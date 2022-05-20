import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebServiceService {

  constructor(private http: HttpClient) {
  }

  getEncoderData() {
    const headers: HttpHeaders = new HttpHeaders();
    const url = `http://3.17.43.30:3000/getData`;
    return this.http.get(url, { headers });
  }
}
