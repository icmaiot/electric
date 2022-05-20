import { Component, OnInit, Inject } from '@angular/core';
import { ContempService } from '@app/services/contemp.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-contemp',
  templateUrl: './nuevo-contemp.component.html',
  styleUrls: ['./nuevo-contemp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoContempComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  contemp: [];
  token;
  idempresa;
  activo: false;
  status: string;

  constructor(
    private contempService: ContempService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoContempComponent>,
    private auth: AuthService,
    private activate: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      idcontemp: [],
      idempresa: [],
      nomcontemp: ['', Validators.required],
      depcontemp: ['', Validators.required],
      puestocontemp: ['', Validators.required],
      pbxcontemp: [],
      extcontemp: [],
      movcontemp: [],
      emailcontemp: [],
      activocontemp: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.ToggleStatus();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _contemp } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_contemp) {
      const { idcontemp, idempresa, nomcontemp, depcontemp, puestocontemp, pbxcontemp, extcontemp, movcontemp, emailcontemp, activocontemp } = _contemp;

      this.form.patchValue({ idcontemp, idempresa, nomcontemp, depcontemp, puestocontemp, pbxcontemp, extcontemp, movcontemp, emailcontemp, activocontemp });
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

  ToggleStatus() {
    if (this.form.value.activocontemp == 1) {
      this.status = 'Activo';
    } else {
      this.status = 'Inactivo';
      this.form.value.activocontemp = 0;
    }
  }

  async guardar() {
    try {
      let response;
      response = await this.contempService.update(this.form.value, this.token).toPromise();
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
