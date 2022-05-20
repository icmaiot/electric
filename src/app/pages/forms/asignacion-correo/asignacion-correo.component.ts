import { Component, OnInit, Inject } from '@angular/core';
import { LineaemailService } from '@app/services/lineaemail.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { UsuarioService } from '@app/services/usuario.service'
import { TipoEquipoService } from '@app/services/tipo-equipo.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignacion-correo',
  templateUrl: './asignacion-correo.component.html',
  styleUrls: ['./asignacion-correo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignacionCorreoComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  linea;
  lista = [];
  listaUsuario = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AsignacionCorreoComponent>,
    private auth: AuthService, 
    private lineaemailService: LineaemailService,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id_linea: [''],
      id_usuario: ['',Validators.required]
    });

    this.loadModalTexts();

    this.getUsuario();
    this.getLineaemail();
  }

  loadModalTexts() {
    const { title, alertErrorText, alertSuccesText, linea } = this.data;
    this.title = title;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.linea = linea;
    console.log(this.linea)
  }

  closeModal() {
    this.dialogRef.close();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    console.log(this.form.value)
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async getUsuario() {
    try {
      let resp = await this.usuarioService.getUsuarioEx( this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaUsuario = resp.response;
        console.log(this.listaUsuario)
      }
    } catch (e) {
    }
  }


  async getLineaemail() {
    try {
      console.log(this.linea)
      let resp = await this.lineaemailService.get(this.linea,this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lista = resp.response;
        console.log(this.lista)
      }
    } catch (e) {
    }
  }

  async guardar() {
    this.form.value.id_linea = this.linea;
    console.log(this.form.value)
    try {
      let response = await this.lineaemailService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        this.getLineaemail();
        this.form.reset({});
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
      this.submitted = false;
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  delete(obj) {
    console.log(obj)
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.lineaemailService.delete(obj, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            this.getLineaemail();
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
