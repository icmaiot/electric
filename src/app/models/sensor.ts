import { Maquina } from './maquina';

export class Sensor {
    idsensor: number;
    sensor: string;
    idmaquina: number;
    color: number;
    intermitente: number = 1;
    tipo: number;
    Maquina: Maquina;
    constructor() {
        this.Maquina = new Maquina();
    }
}
