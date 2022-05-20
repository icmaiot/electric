import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WoService {

  private url: string = environment.environment.urlEndPoint + '/wo';
  constructor(private http: HttpClient) { }

  get(name, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/wo', { headers, params: params });
  }

  getE(name, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('woe', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/empresa', { headers, params: params });
  }

  get2(nam, contacto, empleado, status, orden, registro, vencimiento, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', nam);
    params = params.append('contacto', contacto);
    params = params.append('empleado', empleado);
    params = params.append('status', status);
    params = params.append('orden', orden);
    params = params.append('registro', registro);
    params = params.append('vencimiento', vencimiento);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/buscar', { headers, params: params });
  }


  create(wo, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/wo', wo, { headers });
  }

  read(id: number | string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }


  update(wo, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${wo.idwo}`, wo, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }
}
