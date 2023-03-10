import { Component, OnInit } from '@angular/core';
import { PerfilConfigService } from '@app/services/perfil-config.service';
import { PerfilConfig } from '@app/models/perfilConfig';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoPerfilconfigComponent } from '@app/pages/forms/nuevo-perfilconfig/nuevo-perfilconfig.component';
import { AuthService } from '@app/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-perfil-config',
  templateUrl: './perfil-config.component.html',
  styleUrls: ['./perfil-config.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PerfilConfigComponent implements OnInit {

  dataSource;
  columnsToDisplay = ['arrow', 'nombre', 'desc', 'config', 'opciones'];
  expandedElement: PerfilConfig | null;
  lista: PerfilConfig[];
  total: number;
  listNav = [
    { "name": "Módulo Interfaz", "router": "/moduloInterfaz" },
    { "name": "Perfil configuración", "router": "/perfilConfig" }
  ]

  constructor(
    private perfilService: PerfilConfigService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getPerfil('');
  }

  async getPerfil(searchValue: string) {
    try {
      let resp = await this.perfilService.getPerfil(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        // this.lista = resp.perfilConfig;
        this.dataSource = resp.perfilConfig
        // this.total = this.lista.length;
      }
    } catch (e) {
    }
  }

  onSearchChange(searchValue: string) {
    this.getPerfil(searchValue);
  }

  add() {
    const dialogRef = this.dialog.open(NuevoPerfilconfigComponent, {
      width: '40rem',
      data: {
        title: 'Agregar perfil configuración',
        btnText: 'Guardar',
        alertSuccesText: 'Perfil creado!',
        alertErrorText: "El perfil configuración ya existe",
        modalMode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getPerfil('');
    });
  }

  update(perfil) {
    const dialogRef = this.dialog.open(NuevoPerfilconfigComponent, {
      width: '40rem',
      data: {
        title: 'Editar perfil configuración',
        btnText: 'Guardar',
        alertSuccesText: 'Perfil configuración modificado correctamente',
        alertErrorText: "Error al modificar el modulo interfaz",
        modalMode: 'edit',
        _perfilConfig: perfil
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getPerfil('');
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estas seguro?', text: "Desea eliminar el perfil configuración?",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.perfilService.delete(id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El perfil configuración ha sido eliminado correctamente', 'success');
            this.getPerfil('');
          } else {
            Swal.fire('Error', 'Error al eliminar el perfil', 'error');
          }
        });
      }
    });
  }

  showSpinner() {
    const opt1: Spinner = {
      bdColor: "rgba(51,51,51,0.8)",
      size: "medium",
      color: "#fff",
      type: "square-jelly-box"
    };
    this.spinner.show("mySpinner", opt1);
  }
}