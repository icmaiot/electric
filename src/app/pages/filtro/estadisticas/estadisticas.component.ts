import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import * as environment from '../../../../environments/environment';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})

export class EstadisticasComponent implements OnInit {

  estadisCards: Array<object> = [];
  
  URLMateriales = "../../../../assets/img/sin_fondo/MATERIALES.png";
  URLCalidad = "../../../../assets/img/sin_fondo/CALIDAD.png";
  URLIngeneria = "../../../../assets/img/sin_fondo/INGENIERIA.png";
  URLProduccion = "../../../../assets/img/sin_fondo/PRODUCCION.png";
  URLMantenimiento = "../../../../assets/img/sin_fondo/MANTENIMIENTO.png";
  
  private url2: string = environment.environment.urlEndPoint;
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.estadisCards = [
      {
        icon: this.URLMantenimiento,
        text: 'Estadisticas de Matenimeinto',
        function: '/mntto',
        class: 'blue-bg',
      },
      {
        icon: this.URLMateriales,
        text: 'Estadisticas de Materiales',
        function: '/mats',
        class: 'orange-bg',
      },
      {
        icon: this.URLIngeneria,
        text: 'Estadisticas de Ingenerias',
        function: '/ing',
        class: 'blue-lite-bg',
      },
      {
        icon: this.URLProduccion,
        text: 'Estadisticas de Producción',
        function: '/prod',
        class: 'red-low-bg',
      },
      {
        icon: this.URLCalidad,
        text: 'Estadisticas de Calidad',
        function: '/calidad',
        class: 'pink-bg',
      },
      {
        icon: this.URLCalidad,
        text: 'Estadisticas de Tiempo Muerto',
        function: '/tiempomuerto',
        class: 'green-two-bg',
      },
      {
        icon: this.URLCalidad,
        text: 'Estadisticas de SKU',
        function: '/sku',
        class: 'gray-bg',
      },
      {
        icon: this.URLCalidad,
        text: 'Estadisticas de OEE',
        function: '/oee',
        class: 'red-bg',
      },
      {
        icon: this.URLCalidad,
        text: 'Estadisticas de Eficiencia',
        function: '/eficiencia',
        class: 'be-bg',
      },
    ];
  }
}
