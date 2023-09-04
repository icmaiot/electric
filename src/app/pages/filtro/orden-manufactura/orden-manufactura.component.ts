import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WoService } from '@app/services/wo.service';
import { EmpresaService } from '@app/services/empresa.service';
import { ContempService } from '@app/services/contemp.service';
import { UsuarioService } from '@app/services/usuario.service';
import { StatuswoService } from '@app/services/statuswo.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoStatuswoComponent } from '@app/pages/forms/nuevo-statuswo/nuevo-statuswo.component';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Wo } from '@app/models/wo';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-orden-manufactura',
  templateUrl: './orden-manufactura.component.html',
  styleUrls: ['./orden-manufactura.component.scss']
})
export class OrdenManufacturaComponent implements OnInit {

  id: string;
  token;
  idf: string;
  ide: string;
  minDate: string;
  dateStr: Date;
  date: any;
  selectedCliente: string = '';
  selectedContacto: string = '';
  selectedEmpleado: string = '';
  selectedStatus: string = '';
  selectedOrden: string = '';
  selectedFechaR: Date;
  selectedFechaV: Date;
  submitted = false;
  form: FormGroup;
  total: 0;
  wo: [];
  empresa: [];
  contemp: [];
  usuario: [];
  statuswo: [];
  contemp1: [];
  usuario1: [];
  statuswo1: [];
  listNav = [
    { "name": "Orden de manufactura", "router": "/OrdenManufactura" },
    { "name": "Clientes y proveedores", "router": "/empresa" },
  ]

  constructor(
    private woService: WoService,
    private empresaService: EmpresaService,
    private contempService: ContempService,
    private usuarioService: UsuarioService,
    private statuswoService: StatuswoService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService, private formBuilder: FormBuilder,
    private datePipe: DatePipe, private titleService: Title,
  ) { this.titleService.setTitle('Orden de Manufactura'); }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idwo: [],
      idempresa: ['', Validators.required],
      idcontacto: ['', Validators.required],
      idempleado: ['', Validators.required],
      fechasol: ['', Validators.required],
      fechavenoc: ['', Validators.required],
      idstatuswo: ['', Validators.required],
      woasig: ['', Validators.required],
      ocliente: ['', Validators.required],
      status: [],
      brief: [],
      fecharecoc: [],
      fechatermoc: [],
      cotizacion: [],
    });
    this.getOrdenManufactura('');
    this.getEmpresa();
    this.getUsuarios('');
    this.getStatuswo('');
    this.getContempSearch();
    this.getUsuariosSearch();
    this.getStatuswoSearch();
    this.getWoSearch();
  }


  onChange(event) {
    this.id = "";
    this.id = event.target.value
    this.getContemp();
    this.id = "";
  }

  onChangeFiltro(event) {
    this.idf = "";
    this.idf = event.target.value;
    this.getContempSearch();
    this.idf = "";
  }

  onDefault() {
    this.selectedCliente = '';
    this.selectedContacto = '';
    this.selectedEmpleado = '';
    this.selectedStatus = '';
    this.selectedOrden = '';
    this.selectedFechaV = null;
    this.selectedFechaR = null;
    this.getOrdenManufactura('');
  }

  //Filtros
  async getWo(SearchValue: string, SearchValueV: string) {
    try {
      let resp = await this.woService.get2(
        (this.selectedCliente != "") ? this.selectedCliente : "",
        (this.selectedContacto != "") ? this.selectedContacto : "",
        (this.selectedEmpleado != "") ? this.selectedEmpleado : "",
        (this.selectedStatus != "") ? this.selectedStatus : "",
        (this.selectedOrden != "") ? this.selectedOrden : "",
        SearchValue, SearchValueV,
        this.auth.token).toPromise();

      if (resp.code == 200) {
        this.wo = resp.response;
        this.total = this.wo.length;
      }
    } catch (e) {
    }
  }

  async getContempSearch() {
    try {
      let resp = await this.contempService.getContemp2(this.idf, '1', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.contemp1 = resp.rescontemp;
      }
    } catch (e) {
    }
  }

  async getUsuariosSearch() {
    try {
      let resp = await this.usuarioService.getUsuario("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usuario1 = resp.usuario;
      }
    } catch (e) {
    }
  }

  async getStatuswoSearch() {
    try {
      let resp = await this.statuswoService.getStatuswo("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.statuswo1 = resp.response;
      }
    } catch (e) {
    }
  }

  async getWoSearch() {
    try {
      let resp = await this.woService.get("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.wo = resp.response;
      }
    } catch (e) {
    }
  }

  SearchByCliente() {
    this.getWo('', '');
  }

  SearchByContacto() {
    this.getWo('', '');
  }

  SearchByEmpleado() {
    this.getWo('', '');
  }

  SearchByStatus() {
    this.getWo('', '');
  }

  SearchByOrden() {
    this.getWo('', '');
  }

  onSearchChangeR(searchValueR: string) {
    this.getWo(searchValueR, '');
  }

  onSearchChangeV(searchValueV: string) {
    this.getWo('', searchValueV);

  }

  //Tabla
  async getOrdenManufactura(searchValue: string) {
    try {
      let resp = await this.woService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.wo = resp.response;
        this.total = this.wo.length;
      }
    } catch (e) {
    }
  }

  async getEmpresa() {
    try {
      let resp = await this.empresaService.getEmpresa2('1', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.empresa = resp.response;
      }
    } catch (e) {
    }
  }
  async getContemp() {
    try {
      let resp = await this.contempService.getContemp2(this.id, '1', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.contemp = resp.rescontemp;
      }
    } catch (e) {
    }
  }

  async getUsuarios(searchValue: string) {
    try {
      let resp = await this.usuarioService.getUsuario(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usuario = resp.usuario;
      }
    } catch (e) {
    }
  }

  async getStatuswo(searchValue: string) {
    try {
      let resp = await this.statuswoService.getStatuswo(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.statuswo = resp.response;
      }
    } catch (e) {
    }
  }

  onSearchChange(searchValue: string) {
    this.getOrdenManufactura(searchValue);

  }

  fechaChanged() {
    var doo = new Date();
    let dates = new Date(doo.getTime() + Math.abs(doo.getTimezoneOffset() - 60000))
    this.minDate = this.datePipe.transform(dates, 'yyyy-MM-dd');
    this.form.controls['fechasol'].setValue(this.minDate);
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
      let response = await this.woService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getOrdenManufactura('');
        this.submitted = false;
        this.form.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }

  delete(wo) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.woService.delete(wo.idwo, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            this.getOrdenManufactura('');
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

  newStatuswo() {
    const dialogRef = this.dialog.open(NuevoStatuswoComponent, {
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
      this.getStatuswo('');
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
