import { Empresa } from './empresa';

export class Wo {
  idwo: string;
  woasig: string;
  idempleado: string;
  idcontacto: string;
  idempresa: string;
  ocliente: string;
  nomemp: string;
  Empresa: Empresa;

  constructor() {
    this.Empresa = new Empresa();
}
}
