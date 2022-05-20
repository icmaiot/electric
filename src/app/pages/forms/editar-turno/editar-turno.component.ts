import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';
import { TurnosProductivosService } from '@app/services/turnos-productivos.service';


@Component({
  selector: 'app-editar-turnoo',
  templateUrl: './editar-turno.component.html',
  styleUrls: ['./editar-turno.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditarTurnoComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  listaturno: [];
  token;

  constructor(
    private turnosproductivosService: TurnosProductivosService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditarTurnoComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idturno: [],
      turno: ['', Validators.required],
      numturno: ['', [Validators.required, Validators.min(1)]],
      inicturno: ['', Validators.required],
      finturno: ['', Validators.required],
    });

    this.token = this.auth.token;
    this.loadModalTexts();
    this.getTurno("");
  }

  async getTurno(searchValue: string) {
    try {
      let resp = await this.turnosproductivosService.get(searchValue, this.auth.token).toPromise();
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
      const { idturno, turno, numturno, inicturno, finturno } = _turno;

      this.form.patchValue({ idturno, turno, numturno, inicturno, finturno });
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
      response = await this.turnosproductivosService.update(this.form.value, this.token).toPromise();
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
