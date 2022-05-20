import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Area } from '../models/area';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private url: string = environment.environment.urlEndPoint + '/area';
  constructor(private http: HttpClient) { }

  getAreas(name: string, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/areas', { headers, params: params });
  }

  create(area: Area, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/areas', area, { headers });
  }

  read(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(`${this.url + '/read'}/${id}`, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }

  update(area: Area, token) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${area.idarea}`, area, { headers });
  }
}
