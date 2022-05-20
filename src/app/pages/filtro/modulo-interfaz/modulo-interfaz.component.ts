import { Component, OnInit } from '@angular/core';
import { ModuloInterfazService } from '@app/services/modulo-interfaz.service';
import { ModuloInterfaz } from '@app/models/moduloInterfaz';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoModuloComponent } from '@app/pages/forms/nuevo-modulo/nuevo-modulo.component';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-modulo-interfaz',
  templateUrl: './modulo-interfaz.component.html',
  styleUrls: ['./modulo-interfaz.component.scss']
})
export class ModuloInterfazComponent implements OnInit {

  listaModulo: ModuloInterfaz[];
  total: number;
  listNav = [
    { "name": "Modulo Interfaz", "router": "/moduloInterfaz" },
    { "name": "Perfil configuración", "router": "/perfilConfig" }
  ]
  constructor(private moduloService: ModuloInterfazService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getModulo('');
  }

  async getModulo(searchValue: string) {
    try {
      let resp = await this.moduloService.getModuloInterfaz(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaModulo = resp.moduloI;
        this.total = this.listaModulo.length;
      }
    } catch (e) {
    }
  }

  onSearchChange(searchValue: string) {
    this.getModulo(searchValue);
  }

  add() {
    const dialogRef = this.dialog.open(NuevoModuloComponent, {
      width: '40rem',
      data: {
        title: 'Agregar modulo interfaz',
        btnText: 'Guardar',
        alertSuccesText: 'Modulo interfaz creado!',
        alertErrorText: "El modulo interfaz ya existe",
        modalMode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getModulo('');
    });
  }

  update(modulo) {
    const dialogRef = this.dialog.open(NuevoModuloComponent, {
      width: '40rem',
      data: {
        title: 'Editar modulo interfaz',
        btnText: 'Guardar',
        alertSuccesText: 'Modulo interfaz modificado correctamente',
        alertErrorText: "No se puedo modificar el modulo interfaz",
        modalMode: 'edit',
        _modulo: modulo
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getModulo('');
    });
  }

  delete(modulo) {
    Swal.fire({
      title: 'Desactivar modulo interfaz', text: "¿Desea desactivar el modulo interfaz?",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        modulo.activo = 0;
        this.moduloService.update(modulo, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El modulo interfaz ha sido desactivado correctamente', 'success');
            this.getModulo('');
          } else {
            Swal.fire('Error', 'No fue posible desactivar el modulo interfaz', 'error');
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

  /*addUsuario(idDepto) {
    const dialogRef = this.dialog.open(NuevoUsuarioComponent, {
      width: '50rem',
      data: {
        title: 'Agregar usuario',
        btnText: 'Agregar',
        alertSuccesText: 'Usuario creado!',
        alertErrorText: "No se puedo crear el usuario",
        modalMode: 'create',
        idDepto
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getModulo();
    });
  }*/

}
