import { Component, OnInit, Inject } from '@angular/core';
import { MateriaprimaService } from '@app/services/materiaprima.service';
import { UmService } from '@app/services/um.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-materiap',
  templateUrl: './nuevo-materiap.component.html',
  styleUrls: ['./nuevo-materiap.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoMateriapComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  listaUm: [];
  token;

  constructor(
    private materiaService: MateriaprimaService,
    private umService: UmService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoMateriapComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      um_raw: ['', Validators.required],
      desc_raw: [Validators.required],
      idraw: []
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getUm();
  }

  async getUm() {
    try {
      let resp = await this.umService.get(this.token).toPromise();
      if (resp.code == 200) {
        this.listaUm = resp.response;
      }
    } catch (e) {
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _materia } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_materia) {
      const { idraw, desc_raw } = _materia;
      const um_producto = _materia.Um.idum;
      this.form.patchValue({ idraw, desc_raw, um_producto });
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
      response = await this.materiaService.update(this.form.value, this.token).toPromise();
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
