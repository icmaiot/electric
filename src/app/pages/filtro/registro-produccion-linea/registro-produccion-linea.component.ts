import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { NuevoRegPiezaComponent } from '@app/pages/forms/nuevo-reg-pieza/nuevo-reg-pieza.component';
import { NuevoRegScrapComponent } from '@app/pages/forms/nuevo-reg-scrap/nuevo-reg-scrap.component';
import { WebServiceService } from '@app/services/web-service.service';
import { ProgprodlineaService } from '@app/services/progprodlinea.service'
import { ProduccionloteService } from '@app/services/produccionlote.service';
import { TiempomuertopService } from '@app/services/tiempomuertop.service';
import { MaquinaService } from '@app/services/maquina.service';
import { ModuloRMTService } from '@app/services/modulo-rmt.service';
import { EventoUsuarioService } from '@app/services/evento-usuario.service';
import { EventocausaService } from '@app/services/eventocausa.service';
import { NuevoTMComponent } from '@app/pages/forms/nuevo-tm/nuevo-tm.component';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-registro-produccion-linea',
  templateUrl: './registro-produccion-linea.component.html',
  styleUrls: ['./registro-produccion-linea.component.scss'],
})

export class RegistroProduccionLineaComponent implements OnInit {

  idprogprodlinea;
  idproducto;
  idmaquina: string;
  idrmt: string;
  control;
  topic: string;
  message: string;
  product: number;
  cantidadpiezas: number;
  lineapre: boolean = true;
  lineapro: boolean = true;
  lineater: boolean = true;
  progprodlinea = [];
  progprodlineapa = [];
  productolinea = [];
  filterArray = [];
  moduloRMTlista = [];
  listaprod = [];
  listatm = [];
  listatmp = [];
  lsevento = [];
  lseventoc = [];
  ver_tmp = [];
  dataGauge = [];
  form: FormGroup;
  formp: FormGroup;
  formb: FormGroup;
  formlote: FormGroup;
  formlfinal: FormGroup;
  formFilter: FormGroup;
  formtmps: FormGroup;
  form_ver: FormGroup;
  submitted = false;
  token;
  id;
  tmp;
  ult_period;
  te_producto;
  ciclo_producto;
  intervalo_tm;
  total = 0;

  estado: string;

  listNav = [
    { "name": "Programa de producción", "router": "/programa-de-produccion" },
  ]

  constructor(
    private progprodlineaService: ProgprodlineaService,
    private produccionloteService: ProduccionloteService,
    private tiempomuertopService: TiempomuertopService,
    private eventoService: EventoUsuarioService,
    private eventocausaService: EventocausaService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private activate: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private cdRef: ChangeDetectorRef,
    private webService: WebServiceService,
    private maquinaService: MaquinaService,
    private modulormtService: ModuloRMTService,

  ) { }

  ngOnInit() {



    this.token = this.auth.token;
    this.idprogprodlinea = this.activate.snapshot.paramMap.get('id');

    this.form = this.formBuilder.group({
      idprogprodlinea: [],
      statprodlinea: [''],
    });

    this.formtmps = this.formBuilder.group({
      idlote: [''],
    });

    this.form_ver = this.formBuilder.group({
      lotei: [''],
    });

    this.formp = this.formBuilder.group({
      tname: [''],
    });

    this.formlfinal = this.formBuilder.group({
      lote: [''],
    });

    this.formlote = this.formBuilder.group({
      tname: [''],
      product: [''],
      cantidadpiezas: [''],
      turdescanso: [''],
    });

    this.formb = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.getRlinea();
    this.getProgprodlineapa();
    this.getTM();
    this.getEvento('');
    this.gettmp();
    this.getVer();

    setInterval(() => {
      this.getRlinea();
      this.getProgprodlineapa();
      this.getTM();
      this.getEvento('');
      this.gettmp(); // solo cuando se le de en terminas produccion (tiempo muerto periodo)
    }, 5000);

  }

  onChange(event) {
    this.id = event.target.value
    this.getEventoCausa();
  }

  async getEvento(searchValue: string) {
    try {
      let resp = await this.eventoService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lsevento = resp.eventos;
      }
    } catch (e) {

    }
  }

  async getEventoCausa() {
    try {
      let resp = await this.eventocausaService.get('3', this.id, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lseventoc = resp.response;
      }
    } catch (e) {

    }
  }

  async getTM() {
    try {
      let resp = await this.tiempomuertopService.get(this.idprogprodlinea, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listatm = resp.response;
      }
    } catch (e) {

    }
  }

  async gettmp() {
    try {
      this.formtmps.value.idlote = this.idprogprodlinea;
      let resp = await this.tiempomuertopService.tm(this.idprogprodlinea, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listatmp = resp.response;
      }
    } catch (e) {

    }
  }

  async getVer() {
    try {

      this.form_ver.value.lotei = this.idprogprodlinea;
      let resp = await this.tiempomuertopService.tmp(this.form_ver.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.ver_tmp = resp.response;
        this.tmp = this.ver_tmp[0].tmuerto_reg;
        this.ult_period = this.ver_tmp[0].ult_periodo;
        if (this.tmp == 1 && this.form.value.statprodlinea == 3) {
          this.lineater = false;
        }
        else if (this.tmp == 0 && this.form.value.statprodlinea == 3) {
          this.lineater = false;
        }
        else if (this.tmp == 2 && this.form.value.statprodlinea == 3) {
          this.lineater = true;
        }
        else if (this.tmp == 3 && this.form.value.statprodlinea == 3) {
          this.lineater = false;
        }
      }
    } catch (e) {

    }
  }

  async getProgprodlineapa() {
    try {
      let resp = await this.progprodlineaService.get(this.idprogprodlinea, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.progprodlineapa = resp.response;
        this.form.controls['idprogprodlinea'].setValue(this.progprodlineapa[0].idprogprodlinea);
        this.form.controls['statprodlinea'].setValue(this.progprodlineapa[0].statprodlinea);

        this.formlote.controls['cantidadpiezas'].setValue(this.progprodlineapa[0].cant);
        this.formlote.controls['product'].setValue(this.progprodlineapa[0].idskunow);
        this.cdRef.detectChanges();
      }
    } catch (e) {

    }
  }


  getData(): Observable<any> {
    return this.webService.getEncoderData();
  }

  async getRlinea() {

    try {
      let resp = await this.progprodlineaService.getRlinea(this.auth.token, this.idprogprodlinea).toPromise();
      if (resp.code == 200) {
        this.progprodlinea = resp.response;
        this.dataGauge = resp.response;
        this.formlote.controls['turdescanso'].setValue(this.progprodlinea[0].idturdesc);
        this.te_producto = this.progprodlinea[0].te_producto;
        this.ciclo_producto = this.progprodlinea[0].ciclo_producto;
        this.intervalo_tm = this.progprodlinea[0].intervalo_tm;
        this.titleService.setTitle(this.progprodlinea[0].maquina + ' - Lote ' + this.idprogprodlinea);

        this.getFiltro(this.progprodlinea)

        this.productolinea = resp.response;
        this.control = this.progprodlinea[0].statprodlinea;
        this.control;
        this.cdRef.detectChanges();
        if (this.control == 0) {
          this.estado = "Creada"
        }
        else if (this.control == 1) {
          this.estado ="Preparación"
        }
        else if (this.control == 2) {
          this.estado="Produccción"
        }
        else if (this.control == 3 || this.control > 3) {
          this.estado="Finalizada"
        }
      }
    } catch (e) {

    }
  }

  async getModuloRMT(lista) {
    this.idrmt = lista[0].idrmt;
    try {
      let resp = await this.modulormtService.getModuloRMT(this.idrmt, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.moduloRMTlista = resp.response;
        this.formb.value.topic = this.moduloRMTlista[0].serialrmt;
      }
    } catch (e) {
    }
  }

  async getFiltro(lista) {
    this.idmaquina = lista[0].idlineaprod;
    try {
      let resp = await this.maquinaService.getMaquina(this.idmaquina, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaprod = resp.maquina;
        this.getModuloRMT(this.listaprod)
      }
    } catch (e) {
    }
  }
  //lote:23/RstP:1/Cnt:1/Fin
  async DataEncoderTer() {
    this.formb.value.message = 'Lote:0/RstP:1/Sts:0/Fin';
    try {
      let response = await this.produccionloteService.DataEncoder(this.formb.value).toPromise();

    } catch (error) {
    }
  }
  //  '/Intm:' +  this.intervalo_tm +
  async DataEncoder() {
    this.getFiltro('');
    this.idmaquina;
    this.te_producto;
    this.ciclo_producto;
    this.intervalo_tm;
    this.formb.value.message = 'Equipo:' + this.idmaquina + '/Lote:' + this.idprogprodlinea + '/Tact:' + this.te_producto + '/PCiclo:' + this.ciclo_producto + '/RstP:1/Sts:0/Fin';
    try {
      let response = await this.produccionloteService.DataEncoder(this.formb.value).toPromise();

    } catch (error) {
    }
  }

  async DataEncoderProd() {
    this.formb.value.message = 'Lote:' + this.idprogprodlinea + '/RstP:1/Sts:2/Fin';
    try {
      let response = await this.produccionloteService.DataEncoder(this.formb.value).toPromise();

    } catch (error) {
    }
  }

  async update() {
    this.form.value.statprodlinea = this.control;
    try {
      let response = await this.progprodlineaService.update(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        if (this.form.value.statprodlinea == 1) {
          Swal.fire('Se ha registrado el inicio de la preparación', '', 'success');
        }
        else if (this.form.value.statprodlinea == 2) {
          Swal.fire('Se ha registrado el inicio de la producción', '', 'success');
        }
        this.submitted = false;
        this.getProgprodlineapa();
        this.getRlinea();
        if (this.form.value.statprodlinea == 3) {
          window.close();
        }
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el registro', error.error);
    }
  }

  async savepreparacion() {
    this.control = 1;
    this.update();
    this.DataEncoder();
    this.formp.value.tname = 'lote' + this.idprogprodlinea;
    try {
      let response = await this.produccionloteService.getpreparacion(this.formp.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Se ha registrado el inicio de la preparación', '', 'success');
      }
    } catch (error) {

    }
  }

  async saveproduccionlote() {
    this.control = 2;
    this.update();
    this.formlote.value.tname = 'lote' + this.idprogprodlinea;
    this.DataEncoderProd();
    try {
      let response = await this.produccionloteService.getlote(this.formlote.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Se ha registrado el inicio de la producción', '', 'success');
      }
    } catch (error) {
    }
  }

  async getLotefinal() {
    this.formlfinal.value.lote = this.idprogprodlinea;
    try {
      let response = await this.produccionloteService.getlotefinal(this.formlfinal.value, this.auth.token).toPromise();
      if (response.code == 200) {
        //  Swal.fire('Guardado', '¡Se ha mandado el lote final!', 'success');
      }
    } catch (error) {
    }
  }

  async saveterminado() {
    this.getVer();
    this.control = 3;
    this.form.value.statprodlinea = this.control;
    if (this.form.value.statprodlinea == 3) {
      this.DataEncoderTer();
      this.getLotefinal();
      this.update();
      this.getVer();
      if (this.tmp == 1) {
        this.lineater = false;
        this.control = 3;
        this.form.value.statprodlinea = this.control;
        if (this.form.value.statprodlinea == 3) {
          this.lineater = false;
          //this.DeleteTM();
          this.update();
        }
      }
      if (this.tmp == 2) {
        this.lineater = false;
        Swal.fire('Se encontró un evento de tiempo muerto sin concluir. Verifique que el evento y la subcausa hayan sido registradas', '', 'warning');
      } else if (this.tmp == 3) {
        this.lineater = false;
        Swal.fire('El ultimo registro de tiempo muerto no se le ha asignado un evento o una subcausa. Por favor verifique', '', 'warning');
      }
    }
  }

  async DeleteTM() {
    try {
      let response = await this.tiempomuertopService.delete(this.idprogprodlinea, this.auth.token).toPromise();
      if (response.code == 200) {
        // Swal.fire('Guardado', '¡Se ha mandado el lote final!', 'success');
      }
    } catch (error) {
    }
  }

  editTM(tm) {
    const dialogRef = this.dialog.open(NuevoTMComponent, {
      width: '70rem',
      data: {
        title: 'Editar Tiempo Muerto',
        btnText: 'Guardar',
        alertSuccesText: 'Registro modificado!',
        alertErrorText: "Error modificando el registro",
        modalMode: 'create',
        obj: tm
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.gettmp();
    });
  }

  newPieza(obj) {
    const dialogRef = this.dialog.open(NuevoRegPiezaComponent, {
      //width: '55rem',
      data: {
        title: 'Registro de modos e falla para la orden ' + obj.idprogprodlinea,
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj,
        tname: 'lote' + this.idprogprodlinea,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getRlinea();
    });
  }

  newScrap(obj) {
    const dialogRef = this.dialog.open(NuevoRegScrapComponent, {
      //   width: '55rem',
      data: {
        title: 'Registro de scrap para la orden ' + obj.idprogprodlinea,
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getRlinea();
    });
  }

  get f() { return this.form.controls; }

  showSpinner() {
    const opt1: Spinner = {
      bdColor: "rgba(51,51,51,0.8)",
      size: "medium",
      color: "#fff",
      type: "square-jelly-box"
    };
    this.spinner.show("mySpinner", opt1);
  }
}