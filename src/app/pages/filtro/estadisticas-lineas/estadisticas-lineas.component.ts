import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import * as environment from '../../../../environments/environment';

@Component({
  selector: 'app-estadisticas-lineas',
  templateUrl: './estadisticas-lineas.component.html',
  styleUrls: ['./estadisticas-lineas.component.css']
})

export class EstadisticasLineaComponent implements OnInit {

  estadisCards: Array<object> = [];
  
  URLMateriales = "../../../../assets/img/sin_fondo/MATERIALES.png";
  URLCalidad = "../../../../assets/img/sin_fondo/CALIDAD.png";
  URLIngeneria = "../../../../assets/img/sin_fondo/INGENIERIA.png";
  URLProduccion = "../../../../assets/img/sin_fondo/PRODUCCION.png";
  URLMantenimiento = "../../../../assets/img/sin_fondo/MANTENIMIENTO.png";
  URLTM = "../../../../assets/img/sin_fondo/TIEMPOMUERTO.png";
  URLOEE = "../../../../assets/img/sin_fondo/OEE.png";
  URLEficiencia = "../../../../assets/img/sin_fondo/EFICIENCIA.png";
  URLSKU = "../../../../assets/img/sin_fondo/SKU.png";
  URLDisponibilidad = "../../../../assets/img/sin_fondo/DISPONIBILIDAD.png";
  URLRendimiento = "../../../../assets/img/sin_fondo/RENDIMIENTO.png";
  URLPcalidad = "../../../../assets/img/sin_fondo/PCALIDAD.png";
  URLPerdida = "../../../../assets/img/sin_fondo/PERDIDAFINANCIERA.png";
  
  private url2: string = environment.environment.urlEndPoint;
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.estadisCards = [
      {
        icon: this.URLTM,
        text: 'Estadísticas de Tiempo Muerto',
        function: '/tiempo-muerto',
        class: 'salmon-bg',
      },
      {
        icon: this.URLPerdida,
        text: 'Perdida Financiera',
        function: '/perdida-financiera',
        class: 'green-two-bg',
      },
      {
        icon: this.URLSKU,
        text: 'Estadísticas de SKU',
        function: '/sku',
        class: 'gray-bg',
      },  
      {
        icon: this.URLOEE,
        text: 'Estadísticas de OEE',
        function: '/oee',
        class: 'red-bg',
      },
      {
        icon: this.URLEficiencia,
        text: 'Estadísticas de Eficiencia',
        function: '/eficiencia',
        class: 'be-bg',
      },
      {
        icon: this.URLDisponibilidad,
        text: 'Estadísticas de Disponibilidad',
        function: '/disponibilidad',
        class: 'bluemidas',
      },
      {
        icon: this.URLRendimiento,
        text: 'Estadísticas de Rendimiento',
        function: '/rendimiento',
        class: 'bluesmidas',
      },
      {
        icon: this.URLPcalidad,
        text: 'Estadísticas de Calidad',
        function: '/porcentaje-de-calidad',
        class: 'purplemidas',
      },
    ];
  }
}
