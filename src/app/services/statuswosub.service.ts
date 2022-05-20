import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatuswosubService {


  private url: string = environment.environment.urlEndPoint + '/statuswosub';
  constructor(private http: HttpClient) { }

  get(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/statuswosub', { headers, params: params });
  }

  create(statuswosub, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/statuswosub', statuswosub, { headers });
  }

  read(idstwosub: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', idstwosub);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/statuswosub', { headers, params: params });
  }

  delete(id: number, token): Observable<any> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(statuswosub, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${statuswosub.idstwosub}`, statuswosub, { headers });
  }
}
