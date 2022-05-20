import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EventoRegistroService {

  private url: string = environment.environment.urlEndPoint + '/evento_registro';
  constructor(private http: HttpClient) { }

  get(busqueda, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busqueda', busqueda);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }

  getEventoEquipo(id_evento,id_equipo, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('id_evento', id_evento);
    params = params.append('id_equipo', id_equipo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/eveq', { headers, params: params });
  }

  create(evento_registro, token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.post<any>(this.url + '/get', evento_registro, { headers });
  }

  update(evento_registro, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('id_falla', evento_registro.id_falla);
    params = params.append('id_evento', evento_registro.id_evento);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.put(this.url + '/read', evento_registro, { headers, params: params });
  }

  delete(evento_registro,token): Observable<any> {
    let params = new HttpParams();
    params = params.append('id_falla', evento_registro.id_falla);
    params = params.append('id_evento', evento_registro.id_evento);
    params = params.append('codigo_falla', evento_registro.codigo_falla);
    params = params.append('descripcion_falla', evento_registro.descripcion_falla);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.delete<any>(this.url + '/read', { headers, params: params});
  }

  getEventoCatalago(busq2, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('busq2', busq2);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/eveq2', { headers, params: params});
  } 
}
