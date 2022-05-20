import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as environment from '../../environments/environment';
import { Empresa } from '../models/empresa'

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private url: string = environment.environment.urlEndPoint + '/empresa';
  constructor(private http: HttpClient) { }

  getEmpresa(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/empresa', { headers, params: params });
  }

  getEmpresa2(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  empai(token): Observable<any> {
    let params = new HttpParams();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/empai', { headers, params: params });
  }

  create(empresa, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/empresa', empresa, { headers });
  }

  read(id: number | string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  delete(id: number | string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(empresa, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put<any>(`${this.url + '/read'}/${empresa.idempresa}`, empresa, { headers });
  }

  updateS(empresa: number | string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put<any>(`${this.url + '/read'}/${empresa}`, empresa, { headers });
  }
}
