import { Component, OnInit } from '@angular/core';
import { MateriaprimaService } from '@app/services/materiaprima.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoMateriapComponent } from '@app/pages/forms/nuevo-materiap/nuevo-materiap.component';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UmService } from '@app/services/um.service'
import { NuevoUmComponent } from '@app/pages/forms/nuevo-um/nuevo-um.component';


@Component({
  selector: 'app-materia-prima',
  templateUrl: './materia-prima.component.html',
  styleUrls: ['./materia-prima.component.scss']
})
export class MateriaPrimaComponent implements OnInit {


  lista: [];
  total: number;
  listaUm: [];
  submitted = false;
  form: FormGroup
  listNav = [
    { "name": "SKU", "router": "/producto" },
    { "name": "Subensamble", "router": "/subensamble" },
    { "name": "Materia Prima", "router": "/materiaPrima" }
  ]
  constructor(private service: MateriaprimaService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService, private formBuilder: FormBuilder, private umService: UmService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      um_raw: ['', Validators.required],
      desc_raw: ['', Validators.required]
    });
    this.getProductos('');
    this.getUm();
  }

  async getProductos(searchValue: string) {
    try {
      let resp = await this.service.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lista = resp.response;
        this.total = this.lista.length;
      }
    } catch (e) {
    }
  }

  async getUm() {
    try {
      let resp = await this.umService.get(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaUm = resp.response;
      }
    } catch (e) {
    }
  }

  onSearchChange(searchValue: string) {
    this.getProductos(searchValue);
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
      let response = await this.service.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getProductos('');
        this.submitted = false;
        this.form.reset({});
      }
    } catch (e) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }


  update(obj) {
    const dialogRef = this.dialog.open(NuevoMateriapComponent, {
      width: '40rem',
      data: {
        title: 'Editar producto: ' + obj.desc_raw,
        btnText: 'Guardar',
        alertSuccesText: 'Producto modificado correctamente',
        alertErrorText: "No se puedo modificar el registro",
        modalMode: 'edit',
        _materia: obj
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getProductos('');
    });
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.service.delete(obj.idraw, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getProductos('');
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
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

  newUm() {
    const dialogRef = this.dialog.open(NuevoUmComponent, {
      width: '30rem',
      data: {
        title: 'Nuevo unidad de medida',
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getUm();
    });
  }
}
