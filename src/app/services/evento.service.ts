import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private url: string = environment.environment.urlEndPoint + '/evento/';
  constructor(private http: HttpClient) { }

  getEvento(endPoint: string, maquina: string, inicio: string, fin: string, pagina: string, pageSize: string, token): Observable<any> {
    let params = new HttpParams();

    params = params.append('maquina', maquina);
    params = params.append('inicio', inicio);
    params = params.append('fin', fin);
    params = params.append('pagina', pagina);
    params = params.append('paginaL', pageSize);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + endPoint, { headers, params: params });
  }
}
