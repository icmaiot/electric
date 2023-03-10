import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';
import { CatalogoFuncionesService } from '@app/services/catalogo-funciones.service';

@Component({
  selector: 'app-catalogo-funciones',
  templateUrl: './catalogo-funciones.component.html',
  styleUrls: ['./catalogo-funciones.component.scss']
})
export class CatalogoFuncionesComponent extends Dialog implements OnInit {

  formFuncusu: FormGroup;
  submitted = false;
  listaFuncusu: [];
  token;

  constructor(
    private funcusuService: CatalogoFuncionesService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CatalogoFuncionesComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.formFuncusu = this.formBuilder.group({
      funcusu: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getfunc();
  }

  async getfunc() {
    try {
      let resp = await this.funcusuService.get(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaFuncusu = resp.response;
      }
    } catch (e) {
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
  }

  get f() { return this.formFuncusu.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.formFuncusu.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response;
      response = await this.funcusuService.create(this.formFuncusu.value, this.token).toPromise();
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

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.funcusuService.delete(obj.IDfuncusu, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getfunc();
          } else {
            Swal.fire('Error', 'Error al borrar el registro!', 'error');
          }
        });
      }
    });
  }





}
