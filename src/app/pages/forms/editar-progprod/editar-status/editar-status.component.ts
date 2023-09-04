import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { ProgprodService } from '@app/services/progprod.service';

@Component({
  selector: 'app-editar-status',
  templateUrl: './editar-status.component.html',
  styleUrls: ['./editar-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditarStatusComponent2 extends Dialog implements OnInit {

  token;
  form: FormGroup;
  submitted = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder, private auth: AuthService,
    public dialogRef: MatDialogRef<EditarStatusComponent2>, private progprodService: ProgprodService) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idstatus: ['', Validators.required],
      idprogprod: [''],
      prioridad: [''],
      idmaquina: ['']
    });
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;

    if (obj) {
      const { idstatus, idprogprod, prioridad, idmaquina } = obj;
      this.form.patchValue({ idstatus, idprogprod, prioridad, idmaquina });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
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
      let response = await this.progprodService.updateStatus(this.form.value, this.token).toPromise();
      if (response.code = 200) {
        this.getprogprodprioridad()
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

  get f() { return this.form.controls; }

  async getprogprodprioridad() {
    try {
      let response;
      response = await this.progprodService.getprogprodprioridad(this.auth.token).toPromise();
    } catch (e) {

    }
  }
}
