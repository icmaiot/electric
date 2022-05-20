import { Component, OnInit, Inject } from '@angular/core';
import { TipoEquipoService } from '@app/services/tipo-equipo.service';
import { TipoEquipo } from '@app/models/tipoEquipo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-tipo-equipo',
  templateUrl: './nuevo-tipo-equipo.component.html',
  styleUrls: ['./nuevo-tipo-equipo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoTipoEquipoComponent extends Dialog implements OnInit {

  tipo: TipoEquipo = new TipoEquipo();
  form: FormGroup;
  submitted = false;
  token;
  constructor(
    private tipoService: TipoEquipoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoTipoEquipoComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      tipo: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _tipo } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    if (_tipo) {
      this.tipo = _tipo;
      this.form.controls['tipo'].setValue(this.tipo.tipoequipo);
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
      this.tipo.tipoequipo = this.form.get('tipo').value;
      switch (this.modalMode) {
        case 'create': response = await this.tipoService.createTipo(this.tipo, this.token).toPromise();
          break;
        case 'edit': response = await this.tipoService.update(this.tipo, this.token).toPromise();
          break;
      }
      if (response.code = 200) {
        this.showAlert(this.alertSuccesText, true);

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
