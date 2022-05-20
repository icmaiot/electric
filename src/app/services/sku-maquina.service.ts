import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkuMaquinaService {

  private url: string = environment.environment.urlEndPoint + '/skuMaquina';
  constructor(private http: HttpClient) { }

  get(token, id): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  getProductosMaquina(idmaquina,token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('idmaquina', idmaquina);
    return this.http.get(this.url + '/getProductosMaquina', { headers, params: params });
  }

  getRmt(idmaquina,token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('idmaquina', idmaquina);
    return this.http.get(this.url + '/getRmt', { headers, params: params });
  }

  MQTTEncoder(MQTT): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    const url = `http://3.17.43.30:3000`;
    return this.http.get(`${url + '/sendProductosMaquina?'}topic=${MQTT.topic}&message=${MQTT.message}`, { headers });
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
    return this.http.put(`${this.url + '/read'}/${obj.IDskumaquina}`, obj, { headers });
  }

  delete(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('prioridad', obj.prioridad);
    params = params.append('idproducto', obj.idproducto);
    return this.http.delete<any>(`${this.url + '/read'}/${obj.idskumaquina}`, { headers, params: params });
  }
}
