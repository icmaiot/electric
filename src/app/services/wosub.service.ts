import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WosubService {


  private url: string = environment.environment.urlEndPoint + '/wosub';
  constructor(private http: HttpClient) { }

  get(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/wosub', { headers, params: params });
  }

  create(wosub, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/wosub', wosub, { headers });
  }

  read(idwosub: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', idwosub);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/wosub', { headers, params: params });
  }

  delete(id: number, token): Observable<any> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(wosub, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${wosub.idwosub}`, wosub, { headers });
  }
}
