import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TiempomuertopService {

  private url: string = environment.environment.urlEndPoint + '/tiempomuertop';
  constructor(private http: HttpClient) { }

  get(busqueda, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', busqueda);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  tm(idlote, token): Observable<any> {
    let params = new HttpParams();
    params = params.append( 'idlote', idlote);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/tm', { headers, params: params });
  }
  
  tmp(form, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('lotei', form.lotei);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/tmp', { headers, params: params });
  }

  create(tiempomuertop, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', tiempomuertop, { headers });
  }

  read(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  update(tiempomuertop, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${tiempomuertop.id_tm_periodo}`, tiempomuertop, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }
}
