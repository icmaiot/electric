import { Component, OnInit } from '@angular/core';
import { ProgprodService } from '@app/services/progprod.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaquinaService } from '@app/services/maquina.service'
import { EmpresaService } from '@app/services/empresa.service'
import { ProductoService } from '@app/services/producto.service'
import { EditarProgprodComponent } from '@app/pages/forms/editar-progprod/editar-progprod.component'
import { EditarStatusComponent2 } from '@app/pages/forms/editar-progprod/editar-status/editar-status.component'

@Component({
  selector: 'app-programa-produccion',
  templateUrl: './programa-produccion.component.html',
  styleUrls: ['./programa-produccion.component.scss']
})
export class ProgramaProduccionComponent implements OnInit {

  listaWo = [];
  listaSKU = [];
  maquinas = [];
  empresa = [];
  productos = [];
  listaProgprod = [];
  prod;
  total: number;
  submitted = false;
  form: FormGroup
  formFilter: FormGroup
  listNav = [
    { "name": "Producción", "router": "/produccion" },
    { "name": "Orden de factura", "router": "/OrdenManufactura" }
  ]
  constructor(private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService, private formBuilder: FormBuilder, private progprodService: ProgprodService,
    private maquinaService: MaquinaService, private empresaService: EmpresaService,
    private productoService: ProductoService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idOrden: ['', Validators.required],
      idwosub: ['', Validators.required],
      idProducto: ['']
    });

    this.formFilter = this.formBuilder.group({
      idMaquina: [''],
      idEmpresa: [''],
      idProducto: ['']
    })
    this.getWo();
    this.getMaquinas();
    this.getEmpresa();
    this.getProductos();
    this.getProgprodf();
  }

  async getWo() {
    try {
      this.listaWo = [];
      let resp = await this.progprodService.getProgprodfwo(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaWo = resp.progprodwo;
      }
    } catch (error) {

    }
  }

  async getSKU(idwo) {
    try {
      this.listaSKU = [];
      let resp = await this.progprodService.getProgprodfprod(this.auth.token, idwo).toPromise();
      if (resp.code == 200) {
        this.listaSKU = resp.progprod;
        if (this.listaSKU != null && this.listaSKU.length > 0) {
          this.form.controls['idwosub'].setValue(this.listaSKU[0].idwosub);
          this.form.controls['idProducto'].setValue(this.listaSKU[0].idproducto);
        }
      }
    } catch (error) {

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
      let response = await this.progprodService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.submitted = false;
        this.getWo();
        this.form.reset({});
        this.getProgprodf();
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el registro', error.error);
    }
  }

  async getMaquinas() {
    try {
      let resp = await this.maquinaService.getMaquinas("", "", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.maquinas = resp.maquina;
      }
    } catch (e) {
    }
  }

  async getEmpresa() {
    try {
      let resp = await this.empresaService.getEmpresa("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.empresa = resp.response;
      }
    } catch (e) {
    }
  }

  async getProductos() {
    try {
      let resp = await this.productoService.get("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.productos = resp.response;
      }
    } catch (e) {
    }
  }

  async getProgprodf() {
    try {
      let resp = await this.progprodService.getProgprodf(this.auth.token, this.formFilter.value).toPromise();
      if (resp.code == 200) {
        this.listaProgprod = resp.progprod;
      }
    } catch (error) {
      Swal.fire('Error', '', 'error');
    }
  }

  async limpiarFiltro() {
    this.formFilter.controls['idMaquina'].setValue('');
    this.formFilter.controls['idEmpresa'].setValue('');
    this.formFilter.controls['idProducto'].setValue('');
    this.getProgprodf();
  }

  async updateDown(obj) {
    try {
      let response;
      response = await this.progprodService.updateDown(obj, this.auth.token, obj.idprogprod).toPromise();
      if (response.code == 200) {
        this.getProgprodf();
      }
    } catch (e) {
      Swal.fire('Error', 'No fue posible modificar el registro!', 'error');
    }
  }

  async updateUp(obj) {
    try {
      let response;
      response = await this.progprodService.updateUp(obj, this.auth.token, obj.idprogprod).toPromise();
      if (response.code == 200) {
        this.getProgprodf();
      }
    } catch (e) {
      Swal.fire('Error', 'No fue posible modificar el registro!', 'error');
    }
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.progprodService.delete(obj, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getWo();
            this.form.reset({});
            this.getProgprodf();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

  editProgprod(obj) {
    const dialogRef = this.dialog.open(EditarProgprodComponent, {
      width: '40rem',
      data: {
        title: 'Editar',
        btnText: 'Guardar',
        alertSuccesText: 'Registro modificado!',
        alertErrorText: "Error modificando el registro",
        modalMode: 'create',
        obj: obj
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.getProgprodf();
    });
  }

  onWoChange(idWoSub) {
    //this.form.controls['idProducto'].setValue(idProducto);
  }

  editStatus(obj) {
    const dialogRef = this.dialog.open(EditarStatusComponent2, {
      width: '20rem',
      data: {
        title: 'Editar status',
        btnText: 'Guardar',
        alertSuccesText: 'Registro modificado!',
        alertErrorText: "Error modificando el registro",
        obj: obj
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      //this.getprogprodprioridad();
      this.getProgprodf();
    });
  }
}