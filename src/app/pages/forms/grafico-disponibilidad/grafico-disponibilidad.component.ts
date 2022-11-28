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
import { DatePipe } from '@angular/common';

am4core.useTheme(am4themes_animated);
am4core.options.autoDispose = true;

@Component({
  selector: 'app-grafico-disponibilidad',
  templateUrl: './grafico-disponibilidad.component.html',
  styleUrls: ['./grafico-disponibilidad.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GraficoDisponibilidadComponent implements OnInit {
  @Input() chartdiv: string;
  @Input() chartData;
  CG;
  Input: string;
  dataGauge = [];
  dataOEE = [];
  dataGraficaSkuProducido = [];
  dataGraficaDisponibilidad = [];
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
      idturno: ['-1'],
    });

    this.sumarDias(this.date, -7);
    this.minDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.maxDate = this.datePipe.transform(this.date2, 'yyyy-MM-dd');
    this.formF.controls['fechaprep'].setValue(this.minDate);
    this.formF.controls['fechaprep2'].setValue(this.maxDate);

    this.getTurnos()
    this.getProductos();
    this.getGraficaDisponibilidad()
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
    this.formF.controls['idturno'].setValue('-1');
    this.getGraficaDisponibilidad();
  }

  //Graficas
  async getGraficaDisponibilidad() {
    try {
      let resp = await this.graficaService.PGraficaDisponibilidad(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.dataGraficaDisponibilidad = resp.response;
        this.Disponibilidad(this.dataGraficaDisponibilidad);
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

  async getTurnos() {
    try {
      let resp = await this.turnosService.get("", this.token).toPromise();
      if (resp.code == 200) {
        this.turnos = resp.response;
      }
    } catch (e) {
    }
  }

  //CHARTDIV4****
  Disponibilidad(data) {
    let chart = am4core.create("Disponibilidad", am4charts.XYChart);

    // Add data
    chart.data = data;
    console.log(data)

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Disponibilidad";
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return text + "%";
    });

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "disponibilidad";
    series.dataFields.dateX = "fechaprod";
    series.tooltipText = "{value}"
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();

    chart.scrollbarX.parent = chart.bottomAxesContainer;

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
  }
}
