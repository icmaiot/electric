import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as environment from '../../environments/environment';
import { TipoEquipo } from '../models/tipoEquipo';

@Injectable({
  providedIn: 'root'
})
export class TipoEquipoService {

  private url: string = environment.environment.urlEndPoint + '/tipoEquipo';
  private urlmqtt: string = environment.environment.urlMQTT;
  constructor(private http: HttpClient) { }

  MQTTEncoder(MQTT): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    return this.http.get(`${this.urlmqtt + '/sendTipoEquipos?'}topic=${MQTT.topic}&message=${MQTT.message}`, { headers });
  }

  getTipos(token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/tipos', { headers });
  }

  createTipo(tipo: TipoEquipo, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/tipos', tipo, { headers });
  }

  read(id, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(tipo: TipoEquipo, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${tipo.idtipo}`, tipo, { headers });
  }
}
