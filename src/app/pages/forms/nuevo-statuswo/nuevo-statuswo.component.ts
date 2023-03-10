import { Component, OnInit, Inject } from '@angular/core';
import { StatuswoService } from '@app/services/statuswo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-statuswo',
  templateUrl: './nuevo-statuswo.component.html',
  styleUrls: ['./nuevo-statuswo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoStatuswoComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  statuswo: [];
  token;

  constructor(
    private statuswoService: StatuswoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoStatuswoComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      statuswo: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getStatuswo('');
  }

  async getStatuswo(searchValue: string) {
    try {
      let resp = await this.statuswoService.getStatuswo(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.statuswo = resp.response;
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
      response = await this.statuswoService.create(this.form.value, this.token).toPromise();
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
        this.statuswoService.delete(obj.idstatuswo, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getStatuswo('');
          } else {
            Swal.fire('Error', 'Error al borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
