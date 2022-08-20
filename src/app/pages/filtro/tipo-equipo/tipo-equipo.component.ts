import { Component, OnInit } from '@angular/core';
import { TipoEquipoService } from '@app/services/tipo-equipo.service';
import { TipoEquipo } from '@app/models/tipoEquipo';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/services/auth.service';
import { NuevoTipoEquipoComponent } from '@app/pages/forms/nuevo-tipo-equipo/nuevo-tipo-equipo.component';
import { NuevoEventoCausaComponent } from '@app/pages/forms/nuevo-eventofalla/nuevo-eventofalla.component';
import { NuevoEventoasignacionfallaComponent } from '@app/pages/forms/nuevo-eventoasignacionfalla/nuevo-eventoasignacionfalla.component';

@Component({
  selector: 'app-tipo-equipo',
  templateUrl: './tipo-equipo.component.html',
  styleUrls: ['./tipo-equipo.component.scss']
})

export class TipoEquipoComponent implements OnInit {

  nombre: string;
  tipos: TipoEquipo[];
  total: number = 0;
  urlOperando: string;
  urlIngenieria: string;
  urlMantenimiento: string;
  urlCalidad: string;
  urlProduccion: string;
  urlMateriales: string;
  listNav = [
    { "name": "Equipos", "router": "/maquina" },
    { "name": "Tipo de equipo", "router": "/tipoEquipo" },
  ]
  constructor(private tipoService: TipoEquipoService,
    private dialog: MatDialog, private auth: AuthService) { }

  ngOnInit() {
    this.getTipos("");

    this.urlOperando = "../../../assets/img/OPERANDO - FONDO BLANCO.png";
    this.urlIngenieria = "../../../assets/img/INGENIERIA - FONDO BLANCO.png";
    this.urlMantenimiento = "../../../assets/img/MANTENIMIENTO - FONDO BLANCO.png";
    this.urlProduccion = "../../../assets/img/PRODUCCION - FONDO BLANCO.png";
    this.urlCalidad = "../../../assets/img/CALIDAD - FONDO BLANCO.png";
    this.urlMateriales = "../../../assets/img/MATERIALES - FONDO BLANCO.png";
  }

  async getTipos(searchValue: string) {
    try {
      let resp = await this.tipoService.getTipos(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.tipos = resp.tipo_equipos;
        this.total = this.tipos.length;
      }
    } catch (e) {
    }
  }

  onSearchChange(searchValue: string) {
     this.getTipos(searchValue);
  }

  add() {
    const dialogRef = this.dialog.open(NuevoTipoEquipoComponent, {
      width: '30rem',
      data: {
        title: 'Agregar tipo de equipo',
        btnText: 'Guardar',
        alertSuccesText: 'Tipo de equipo creado!',
        alertErrorText: "No se puedo crear el tipo de equipo",
        modalMode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getTipos("");
    });

  }

  update(_tipo) {
    const dialogRef = this.dialog.open(NuevoTipoEquipoComponent, {
      width: '30rem',
      data: {
        title: 'Editar tipo de equipo',
        btnText: 'Guardar',
        alertSuccesText: 'Tipo de equipo modificado correctamente',
        alertErrorText: "No se puedo modificar el tipo de equipo",
        modalMode: 'edit',
        _tipo
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getTipos("");
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estas seguro?', text: "Desea eliminar el tipo",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.tipoService.delete(id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El tipo ha sido eliminado correctamente', 'success');
            this.getTipos("");
          } else {
            Swal.fire('Error', 'No fue posible eliminar el tipo', 'error');
          }
        });
      }
    });
  }

  Eventoc(number,id_equipo) {
    if (number == 4) {
      this.nombre = 'Mantenimiento'
    } else if (number == 5) {
      this.nombre = 'Materiales'
    } else if (number == 6) {
      this.nombre = 'Ingenieria'
    } else if (number == 7) {
      this.nombre = 'Producción'
    } else if (number == 8) {
      this.nombre = 'Calidad'
    }

    const dialogRef = this.dialog.open(NuevoEventoasignacionfallaComponent, {
      width: '50rem',
      data: {
        title: 'Catalago de fallos - ' + this.nombre,
        btnText: 'Guardar',
        alertSuccesText: 'Evento de causa modificada correctamente',
        alertErrorText: "No se puedo modificar el evento de causa",
        modalMode: 'edit',
        idevento: number,
        idequipo : id_equipo,
      }
    });
  }
  
  Eventoasg(number) {
    if (number == 4) {
      this.nombre = 'Mantenimiento'
    } else if (number == 5) {
      this.nombre = 'Materiales'
    } else if (number == 6) {
      this.nombre = 'Ingenieria'
    } else if (number == 7) {
      this.nombre = 'Producción'
    } else if (number == 8) {
      this.nombre = 'Calidad'
    }

  const dialogRef = this.dialog.open(NuevoEventoCausaComponent, {
    width: '50rem',
    data: {
      title: 'Historial de fallos - ' + this.nombre,
      btnText: 'Guardar',
      alertSuccesText: 'Evento de causa modificada correctamente',
      alertErrorText: "No se puedo modificar el evento de causa",
      modalMode: 'edit',
      idevento: number,
     
    }
  });
 }
}
