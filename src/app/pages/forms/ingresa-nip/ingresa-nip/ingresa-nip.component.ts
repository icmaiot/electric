import { string } from '@amcharts/amcharts4/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialog } from '@app/classes/Dialog';
import { Usuario } from '@app/models/usuario';
import { EditarUsuarioComponent } from '../../editar-usuario/editar-usuario.component';
import { NuevoUsuarioComponent } from '../../nuevo-usuario/nuevo-usuario.component';

@Component({
  selector: 'app-ingresa-nip',
  templateUrl: './ingresa-nip.component.html',
  styleUrls: ['./ingresa-nip.component.scss']
})
export class IngresaNipComponent extends Dialog implements OnInit {

  usuario: Usuario;
  IngresaNipForm: FormGroup;
  submitted = false;
  nip: string;
  //editar= false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<IngresaNipComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data) {
    super();
  }
  ngOnInit() {
    this.loadModalTexts();
    this.IngresaNipForm = this.formBuilder.group({
      nip: ['', [Validators.required]]
    });//, { validator: this.MustMatch('nip', this.usuario.nip.toString()) }    { validator: this.MustMatch('nip')}

  }

  get f() { return this.IngresaNipForm.controls; }

  onSubmitCN() {
    this.submitted = true;
    if (this.IngresaNipForm.invalid) {
      return;
    } else {
      if (this.usuario == null) {/************************** Agregar Nuevo Usuario *************************/
        if (this.nip == "1234") {/* Si la primera vez que ingresa es 1234 */
          this.addUsuario();
          //this.closeModal();
        } else {/* No fue correcto el NIP*/
          this.IngresaNipForm.reset();
          this.showAlert(this.alertErrorText, false)
        }
      } else {                   /************************** Edita Usuario *************************/
        if (this.nip == this.usuario.nip.toString()) {/*El Nip coincide */
          this.EditUsuario();
          //this.closeModal();
        } else {/*El NIP no coincide */
          this.IngresaNipForm.reset();
          this.showAlert(this.alertErrorText, false)
        }
      }


    }
  }
  async addUsuario() {
    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      //width: '25rem',
      data: {
        title: 'Datos adicionales',
        btnText: 'Guardar',
        alertSuccesText: 'Usuario creado!',
        alertErrorText: "No se puedo crear el usuario",
        modalMode: 'create',
        username: this.data.username,
        Username_last: this.data.Username_last,
        iddep: this.data.iddep,
        idevento: this.data.idevento,
        tipousuario: this.data.tipousuario,
        //usuario: this.usuario,
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.closeModal();
    });
  }


  async EditUsuario() {
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      width: '40rem',
      data: {
        title: 'Editar usuario: ' + this.usuario.username + ' ' + this.usuario.Username_last,
        btnText: 'Actualiza',
        alertSuccesText: 'Entraste!',
        alertErrorText: "No se puede actualizar el usuario",
        modalMode: 'create',
        usuario: this.usuario,
        tipousuario: this.data.tipousuario,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.closeModal();
    });
  }


  closeModal(): void {
    this.dialogRef.close();
  }

  loadModalTexts(): void {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, usuario } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    if (usuario) {
      this.usuario = new Usuario();
      this.usuario = usuario;
      //this.editar = true;
    }
  }

}
