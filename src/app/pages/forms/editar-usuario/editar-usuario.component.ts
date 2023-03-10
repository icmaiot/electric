import { Component, OnInit, Inject } from '@angular/core';
import { DepartamentoService } from '@app/services/departamento.service';
import { UsuarioService } from '@app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departamento } from '@app/models/departamento';
import { Usuario } from '@app/models/usuario';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { CambiarContrComponent } from '../cambiar-contr/cambiar-contr.component';
import { CambiarNipComponent } from '../cambiar-nip/cambiar-nip.component';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditarUsuarioComponent extends Dialog implements OnInit {

  usuario: Usuario = new Usuario();
  usuarioForm: FormGroup;
  submitted = false;
  departamentos: Departamento[];
  enabledDepartamento: boolean = false;
  token;
  tipousuario: string;
  sistema: boolean = false;
  auxnip2: string = '';
  auxpassword2: string = '';
  statusUsu: string;
  statusLine: string;

  usr = [];
  usrSend: string;
  MQTT: FormGroup;

  constructor(private deptoService: DepartamentoService, private formBuilder: FormBuilder,
    private usuarioService: UsuarioService, private auth: AuthService, private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    super();
  }

  ngOnInit() {
    const disabled = this.data.idDepto ? true : false;
    this.loadModalTexts();
    this.MQTT = this.formBuilder.group({
      topic: [''],
      message: [],
    });
    
    if (this.sistema) {
      this.usuarioForm = this.formBuilder.group({
        id: [''],
       // nip: ['', Validators.required],
       // password: ['', [Validators.required, Validators.min(6)]],
        email: ['', [Validators.required, Validators.email]],
        celular: [''],
        activousr: ['', Validators.required],
        permitir_linea: ['', Validators.required],
      }
      );
    } else {
      this.usuarioForm = this.formBuilder.group({
        id: [''],
       // nip: ['', Validators.required],
       // email: ['', Validators.email],
        celular: [''],
        activousr: ['', Validators.required],
        permitir_linea: ['', Validators.required],
      }
      );
    }
    this.token = this.auth.token;
    this.getDeptos();
  }

  async getDeptos() {
    try {
      let resp = await this.deptoService.getDepartamentos("", this.token).toPromise();
      if (resp.code == 200) {
        this.departamentos = resp.depto;
      }
    } catch (e) {
    }
  }

  async getUsrAct() {
    try {
      let resp = await this.usuarioService.getUsuariosAct(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usr = resp.response;
        for(let i = 0; i < this.usr.length ; i++){
          this.usrSend = JSON.stringify(this.usr[i]);
          this.usrSend = this.usrSend.split(/]|{|}|"|id|evento|nip|permitir_evento|permitir_linea|:|/g).join('');
          this.usrSend = this.usrSend.split("[").join('');
          this.usrSend = this.usrSend.split(",").join('?');
          this.SendUsuariosMQTT(this.usrSend)
            console.log(this.usrSend)
          }
      }
    } catch (e) {
    }
  }

  async SendUsuariosMQTT(info) {
    this.MQTT.value.message =  'Ids:'+ info +'/Fin';
    try {
      let resp = await this.usuarioService.MQTTEncoder(this.MQTT.value).toPromise();
      
    } catch (e) {
    }
  }

  get f() { return this.usuarioForm.controls; }

  onSubmit() {

    this.submitted = true;
    if (this.usuarioForm.invalid) {
      return;
    } else {
      this.update();
    }
  }

  async update() {
    this.usuarioForm.value.id = this.usuario.id;
    try {
      let response = await this.usuarioService.update(this.usuarioForm.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert('Usuario actualizado', true);
        this.getUsrAct();
        this.submitted = false;
      }
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  

  updatePassword() {
    const dialogRef = this.dialog.open(CambiarContrComponent, {
      //width: '25rem',
      data: {
        title: 'Cambiar Contraseña',
        btnText: 'Cambiar',
        alertSuccesText: '¡Contraseña actualizada!',
        alertErrorText: "No se puede actualizar el usuario",
        modalMode: 'create',
        usuario: this.usuario,
        tipousuario: 'sistema',
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      // this.closeModal();
      this.getUsrAct();
    });
  }
    async guardarNip() {
    try {
      let response = await this.usuarioService.update(this.usuario, this.token).toPromise();
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

  updateNip() {
    const dialogRef = this.dialog.open(CambiarNipComponent, {
      //width: '25rem',
      data: {
        title: 'Cambiar NIP',
        btnText: 'Cambiar',
        alertSuccesText: '¡Nip actualizado!',
        alertErrorText: "No se puede actualizar el usuario",
        modalMode: 'create',
        usuario: this.usuario,
        tipousuario: 'sistema',
      }
    });

  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, id, username, Username_last, iddep, idevento, tipousuario, usuario, idDepto, permitir_linea } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.usuario.username = username;
    this.usuario.Username_last = Username_last;
    this.usuario.iddep = parseInt(iddep);
    this.usuario.idevento = parseInt(idevento);
    this.usuario.permitir_linea = permitir_linea;
    this.tipousuario = tipousuario;
    this.usuario.id = id;
    this.usuario = usuario;
    if (tipousuario) {
      this.sistema = true;
    }
    if (idDepto) {
      this.enabledDepartamento = true;
      this.usuario.iddep = idDepto;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  ToggleStatusUsu() {
    if (this.usuarioForm.value.activousr == 1) {
      this.statusUsu = 'Activo';
    } else {
      this.statusUsu = 'Inactivo';
      this.usuarioForm.value.activousr = 0;
    }
  }

  ToggleStatusLine() {
    if (this.usuarioForm.value.permitir_linea == 1) {
      this.statusLine = 'Activo';
      this.usuarioForm.value.permitir_linea = 1;
    } else {
      this.statusLine = 'Inactivo';
      this.usuarioForm.value.permitir_linea = 0;
    }
  }

}
