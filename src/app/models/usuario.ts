import { Departamento } from './departamento';
import { EventoSensor } from './eventoSensor';

export class Usuario {
    username: string;
    email: string;
    password: string;
    create_time: Date;
    last_update: Date;
    celular: string;
    id: number;
    iddep: number;
    nip: number;
    idevento: number;
    Username_last: string;
    activousr: number;
    permitir_linea: number;

    constructor() {
    }
}