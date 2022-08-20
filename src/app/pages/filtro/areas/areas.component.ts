import { Component, OnInit } from '@angular/core';
import { AreaService } from '@app/services/area.service';
import { Area } from '@app/models/area';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { NuevoAreaComponent } from '@app/pages/forms/nuevo-area/nuevo-area.component';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoMaquinaComponent } from '@app/pages/forms/nuevo-maquina/nuevo-maquina.component';
import { AuthService } from '@app/services/auth.service';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  areas: Area[];
  total: number = 0;
  render = true;
  listNav = [
    { "name": "Equipo", "router": "/maquina" },
    { "name": "Área", "router": "/area" },
  ]
  constructor(private areaService: AreaService, private auth: AuthService,
    private dialog: MatDialog, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getAreas("");
  }

  async getAreas(searchValue: string) {
    try {
      let resp = await this.areaService.getAreas(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.areas = resp.area
        this.total = this.areas.length;
      }
    } catch (e) {
    }
  }

  addArea() {
    const dialogRef = this.dialog.open(NuevoAreaComponent, {
      width: '30rem',
      data: {
        title: 'Agregar área',
        btnText: 'Agregar',
        alertSuccesText: 'Área creada!',
        alertErrorText: "No se puedo crear el área",
        modalMode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getAreas("");
    });
  }

  addMaquina(idArea) {
    const dialogRef = this.dialog.open(NuevoMaquinaComponent, {
      width: '30rem',
      data: {
        title: 'Agregar equipo ',
        btnText: 'Agregar',
        alertSuccesText: 'Equipo creado!',
        alertErrorText: "No se puedo crear el equipo",
        modalMode: 'create',
        idArea
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getAreas("");
    });
  }


  updateArea(_area) {
    const dialogRef = this.dialog.open(NuevoAreaComponent, {
      width: '20rem',
      data: {
        title: 'Editar área: ' + _area.area,
        btnText: 'Guardar',
        alertSuccesText: 'Área modificada correctamente',
        alertErrorText: "No se puedo modificar el área",
        modalMode: 'edit',
        _area
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getAreas("");
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estas seguro?', text: "Desea eliminar el área",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.areaService.delete(id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El área ha sido eliminado correctamente', 'success');
            this.getAreas("");
          } else {
            Swal.fire('Error', 'No fue posible eliminar el área', 'error');
          }
        });
      }
    });
  }

  async onSearchChange(searchValue: string) {
    this.getAreas(searchValue);
  }
}
