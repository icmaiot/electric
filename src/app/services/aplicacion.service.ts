import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {

  private _idMaquina: number;
  private _sensor: string;
  constructor() { }

  set idMaqina(maquina: number) {
    this._idMaquina = maquina;
  }

  get idMaqina(): number {
    return this._idMaquina;
  }

  set sensor(sensor: string) {
    this._sensor = sensor;
  }

  get sensor(): string {
    return this._sensor;
  }
}
