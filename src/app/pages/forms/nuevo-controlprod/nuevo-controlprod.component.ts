import { Component, OnInit, Inject } from '@angular/core';
import { ControlprodService } from '@app/services/controlprod.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-controlprod',
  templateUrl: './nuevo-controlprod.component.html',
  styleUrls: ['./nuevo-controlprod.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoControlProdComponent extends Dialog implements OnInit {

  lista: [];
  form: FormGroup;
  submitted = false;
  token;
  constructor(
    private controlprodService: ControlprodService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoControlProdComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idcontrolprod: [],
      mts: ['', Validators.required],
      skunext: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (obj) {
      const { idcontrolprod, mts, skunext } = obj;

      this.form.patchValue({ idcontrolprod, mts, skunext });
    }
  }
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.update();
    }
  }

  async update() {
    console.log(this.form.value)
    try {
      let response = await this.controlprodService.update(this.form.value, this.token).toPromise();
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
