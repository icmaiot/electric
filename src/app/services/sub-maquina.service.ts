import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubMaquinaService {

  private url: string = environment.environment.urlEndPoint + '/subMaquina';
  constructor(private http: HttpClient) { }

  get(id,token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  getSubensambleMaquina(id_maquina,token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id_maquina', id_maquina);
    return this.http.get(this.url + '/getSubensambleMaquina', { headers, params: params });
  }

  getRmt(id_maquina,token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id_maquina', id_maquina);
    return this.http.get(this.url + '/getRmt', { headers, params: params });
  }

  MQTTEncoder(MQTT): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    const url = `http://3.17.43.30:3000`;
    return this.http.get(`${url + '/sendSubensambleMaquina?'}topic=${MQTT.topic}&message=${MQTT.message}`, { headers });
  }
  

  create(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', obj, { headers });
  }

  read(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  update(obj, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${obj.id_submaquina}`, obj, { headers });
  }

  delete(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id_submaquina', obj.id_submaquina);
    return this.http.delete<any>(`${this.url + '/read'}/${obj.id_submaquina}`, { headers, params: params });
  }
}
