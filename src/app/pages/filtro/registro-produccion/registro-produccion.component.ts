import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MaquinaService } from '@app/services/maquina.service'
import { EmpresaService } from '@app/services/empresa.service'
import { ProductoService } from '@app/services/producto.service'
import { ProgprodService } from '@app/services/progprod.service';
import { ProdregisroService } from '@app/services/prodregisro.service';
import { ProduccionloteService } from '@app/services/produccionlote.service';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { NuevoRegOrdenComponent } from '@app/pages/forms/nuevo-reg-orden/nuevo-reg-orden.component'
import { NuevoRegPiezaComponent } from '@app/pages/forms/nuevo-reg-pieza/nuevo-reg-pieza.component'
import { NuevoRegScrapComponent } from '@app/pages/forms/nuevo-reg-scrap/nuevo-reg-scrap.component'

@Component({
  selector: 'app-registro-produccion',
  templateUrl: './registro-produccion.component.html',
  styleUrls: ['./registro-produccion.component.scss'],
})

export class RegistroProduccionComponent implements OnInit {

  idprogprod;
  idwo;
  idproducto;
  listaWo = [];
  listaSKU = [];
  maquinas = [];
  empresa = [];
  productos = [];
  progprod = [];
  prodregisro = [];
  form: FormGroup;
  formp: FormGroup;
  formlote: FormGroup;
  submitted = false;
  token;
  total = 0;

  listNav = [
    { "name": "Registro de producción", "router": "/registro-de-produccion" },
    { "name": "Programa de producción", "router": "/produccion" },
  ]

  constructor(
    private empresaService: EmpresaService,
    private productoService: ProductoService,
    private progprodService: ProgprodService,
    private produccionloteService: ProduccionloteService,
    private maquinaService: MaquinaService,
    private prodregisroService: ProdregisroService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private activate: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.token = this.auth.token;
    this.idprogprod = this.activate.snapshot.paramMap.get('id');
    this.titleService.setTitle('Registro de producción ' + this.idprogprod);

    this.form = this.formBuilder.group({
      idprogprod: ['', Validators.required],
      idmaquina: ['', Validators.required],
      idwo: ['', Validators.required],
      idempresa: ['', Validators.required],
      maquina: ['', Validators.required],
      nomcortemp: ['', Validators.required],
      woasig: ['', Validators.required],
      ocliente: ['', Validators.required],
      producto: ['', Validators.required],
      desc_producto: ['', Validators.required],
      cant: ['', Validators.required],
      tcarga: ['', Validators.required],
      totpro: ['', Validators.required],
      totdef: ['', Validators.required],
      totsgrap: ['', Validators.required],
    });

    this.formp = this.formBuilder.group({
      tname: [''],
    });

    this.formlote = this.formBuilder.group({
      tname: [''],
      product: [''],
      cantidadpiezas: [''],
    });

    this.getWo();
    this.getMaquinas();
    this.getEmpresa();
    this.getProductos();
    this.getProdregisro();
    this.getidProducto('');
  }

  async getProdregisro() {
    try {
      let resp = await this.prodregisroService.getProdregisro(this.auth.token, this.idprogprod).toPromise();
      if (resp.code == 200) {
        this.prodregisro = resp.prodregisro;
        if (this.prodregisro != null && this.prodregisro.length > 0) {
          this.getidProducto(this.prodregisro[0].producto)
          this.formlote.value.cantidadpiezas = this.prodregisro[0].cant;
          this.formlote.controls['cantidadpiezas'].setValue(this.prodregisro[0].cant);
          this.getSKU(this.prodregisro[0].idwo)
        }
      }
    } catch (error) {
      Swal.fire('Error', '', 'error');
    }
  }

  async getWo() {
    try {
      let resp = await this.progprodService.getProgprodfwo(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaWo = resp.progprodwo;
      }
    } catch (error) {

    }
  }

  async getSKU(idwo) {
    try {
      let resp = await this.progprodService.getProgprodfprod(this.auth.token, idwo).toPromise();
      if (resp.code == 200) {
        this.listaSKU = resp.progprod;
        if (this.listaSKU != null && this.listaSKU.length > 0) {
          this.form.controls['idwosub'].setValue(this.listaSKU[0].idwosub);
        }
      }
    } catch (error) {

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

  async getidProducto(pro) {
    try {
      let resp = await this.productoService.get(pro, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.productos = resp.response;
        if (this.productos != null && this.productos.length > 0) {
          this.formlote.controls['product'].setValue(this.productos[0].idproducto);
        }
        this.idproducto = this.productos[0].idproducto;
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

  async savepreparacion() {
    this.formp.value.tname = 'lote' + this.idprogprod;
    try {
      let response = await this.produccionloteService.getpreparacion(this.formp.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido creado!', 'success');
        this.submitted = false;
        this.formp.reset({});
      }
    } catch (error) {

    }
  }

  async saveproduccionlote() {
    this.formlote.value.tname = 'lote' + this.idprogprod;
    this.formlote.value.product = this.idproducto;
    try {
      let response = await this.produccionloteService.getlote(this.formlote.value, this.auth.token).toPromise();
      if (response.code == 200) {
      }
    } catch (error) {

    }
  }

  newCantidad(obj) {
    const dialogRef = this.dialog.open(NuevoRegOrdenComponent, {
      width: '40rem',
      data: {
        title: 'Registro de producción para la orden ' + obj.ocliente,
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getProdregisro();
    });
  }

  newPieza(obj) {
    const dialogRef = this.dialog.open(NuevoRegPiezaComponent, {
      width: '40rem',
      data: {
        title: 'Registro de defectos para la orden ' + obj.ocliente,
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getProdregisro();
    });
  }

  newScrap(obj) {
    const dialogRef = this.dialog.open(NuevoRegScrapComponent, {
      width: '40rem',
      data: {
        title: 'Registro de scrap para la orden ' + obj.ocliente,
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getProdregisro();
    });
  }

  get f() { return this.form.controls; }

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