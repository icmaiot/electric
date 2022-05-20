
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { tap } from 'rxjs/operators';
import * as environment from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _token: string;
  _userID: string;
  _idCia;
  private url: string = environment.environment.urlEndPoint + '/usuario/login';
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });
  constructor(private http: HttpClient) {
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && localStorage.getItem('token') != null) {
      this._token = localStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public get userID(): string {
    if (this._userID != null) {
      return this._userID;
    } else if (this._userID == null && localStorage.getItem('userID') != null) {
      this._userID = localStorage.getItem('userID');
      return this._userID;
    }
    return null;
  }

  public get idCia(): string {
    if (this._idCia != null) {
      return this._idCia;
    } else if (this._idCia == null && localStorage.getItem('cia') != null) {
      this._idCia = localStorage.getItem('cia');
      return this._idCia;
    }
    return null;
  }

  login(user, getHas?): Observable<any> {
    user['getHas'] = (getHas) ? getHas : null;
    return this.http.post<any>(this.url, user, { headers: this.httpHeaders });
  }

  guardarUsuarioToken(accessToken: string, id: string, expires: string, idcia): void {
    this._token = accessToken;
    this._userID = id;
    this._idCia = idcia;
    localStorage.setItem('userID', id);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('expires', expires);
    localStorage.setItem('cia', idcia);
  }

  isAuthenticated(): boolean {
    if (this.token != null && this.userID) {

      return true;
    }
    return false;
  }

  logout() {
    this._token = null;
    this._userID = null;
    this._idCia = null;
    localStorage.clear();
    sessionStorage.clear();
  }

}
