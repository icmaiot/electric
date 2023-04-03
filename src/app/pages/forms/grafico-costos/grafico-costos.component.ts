import { Component, ViewEncapsulation, NgZone,AfterViewInit, OnInit, Input, Inject, OnDestroy ,ViewChild} from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

am4core.useTheme(am4themes_animated);
am4core.options.autoDispose = true;

@Component({
  selector: 'app-grafico-costos',
  templateUrl: './grafico-costos.component.html',
  styleUrls: ['./grafico-costos.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GraficoCostosComponent implements  OnInit {
  dataSource: any;
  dataSource2: any;
  TablaLinea = [];
  dataGauge = [];
  dataOEE = [];
  turnos = [];
  productos = [];
  lineas = [];
  columnas = [];
  filas = [];
  columnas2 = [];
  filas2 = [];
  formF: FormGroup;
  submitted = false;
  maxDate: string;
  minDate: string;
  date: Date;
  date2: Date;
  token;
  id;
  table1 = [];
  table2 = [];

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
      idproducto: ['-1'],
    });

    this.sumarDias(this.date, -7);
    this.minDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.maxDate = this.datePipe.transform(this.date2, 'yyyy-MM-dd');
    this.formF.controls['fechaprep'].setValue(this.minDate);
    this.formF.controls['fechaprep2'].setValue(this.maxDate);

    this.getProductos();
    this.getTurnos();
    this.getMaquina();
    this.getTablaLinea();
    this.getLineas();
    this.getTabla1(); 
    this.getTabla2(); 
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;


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
    this.formF.controls['idproducto'].setValue('-1');
    this.getMaquina();
    this.getTablaLinea();
  }

  //Tablas

  async getTablaLinea() {
    try {
      let resp = await this.maquinaService.PTablaLinea(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.TablaLinea = resp.response;
        this.COSTOS(this.turnos, this.TablaLinea);
      }
    } catch (e) {
    }
  }

  async getTabla1() {
    try {
      let resp = await this.graficaService.PTablaCostos1(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.table1 = resp.response;
        console.log(this.table1)
        this.columnas = [];
        for (let v in this.table1[0]) {
          this.columnas.push(v);
        }
        this.dataSource = new MatTableDataSource(this.table1);
        this.dataSource.paginator = this.paginator;
        
      }
    } catch (e) {
    }
  }

  async getTabla2() {
    try {
      let resp = await this.graficaService.PTablaCostos2(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.table2 = resp.response;
        console.log(this.table2)
        this.columnas2 = [];
        for (let v in this.table2[0]) {
          this.columnas2.push(v);
        }
        this.dataSource2 = new MatTableDataSource(this.table2);
        this.dataSource2.paginator = this.paginator2;
        
      }
    } catch (e) {
    }
  }

  //Graficas

  async getMaquina() {
    try {
      let resp = await this.maquinaService.PGraficaLinea(this.formF.value, this.token).toPromise();
      if (resp.code == 200) {
        this.dataGauge = resp.response;
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

  async getLineas() {
    try {
      let resp = await this.maquinaService.getLinea('Línea', this.token).toPromise();
      if (resp.code == 200) {
        this.lineas = resp.response;
        for (var i = 0; i < this.lineas.length; i++) {
          this.lineas[i].maquina.replaceAll(' ', '_');
        }
      }
    } catch (e) {
    }
  }

  COSTOS(turnos, data) {
    console.log(data)
    let chart = am4core.create("costos", am4charts.XYChart);


    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.groupData = true;
    dateAxis.dateFormats.setKey("day", { "year": "numeric", "month": "short", "day": "numeric" });
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    for (var i = 0; i < turnos.length; i++) {
      createSeries(turnos[i].turno, data, turnos[i].turnodb)
    }

    // Create series
    function createSeries(name, data, turnodb) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = turnodb;
      series.dataFields.dateX = "Fecha";
      series.name = name;

      series.tooltipText = "{name}\n Costos: {valueY}";

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

  


    // A button to toggle the data table
    /* let button = chart.createChild(am4core.SwitchButton);
     button.align = "right";
     button.leftLabel.text = "Mostrar Informacion";
     button.isActive = true;*/

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
