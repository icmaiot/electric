import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Evento_AsignacionService {

  private url: string = environment.environment.urlEndPoint + '/evento_asignacion';
  constructor(private http: HttpClient) { }

  get(id_evento, id_equipo, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('id_evento', id_evento);
    params = params.append('id_equipo', id_equipo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  create(evento_asignacion, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', evento_asignacion, { headers});
  }

  update(evento_asignacion, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(this.url + '/read', evento_asignacion, { headers});
  }

  delete(evento_asignacion, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('id_tipoequipo', evento_asignacion.id_tipoequipo);
    params = params.append('id_evento', evento_asignacion.id_evento);
    params = params.append('id_falla', evento_asignacion.id_falla);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(this.url + '/read', { headers, params: params });
  }

}
