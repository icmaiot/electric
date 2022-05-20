import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as environment from '../../environments/environment'; import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private url: string = environment.environment.urlEndPoint + '/eventoSensor';
  constructor(private http: HttpClient) { }

  getColors(token): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this.http.get(this.url + '/get', { headers });
  }
}
