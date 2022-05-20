import { string } from '@amcharts/amcharts4/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '@app/classes/Dialog';
import { Usuario } from '@app/models/usuario';
import { AuthService } from '@app/services/auth.service';
import { UsuarioService } from '@app/services/usuario.service';

@Component({
  selector: 'app-cambia-nip',
  templateUrl: './cambiar-nip.component.html',
  styleUrls: ['./cambiar-nip.component.scss']
})
export class CambiarNipComponent extends Dialog implements OnInit {

  usuario: Usuario;
  token;
  CambiaNipForm: FormGroup;
  submitted = false;
  nip: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<CambiarNipComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data) {
    super();
  }
  ngOnInit() {
    this.usuario = new Usuario();
    this.loadModalTexts();
    this.CambiaNipForm = this.formBuilder.group({
      nip: ['', [Validators.required]],
      nip2: ['', [Validators.required]]
    },
      { validator: [this.MustMatch('nip', 'nip2')] });//, { validator: this.MustMatch('nip', this.usuario.nip.toString()) }    { validator: this.MustMatch('nip')}

    this.token = this.auth.token;
  }

  get f() { return this.CambiaNipForm.controls; }

  onSubmitNip() {
    this.submitted = true;
    if (this.CambiaNipForm.invalid) {
      return;
    } else {
      this.usuario.nip = Number(this.nip);
      this.guardarNip();
    }
  }

  async guardarNip() {
    try {
      let response = await this.usuarioService.update(this.usuario, this.token).toPromise();
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

  closeModal(): void {
    this.dialogRef.close();
  }

  loadModalTexts(): void {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, usuario } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.usuario = usuario
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

}