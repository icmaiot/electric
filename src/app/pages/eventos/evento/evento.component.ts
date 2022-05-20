import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';

import { AuthService } from '@app/services/auth.service';
import { Evento } from '@app/models/evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.scss']
})
export class EventoComponent implements OnInit {

  date = new Date();
  idMaquina: string;
  sensor: string;
  fechaInicio: string;
  fechaFin: string;
  page: number = 1;
  limit: number = 10;
  total: number;
  listEventos: Evento[];
  numberOfElemets = [
    { label: '20', value: '20' },
    { label: '25', value: '25' },
    { label: '30', value: '30' },
    { label: '35', value: '35' },
    { label: '40', value: '40' },
  ];
  constructor(private eventoService: EventoService, private spinner: NgxSpinnerService, private auth: AuthService) { }

  ngOnInit() {
    try {
      this.idMaquina = localStorage.getItem('maquina');
      this.fechaInicio = localStorage.getItem('fechaInicio');
      this.fechaFin = localStorage.getItem('fechaFin');
      this.sensor = localStorage.getItem('sensor');
      localStorage.removeItem('maquina');
      localStorage.removeItem('fechaInicio');
      localStorage.removeItem('fechaFin');
      localStorage.removeItem('sensor');
      this.getEventos();
    } catch (e) {
    }
  }

  async getEventos() {
    try {
      let resp = await this.eventoService.getEvento(this.sensor, this.idMaquina, this.fechaInicio, this.fechaFin, String(this.page), String(this.limit), this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listEventos = resp.evento;
        this.total = resp.total;
        this.spinner.hide("mySpinner");
      }

    } catch (e) {
    }
  }

  selectPage(page) {
    this.page = page;
    this.showSpinner();
    this.getEventos();
    // do a call with this page
  }

  selectOption(option) {
    this.limit = option.value;
    this.page = 1;
    this.showSpinner();
    this.getEventos();
  }

  showSpinner() {
    const opt1: Spinner = {
      bdColor: "rgba(51,51,51,0.8)",
      size: "medium",
      color: "#fff",
      type: "square-jelly-box"
    };
    this.spinner.show("mySpinner", opt1);
  }
}
