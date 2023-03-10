import { Component, OnInit, Inject } from '@angular/core';
import { SubMaquinaService } from '@app/services/sub-maquina.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { MaquinaService } from '@app/services/maquina.service'
import { TipoEquipoService } from '@app/services/tipo-equipo.service'
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-asignacion-maquina',
  templateUrl: './asignacion-maquina.component.html',
  styleUrls: ['./asignacion-maquina.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignacionMaquinaComponent extends Dialog implements OnInit {

  form: FormGroup;
  MQTT: FormGroup;
  submitted = false;
  idsubens: number;
  listap: string;
  prioridad;
  id_maquina;
  idrmt;
  tipos = [];
  listaSUB = [];
  listaMaquinas = [];
  ListaSubensambleByMaquina = [];
  Rmt = [];

  constructor(
    private formBuilder: FormBuilder,
    private subService: SubMaquinaService,
    public dialogRef: MatDialogRef<AsignacionMaquinaComponent>,
    private auth: AuthService, private maquinaService: MaquinaService,
    private tipoService: TipoEquipoService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id_maquina: ['', Validators.required],
      id_subensamble: ['']
    });

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.loadModalTexts();

    this.getTipos();
    this.getMaquinas();
    this.getSUB();
  }

  loadModalTexts() {
    const { title, alertErrorText, alertSuccesText, idsubens } = this.data;
    this.title = title;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.idsubens = idsubens;
  }

  closeModal() {
    this.dialogRef.close();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.hiddeAlert();
      this.guardar();
    }
  }

  async getMaquinas() {
    try {
      let resp = await this.maquinaService.getMaquinas("", "", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaMaquinas = resp.maquina;
      }
    } catch (e) {
    }
  }


  async getSUB() {
    try {
      let resp = await this.subService.get(this.idsubens, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaSUB = resp.response;
        let sub = this.listaSUB[this.listaSUB.length - 1];
      }
    } catch (e) {
    }
  }

  async getTipos() {
    try {
      let resp = await this.tipoService.getTipos(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.tipos = resp.tipo_equipos;
      }
    } catch (e) {
    }
  }

  async getSubensambleMaquina(id_maquina) {
    try {
      this.getRmt(id_maquina);
      let resp = await this.subService.getSubensambleMaquina(id_maquina, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.ListaSubensambleByMaquina = resp.response;
        for (let i = 0; i < this.ListaSubensambleByMaquina.length; i++) {
          this.listap = JSON.stringify(this.ListaSubensambleByMaquina[i]);
          this.listap = this.listap.split(/]|{|}|idsubens:|subensamble:|"|/g).join('');
          this.listap = this.listap.split("idsubens:").join('');
          this.listap = this.listap.split("subensamble:").join('');
          this.listap = this.listap.split("[").join('');
          this.listap = this.listap.split(",").join('?');
          this.SendSubensambleMQTT(this.listap);
        }
      }
    } catch (e) {
    }
  }

  async getRmt(id_maquina) {
    try {
      let resp = await this.subService.getRmt(id_maquina, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.Rmt = resp.response;
        this.MQTT.controls['topic'].setValue(this.Rmt[0].serialrmt);
      }
    } catch (e) {
    }
  }

  async SendSubensambleMQTT(info) {
    this.MQTT.value.message = 'SUB:' + info + '/Fin';
    try {
      let resp = await this.subService.MQTTEncoder(this.MQTT.value).toPromise();

    } catch (e) {
    }
  }

  async guardar() {
    try {
      this.id_maquina = this.form.value.id_maquina;
      let response;
      this.form.controls['id_subensamble'].setValue(this.idsubens);
      response = await this.subService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        this.getSUB();
        this.getSubensambleMaquina(this.id_maquina);
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
      this.submitted = false;
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.subService.delete(obj, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            this.getSubensambleMaquina(obj.id_maquina);
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getSUB();
          } else {
            Swal.fire('Error', 'Error al borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
