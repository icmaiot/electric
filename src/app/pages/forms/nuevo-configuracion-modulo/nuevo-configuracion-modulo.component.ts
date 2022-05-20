import { Component, OnInit, Inject } from '@angular/core';
import { ConfiguracionModuloService } from '@app/services/configuracion-modulo.service';
import { ColorService } from '@app/services/color.service';
import { ViewEncapsulation } from '@angular/core';
import { AuthService } from '@app/services/auth.service'
import { EventoSensor } from '@app/models/eventoSensor';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-nuevo-configuracion-modulo',
  templateUrl: './nuevo-configuracion-modulo.component.html',
  styleUrls: ['./nuevo-configuracion-modulo.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NuevoConfiguracionModuloComponent implements OnInit {

  status: string;
  autoManual: string;
  submitted = false;
  token;
  listEventos: EventoSensor[];
  lisConfiguracion = [];
  listEstacion = [];
  validate = true;
  messageError;
  idPerfil;
  errorDuplicated = false;
  lisConfiguracionPerfil = []; //array para editar la configuracion
  listNav = [
    { "name": "Perfil configuración", "router": "/perfilConfig" },
    { "name": "Agregar configuración", "router": "/configuracionModulo" }
  ]

  constructor(
    private configService: ConfiguracionModuloService,
    private activate: ActivatedRoute, private router: Router,
    private auth: AuthService, private colorService: ColorService,
  ) {
  }

  ngOnInit() {
    this.token = this.auth.token;
    this.listEstacion = Array(16).fill(null).map((x, i) => ({ 'estacion': i + 1 }));
    this.idPerfil = this.activate.snapshot.paramMap.get('idPerfil');
    this.status = this.activate.snapshot.paramMap.get('status');
    this.autoManual = this.activate.snapshot.paramMap.get('auto');
    this.listNav[1].router = "/configuracionModulo/" + this.idPerfil;
    this.getEventos();
    if (this.status === 'create') {
      this.drawTable()
    } else if (this.status === 'edit') {
      this.getConfiguracion();
    }

  }

  drawTable() {
    this.lisConfiguracion = Array(11).fill(null).map((x, i) => (
      {
        entrada: i + 1,
        tipoentrada: '',
        idevento: '',
        idperfil: this.idPerfil,
        listEstacion: Array(16).fill(null).map((x, i) => ({ 'id': 'estacion_' + (i + 1), 'checked': false })),
        errorEvento: false,
        show: true,
        intermitente: false
      }
    ));
    this.lisConfiguracion[0].idevento = "1";
    this.lisConfiguracion[1].idevento = "2";
    this.lisConfiguracion[2].idevento = "3";
    this.lisConfiguracion[8].idevento = "1";
    this.lisConfiguracion[9].idevento = "2";
    this.lisConfiguracion[10].idevento = "3";
    //si es manual, esconder los renglones 9,10,11
    if (this.autoManual == '1') {
      this.lisConfiguracion[8].show = false;
      this.lisConfiguracion[9].show = false;
      this.lisConfiguracion[10].show = false;
    } else {
      //automatico, el tipo de entrada es PLC
      this.lisConfiguracion[0].tipoentrada = "1";
      this.lisConfiguracion[1].tipoentrada = "1";
      this.lisConfiguracion[2].tipoentrada = "1";
      this.lisConfiguracion[8].tipoentrada = "1";
      this.lisConfiguracion[9].tipoentrada = "1";
      this.lisConfiguracion[10].tipoentrada = "1";
    }
  }

  fillTable() {
    this.lisConfiguracion.forEach((key) => {
      key.errorEvento = false,
        key.show = true,
        key.listEstacion = Array(16).fill(null).map((x, i) => ({ 'id': 'estacion_' + (i + 1), 'checked': key['estacion_' + (i + 1)] }))
    });
    if (this.autoManual == '1') {
      this.lisConfiguracion[8].show = false;
      this.lisConfiguracion[9].show = false;
      this.lisConfiguracion[10].show = false;
    }
  }

  async getEventos() {
    try {
      let resp = await this.colorService.getColors(this.token).toPromise();
      if (resp.code == 200) {
        this.listEventos = resp.eventos;
      }
    } catch (e) {
    }
  }

  async getConfiguracion() {
    try {
      let resp = await this.configService.read(this.idPerfil, this.token).toPromise();
      if (resp.code == 200) {
        this.lisConfiguracion = resp.listaconfig;
        this.fillTable();
      }
    } catch (e) {
    }
  }

  onSubmit() {
    this.submitted = true;
    this.validate = true;
    this.lisConfiguracion.forEach((key) => {
      if (key.tipoentrada === '' || key.idevento === '' || key.errorEvento) {
        this.validate = false;
      }
    });
    if (!this.validate) {
      this.messageError = "¡Error!";
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      //Valida que tenga sólo máximo 8 estaciones para una entrada
      if (this.validarConfiguracion()) {
        let response;
        switch (this.status) {
          case 'create': response = await this.configService.create(this.lisConfiguracion, this.token).toPromise();
            break;
          case 'edit': response = await this.configService.update(this.lisConfiguracion, this.token).toPromise();
            break;
        }
        if (response.code == 200) {
          Swal.fire('Se guardó correctamente la configuración!', '', 'success');
          this.router.navigate(['/perfilConfig']);
        }
        else {
          this.validate = false;
        }
      } else {
        Swal.fire('Máximo 8 estaciones seleccionadas por entrada', '', 'error');
      }
    } catch (e) {
      Swal.fire('Error al guardar los registros', '', 'error');
      this.validate = false;
    }
  }

  validarConfiguracion() {
    let bandera = true;
    this.lisConfiguracion.forEach((key) => {
      let contador = 0;
      key.listEstacion.forEach(estacion => {
        if (estacion.checked) {
          contador++;
          if (contador > 8) {
            bandera = false;
          }
        }
      })
    });
    return bandera;
  }


  onEventoChange(eve: any, index) {
    this.lisConfiguracion[index].errorEvento = false;
    this.lisConfiguracion.forEach((key, i) => {
      if (key.idevento == eve && index != i) {
        this.lisConfiguracion[index].errorEvento = true;
      }
    });
  }

  onTipoEntradaChange(eve: any, index, key: string) {
    //la entrada 1 es igual a  9
    //Entrada 2 igual 10
    //Entrada 3 igual 11
    let indexChange;
    switch (index) {
      case 0:
        indexChange = 8;
        break;
      case 1:
        indexChange = 9;
        break;
      case 2:
        indexChange = 10;
        break;
    }
    if (indexChange !== undefined) {
      let objectConfig = this.lisConfiguracion[indexChange];
      objectConfig[key] = eve;
    }
  }

  trackByFn(index, item) {
    return index;
  }

  onEstacionChange(eve: any, index, indexEstacion) {
    let isChecked = eve.checked;
    if (index != 8 || index != 9 || index != 10) {
      this.lisConfiguracion.forEach((key) => {
        key.listEstacion.forEach(estacion => {
          if (estacion.id === eve.id && estacion.checked) {
            estacion.checked = false;
          }
        })
      });
      if (!isChecked) {
        eve.checked = !eve.checked;
      }
      let indexChange;
      switch (index) {
        case 0:
          indexChange = 8;
          break;
        case 1:
          indexChange = 9;
          break;
        case 2:
          indexChange = 10;
          break;
      }
      if (indexChange !== undefined) {
        let objectConfig = this.lisConfiguracion[indexChange].listEstacion[indexEstacion];
        objectConfig['checked'] = eve.checked;
      }
    }
  }
}
