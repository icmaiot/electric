import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Maquina } from '../models/maquina';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaquinaService {

  private url: string = environment.environment.urlEndPoint + '/maquina';
  private url2: string = environment.environment.urlEndPoint;
  private urlmqtt: string = environment.environment.urlMQTT;
  chartPage = new Subject();
  constructor(private http: HttpClient) { }

  sendEmail(user, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post(`${this.url2 + '/maquina/send-email'}`, user, { headers });
  }

  getMaquina(idmaquina: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', idmaquina);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/maquina', { headers, params: params });
  }

  getLinea(progprod: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', progprod);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/linea', { headers, params: params });
  }

  getMaquinaEjecucion(progprod: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', progprod);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/ejecucion', { headers, params: params });
  }

  getHistorico(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('turnosel', form.turnosel);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/historico', { headers, params: params });
  }

   filtroTm(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('turnosel', form.turnosel);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/filtroTm', { headers, params: params });
  }

  filtroScrap(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('turnosel', form.turnosel);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/filtroScrap', { headers, params: params });
  }

  filtroDefectos(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idskunow', form.idskunow);
    params = params.append('turnosel', form.turnosel);
    params = params.append('fechaprep', form.fechaprep);
    params = params.append('fechaprep2', form.fechaprep2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/filtroDefectos', { headers, params: params });
  }

  PGraficaLinea( token): Observable<any> {
    let params = new HttpParams();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/PGraficaLinea', { headers, params: params });
  }

  getMaquinas(name: string, area: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    params = params.append('area', area);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/maquinas', { headers, params: params });
  }

  getMaquinaLista(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idarea', form.idarea);
    params = params.append('idtipo', form.idtipo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/buscar', { headers, params: params });
  }

  getInterfaz(id_maquina, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('id_maquina', id_maquina);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/getInterfaz', { headers, params: params });
  }

 getCorreos(idmaquina, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idmaquina', idmaquina);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/getCorreos', { headers, params: params });
  }

  MQTTEncoder(MQTT): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    return this.http.get(`${this.urlmqtt + '/sendDescanso?'}topic=${MQTT.topic}&message=${MQTT.message}`, { headers });
  }

  getModuloInterfaz(token): Observable<any> {
    let params = new HttpParams();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/modin', { headers, params: params });
  }

  getModrmt(token): Observable<any> {
    let params = new HttpParams();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/modrmt', { headers, params: params });
  }

  create(maquina, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/maquinas', maquina, { headers });
  }

  read(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(maquina, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${maquina.idmaquina}`, maquina, { headers });
  }

  changePage(page, token) {
    this.chartPage.next(page);
  }
}
