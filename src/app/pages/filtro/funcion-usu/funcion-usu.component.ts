import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario';

import { CatalogoFuncionesService } from '@app/services/catalogo-funciones.service';

@Component({
  selector: 'app-funcion-usu',
  templateUrl: './funcion-usu.component.html',
  styleUrls: ['./funcion-usu.component.scss']
})
export class FuncionUsuComponent extends Dialog implements OnInit {

  formFuncusu: FormGroup;
  submitted = false;
  listaFuncusu: [];
  token;
  usuario: Usuario;

  constructor(
    private funcusuService: CatalogoFuncionesService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FuncionUsuComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.formFuncusu = this.formBuilder.group({
      funcionusu: ['', Validators.required],
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
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, usuario } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.usuario = usuario;
  }

  get f() { return this.formFuncusu.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.formFuncusu.invalid) {
      return;
    } else {
      //this.guardar();
    }
  }
  closeModal() {
    this.dialogRef.close();
  }
}
