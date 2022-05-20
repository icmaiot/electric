import { Component, OnInit, Inject } from '@angular/core';
import { AsignarScrapService } from '@app/services/asignarscrap.service';
import { RegistroscrapService } from '@app/services/registroscrap.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-scrap',
  templateUrl: './asignar-scrap.component.html',
  styleUrls: ['./asignar-scrap.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignarScrapComponent extends Dialog implements OnInit {

  form: FormGroup;
  formins: FormGroup;
  submitteds = false;
  scrap: [];
  scraps: [];
  producto: [];
  idp;
  token;

  constructor(
    private asignarscrapService: AsignarScrapService,
    private registroscrapService: RegistroscrapService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AsignarScrapComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idproducto: ['', Validators.required],
      idscrapreg: ['', Validators.required],
    });

    this.token = this.auth.token;
    this.loadModalTexts();
    this.getscrap();
    this.getscraps();
  }

  async getscrap() {
    try {
      let resp = await this.asignarscrapService.get(this.idp, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.scrap = resp.response;
      }
    } catch (e) {
    }
  }

  async getscraps() {
    try {
      let resp = await this.registroscrapService.get('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.scraps = resp.response;
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
      const { idproducto, idscrapreg } = obj;
      this.form.patchValue({ idproducto, idscrapreg });
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
      response = await this.asignarscrapService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getscrap();
        this.submitteds = false;
        this.form.reset('idscrapreg');
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
        this.asignarscrapService.delete(obj, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getscrap();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }
}
