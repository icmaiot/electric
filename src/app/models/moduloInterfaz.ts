import { Area } from './area';
import { TipoEquipo } from './tipoEquipo';

import { PerfilConfig } from './perfilConfig';
export class ModuloInterfaz {
    idmodulo: number;
    serial: string;
    activo: number = 1;
    idperfil: number;
    PerfilConfig: PerfilConfig;
    constructor() {
        this.PerfilConfig = new PerfilConfig();
    }
}