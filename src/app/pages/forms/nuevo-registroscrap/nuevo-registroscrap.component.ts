import { Component, OnInit, Inject } from '@angular/core';
import { RegistroscrapService } from '@app/services/registroscrap.service';
import { ScrapService } from '@app/services/scrap.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-registroscrap',
  templateUrl: './nuevo-registroscrap.component.html',
  styleUrls: ['./nuevo-registroscrap.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoRegistoscrapComponent extends Dialog implements OnInit {

  form: FormGroup;
  formins: FormGroup;
  submitteds = false;
  scrap: [];
  token;
  date;
  id;
  lote;
  cant;

  constructor(
    private registroscrapService: RegistroscrapService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoRegistoscrapComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      // idscrapreg: [''],
      descripcion_scrap: ['', Validators.required],
      cod_scrap: ['', Validators.required],
    });

    this.token = this.auth.token;
    this.loadModalTexts();
    this.getScrap();
  }

  async getScrap() {
    try {
      let resp = await this.registroscrapService.get('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.scrap = resp.response;
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
      const { idscrapreg, descripcion_scrap, cod_scrap } = obj;
      this.form.patchValue({ idscrapreg, descripcion_scrap, cod_scrap });
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
      response = await this.registroscrapService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getScrap();
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
        this.registroscrapService.delete(obj.idscrapreg, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getScrap();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
