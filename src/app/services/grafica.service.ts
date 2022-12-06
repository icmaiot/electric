import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraficaService {
  private url: string = environment.environment.urlEndPoint + '/grafica';
  constructor(private http: HttpClient) { }

  getGrafica(maquina: string, inicio: string, fin: string, bandera: string, token): Observable<any> {
    let params = new HttpParams();

    params = params.append('maquina', maquina);
    params = params.append('inicio', inicio);
    params = params.append('fin', fin);
    params = params.append('bandera', bandera);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/graficaSensor', { headers, params: params });
  }

  getGraficaEstadoR(id: string, tipo: string, token): Observable<any> {
    let params = new HttpParams();

    params = params.append('id', id);
    params = params.append('tipo', tipo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/graficaEstadoR', { headers, params: params });
  }

  getGraficaAnillo(maquina: string, inicio: string, fin: string, tipo: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('maquina', maquina);
    params = params.append('inicio', inicio);
    params = params.append('fin', fin);
    params = params.append('tipo', tipo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/graficaAnillo', { headers, params: params });
  }

  getSobrepuesta(maquina: string, inicio: string, fin: string, tipo: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('maquina', maquina);
    params = params.append('inicio', inicio);
    params = params.append('fin', fin);
    params = params.append('tipo', tipo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/graficaSobrepuesta', { headers, params: params });
  }

  
  PGraficaSkuProducido(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('linea', form.linea);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/PGraficaSkuProducido', { headers, params: params });
  }

  PGraficaEficiencia(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/PGraficaEficiencia', { headers, params: params });
  }  

  PGraficaDisponibilidad(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/PGraficaDisponibilidad', { headers, params: params });
  }  

  PGraficaRendimiento(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/PGraficaRendimiento', { headers, params: params });
  }  

  PGraficaPcalidad(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/PGraficaPcalidad', { headers, params: params });
  }  
  
  PGraficaTiempomuertoPorDiayTurno(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    params = params.append('turno', form.turno);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/PGraficaTiempomuertoPorDiayTurno', { headers, params: params });
  }
}
