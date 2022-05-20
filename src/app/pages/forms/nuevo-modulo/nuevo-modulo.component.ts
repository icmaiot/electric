import { Component, OnInit, Inject } from '@angular/core';
import { ModuloInterfazService } from '@app/services/modulo-interfaz.service';
import { PerfilConfigService } from '@app/services/perfil-config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilConfig } from '@app/models/perfilConfig';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';


@Component({
  selector: 'app-nuevo-modulo',
  templateUrl: './nuevo-modulo.component.html',
  styleUrls: ['./nuevo-modulo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoModuloComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  listaPerfil: PerfilConfig[];
  token;

  constructor(
    private moduloService: ModuloInterfazService,
    private perfilService: PerfilConfigService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoModuloComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      serial: ['', Validators.required],
      idperfil: ['', Validators.required],
      idmodulo: [],
      activo: [1]
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getPerfiles();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _modulo } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_modulo) {
      const { idmodulo, serial, idperfil, activo } = _modulo;
      this.form.patchValue({ idmodulo, serial, idperfil, activo });
    }
  }

  async getPerfiles() {
    try {
      let resp = await this.perfilService.getPerfil('', this.token).toPromise();
      if (resp.code == 200) {
        this.listaPerfil = resp.perfilConfig;
      }
    } catch (e) {
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
        case 'create': response = await this.moduloService.create(this.form.value, this.token).toPromise();
          break;
        case 'edit': response = await this.moduloService.update(this.form.value, this.token).toPromise();
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
      //Duplicate Element and the modulo is inactive (0)
      if (e.status == 403 && e.error.modulo.activo == 0) {

      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

}
