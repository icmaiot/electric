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
  selector: 'app-grafico-tiempomuerto',
  templateUrl: './grafico-tiempomuerto.component.html',
  styleUrls: ['./grafico-tiempomuerto.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GraficoTiempomuertoComponent implements OnInit {
  @Input() chartdiv: string;
  @Input() chartData;
  CG;
  Input: string;
  dataGauge = [];
  dataOEE = [];
  dataGraficaSkuProducido = [];
  dataGraficaEficiencia = [];
  dataGraficaTmturnolineas = [];
  turnos = [];
  productos = [];
  filterArray = [];
  lineas = [];
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
      turno: ['-1'],
    });

    this.sumarDias(this.date, -7);
    this.minDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.maxDate = this.datePipe.transform(this.date2, 'yyyy-MM-dd');
    this.formF.controls['fechaprep'].setValue(this.minDate);
    this.formF.controls['fechaprep2'].setValue(this.maxDate);

    this.getProductos();
    this.getGraficaTiempomuertoPorDiayTurno();
    this.getMaquina();
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
    this.formF.controls['turno'].setValue('-1');
    this.getMaquina();
    this.getGraficaTiempomuertoPorDiayTurno();
  }

  //Graficas

  async getMaquina() {
    try {
      let resp = await this.maquinaService.PGraficaLinea(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.dataGauge = resp.response;
        this.getTurnos(this.dataGauge);
      }
    } catch (e) {
    }
  }

  async getGraficaTiempomuertoPorDiayTurno() {
    try {
      let resp = await this.graficaService.PGraficaTiempomuertoPorDiayTurno(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.dataGraficaTmturnolineas = resp.response;
        this.getLineas(this.dataGraficaTmturnolineas);
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
        this.TIEMPOMUERTO(this.turnos, data);
      }
    } catch (e) {
    }
  }

  async getLineas(data) {
    try {
      let resp = await this.maquinaService.getLinea('Línea', this.token).toPromise();
      if (resp.code == 200) {
        this.lineas = resp.response;
        for (var i = 0; i < this.lineas.length; i++) {
          this.lineas[i].maquina.replaceAll(' ', '_');
        }
        this.TMTURNOLINEAS(this.lineas, data);
        this.TMLINEASTURNOS(this.lineas, data);
      }
    } catch (e) {
    }
  }

  //TOTAL DE TIEMPO MUERTO POR FECHA POR TURNO (X=Fecha, Y=Tiempo Muerto, Z= Turno)
  TIEMPOMUERTO(turnos, data) {
    let chart = am4core.create("tm-turno", am4charts.XYChart);

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    for (var i = 0; i < turnos.length; i++) {
      createSeries(turnos[i].turno, data, turnos[i].turnodb)
    }

    // Create series
    function createSeries(name, data, turnodb) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = turnodb;
      series.dataFields.dateX = "fechaprod";
      series.name = name;
      series.tooltipText = "{name}: {valueY}";

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

  TMLINEASTURNOS(lineas, data) {

    // Create chart instance
    let chart = am4core.create("tm-lineas-turnos", am4charts.XYChart);

    // Add data
    chart.data = data;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "fechaprod";
    categoryAxis.title.text = "Líneas de Producción";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Tiempo Muerto (TM)";

    // Create series
    function createSeries(value, data, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = value;
      series.dataFields.categoryX = "fechaprod";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);

      var bullet = series.bullets.push(new am4charts.LabelBullet())
      bullet.interactionsEnabled = false
      bullet.locationY = 0.5;
      bullet.label.text = '{valueY}'
      bullet.label.fill = am4core.color('#ffffff')
      bullet.verticalCenter = "middle";
    }

    for (var i = 0; i < lineas.length; i++) {

      createSeries(lineas[i].maquina.replaceAll(' ', '_'), data, lineas[i].maquina, true)
    }

    // Add legend
    chart.legend = new am4charts.Legend();
  }

  TMTURNOLINEAS(lineas, data) {
    let chart = am4core.create('tm-turno-lineas', am4charts.XYChart)
    chart.colors.step = 2;

    chart.legend = new am4charts.Legend()
    chart.legend.position = 'top'
    chart.legend.paddingBottom = 20
    chart.legend.labels.template.maxWidth = 95

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = 'fechaprod'
    xAxis.renderer.cellStartLocation = 0.1
    xAxis.renderer.cellEndLocation = 0.9
    xAxis.renderer.grid.template.location = 0;

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    function createSeries(value, data, name) {
      let series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value
      series.dataFields.categoryX = 'fechaprod'
      series.name = name
      series.columns.template.tooltipText = "{name} = {valueY}";
      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);

      let bullet = series.bullets.push(new am4charts.LabelBullet())
      bullet.interactionsEnabled = false
      bullet.dy = 30;
      bullet.label.text = '{valueY}'
      bullet.label.fill = am4core.color('#ffffff')

      return series;
    }

    chart.data = data;

    for (var i = 0; i < lineas.length; i++) {

      createSeries(lineas[i].maquina.replaceAll(' ', '_'), data, lineas[i].maquina)
    }

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            }
            else {
              series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function (series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }
  }
}
