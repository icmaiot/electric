import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatuswoService {


  private url: string = environment.environment.urlEndPoint + '/statuswo';
  constructor(private http: HttpClient) { }

  getStatuswo(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/statuswo', { headers, params: params });
  }

  create(statuswo, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/statuswo', statuswo, { headers });
  }

  readStatuswo(idstatuswo: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', idstatuswo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/statuswo', { headers, params: params });
  }

  delete(id: number, token): Observable<any> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(statuswo, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${statuswo.idstatuswo}`, statuswo, { headers });
  }
}
