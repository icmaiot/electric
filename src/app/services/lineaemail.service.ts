import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LineaemailService {

  private url: string = environment.environment.urlEndPoint + '/lineaemail';
  constructor(private http: HttpClient) { }

  get(id, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  create(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', obj, { headers });
  }

  update(obj, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${obj.id_le}`, obj, { headers });
  }

  delete(obj, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${obj.id_le}`, { headers });
  }
}
