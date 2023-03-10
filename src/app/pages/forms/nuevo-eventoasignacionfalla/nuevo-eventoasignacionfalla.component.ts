import { Component, Inject, OnInit } from '@angular/core';
import { EventoRegistroService } from '@app/services/eventoregistro.service';
import { TipoEquipoService } from '@app/services/tipo-equipo.service';
import { TipoEquipo } from '@app/models/tipoEquipo';
import { MaquinaService } from '@app/services/maquina.service';
import { Evento_AsignacionService } from '@app/services/eventoasignacion.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-nuevo-eventoasignacionfalla',
  templateUrl: './nuevo-eventoasignacionfalla.component.html',
  styleUrls: ['./nuevo-eventoasignacionfalla.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoEventoasignacionfallaComponent extends Dialog implements OnInit {


  form: FormGroup;
  MQTT: FormGroup;
  token;
  listaopciones: [];
  lopciones: [];
  moduloi = [];
  causas = [];
  causasproceso;
  idmaquina;

  tipos: TipoEquipo[];
  number;
  idequipo;
  idevento;
  equipo;
  fallasg: [];
  clavef: [];
  submitted = false;
  constructor(
    private tipoService: TipoEquipoService,
    private maquinaService: MaquinaService,
    private evento_registroService: EventoRegistroService,
    private evento_asignacionServices: Evento_AsignacionService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoEventoasignacionfallaComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id_falla: ['', Validators.required],
    });

    this.MQTT = this.formBuilder.group({
      topic: [''],
      message: [],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getEventoc();
    this.getEventoCatalago();
    this.getEventoAsig2();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _eventoc, idevento, idequipo } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.number = idevento;
    this.equipo = idequipo;


    if (_eventoc) {
      const { id_falla, id_evento, codigo_falla, descripcion_falla } = _eventoc;

      this.form.patchValue({ id_falla, id_evento, codigo_falla, descripcion_falla });
    }
  }


  get f() { return this.form.controls; }

  saveData() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.save();
    }
  }

  async save() {
    this.form.value.id_tipoequipo = this.equipo;
    this.form.value.id_evento = this.number;
    try {
      let response = await this.evento_asignacionServices.create(this.form.value, this.auth.token).toPromise();
      if (response.code = 200) {
        Swal.fire('Guardado', 'La opcion fue asignada correctamente!', 'success');
        this.submitted = false;
        this.form.reset({});
        this.getEventoAsig();
      } else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (error) {
      Swal.fire('Error', 'Error al asignar la opcion seleccionada!', 'error');
    }
  }

  /* Llamar a todos los datos*/
  async getEventoc() {
    try {
      let resp = await this.evento_registroService.getEventoEquipo(this.number, this.equipo, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaopciones = resp.resp;
        console.log(this.listaopciones)
      }
    } catch (e) {
    }
  }

  async getEventoCatalago() {
    try {
      let resp = await this.evento_registroService.getEventoCatalago(this.number, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lopciones = resp.resp;
        console.log(this.lopciones)
        //console.log(this.number)
      }
    } catch (e) {
    }
  }

  async getEventoAsig() {
    try {
      let resp = await this.evento_asignacionServices.get(this.number, this.equipo, this.auth.token).toPromise();
      //console.log(resp)
      if (resp.code == 200) {
        this.fallasg = resp.response;
        console.log(this.number + '//' + this.equipo)
        console.log(this.fallasg)//estos se mandan por mqtt
        this.getCausas(this.number, this.fallasg, this.equipo)
      }
    } catch (e) {
    }
  }

  async getEventoAsig2() {
    try {
      let resp = await this.evento_asignacionServices.get(this.number, this.equipo, this.auth.token).toPromise();
      //console.log(resp)
      if (resp.code == 200) {
        this.fallasg = resp.response;
        console.log(this.number + '//' + this.equipo)
        console.log(this.fallasg)//estos se mandan por mqtt
      }
    } catch (e) {
    }
  }

  delete(_eventoc) {
    Swal.fire({
      title: '¿Desea eliminar la opcion seleccionada?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.evento_asignacionServices.delete(_eventoc, this.auth.token).subscribe(res => {
          //  console.log(_eventoc);
          if (res.code == 200) {
            Swal.fire('Eliminado', 'La opcion ha sido removida de este equipo!', 'success');
            this.getEventoAsig();
            this.getEventoAsig2()
          } else {
            Swal.fire('Error', 'Error al remover la opcion seleccionada!', 'error');
          }
        });
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }


  //PRODUCTOS
  async getCausas(evento, fallas, equipo) {
    if (evento == 4) {
      for (let i = 0; i < fallas.length; i++) {
        let mssg = 'Man:' + fallas[i].id_evento + '?' + fallas[i].id_falla + '?' + fallas[i].Evento_registro.codigo_falla + '?' + fallas[i].Evento_registro.descripcion_falla + '/Fin'
        this.MQTT.value.topic = equipo;
        this.MQTT.value.message = mssg;
        this.SendProductosMQTT(mssg)
      }
    }
    else if (evento == 5) {
      for (let i = 0; i < fallas.length; i++) {
        let mssg = 'Mat:' + fallas[i].id_evento + '?' + fallas[i].id_falla + '?' + fallas[i].Evento_registro.codigo_falla + '?' + fallas[i].Evento_registro.descripcion_falla + '/Fin'
        this.MQTT.value.topic = equipo;
        this.MQTT.value.message = mssg;
        this.SendProductosMQTT(mssg)
      }
    }
    else if (evento == 6) {
      for (let i = 0; i < fallas.length; i++) {
        let mssg = 'Ing:' + fallas[i].id_evento + '?' + fallas[i].id_falla + '?' + fallas[i].Evento_registro.codigo_falla + '?' + fallas[i].Evento_registro.descripcion_falla + '/Fin'
        this.MQTT.value.topic = equipo;
        this.MQTT.value.message = mssg;
        this.SendProductosMQTT(mssg)
      }
    }
    else if (evento == 7) {
      for (let i = 0; i < fallas.length; i++) {
        let mssg = 'Prod:' + fallas[i].id_evento + '?' + fallas[i].id_falla + '?' + fallas[i].Evento_registro.codigo_falla + '?' + fallas[i].Evento_registro.descripcion_falla + '/Fin'
        this.MQTT.value.topic = equipo;
        this.MQTT.value.message = mssg;
        this.SendProductosMQTT(mssg)
      }
    }
    else if (evento == 8) {
      for (let i = 0; i < fallas.length; i++) {
        let mssg = 'Cal:' + fallas[i].id_evento + '?' + fallas[i].id_falla + '?' + fallas[i].codigo_falla + '?' + fallas[i].descripcion_falla + '/Fin'
        this.MQTT.value.topic = equipo;
        this.MQTT.value.message = mssg;
        this.SendProductosMQTT(mssg)
      }
    }

    /*this.causasproceso = JSON.stringify(fallas[i]);
      this.causasproceso = this.causasproceso.split(/]|{|}|"|id|_tipoequipo|_falla|_evento|Evento_registro|codigo|descripcion|:|/g).join('');
      this.causasproceso = this.causasproceso.split("[").join('');
      this.causasproceso = this.causasproceso.split(",").join('?');
      this.MQTT.value.topic = equipo;
      console.log(this.causasproceso)
    //this.SendProductosMQTT(this.causasproceso)*/
  }


  async SendProductosMQTT(mssg) {
    console.log(mssg)
    try {
      console.log(this.MQTT.value)
      let resp = await this.tipoService.MQTTEncoder(this.MQTT.value).toPromise();

    } catch (e) {
    }
  }

}
