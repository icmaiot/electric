import { Component, OnInit, Inject } from '@angular/core';
import { RegistrodefectosService } from '@app/services/registrodefectos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-registrodefectos',
  templateUrl: './nuevo-registrodefectos.component.html',
  styleUrls: ['./nuevo-registrodefectos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoRegistodefectosComponent extends Dialog implements OnInit {

  form: FormGroup;
  formins: FormGroup;
  submittedd = false;
  defectos: [];
  token;
  date;
  id;
  lote;
  cant;

  constructor(
    private registrodefectosService: RegistrodefectosService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoRegistodefectosComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      //iddefreg: [''],
      descripcion_defecto: ['', Validators.required],
      cod_defecto: ['', Validators.required],
    });

    this.token = this.auth.token;
    this.loadModalTexts();
    this.getdefectos();
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

    if (obj) {
      //this.maquina = _maquina;
      const { iddefreg, descripcion_defecto, cod_defecto } = obj;
      this.form.patchValue({ iddefreg, descripcion_defecto, cod_defecto });
    }
  }

  get f() { return this.form.controls; }

  onSubmitd() {
    this.submittedd = true;
    if (this.form.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response;
      response = await this.registrodefectosService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getdefectos();
        this.submittedd = false;
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
        this.registrodefectosService.delete(obj.iddefreg, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getdefectos();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
