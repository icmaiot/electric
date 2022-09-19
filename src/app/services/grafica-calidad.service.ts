import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import * as environment from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class GraficaCalidadService {
    private url: string = environment.environment.urlEndPoint + '/grafica_calidad';
    constructor(private http: HttpClient) {}

    getc(token): Observable <any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
        return this.http.get<any>(this.url + '/get', { headers });
    }

    getConsulc(maquina: string ,r1: string, r2: string, token): Observable<any> {
        let params = new HttpParams();
        params = params.append('maq', maquina);
        params = params.append('rango1', r1);
        params = params.append('rango2', r2);
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token});
        return this.http.get<any> (this.url + '/consul', { headers, params: params });
    }

    getMaqc(token): Observable <any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
        return this.http.get<any>(this.url + '/maqc', { headers });
    }

    getCausac(causa: string, maquina: string, r1: string, r2: string, token): Observable<any>{
        let params = new HttpParams();
        params = params.append('causa', causa);
        params = params.append('ma', maquina);
        params = params.append('rango1', r1);
        params = params.append('rango2', r2);
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token});
        return this.http.get<any>(this.url + '/cau', { headers, params:params });
    }
}