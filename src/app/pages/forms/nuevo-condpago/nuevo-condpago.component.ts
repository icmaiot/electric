import { Component, OnInit, Inject } from '@angular/core';
import { CondpagoService } from '@app/services/condpago.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-condpago',
  templateUrl: './nuevo-condpago.component.html',
  styleUrls: ['./nuevo-condpago.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoCondpagoComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  condpago: [];
  token;

  constructor(
    private condpagoService: CondpagoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoCondpagoComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      condpago: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getCondpago();
  }

  async getCondpago() {
    try {
      let resp = await this.condpagoService.get(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.condpago = resp.response;
      }
    } catch (e) {
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
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
    try {
      let response;
      response = await this.condpagoService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.closeModal();
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
        this.condpagoService.delete(obj.idcondpago, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getCondpago();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
