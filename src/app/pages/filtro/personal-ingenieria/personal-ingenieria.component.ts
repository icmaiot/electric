import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '@app/services/usuario.service';
import { Usuario } from '@app/models/usuario';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { NuevoUsuarioComponent } from '@app/pages/forms/nuevo-usuario/nuevo-usuario.component';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from '@amcharts/amcharts4/core';
import { EventoSensor } from '@app/models/eventoSensor';
import { EventoUsuarioService } from '@app/services/evento-usuario.service';
import { Departamento } from '@app/models/departamento';
import { DepartamentoService } from '@app/services/departamento.service';
import { IngresaNipComponent } from '@app/pages/forms/ingresa-nip/ingresa-nip/ingresa-nip.component';
import { CatalogoFuncionesComponent } from '../catalogo-funciones/catalogo-funciones.component';

@Component({
  selector: 'app-personal-ingenieria',
  templateUrl: './personal-ingenieria.component.html',
  styleUrls: ['./personal-ingenieria.component.scss']
})
export class PersonalIngenieriaComponent implements OnInit {

  usuarios: Usuario[];
  usuario: Usuario;
  listaEvento = [
    { id: 1, nombre: "Operando" },
    { id: 2, nombre: "En paro" },
    { id: 3, nombre: "Stand by" },
    { id: 4, nombre: "Mantenimiento" },
    { id: 5, nombre: "Materiales" },
    { id: 6, nombre: "Ingenieria" },
    { id: 7, nombre: "Producción" },
    { id: 8, nombre: "Calidad" }
  ];
  listaDepart: Departamento[];
  formUser: FormGroup;
  total: number = 0;
  statusUsu: string;
  submitted = false;
  listNav = [
    { "name": "Usuarios del sistema", "router": "/usuario" },
    { "name": "Personal tecnico", "router": "/personal-tecnico" },
    { "name": "Personal operativo", "router": "/personal-operativo" },
    { "name": "Personal ingenieria", "router": "/personal-ingenieria" },
    { "name": "Personal calidad", "router": "/personal-calidad" },
    { "name": "Personal materiales", "router": "/personal-materiales" },
  ]
  token: string;
  
  constructor(private usuarioService: UsuarioService, private eventousuarioService: EventoUsuarioService,
    private departamentoService: DepartamentoService, private auth: AuthService,
    private dialog: MatDialog, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.usuario = new Usuario();
    this.formUser = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      departamento: ['', Validators.required],
    });
    this.getUsuarios('');
    this.getDepartamentos();
    ///this.getEventos();

  }


  async getUsuarios(searchValue: string) {
    try {
      let resp = await this.usuarioService.getUsuarios(searchValue, '', '6', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usuarios = resp.usuario;

        this.total = this.usuarios.length;
      }
    } catch (e) {
    }
  }

  async getEventos(searchValue: string) {
    try {
      let resp = await this.eventousuarioService.get(searchValue, this.auth.token).toPromise();
   
      if (resp.code == 200) {
        this.listaEvento = resp.eventos;
      }
    } catch (e) {
    }
  }

  async getDepartamentos() {
    try {
      let resp = await this.departamentoService.getDepartamentos('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaDepart = resp.depto;
      }
    } catch (e) {
    }
  }

  addUsuario() {
    const dialogRef = this.dialog.open(IngresaNipComponent, {
      //width: '25rem',
      data: {
        title: 'Ingresa el NIP',
        btnText: 'Ingresar',
        alertSuccesText: 'Entraste!',
        alertErrorText: "El NIP no coincide",
        modalMode: 'create',
        username: this.usuario.username,
        Username_last: this.usuario.Username_last,
        iddep: this.usuario.iddep,
        idevento: 6
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getUsuarios('');
      this.formUser.reset({});
    });
  }

  updateUsuario(usuario) {
    const dialogRef = this.dialog.open(IngresaNipComponent, {
      //width: '25rem',
      data: {
        title: 'Ingresa el NIP',
        btnText: 'Ingresar',
        alertSuccesText: 'Entraste!',
        alertErrorText: "El NIP no coincide",
        modalMode: 'create',
        username: this.usuario.username,
        Username_last: this.usuario.Username_last,
        iddep: this.usuario.iddep,
        idevento: 6,
        usuario
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getUsuarios('');
    });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estas seguro?', text: "Desea eliminar el usuario",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.delete(id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El usuario se ha sido eliminado correctamente', 'success');
            this.getUsuarios('');
          } else {
            Swal.fire('Error', 'No fue posible eliminar el usuario', 'error');
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

  async onSearchChange(searchValue: string) {
    this.getUsuarios(searchValue);
  }

  get f() { return this.formUser.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.formUser.invalid) {
      return;
    } else {
      this.addUsuario();
      this.submitted = false;
    }
  }

  async save() {
    try {
      let response = await this.usuarioService.create(this.formUser.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getUsuarios('');
        this.submitted = false;
        this.formUser.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }

  openFunciones() {
    const dialogRef = this.dialog.open(CatalogoFuncionesComponent, {
      width: '40rem',
      data: {
        title: 'Catalogo de funciones autorizadas en el sistema',
        btnText: 'Guardar',
        alertSuccesText: 'Funcion agregada correctamente',
        alertErrorText: "No se puede agregar función",
      }
    });
  }


}

