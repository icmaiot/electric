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
        this.getTurnos(this.dataGraficaSkuProducido);
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
        this.SKU(this.turnos,data);
      }
    } catch (e) {
    }
  }

  // SKU PRODUCIDOS POR LOTE

  // SKU PRODUCIDOS POR LINEA

  //CHARTDIV2
  SKU(turnos, data) {
    let chart = am4core.create("SKU", am4charts.XYChart);

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "SKU";


    for (var i = 0; i < turnos.length; i++) {
      createSeries(turnos[i].turno, data, turnos[i].turnodb)
    }

    // Create series
    function createSeries(name, data, turnodb) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = turnodb;
      series.dataFields.dateX = "fechater";
      series.name = name;
      series.tooltipText = "{name}: {valueY} piezas";

      let segment = series.segments.template;
      segment.interactionsEnabled = true;

      let hoverState = segment.states.create("hover");
      hoverState.properties.strokeWidth = 3;

      let dimmed = segment.states.create("dimmed");
      dimmed.properties.stroke = am4core.color("#dadada");

      segment.events.on("over", function (event) {
        processOver(event.target.parent.parent.parent);
      });

      segment.events.on("out", function (event) {
        processOut(event.target.parent.parent.parent);
      });

      // Make bullets grow on hover
      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#fff");

      let bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 1.3;

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;

      series.data = data;
      return series;
    }

    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.legend.scrollable = true;

    chart.legend.markers.template.states.create("dimmed").properties.opacity = 0.3;
    chart.legend.labels.template.states.create("dimmed").properties.opacity = 0.3;

    chart.legend.itemContainers.template.events.on("over", function (event) {
      processOver(event.target.dataItem.dataContext);
    })

    chart.legend.itemContainers.template.events.on("out", function (event) {
      processOut(event.target.dataItem.dataContext);
    })

    function processOver(hoveredSeries) {
      hoveredSeries.toFront();

      hoveredSeries.segments.each(function (segment) {
        segment.setState("hover");
      })

      hoveredSeries.legendDataItem.marker.setState("default");
      hoveredSeries.legendDataItem.label.setState("default");

      chart.series.each(function (series) {
        if (series != hoveredSeries) {
          hoveredSeries.segments.each(function (segment) {
            segment.setState("dimmed");
          })
          series.bulletsContainer.setState("dimmed");
          series.legendDataItem.marker.setState("dimmed");
          series.legendDataItem.label.setState("dimmed");
        }
      });
    }

    function processOut(hoveredSeries) {
      chart.series.each(function (series) {
        hoveredSeries.segments.each(function (segment) {
          segment.setState("default");
        })
        series.bulletsContainer.setState("default");
        series.legendDataItem.marker.setState("default");
        series.legendDataItem.label.setState("default");
      });
    }
  }

}
