import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CiaService } from '@app/services/cia.service';
import { Cia } from '@app/models/cia';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  cia: Cia = new Cia();
  urlImg: string;
  homeCards: Array<object> = [];

  constructor(private router: Router, private ciaService: CiaService, private auth: AuthService) { }

  ngOnInit() {
    this.urlImg = "assets/img/ICMA_AUTOMATION-01.png";
    this.homeCards = [
      {
        icon: 'build',
        text: 'Orden de Manufactura',
        function: '/OrdenManufactura',
        class: 'black-bg'
      },
      {
        icon: 'timer',
        text: 'Turnos Productivos',
        function: '/TurnosProductivos',
        class: 'green-two-bg'
      },
      {
        icon: 'book',
        text: 'Producción',
        function: '/produccion',
        class: 'blue-bg'
      },
      {
        icon: 'perm_data_setting',
        text: 'Performance',
        function: '/performance',
        class: 'red-bg'
      },
      {
        icon: 'group',
        text: 'Equipos de Producción',
        function: '/EquipodeProduccion',
        class: 'green-bg'
      }
    ];
  }



  navigateTo(url: String) {
    url = '/' + url;
    this.router.navigate([url]);
  }
}
