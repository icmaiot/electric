import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContempService {


  private url: string = environment.environment.urlEndPoint + '/contemp';
  constructor(private http: HttpClient) { }

  getContemp(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/contemp', { headers, params: params });
  }

  getContemp2(name: string, nu: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    params = params.append('activoc', nu);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  create(contemp, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/contemp', contemp, { headers });
  }

  readContemp(idcontemp: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', idcontemp);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/contemp', { headers, params: params });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  deleteall(id: number | string, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/del'}/${id}`, { headers });
  }

  update(contemp, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${contemp.idcontemp}`, contemp, { headers });
  }

  updateS(contemp, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/status'}/${contemp.idempresa}`, contemp, { headers });
  }
}
