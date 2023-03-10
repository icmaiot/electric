import { Component, OnInit } from '@angular/core';
import { ModuloRMTService } from '@app/services/modulo-rmt.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoModuloComponent } from '@app/pages/forms/nuevo-modulo/nuevo-modulo.component';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modulo-rmt',
  templateUrl: './modulo-rmt.component.html',
  styleUrls: ['./modulo-rmt.component.scss']
})
export class ModuloRMTComponent implements OnInit {

  modulormt = [];
  form: FormGroup;
  total: number;
  submitted = false;

  listNav = [
    { "name": "Equipos", "router": "/maquina" },
    { "name": "Módulo RMT", "router": "/modulo-RMT" },
  ]

  constructor(
    private moduloService: ModuloRMTService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idrmt: [],
      serialrmt: ['', Validators.required],
    });
    this.getModulo('');
  }

  async getModulo(searchValue: string) {
    try {
      let resp = await this.moduloService.getModuloRMT(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.modulormt = resp.response;
      }
    } catch (e) {
    }
  }


  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.save();
    }
  }

  async save() {
    try {
      let response = await this.moduloService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getModulo('');
        this.submitted = false;
        this.form.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'Error al guardar el registro!', 'error');
    }
  }

  delete(modulormt) {
    Swal.fire({
      title: '¿Desea eliminar el Modulo RMT?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.moduloService.delete(modulormt.idrmt, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El modulo ha sido borrado!', 'success');
            this.getModulo('');
          } else {
            Swal.fire('Error', 'Error al borrar el modulo!', 'error');
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
