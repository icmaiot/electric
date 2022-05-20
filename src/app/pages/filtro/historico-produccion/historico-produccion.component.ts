import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { MaquinaService } from '@app/services/maquina.service';
import { ProductoService } from '@app/services/producto.service';
import { TiempomuertopService } from '@app/services/tiempomuertop.service';
import { DefectosService } from '@app/services/defectos.service';
import { ScrapService } from '@app/services/scrap.service';
import { ProduccionhistoricoService } from '@app/services/produccionhistorico.service';
import { ExcelService } from '@app/services/excel.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-historico-produccion',
  templateUrl: './historico-produccion.component.html',
  styleUrls: ['./historico-produccion.component.scss'],
})

export class HistoricoProduccionComponent implements OnInit {


  maxDate: string;
  minDate: string;
  historico = [];
  producto = [];
  filter = [];
  FilterArray = [];
  FilterArray2 = [];
  tiempomuerto = [];
  pieza = [];
  scrap = [];
  produccionhistorico = [];
  filtro_tm = [];
  filtro_scrap = [];
  filtro_defectos = [];
  lote;

  token;
  total = 0;
  formFilter: FormGroup;
  date: Date;
  date2: Date;
  names: any;

  listNav = [
    { "name": "Programa de producción", "router": "/programa-de-produccion" },
    { "name": "Programa en ejecución", "router": "/produccion-ejecucion" },
    { "name": "Histórico de producción", "router": "/historico-produccion" },
  ]

  constructor(
    private auth: AuthService,
    private maquinaService: MaquinaService,
    private productoService: ProductoService,
    private tiempomuertopService: TiempomuertopService,
    private defectosService: DefectosService,
    private scrapService: ScrapService,
    private produccionhistoricoService: ProduccionhistoricoService,
    private excelService: ExcelService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.token = this.auth.token;
    this.date = new Date();
    this.date2 = new Date();
    this.formFilter = this.formBuilder.group({
      idskunow: ['-1'],
      turnosel: ['-1'],
      fechaprep: ['0000-00-00'],
      fechaprep2: ['0000-00-00'],
    })
    this.sumarDias(this.date, -7);
    this.minDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.maxDate = this.datePipe.transform(this.date2, 'yyyy-MM-dd');
    this.formFilter.controls['fechaprep'].setValue(this.minDate);
    this.formFilter.controls['fechaprep2'].setValue(this.maxDate);
    this.getHistorico();
    this.getFilter();

    this.filtroTm();
    this.filtroScrap();
    this.filtroDefectos();
  }

  async getHistorico() {
    try {
      let resp = await this.maquinaService.getHistorico(this.formFilter.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.historico = resp.response;
        this.total = this.historico.length;
      }
    } catch (e) {
    }
  }

  async filtroTm() {
    try {
      let resp = await this.maquinaService.filtroTm(this.formFilter.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.filtro_tm = resp.response;
      }
    } catch (e) {
    }
  }

  async filtroScrap() {
    try {
      let resp = await this.maquinaService.filtroScrap(this.formFilter.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.filtro_scrap = resp.response;
      }
    } catch (e) {
    }
  }

  async filtroDefectos() {
    try {
      let resp = await this.maquinaService.filtroDefectos(this.formFilter.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.filtro_defectos = resp.response;
      }
    } catch (e) {
    }
  }
  

  async getProducto() {
    try {
      let resp = await this.productoService.get('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.producto = resp.response;
      }
    } catch (e) {
    }
  }

  async getProduccionhistorico(idlote) {
        console.log(idlote)
    try {
      let resp = await this.produccionhistoricoService.get(idlote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.produccionhistorico = resp.response;
        this.getTmp(idlote, this.produccionhistorico)
      }
    } catch (e) {
    }
  }

  async getTmp(idlote,PD) {
    try {
      let resp = await this.tiempomuertopService.tm(idlote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.tiempomuerto = resp.response;
        this.getPieza(idlote, PD, this.tiempomuerto)
      }
    } catch (e) {
    }
  }

  async getPieza(idlote, PD, TMP) {
    try {
      let resp = await this.defectosService.get(idlote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.pieza = resp.response;
        this.getScrap(idlote, PD, TMP, this.pieza)
      }
    } catch (e) {
    }
  }

  async getScrap(idlote,PD, TMP, PZ) {
    try {
      let resp = await this.scrapService.get(idlote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.scrap = resp.response;
        this.excelService.exportAsExcelFile(idlote, PD,TMP,PZ, this.scrap);
        
      }
    } catch (e) {
    }
  }



  async getFilter() {
    try {
      let resp = await this.maquinaService.getHistorico(this.formFilter.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.filter = resp.response;
        console.log(this.filter)
        this.FilterArray = this.filter.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.idskunow === current.idskunow)) {
            accumalator.push(current);
          }
          return accumalator;
        }, []);
        this.FilterArray2 = this.filter.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.turno === current.turno)) {
            accumalator.push(current);
          }
          return accumalator;
        }, []);
      }
    } catch (e) {
    }
  }

  sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  async limpiarFiltro() {
    this.formFilter.controls['idskunow'].setValue('-1');
    this.formFilter.controls['turnosel'].setValue('-1');
    this.formFilter.controls['fechaprep'].setValue(this.minDate);
    this.formFilter.controls['fechaprep2'].setValue(this.maxDate);
    this.getHistorico();
    this.filtroTm();
    this.filtroScrap();
    this.filtroDefectos();
  }


  exportAsExcelFile(data): void {
    console.log(data)
    console.log(data.progprodlinea)
    this.getProduccionhistorico(data);
    //this.excelService.exportAsExcelFile(data);
  }

  exportAsExcel(): void {
    this.excelService.exportAsExcel();
  }



}