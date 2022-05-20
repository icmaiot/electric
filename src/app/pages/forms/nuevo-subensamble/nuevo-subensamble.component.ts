import { Component, OnInit, Inject } from '@angular/core';
import { SubensambleService } from '@app/services/subensamble.service';
import { UmService } from '@app/services/um.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-subensamble',
  templateUrl: './nuevo-subensamble.component.html',
  styleUrls: ['./nuevo-subensamble.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoSubensambleComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  listaUm: [];
  token;

  constructor(
    private subensambleService: SubensambleService,
    private umService: UmService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoSubensambleComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      subensamble: ['', Validators.required],
      desc_subens: ['', Validators.required],
      te_subens: ['', [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      um_subens: [Validators.required],
      idsubens: []
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
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _subensamble } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_subensamble) {
      const { idsubens, desc_subens, te_subens, subensamble } = _subensamble;
      const um_subens = _subensamble.Um.idum;
      this.form.patchValue({ idsubens, desc_subens, te_subens, um_subens, subensamble });
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
      response = await this.subensambleService.update(this.form.value, this.token).toPromise();
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
