import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { NuevoStatuswosubComponent } from '@app/pages/forms/nuevo-statuswosub/nuevo-statuswosub.component';
import { NuevoWosubComponent } from '@app/pages/forms/nuevo-wosub/nuevo-wosub.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { WoService } from '@app/services/wo.service';
import { WosubService } from '@app/services/wosub.service';
import Swal from 'sweetalert2';
import { Wo } from '@app/models/wo';
import { Wosub } from '@app/models/wosub';
import { Producto } from '@app/models/producto';
import { Empresa } from '@app/models/empresa';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { EmpresaService } from '../../../services/empresa.service';
import { ProductoService } from '../../../services/producto.service';
import { StatuswosubService } from '../../../services/statuswosub.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-nuevo-wo',
  templateUrl: './nuevo-wo.component.html',
  styleUrls: ['./nuevo-wo.component.scss'],
})

export class NuevoWoComponent implements OnInit {

  ide: string;
  id2: string;
  form: FormGroup;
  formc: FormGroup;
  submitted = false;
  wo: Wo = new Wo;
  token;
  idwo;
  status: string;
  total = 0;
  empresa: Empresa = new Empresa;
  producto: [];
  wosub: [];
  timp;
  tipo: number = 0;
  statuswosub: [];
  tipoP: any[] = [
    { id: 0, tipo: 'Normal' },
    { id: 1, tipo: 'Muestra' },
  ];
  listNav = [
    { "name": "Orden de manufactura", "router": "/OrdenManufactura" },
  ]

  constructor(
    private woService: WoService,
    private empresaService: EmpresaService,
    private productoService: ProductoService,
    private statuswosubService: StatuswosubService,
    private wosubService: WosubService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private activate: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.token = this.auth.token;
    this.idwo = this.activate.snapshot.paramMap.get('id');
    this.titleService.setTitle('Orden ' + this.idwo);

    this.getWo();
    this.getStatuswosub('');
    this.getWosub();
    this.formc = this.formBuilder.group({
      idwo: ['', Validators.required],
      idempresa: ['', Validators.required],
      woasig: ['', Validators.required],
      ocliente: ['', Validators.required],

    });


    this.form = this.formBuilder.group({
      idwosub: [],
      idwo: [],
      descwosub: ['', Validators.required],
      puwosub: ['', Validators.required],
      idempresa: ['', Validators.required],
      idstwosub: 2,
      cantwosub: ['', Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')],
      idproducto: ['', Validators.required],
      nomemp: ['', Validators.required],
      tipowosub: ['', Validators.required],
    });

  }

  get f() { return this.form.controls; }

  async save() {
    try {
      this.form.value.descuentoemp = this.empresa.descuentoemp;
      this.form.value.idwo = this.idwo;
      this.form.value.idstwosub = 2;
      let response = await this.wosubService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getWosub();
        this.submitted = false;
        this.form.reset();
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }

  update() {
    const dialogRef = this.dialog.open(NuevoStatuswosubComponent, {
      width: '30rem',
      data: {
        title: 'Nuevo status',
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getStatuswosub('');
    });
  }

  editar(wosub) {
    const dialogRef = this.dialog.open(NuevoWosubComponent, {
      width: '40rem',
      data: {
        title: 'Editar ',
        btnText: 'Guardar',
        alertSuccesText: 'Orden modificada correctamente',
        alertErrorText: "No se puedo modificar el registro",
        modalMode: 'edit',
        _wosub: wosub
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getWosub();
    });
  }
  async getWo() {
    try {
      let resp = await this.woService.read(this.idwo, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.wo = resp.response;
        this.ide = this.wo.idempresa;
        this.getProducto();
      }
    } catch (e) {
    }
  }


  async getEmpresa() {
    try {
      let resp = await this.empresaService.getEmpresa(this.form.value.idempresa, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.empresa = resp.response;
      }
    } catch (e) {
    }
  }

  async getProducto() {
    try {
      let resp = await this.productoService.get2(this.ide, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.producto = resp.response;
      }
    } catch (e) {
    }
  }

  async getStatuswosub(SearchValue: string) {
    try {
      let resp = await this.statuswosubService.get(SearchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.statuswosub = resp.response;
      }
    } catch (e) {
    }
  }

  async getWosub() {
    try {
      let resp = await this.wosubService.get(this.idwo, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.wosub = resp.response;

      }
    } catch (e) {
    }
  }

  TWosub(tip) {
    if (tip == '0') {
      this.form.value.tipowosub = 0;
    }
    else if (tip == '1') {
      this.form.value.tipowosub = 1;
    }
  }

  delete(wosub) {
    this.wosubService.delete(wosub.idwosub, this.auth.token).subscribe(res => {
      if (res.code == 200) {
        Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
        this.getWosub();
      } else {
        Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
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

