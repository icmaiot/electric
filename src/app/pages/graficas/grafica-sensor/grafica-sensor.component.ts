import { Component, OnInit, Inject } from '@angular/core';
import { GraficaService } from '@app/services/grafica.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaquinaService } from '@app/services/maquina.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { AreaService } from '@app/services/area.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '@app/services/auth.service';
import { ChartHeapMap } from '@app/classes/ChartHeapMap';
import { interval } from 'rxjs';
import { TipoEquipoService } from '@app/services/tipo-equipo.service';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { COLORS_CHART } from '@app/classes/Color';
import { ClassChart } from '@app/classes/ClassChart';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-grafica-sensor',
  templateUrl: './grafica-sensor.component.html',
  styleUrls: ['./grafica-sensor.component.scss']
})
export class GraficaSensorComponent extends ClassChart implements OnInit {

  private chart: am4charts.XYChart;
  private chartHeap: ChartHeapMap = new ChartHeapMap();
  dataChart = [];
  intervalTimer = interval(15000);
  intervalSubs;
  estado = [
    "Apagado",
    "Evento",
    "Paro"
  ];
  urlOperando = "../../../assets/img/Operando_B.jpg";
  urlEnparo = "../../../assets/img/paro2.jpg";
  urlIngenieria = "../../../assets/img/INGENIERIA - FONDO BLANCO.png";
  urlMantenimiento = "../../../assets/img/MANTENIMIENTO - FONDO BLANCO.png";
  urlProduccion = "../../../assets/img/PRODUCCION - FONDO BLANCO.png";
  urlCalidad = "../../../assets/img/CALIDAD - FONDO BLANCO.png";
  urlMateriales = "../../../assets/img/MATERIALES - FONDO BLANCO.png";

  constructor(
    @Inject(MaquinaService) maquinaService: MaquinaService,
    private graficaService: GraficaService,
    private formBuilder: FormBuilder,
    @Inject(NgxSpinnerService) spinner: NgxSpinnerService,
    private activate: ActivatedRoute, @Inject(AuthService) auth: AuthService,
    @Inject(AreaService) areaService: AreaService, @Inject(TipoEquipoService) tipoService: TipoEquipoService
  ) {
    super(areaService, maquinaService, auth, spinner, tipoService);
  }

  ngOnInit() {
    this.graficaForm = this.formBuilder.group({
      maquina: [''],
      area: [''],
      tipo: ['']
    });
    if (this.activate.snapshot.paramMap.get('idMaquina') != '0') {
      this.graficaForm.value.maquina = this.activate.snapshot.paramMap.get('idMaquina');
    }
    this.getSelect();
    if (this.activate.snapshot.paramMap.get('idMaquina') != '0') {
      this.graficaForm.controls['maquina'].setValue(this.activate.snapshot.paramMap.get('idMaquina'));
    }
  }

  async getDatosGrafica(mostartSpinner: boolean) {
    let arreglo;
    let tipo: string = "";
    let id;
    let bandera: boolean = false;
    let estado: string = "";
    try {
      this.dataChart = [];
      if (mostartSpinner) {
        this.showSpinner();
      }
      this.unsubscribeInterval();
      //this.disposeChart();
      if (this.graficaForm.value.maquina != '') {
        id = this.graficaForm.value.maquina;
        tipo = '0';
        bandera = true;
      } else if (this.graficaForm.value.area != '') {
        id = this.graficaForm.value.area;
        tipo = '1';
        bandera = true;
      }
      else if (this.graficaForm.value.tipo != '') {
        id = this.graficaForm.value.tipo;
        tipo = '2';
        bandera = true;
      }
      if (bandera) {
        let response = await this.graficaService.getGraficaEstadoR(id, tipo, this.auth.token).toPromise();
        if (response.code == 200) {
          this.dataChart = response.grafica;
          /*  arreglo = response.grafica;
            arreglo.forEach((element) => {
              let maquina = element["DESCRIPCION"];
              Object.keys(element).forEach(key => {
                if (['Operando', 'En_Paro', 'Stand_by', 'Servicio', 'Materiales', 'Ingenieria', 'Produccion', 'Calidad'].indexOf(key) >= 0) {
                  if (element[key] !== null) {
                    estado = this.estado[element[key]];
                    this.dataChart.push({
                      sensor: key,
                      maquina: maquina,
                      estado: estado,
                      color: estado == 'Evento' ? COLORS_CHART[key] : COLORS_CHART[estado],
                      valor: 20,
                      estadoN: element[key],
                    });
                  }
                }
              });
            });*/
          /*if (this.chart) {
            this.chart.data = this.dataChart;
            this.chart.validateData();
          } else {
            this.llenarGrafica();
          }*/
          this.intervalSubs = this.intervalTimer.subscribe(() => this.getDatosGrafica(false));
        } else {
          Swal.fire('Error', 'No existe información para la tabla', 'error');
        }
      }
      if (mostartSpinner)
        this.spinner.hide("mySpinner");
    } catch (e) {
      this.spinner.hide("mySpinner");
      Swal.fire('Error', 'Error al obtener los datos para las tabla', 'error');
    }
  }

  llenarGrafica() {
    this.chart = this.chartHeap.generateChart(this.dataChart, "chartdiv");
    this.chartHeap.generateSerie(this.chart);
  }

  get f() { return this.graficaForm.controls; }

  filterSelected(type: number) {
    if (this.chart) {
      this.chart.data = [];
      this.unsubscribeInterval();
    }
    super.filterTypeselected(type);
  }

  unsubscribeInterval() {
    if (this.intervalSubs) {
      this.intervalSubs.unsubscribe();
    }
  }

  disposeChart() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  ngOnDestroy() {
    this.disposeChart();
    this.unsubscribeInterval();
  }
}