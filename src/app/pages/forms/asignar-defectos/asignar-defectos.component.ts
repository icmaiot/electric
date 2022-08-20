import { Component, OnInit, Inject } from '@angular/core';
import { AsignarDefectosService } from '@app/services/asignardefectos.service';
import { RegistrodefectosService } from '@app/services/registrodefectos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-defectos',
  templateUrl: './asignar-defectos.component.html',
  styleUrls: ['./asignar-defectos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignarDefectosComponent extends Dialog implements OnInit {

  form: FormGroup;
  formins: FormGroup;
  submitteds = false;
  defecto: [];
  defectos: [];
  producto: [];
  idp;
  token;

  constructor(
    private asignardefectosService: AsignarDefectosService,
    private registrodefectosService: RegistrodefectosService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AsignarDefectosComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idproducto: ['', Validators.required],
      iddefreg: ['', Validators.required],
    });

    this.token = this.auth.token;
    this.loadModalTexts();
    this.getdefecto();
    this.getdefectos();
  }

  async getdefecto() {
    try {
      let resp = await this.asignardefectosService.get(this.idp, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.defecto = resp.response;
      }
    } catch (e) {
    }
  }

  async getdefectos() {
    try {
      let resp = await this.registrodefectosService.get('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.defectos = resp.response;
      }
    } catch (e) {
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.idp = obj.idproducto;

    if (obj) {
      //this.maquina = _maquina;
      const { idproducto, iddefreg } = obj;
      this.form.patchValue({ idproducto, iddefreg });
    }
  }

  get f() { return this.form.controls; }

  onSubmits() {
    this.submitteds = true;
    if (this.form.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response;
      response = await this.asignardefectosService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getdefecto();
        this.submitteds = false;
        this.form.reset({});
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


  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.asignardefectosService.delete(obj, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getdefecto();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }
}
