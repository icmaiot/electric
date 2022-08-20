import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaquinaService } from '@app/services/maquina.service';
import { AreaService } from '@app/services/area.service';
import { Maquina } from '@app/models/maquina';
import { Area } from '@app/models/area';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NuevoMaquinaComponent } from '@app/pages/forms/nuevo-maquina/nuevo-maquina.component';
import { NuevoSensorComponent } from '@app/pages/forms/nuevo-sensor/nuevo-sensor.component';
import { AsignacionCorreoComponent } from '@app/pages/forms/asignacion-correo/asignacion-correo.component';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { ModuloInterfazService } from '@app/services/modulo-interfaz.service';
import { TipoEquipo } from '@app/models/tipoEquipo';
import { TipoEquipoService } from '@app/services/tipo-equipo.service';
import { Router } from '@angular/router';
import { SkuMaquinaService } from '@app/services/sku-maquina.service'
import { ProductoService } from '@app/services/producto.service';
import { TurnosdescansoService } from '@app/services/turnosdescanso.service';
import { ProgprodlineaService } from '@app/services/progprodlinea.service';
import { UsuarioService } from '@app/services/usuario.service';
import { SubMaquinaService } from '@app/services/sub-maquina.service';

@Component({
  selector: 'app-maquinas',
  templateUrl: './maquinas.component.html',
  styleUrls: ['./maquinas.component.scss']
})
export class MaquinasComponent implements OnInit {

  maquina: Maquina = new Maquina();
  form: FormGroup;
  formFilter: FormGroup;
  submitted = false;
  tipoequipo: TipoEquipo[];
  moduloInterfaz = [];
  maquinalista = [];
  maquinalista2 = [];
  filterArray = [];
  filterArray2 = [];
  moduloInlista = [];
  moduloRMTlista = [];
  token;
  maquinas: Maquina[];
  areas: Area[];
  selectedArea: string = '';
  total: number = 0;

  idmaquina;
  MBP: any [];
  MQTT: FormGroup;
  MQTTt: FormGroup;
  MQTTs: FormGroup;
  MQTTu: FormGroup;
  prod = [];
  moduloi = [];
  turnodescanso = [];
  usr = [];
  usrSend: string;
  turnod: string;
  prodSend: string;

  programa: any[] = [
    { id: 1, progprod: 'Línea' },
    { id: 2, progprod: 'Equipo' },
  ];

  listNav = [
    { "name": "Equipos", "router": "/maquina" },
    { "name": "Área", "router": "/area" },
    { "name": "Tipo de equipo", "router": "/tipoEquipo" },
    { "name": "Modulo Interfaz", "router": "/moduloInterfaz" },
    { "name": "Modulo RMT", "router": "/modulo-RMT" },
  ]

  constructor(
    private maquinaService: MaquinaService,
    private areaService: AreaService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tipoService: TipoEquipoService,
    private moduloService: ModuloInterfazService,
    private cdRef: ChangeDetectorRef,

    private productoService: ProductoService,
    private skumaquinaService: SkuMaquinaService,
    private progprodlineaService: ProgprodlineaService,
    private turnoService: TurnosdescansoService,
    private usuarioService: UsuarioService,
    private submaquinaService: SubMaquinaService,
  ) { }

  ngOnInit() {
    this.token = this.auth.token;
    //const disabled = this.data.idArea ? true : false;

    this.form = this.formBuilder.group({
      maquina: ['', Validators.required],
      idarea: ['', Validators.required],
      tipoequipo: ['', Validators.required],
      idmodulo: [''],
      Descripcion: ['', Validators.required],
      idrmt: [''],
      progprod: ['', Validators.required],
      idmaquina: []
    });

    this.formFilter = this.formBuilder.group({
      idarea: ['-1'],
      idtipo: ['-1']
    });

    this.MQTT = this.formBuilder.group({
      topic: [''],
      message: [],
    });
    this.MQTTt = this.formBuilder.group({
      topic: [''],
      message: [],
    });
    this.MQTTs = this.formBuilder.group({
      topic: [''],
      message: [],
    });
    this.MQTTu = this.formBuilder.group({
      topic: [''],
      message: [],
    });

    // this.getMaquinas("");
    this.getAreas();
    this.getTipos();
    // this.getModulo();
    this.getMaquinaLista();
    this.getMaquinaLista2();
    this.getModuloIn();
    this.getModuloRMT();
  }

  //EMPIEZA ENVIAR A MTQQ

  //oBTENER RMT TOPIC

  async Serial(idmaquina) {
      this.idmaquina = idmaquina;
    try {
         let resp = await this.maquinaService.getInterfaz(this.idmaquina, this.auth.token).toPromise();
         if (resp.code == 200) {
            this.moduloi = resp.response;
            this.getprodAct(this.moduloi[0].serialrmt);
            this.getTurnoDescanso(this.moduloi[0].serialrmt);
            this.getUsrAct(this.moduloi[0].serialrmt);
            this.getsubAct(this.moduloi[0].serialrmt);
         
        }
       } catch (e) {
       }

  }
  //PRODUCTOS

  async getprodAct(serialrmt) {
    try {
      let resp = await this.skumaquinaService.getProductosMaquina(this.idmaquina,this.auth.token).toPromise();
      if (resp.code == 200) {
        this.prod = resp.response;
        this.prodSend = JSON.stringify(this.prod);
        this.prodSend = this.prodSend.split(/]|{|}|"|id|producto|te_|intervalo_tm|ciclo_|:|/g).join('');
        this.prodSend = this.prodSend.split("[").join('');
        this.prodSend = this.prodSend.split(",").join('?');
        this.MQTT.value.topic = serialrmt;
        this.SendProductosMQTT(this.prodSend)
      }
    } catch (e) {
    }
  }

  async SendProductosMQTT(info) {
    this.MQTT.value.message =  'SKU:'+ info +'/Fin';
    try {
      let resp = await this.skumaquinaService.MQTTEncoder(this.MQTT.value).toPromise();
      
    } catch (e) {
    }
  }

  //TURNOS

  async getTurnoDescanso(serialrmt) {
    try {
      let resp = await this.progprodlineaService.getseleccionturno(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.turnodescanso = resp.response;
        this.turnod = JSON.stringify(this.turnodescanso);
        this.turnod = this.turnod.split(/]|{|}|"|/g).join('');
        this.turnod = this.turnod.split("idturdesc:").join('');
        this.turnod = this.turnod.split("descansos:"). join('');
        this.turnod = this.turnod.split("Turno:"). join('');
        this.turnod = this.turnod.split("[").join('');
        this.turnod = this.turnod.split(",").join('?');
        this.MQTTt.value.topic = serialrmt;
        this.SendTurnosMQTT(this.turnod)

      }
    } catch (e) {
    }
  }

  async SendTurnosMQTT(info) {
    this.MQTTt.value.message =  'Turno:'+ info +'/Fin';
    try {
      let resp = await this.turnoService.MQTTEncoder(this.MQTTt.value).toPromise();
      
    } catch (e) {
    }
  }

  //USUARIOS

  async getUsrAct(serialrmt) {
    try {
      let resp = await this.usuarioService.getUsuariosAct(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usr = resp.response;
        this.usrSend = JSON.stringify(this.usr);
        this.usrSend = this.usrSend.split(/]|{|}|"|id|evento|nip|permitir_linea|:|/g).join('');
        this.usrSend = this.usrSend.split("[").join('');
        this.usrSend = this.usrSend.split(",").join('?');
        this.MQTTu.value.topic = serialrmt;
        this.SendUsuariosMQTT(this.usrSend)
      }
    } catch (e) {
    }
  }

  async SendUsuariosMQTT(info) {
    this.MQTTu.value.message =  'Ids:'+ info +'/Fin';
    try {
      let resp = await this.usuarioService.MQTTEncoder(this.MQTTu.value).toPromise();
      
    } catch (e) {
    }
  }

  //SUBENSAMBLE


  async getsubAct(serialrmt) {
    try {
      let resp = await this.submaquinaService.getSubensambleMaquina(this.idmaquina,this.auth.token).toPromise();
      if (resp.code == 200) {
        this.prod = resp.response;
        this.prodSend = JSON.stringify(this.prod);
        this.prodSend = this.prodSend.split(/]|{|}|"|idsubens:|subensamble:|/g).join('');
        this.prodSend = this.prodSend.split("idsubens:").join('');
        this.prodSend = this.prodSend.split("subensamble:").join('');
        this.prodSend = this.prodSend.split("[").join('');
        this.prodSend = this.prodSend.split(",").join('?');
        this.MQTTs.value.topic = serialrmt;
        this.SendSubMQTT(this.prodSend)
      }
    } catch (e) {
    }
  }

  async SendSubMQTT(info) {
    this.MQTTs.value.message =  'SUB:'+ info +'/Fin';
    try {
      let resp = await this.submaquinaService.MQTTEncoder(this.MQTTs.value).toPromise();
      
    } catch (e) {
    }
  }


// FINALIZA ENVIADA A MTQQ

  async getMaquinaLista2() {
    try {
      let resp = await this.maquinaService.getMaquinaLista(this.formFilter.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.maquinalista2 = resp.response;

        this.filterArray = this.maquinalista2.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.area === current.area)) {
            accumalator.push(current);
          }
          return accumalator;

        }, []);
        this.filterArray2 = this.maquinalista2.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.tipoequipo === current.tipoequipo)) {
            accumalator.push(current);
          }
          return accumalator;

        }, []);
      }
    } catch (e) {
    }
  }

  async getModuloIn() {
    try {
      let resp = await this.maquinaService.getModuloInterfaz(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.moduloInlista = resp.response;
      }
    } catch (e) {
    }
  }

  async getModuloRMT() {
    try {
      let resp = await this.maquinaService.getModrmt(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.moduloRMTlista = resp.response;
      }
    } catch (e) {
    }
  }

  async getMaquinaLista() {
    try {
      let resp = await this.maquinaService.getMaquinaLista(this.formFilter.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.maquinalista = resp.response;
      }
    } catch (e) {
    }
  }

  async limpiarFiltro() {
    this.formFilter.controls['idarea'].setValue('-1');
    this.formFilter.controls['idtipo'].setValue('-1');
    this.getMaquinaLista();
  }

  async getMaquinas(searchValue: string) {
    try {
      let resp = await this.maquinaService.getMaquinas(searchValue, (this.selectedArea != "") ? this.selectedArea : "", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.maquinas = resp.maquina;
        this.total = this.maquinas.length;

      }
    } catch (e) {
    }
  }

  async getAreas() {
    try {
      let resp = await this.areaService.getAreas("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.areas = resp.area;
      }
    } catch (e) {
    }
  }

  async getTipos() {
    try {
      let resp = await this.tipoService.getTipos(this.token).toPromise();
      if (resp.code == 200) {
        this.tipoequipo = resp.tipo_equipos;
      }
    } catch (error) {
    }
  }

  async getModulo() {
    try {
      let resp = await this.moduloService.getModuloInterfazLista(this.token).toPromise();
      if (resp.code == 200) {
        this.moduloInterfaz = resp.modulo;
      }
    } catch (error) { }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.save();
    }
  }

  async save() {
    try {
      let response = await this.maquinaService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.submitted = false;
        this.form.reset({});
        this.getMaquinaLista();
        this.cdRef.detectChanges();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el registro', error.error);
    }
  }

  update(_maquina) {
    const dialogRef = this.dialog.open(NuevoMaquinaComponent, {
      width: '40rem',
      data: {
        title: 'Editar equipo: ' + _maquina.maquina,
        btnText: 'Guardar',
        alertSuccesText: 'Equipo modificado correctamente',
        alertErrorText: "No se puedo modificar el equipo",
        modalMode: 'edit',
        _maquina
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getMaquinaLista();
      this.getModuloRMT();
      this.getModuloIn();
      this.cdRef.detectChanges();
      this.form.reset({});
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estas seguro?', text: "Desea eliminar el equipo",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.maquinaService.delete(id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El equipo ha sido eliminado correctamente', 'success');
            this.getMaquinaLista();
          } else {
            Swal.fire('Error', 'No fue posible eliminar el equipo', 'error');
          }
        });
      }
    });
  }

  showSpinner() {
    const opt1: Spinner = {
      bdColor: "rgba(51,51,51,0.8)",
      size: "medium",
      color: "#fff",
      type: "square-jelly-box"
    };
    this.spinner.show("mySpinner", opt1);
  }

  onSearchChange(searchValue: string) {
    this.getMaquinas(searchValue);
  }

  searchByArea() {
    this.getMaquinas("");
  }

  addSensor(idMaquina) {
    const dialogRef = this.dialog.open(NuevoSensorComponent, {
      width: '40rem',
      data: {
        title: 'Agregar sensor',
        btnText: 'Agregar',
        alertSuccesText: 'Sensor creado!',
        alertErrorText: "No se pudo crear el sensor",
        modalMode: 'create',
        idMaquina
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getMaquinas("");
    });
  }

  email(obj) {
    const dialogRef = this.dialog.open(AsignacionCorreoComponent, {
      width: '40rem',
      data: {
        title: 'Asignar correo de usuario',
        btnText: 'Agregar',
        alertSuccesText: 'Correo asignado a la linea!',
        alertErrorText: "No se pudo asignar",
        obj,
        linea : obj.idmaquina,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getMaquinas("");
    });
  }

  loadPage(page) {
    this.maquinaService.changePage(page, this.auth.token);
  }
}
