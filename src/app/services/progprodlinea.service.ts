import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProgprodlineaService {

  private url: string = environment.environment.urlEndPoint + '/progprodlinea';
  private urlmqtt: string = environment.environment.urlMQTT;
  constructor(private http: HttpClient) { }

  get(name, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  getProgprodlinea(token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/getprogprodlinea', { headers });
  }

  getseleccionturno(token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/selecturno', { headers });
  }

  filtro(token, form): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('idLinea', form.idLinea);
    params = params.append('idProducto', form.idProducto);
    return this.http.get(this.url + '/buscar', { headers, params: params });
  }

  getRlinea(token, idLote): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('idLote', idLote);
    return this.http.get(this.url + '/getlinea', { headers, params: params });
  }

  getAcum(lote: string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('lote', lote);
    return this.http.get(this.url + '/acum', { headers, params: params });
  }

  MQTTEncoder(MQTT): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    return this.http.get(`${this.urlmqtt + '/sendLineaprod?'}topic=${MQTT.topic}&message=${MQTT.message}`, { headers });
  }

  create(name, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', name, { headers });
  }

  read(id: number | string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  update(progprodlinea, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${progprodlinea.idprogprodlinea}`, progprodlinea, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }
}
