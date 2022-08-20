import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProduccionloteService {

  private url: string = environment.environment.urlEndPoint + '/produccionlote';
  private urlmqtt: string = environment.environment.urlMQTT;
  constructor(private http: HttpClient) { }

  DataEncoder(formb): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders();
    return this.http.get(`${this.urlmqtt + '/sendDataEncoder?'}topic=${formb.topic}&message=${formb.message}`, { headers });
  }

  get(token, id): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(this.url + '/produccionlote', { headers, params: params });
  }

  getpreparacion(formp, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('tname', formp.tname);
    return this.http.get(this.url + '/getpro', { headers, params: params });
  }

  getlote(formp, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('tname', formp.tname);
    params = params.append('product', formp.product);
    params = params.append('cantidadpiezas', formp.cantidadpiezas);
    params = params.append('turdescanso', formp.turdescanso);
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  getlotefinal(forml, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('lote', forml.lote);
    return this.http.get(this.url + '/getlotefinal', { headers, params: params });
  }

  getBoard(formb, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('tmaquina', formb.tmaquina);
    return this.http.get(this.url + '/getboard', { headers, params: params });
  }

  getDescanso(formd, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('lote', formd.lote);
    return this.http.get(this.url + '/descanso', { headers, params: params });
  }

  getLoteActivo(formb, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('tmaquina', formb.tmaquina);
    return this.http.get(this.url + '/getlote', { headers, params: params });
  }

  getData(formb, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('tlote', formb.tlote);
    params = params.append('tname', formb.tname);
    params = params.append('tmaquina', formb.tmaquina);
    return this.http.get(this.url + '/getdata', { headers, params: params });
  }

  createlote(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', obj, { headers });
  }

  read(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }
  update(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${obj.idprodregisro}`, obj, { headers });
  }
}
