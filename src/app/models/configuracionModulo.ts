import { EventoSensor } from './eventoSensor';

export class ConfiguracionModulo {
    idconfiguracion: number;
    entrada: string;
    tipoentrada: number;
    idevento: number;
    idperfil: number;
    estacion_1: boolean;
    estacion_2: boolean;
    estacion_3: boolean;
    estacion_4: boolean;
    estacion_5: boolean;
    estacion_6: boolean;
    estacion_7: boolean;
    estacion_8: boolean;
    estacion_9: boolean;
    estacion_10: boolean;
    estacion_11: boolean;
    estacion_12: boolean;
    estacion_13: boolean;
    estacion_14: boolean;
    estacion_15: boolean;
    estacion_16: boolean;
    listEstacion;
    evento:string;

    constructor(idPerfil) {
        this.idconfiguracion = 0;
        this.entrada = "";
        this.tipoentrada = 0;
        this.idevento = 0;
        this.idperfil = idPerfil;
        this.estacion_1 = false;
        this.estacion_2 = false;
        this.estacion_3 = false;
        this.estacion_4 = false;
        this.estacion_5 = false;
        this.estacion_6 = false;
        this.estacion_7 = false;
        this.estacion_8 = false;
        this.estacion_9 = false;
        this.estacion_10 = false;
        this.estacion_11 = false;
        this.estacion_12 = false;
        this.estacion_13 = false;
        this.estacion_14 = false;
        this.estacion_15 = false;
        this.estacion_16 = false;
        this.listEstacion = Array(16).fill(null).map((x, i) => ({ 'id': 'estacion_' + (i + 1), 'activo': false }));
    }

}