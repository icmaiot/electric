import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DefectosService {

  private url: string = environment.environment.urlEndPoint + '/defectos';
  constructor(private http: HttpClient) { }

  get(busqueda, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', busqueda);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  getDefectosins(formins, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('tname', formins.tname);
    params = params.append('lote', formins.lote);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/ins', { headers, params: params });
  }

  create(defectos, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', defectos, { headers });
  }

  update(defectos, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${defectos.id}`, defectos, { headers });
  }

  delete(id: number, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${id}`, { headers });
  }
}
