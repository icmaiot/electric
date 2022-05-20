import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgprodService {

  private url: string = environment.environment.urlEndPoint + '/progprod';
  constructor(private http: HttpClient) { }

  get(token, id): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(this.url + '/getprogprodf', { headers, params: params });
  }

  getProgprodf(token, form): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('idMaquina', form.idMaquina);
    params = params.append('idEmpresa', form.idEmpresa);
    params = params.append('idProducto', form.idProducto);
    return this.http.get(this.url + '/getprogprodf', { headers, params: params });
  }

  getProgprodfwo(token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/getprogprodwo', { headers });
  }


  getProgprodfprod(token, id): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(this.url + '/getprogprodfprod', { headers, params: params });
  }

  getprogprodprioridad(token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/getprogprodprioridad', { headers });
  }

  create(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', obj, { headers });
  }

  read(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  updateDown(obj, token, id: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/updateDown'}/${id}`, obj, { headers });
  }

  updateUp(obj, token, id: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/updateUp'}/${id}`, obj, { headers });
  }

  delete(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('prioridad', obj.prioridad);
    params = params.append('idmaquina', obj.idmaquina);
    params = params.append('idwosub', obj.idwosub);
    return this.http.delete<any>(`${this.url + '/read'}/${obj.idprogprod}`, { headers, params: params });
  }

  update(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${obj.idprogprod}`, obj, { headers });
  }

  updateStatus(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/updateStatus'}/${obj.idprogprod}`, obj, { headers });
  }
}