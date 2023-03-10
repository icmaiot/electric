import { Component, OnInit } from '@angular/core';
import { SubensambleService } from '@app/services/subensamble.service';
import { SubMaquinaService } from '@app/services/sub-maquina.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoSubensambleComponent } from '@app/pages/forms/nuevo-subensamble/nuevo-subensamble.component';
import { AsignacionMaquinaComponent } from '@app/pages/forms/asignacion-maquina/asignacion-maquina.component';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UmService } from '@app/services/um.service'
import { NuevoUmComponent } from '@app/pages/forms/nuevo-um/nuevo-um.component'

@Component({
  selector: 'app-subensamble',
  templateUrl: './subensamble.component.html',
  styleUrls: ['./subensamble.component.scss']
})
export class SubensambleComponent implements OnInit {

  lista: [];
  total: number;
  listaUm: [];
  submitted = false;
  form: FormGroup

  MBP: any[];
  MQTT: FormGroup;
  prod = [];
  prodSend: string;
  totalMBP;

  listNav = [
    { "name": "SKU", "router": "/producto" },
    { "name": "Subensamble", "router": "/subensamble" },
    { "name": "Materia Prima", "router": "/materiaPrima" }
  ]

  constructor(private subensambleService: SubensambleService,
    private submaquinaService: SubMaquinaService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService, private formBuilder: FormBuilder,
    private umService: UmService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      subensamble: ['', Validators.required],
      desc_subens: ['', Validators.required],
      te_subens: ['', [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      um_subens: [Validators.required],
      idsubens: []
    });

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.getSubensamble('');
    this.getUm();
  }

  async getUm() {
    try {
      let resp = await this.umService.get(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaUm = resp.response;
      }
    } catch (e) {
    }
  }

  async getSubensamble(searchValue: string) {
    try {
      let resp = await this.subensambleService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lista = resp.response;
        this.total = this.lista.length;
      }
    } catch (e) {
    }
  }

  async getprodAct(idmaquina, serialrmt) {
    try {
      let resp = await this.submaquinaService.getSubensambleMaquina(idmaquina, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.prod = resp.response;
        for (let i = 0; i < this.prod.length; i++) {
          this.prodSend = JSON.stringify(this.prod[i]);
          this.prodSend = this.prodSend.split(/]|{|}|"|idsubens:|subensamble:|/g).join('');
          this.prodSend = this.prodSend.split("idsubens:").join('');
          this.prodSend = this.prodSend.split("subensamble:").join('');
          this.prodSend = this.prodSend.split("[").join('');
          this.prodSend = this.prodSend.split(",").join('?');
          this.MQTT.value.topic = serialrmt;
          this.SendUsuariosMQTT(this.prodSend);
        }
      }
    } catch (e) {
    }
  }

  async SendUsuariosMQTT(info) {
    this.MQTT.value.message = 'SUB:' + info + '/Fin';
    try {
      let resp = await this.submaquinaService.MQTTEncoder(this.MQTT.value).toPromise();

    } catch (e) {
    }
  }

  async MaquinaBySubensamble(idsubens) {
    try {
      let resp = await this.subensambleService.getMaquinaBySubensamble(idsubens, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.MBP = resp.response;
        this.totalMBP = this.MBP.length;
        if (this.totalMBP > 0) {
          for (let i in this.MBP) {
            this.MBP[i].id_maquina;
            this.MBP[i].serialrmt;
            this.getprodAct(this.MBP[i].id_maquina, this.MBP[i].serialrmt)
          }
        }
      }
    } catch (e) {

    }
  }

  onSearchChange(searchValue: string) {
    this.getSubensamble(searchValue);
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.save();
    }
  }

  async save() {
    try {
      let response = await this.subensambleService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getSubensamble('');
        this.submitted = false;
        this.form.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'Error al guardar el registro!', 'error');
    }
  }

  update(obj) {
    const dialogRef = this.dialog.open(NuevoSubensambleComponent, {
      width: '40rem',
      data: {
        title: 'Editar producto: ' + obj.subensamble,
        btnText: 'Guardar',
        alertSuccesText: 'Sunensamble modificado correctamente',
        alertErrorText: "Error al modificar el registro",
        modalMode: 'edit',
        _subensamble: obj
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getSubensamble('');
      this.MaquinaBySubensamble(obj.idsubens);
    });
  }

  delete(modulo) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.subensambleService.delete(modulo.idsubens, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getSubensamble('');
            this.MaquinaBySubensamble(modulo.idsubens);
          } else {
            Swal.fire('Error', 'Error al borrar el registro!', 'error');
          }
        });
      }
    });
  }

  showSpinner() {
    const opt1: Spinner = {
      bdColor: "rgba(51,51,51,0.8)",
      size: "medium",
      color: "#fff",
      type: "square-jelly-box"
    };
    this.spinner.show("mySpinner", opt1);
  }

  AsigMaquina(subensamble) {
    const dialogRef = this.dialog.open(AsignacionMaquinaComponent, {
      width: '30rem',
      data: {
        title: 'Asignación de maquina para: ' + subensamble.subensamble,
        alertSuccesText: 'Asignación guardada',
        alertErrorText: "Error al modificar la asignación",
        idsubens: subensamble.idsubens
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getSubensamble('');
    });
  }

  newUm() {
    const dialogRef = this.dialog.open(NuevoUmComponent, {
      width: '30rem',
      data: {
        title: 'Nuevo unidad de medida',
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "Error al guardar el registro!",
        modalMode: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getUm();
    });
  }
}
