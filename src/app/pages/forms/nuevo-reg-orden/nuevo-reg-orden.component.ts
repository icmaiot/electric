import { Component, OnInit, Inject } from '@angular/core';
import { ProduccionService } from '@app/services/produccion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { get12Hours, truncateWithEllipsis } from '@amcharts/amcharts4/.internal/core/utils/Utils';

@Component({
  selector: 'app-nuevo-reg-orden',
  templateUrl: './nuevo-reg-orden.component.html',
  styleUrls: ['./nuevo-reg-orden.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoRegOrdenComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  produccion: [];
  token;
  lote;
  date;
  cantidad;
  intervalo;
  idmaquina;

  constructor(
    private produccionService: ProduccionService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoRegOrdenComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    //var doo = new Date();
    //  let dates = new Date(doo.getTime() + Math.abs(doo.getTimezoneOffset() - 60000))

    this.date = this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss');
    this.form = this.formBuilder.group({
      Cantidad: ['', Validators.required],
      lote: [],
      idmaquina: [],
      date: [],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getProduccion();
  }

  async getProduccion() {
    try {
      let resp = await this.produccionService.get(this.lote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.produccion = resp.response;
      }
    } catch (e) {
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.lote = obj.idprogprod;
    this.intervalo = obj.tcarga;
    this.idmaquina = obj.idmaquina;

    if (obj) {
      const { idproduccion, Fecha, idmaquina, lote, Cantidad, Intervalo } = obj;
      this.form.patchValue({ idproduccion, Fecha, idmaquina, lote, Cantidad, Intervalo });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    this.form.value.idmaquina = this.idmaquina;
    this.form.value.lote = this.lote;
    this.form.value.Fecha = this.date;
    try {
      let response;
      response = await this.produccionService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getProduccion();
        this.submitted = false;
        this.form.reset({});
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.produccionService.delete(obj.idproduccion, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getProduccion();
          } else {
            Swal.fire('Error', 'Error al borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
