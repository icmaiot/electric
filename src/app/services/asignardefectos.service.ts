import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AsignarDefectosService {

  private url: string = environment.environment.urlEndPoint + '/asignardefectos';
  constructor(private http: HttpClient) { }

  get(busqueda, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', busqueda);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  create(defectos, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', defectos, { headers });
  }

  update(defectos, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(`${this.url + '/read'}/${defectos.idproducto}`, defectos, { headers });
  }

  delete(obj, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('idp', obj.idproducto);
    params = params.append('idd', obj.iddefreg);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(`${this.url + '/read'}/${obj.idproducto}`, { headers, params: params });
  }
}
