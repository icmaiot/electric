import { Component, OnInit, Inject } from '@angular/core';
import { StatuswosubService } from '@app/services/statuswosub.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-statuswosub',
  templateUrl: './nuevo-statuswosub.component.html',
  styleUrls: ['./nuevo-statuswosub.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoStatuswosubComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  statuswosub: [];
  token;

  constructor(
    private statuswosubService: StatuswosubService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoStatuswosubComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      stwosub: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getStatuswosub('');
  }

  async getStatuswosub(searchValue: string) {
    try {
      let resp = await this.statuswosubService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.statuswosub = resp.response;
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
      response = await this.statuswosubService.create(this.form.value, this.token).toPromise();
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
        this.statuswosubService.delete(obj.idstwosub, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getStatuswosub('');
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
