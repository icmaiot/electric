import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MaquinaService } from '@app/services/maquina.service';
import { AreaService } from '@app/services/area.service';
import { TipoEquipoService } from '@app/services/tipo-equipo.service';
import { ModuloInterfazService } from '@app/services/modulo-interfaz.service';
import { ModuloRMTService } from '@app/services/modulo-rmt.service';
import { UsuarioService } from '@app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Maquina } from '@app/models/maquina';
import { Area } from '@app/models/area';
import { TipoEquipo } from '@app/models/tipoEquipo';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-maquina',
  templateUrl: './nuevo-maquina.component.html',
  styleUrls: ['./nuevo-maquina.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoMaquinaComponent extends Dialog implements OnInit{

  maquina = [];
  maquinaForm: FormGroup;
  submitted = false;
  modulo = true;
  AS = [];
  TP = [];
  MIlista = [];
  MRMTlista = [];
  modulormt = [];
  usuario = [];
  tipo;
  token;
  serial;
  serialrmt;

  constructor(private maquinaService: MaquinaService,
    private areaService: AreaService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<NuevoMaquinaComponent>,
    private auth: AuthService,
    private tipoService: TipoEquipoService,
    private moduloService: ModuloInterfazService,
    private moduloRMTService: ModuloRMTService,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  programa = [
    { id: 1, nombrep: 'Línea' },
    { id: 2, nombrep: 'Equipo' },
  ];

  ngOnInit() {
    this.maquinaForm = this.formBuilder.group({
      idmaquina: [],
      tipoequipo: ['', Validators.required],
      maquina: ['', Validators.required],
      idarea: ['', Validators.required],
      idmodulo: [''],
      Descripcion: ['', Validators.required],
      idrmt: ['', Validators.required],
      progprod: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getAreas();
    this.getTipos();
    this.getModulo();
    this.getModuloRMT();
    this.getUsuario();
  }

  
  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _maquina } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.serial = _maquina.serial;
    this.serialrmt = _maquina.serialrmt;
    console.log(_maquina)
    if (_maquina) {
      //this.maquina = _maquina;
      const { idmaquina, Descripcion, idarea, tipoequipo, idmodulo, maquina, idrmt, serial, progprod  } = _maquina;
      this.maquinaForm.patchValue({ idmaquina, Descripcion, idarea, tipoequipo , idmodulo, maquina, serial, idrmt, progprod  });
  }

  this.maquinaForm.controls['tipoequipo'].setValue(_maquina.idtipo);
  if(_maquina.progprod=="Equipo"){ 
    this.modulo = false;
    this.maquinaForm.value.progprod = '2' 
  } else {
    this.maquinaForm.value.progprod = '1' }
  }


  setIDM(){
    this.maquinaForm.controls['idmodulo'].setValue('0');
  }

  setIDRMT(){
    this.maquinaForm.controls['idrmt'].setValue('0');
  }

  async getAreas() {
    try {
      let resp = await this.areaService.getAreas("", this.token).toPromise();
      if (resp.code == 200) {
        this.AS = resp.area;
      }
    } catch (e) {
    }
  }

  async getTipos() {
    try {
      let resp = await this.tipoService.getTipos(this.token).toPromise();
      if (resp.code == 200) {
        this.TP = resp.tipo_equipos;
      }
    } catch (error) {
    }
  }

  async getUsuario() {
    try {
      let resp = await this.usuarioService.getUsuarioEx(this.token).toPromise();
      if (resp.code == 200) {
        this.usuario = resp.response;
      }
    } catch (error) {
    }
  }

  async getModuloRMT() {
    try {
      let resp = await this.maquinaService.getModrmt(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.MRMTlista = resp.response;
        if (this.serialrmt != null){
        this.MRMTlista.push({idrmt: this.maquinaForm.value.idrmt, serialrmt: this.serialrmt})}
      }
    } catch (e) {
    }
  }

  async getModulo() {
    try {
      let resp = await this.moduloService.getModuloInterfazLista(this.token).toPromise();
      if (resp.code == 200) {
        this.MIlista = resp.modulo;
        if (this.serial != null){
        this.MIlista.push({idmodulo: this.maquinaForm.value.idmodulo, serial: this.serial})}
      }
    } catch (error) {
    }
  }
  
  get f() { return this.maquinaForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.maquinaForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  borrarrmt(){
    
  }

  async guardar() {
    try {
      let response;
      response = await this.maquinaService.update(this.maquinaForm.value, this.token).toPromise();
      if (response.code = 200) {
        console.log(this.maquinaForm.value)
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
