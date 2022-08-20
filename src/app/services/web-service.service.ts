import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebServiceService {
  private urlmqtt: string = environment.environment.urlMQTT;

  constructor(private http: HttpClient) {
  }

  getEncoderData() {
    const headers: HttpHeaders = new HttpHeaders();
    return this.http.get(this.urlmqtt + '/getData', { headers });
  }
}
