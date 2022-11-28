import { Component, ViewEncapsulation, NgZone, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { MaquinaService } from '@app/services/maquina.service';
import { TurnosProductivosService } from '@app/services/turnos-productivos.service';
import { ProductoService } from '@app/services/producto.service'
import { GraficaService } from '@app/services/grafica.service'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { CardTitleComponent } from '@app/components/card-title/card-title.component';
import { DatePipe } from '@angular/common';
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';

am4core.useTheme(am4themes_animated);
am4core.options.autoDispose = true;

@Component({
  selector: 'app-grafico-sku',
  templateUrl: './grafico-sku.component.html',
  styleUrls: ['./grafico-sku.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GraficoSkuComponent implements OnInit {
  @Input() chartdiv: string;
  @Input() chartData;
  CG;
  Input: string;
  dataGauge = [];
  dataOEE = [];
  dataGraficaSkuProducido = [];
  dataGraficaEficiencia = [];
  turnos = [];
  productos = [];
  filterArray = [];
  formF: FormGroup;
  submitted = false;
  X = false;
  Z = false;
  token;
  data;
  Gaugue;
  calidad;
  score;
  title: string;
  id;

  maxDate: string;
  minDate: string;
  date: Date;
  date2: Date;


  constructor(
    private maquinaService: MaquinaService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private turnosService: TurnosProductivosService,
    private productoService: ProductoService,
    private graficaService: GraficaService,
  ) {

  }

  ngOnInit() {
    this.token = this.auth.token;
    this.date = new Date();
    this.date2 = new Date();
    this.formF = this.formBuilder.group({
      fechaprep: ['0000-00-00'],
      fechaprep2: ['0000-00-00'],
      idskunow: ['-1'],
      linea: ['-1'],
    });

    this.sumarDias(this.date, -7);
    this.minDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.maxDate = this.datePipe.transform(this.date2, 'yyyy-MM-dd');
    this.formF.controls['fechaprep'].setValue(this.minDate);
    this.formF.controls['fechaprep2'].setValue(this.maxDate);

    this.getMaquina();
    this.getProductos();
    this.getGraficaSkuProducido();
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  async limpiarFiltro() {
    this.formF.controls['fechaprep'].setValue(this.minDate);
    this.formF.controls['fechaprep2'].setValue(this.maxDate);
    this.formF.controls['idskunow'].setValue('-1');
    this.formF.controls['linea'].setValue('-1');
    this.getMaquina();
    this.getGraficaSkuProducido();
  }

  //Graficas

  async getMaquina() {
    try {
      let resp = await this.maquinaService.PGraficaLinea(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.dataGauge = resp.response;
        this.getTurnos(this.dataGauge)

      }
    } catch (e) {
    }
  }

  async getGraficaSkuProducido() {
    try {
      let resp = await this.graficaService.PGraficaSkuProducido(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.dataGraficaSkuProducido = resp.response;
        this.SKU(this.dataGraficaSkuProducido);
      }
    } catch (e) {
    }
  }



  // Filtros
  async getProductos() {
    try {
      let resp = await this.productoService.get("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.productos = resp.response;
      }
    } catch (e) {
    }
  }


  async getTurnos(data) {
    try {
      let resp = await this.turnosService.get("", this.token).toPromise();
      if (resp.code == 200) {
        this.turnos = resp.response;
      }
    } catch (e) {
    }
  }

  // SKU PRODUCIDOS POR LOTE

  // SKU PRODUCIDOS POR LINEA

  //CHARTDIV2
  SKU(data) {
    let chart = am4core.create("SKU", am4charts.XYChart3D);

    chart.data = data;
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "fechaprod";

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Cantidad de Piezas Producidas";
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return text + "Un";
    });

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "cantproducida";
    series.dataFields.categoryX = "fechaprod";
    series.name = "producto";
    series.clustered = false;
    series.columns.template.tooltipText = "Cantidad {category}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.9;

    var bullet = series.bullets.push(new am4charts.LabelBullet())
    bullet.interactionsEnabled = false
    bullet.locationY = 0.5;
    bullet.label.text = '{valueY}'
    bullet.label.fill = am4core.color('#ffffff')
    bullet.verticalCenter = "middle";
  }

}
