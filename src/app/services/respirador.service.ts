import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as environment from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RespiradorService {

  private url: string = environment.environment.urlEndPoint + '/respirador';
  constructor(private http: HttpClient) { }

  getInfoRespirador(id, token): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', id);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers, params: params });
  }
}
