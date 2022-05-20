import { Component, OnInit, Inject } from '@angular/core';
import { PerfilConfigService } from '@app/services/perfil-config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-perfilconfig',
  templateUrl: './nuevo-perfilconfig.component.html',
  styleUrls: ['./nuevo-perfilconfig.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoPerfilconfigComponent extends Dialog implements OnInit {


  form: FormGroup;
  submitted = false;
  token;
  constructor(
    private perfilService: PerfilConfigService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoPerfilconfigComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombreperfil: ['', Validators.required],
      idperfil: [],
      descripcion: [''],
      automanual: ['', Validators.required]
    });
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _perfilConfig } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_perfilConfig) {
      const { idperfil, nombreperfil, descripcion, automanual } = _perfilConfig;
      this.form.patchValue({ idperfil, nombreperfil, descripcion, automanual });
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
    try {
      let response;
      switch (this.modalMode) {
        case 'create': response = await this.perfilService.create(this.form.value, this.token).toPromise();
          break;
        case 'edit': response = await this.perfilService.update(this.form.value, this.token).toPromise();
          break;
      }
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


}
