import { Component, OnInit, Inject } from '@angular/core';
import { TurnosdescansoService } from '@app/services/turnosdescanso.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nuevo-diaturno',
  templateUrl: './nuevo-diaturno.component.html',
  styleUrls: ['./nuevo-diaturno.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoDiaTurnoComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  listaturno: [];
  token;

  constructor(
    private turnoService: TurnosdescansoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoDiaTurnoComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idturdesc: [],
      idturno: [],
      numdesc: ['', Validators.required],
      desc1: ['', Validators.required],
      desc1dur: ['', Validators.required],
      desc2: ['', Validators.required],
      desc2dur: ['', Validators.required],
      desc3: ['', Validators.required],
      desc3dur: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getTurno();
  }

  async getTurno() {
    try {
      let resp = await this.turnoService.get('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaturno = resp.response;
        this.listaturno.length;
      }
    } catch (e) {
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _turno } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_turno) {
      const { idturdesc, numdesc, idturno, desc1, desc1dur, desc2, desc2dur, desc3, desc3dur } = _turno;

      this.form.patchValue({ idturdesc, numdesc, idturno, desc1, desc1dur, desc2, desc2dur, desc3, desc3dur });
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
      response = await this.turnoService.update(this.form.value, this.token).toPromise();
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
