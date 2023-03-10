import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import * as environment from '../../../../environments/environment';

@Component({
  selector: 'app-estadisticas-equipos',
  templateUrl: './estadisticas-equipos.component.html',
  styleUrls: ['./estadisticas-equipos.component.css']
})

export class EstadisticasEquipoComponent implements OnInit {

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
  
  private url2: string = environment.environment.urlEndPoint;
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.estadisCards = [
      {
        icon: this.URLMantenimiento,
        text: 'Estadísticas de Matenimeinto',
        function: '/mantenimiento',
        class: 'blue-bg',
      },
      {
        icon: this.URLMateriales,
        text: 'Estadísticas de Materiales',
        function: '/materiales',
        class: 'orange-bg',
      },
      {
        icon: this.URLIngeneria,
        text: 'Estadísticas de Ingenerías',
        function: '/ingenieria',
        class: 'blue-lite-bg',
      },
      {
        icon: this.URLProduccion,
        text: 'Estadísticas de Producción',
        function: '/produccion',
        class: 'red-low-bg',
      },
      {
        icon: this.URLCalidad,
        text: 'Estadísticas de Calidad',
        function: '/calidad',
        class: 'pink-bg',
      },
     
    ];
  }
}
