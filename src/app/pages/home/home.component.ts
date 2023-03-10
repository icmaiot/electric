import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CiaService } from '@app/services/cia.service';
import { Cia } from '@app/models/cia';
import { AuthService } from '@app/services/auth.service';
import * as environment from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cia: Cia = new Cia();
  urlImg: string;
  urlImg2: string;
  urlImg3: string;
  urlImg4: string;
  urlImg5: string;
  img: string;
  homeCards: Array<object> = [];
  private url2: string = environment.environment.urlEndPoint;
  public imgURL: any = '';

  constructor(private router: Router, private ciaService: CiaService, private auth: AuthService) { }

  ngOnInit() {
    this.urlImg = "assets/img/LOGOMIDAS.jpg";
    this.homeCards = [
      {
        icon: 'store',
        text: 'Editar Empresa',
        function: '/cia/0',
        class: 'blue-cg'
      },
      {
        icon: 'person_add',
        text: 'Usuarios',
        function: '/usuario',
        class: 'blue-bg'
      },
      {
        icon: 'work',
        text: 'Clientes',
        function: '/empresa',
        class: 'orange-bg',
      },
      {
        icon: 'description',
        text: 'SKU',
        function: '/producto',
        class: 'gray-bg',
      },
      {
        icon: 'build',
        text: 'Equipos',
        function: '/maquina',
        class: 'pink-bg'
      },
      {
        icon: 'desktop_mac',
        text: 'Estado',
        function: '/tablaEstado/0',
        class: 'be-bg'
      },
      {
        icon: 'group',
        text: 'Departamentos',
        function: '/departamento',
        class: 'green-bg'
      },
      {
        icon: 'person_pin_circle',
        text: 'Áreas',
        function: '/area',
        class: 'red-bg'
      },
      {
        icon: 'schedule',
        text: 'Módulo Interfaz',
        function: '/moduloInterfaz',
        class: 'red-low-bg'
      },
      {
        icon: 'assignment',
        text: 'Módulo RMT',
        function: '/modulo-RMT',
        class: 'green-two'
      },
      {
        icon: 'av_timer',
        text: 'Turnos',
        function: '/TurnosProductivos',
        class: 'yellow-bg'
      },
      {
        icon: 'book',
        text: 'Programa de Producción',
        function: '/programa-de-produccion',
        class: 'orange-bg'
      },
      {
        icon: 'equalizer',
        text: 'Estadísticas Líneas',
        function: '/estadisticas-lineas',
        class: 'gray-bg'
      },
      {
        icon: 'equalizer',
        text: 'Estadísticas Equipos',
        function: '/estadisticas-equipos',
        class: 'be-bg'
      }
    ];

    this.getCia();
  }

  async getCia() {
    try {
      let resp = await this.ciaService.readCia(this.auth.idCia, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.cia = resp.cia;
        this.imgURL = this.url2 + '/cia/get-image/' + this.cia.image;
      }
    } catch (e) {
    }
  }

  navigateTo(url: String) {
    url = '/' + url;
    this.router.navigate([url]);
  }
}
