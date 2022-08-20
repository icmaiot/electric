import { Component, OnInit } from '@angular/core';
import { ProductoService } from '@app/services/producto.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { NuevoProductoComponent } from '@app/pages/forms/nuevo-producto/nuevo-producto.component';
import { NuevoRegistodefectosComponent } from '@app/pages/forms/nuevo-registrodefectos/nuevo-registrodefectos.component';
import { NuevoRegistoscrapComponent } from '@app/pages/forms/nuevo-registroscrap/nuevo-registroscrap.component';
import { RegistrocopyComponent } from '@app/pages/forms/registro-copy/registro-copy.component';
import { AsignarDefectosComponent } from '@app/pages/forms/asignar-defectos/asignar-defectos.component';
import { AsignarScrapComponent } from '@app/pages/forms/asignar-scrap/asignar-scrap.component';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UmService } from '@app/services/um.service'
import { NuevoUmComponent } from '@app/pages/forms/nuevo-um/nuevo-um.component'
import { AsignacionEquipoComponent } from '@app/pages/forms/asignacion-equipo/asignacion-equipo.component'
import { EmpresaService } from '@app/services/empresa.service'
import { SkuMaquinaService } from '@app/services/sku-maquina.service'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  listaProductos: [];
  form: FormGroup;
  total: number;
  totalMBP: number;
  totalVPL: number;
  listaUm: [];
  submitted = false;
  listaEmpresa: [];
  VPL: [];
  
  MBP: any [];
  MQTT: FormGroup;
  prod = [];
  prodSend: string;

  listNav = [
    { "name": "SKU", "router": "/producto" },
    { "name": "Subensamble", "router": "/subensamble" },
    { "name": "Materia Prima", "router": "/materiaPrima" }
  ]
  constructor(
    private productoService: ProductoService,
    private skumaquinaService: SkuMaquinaService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService, private formBuilder: FormBuilder, private umService: UmService,
    private empresaServise: EmpresaService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      producto: ['', Validators.required],
      desc_producto: ['', Validators.required],
      te_producto: ['', [Validators.required, Validators.min(1)]],
      um_producto: ['', Validators.required],
      intervalo_tm: ['', Validators.required],
      ciclo_producto: ['', Validators.required],
      dolar_minuto: ['', Validators.required],
      activo_producto: [],
      idempresa: ['', Validators.required]
    });

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.getUm();
    this.getEmpresa();
    this.getProductos('');
  }

  async getProductos(searchValue: string) {
    try {
      let resp = await this.productoService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaProductos = resp.response;
        this.total = this.listaProductos.length;
      }
    } catch (e) {
    }
  }

  async VerificaProd(producto) {
    try {
      let resp = await this.productoService.VerificaProdlinea(producto.idproducto, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.VPL = resp.response;
        this.totalVPL = this.VPL.length;

        if(this.totalVPL > 0){
          Swal.fire('Error', '¡Este producto no puede ser eliminado debido a que se encuentra vinculado a una línea de producción!', 'error');
          
        } else{
          this.delete(producto);
        }
      }
    } catch (e) {
    }
  }

  async getEmpresa() {
    try {
      let response = await this.empresaServise.getEmpresa("", this.auth.token).toPromise();
      if (response.code == 200) {
        this.listaEmpresa = response.response;
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

  async getprodAct(idmaquina,serialrmt) {
    try {
      let resp = await this.skumaquinaService.getProductosMaquina(idmaquina,this.auth.token).toPromise();
      if (resp.code == 200) {
        this.prod = resp.response;
        this.prodSend = JSON.stringify(this.prod);
        this.prodSend = this.prodSend.split(/]|{|}|"|id|producto|te_|intervalo_tm|ciclo_|:|/g).join('');
        this.prodSend = this.prodSend.split("[").join('');
        this.prodSend = this.prodSend.split(",").join('?');
        this.MQTT.value.topic = serialrmt;
        this.SendUsuariosMQTT(this.prodSend)
      }
    } catch (e) {
    }
  }

  async SendUsuariosMQTT(info) {
    this.MQTT.value.message =  'SKU:'+ info +'/Fin';
    try {
      let resp = await this.skumaquinaService.MQTTEncoder(this.MQTT.value).toPromise();
      
    } catch (e) {
    }
  }

  async MaquinaByProducto(idproducto) {
    try {
      let resp = await this.productoService.getMaquinaByProducto(idproducto, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.MBP = resp.response;
        this.totalMBP = this.MBP.length;
        if(this.totalMBP > 0){
          for(let i in this.MBP){
            this.MBP[i].idmaquina;
            this.MBP[i].serialrmt;
            this.getprodAct(this.MBP[i].idmaquina,this.MBP[i].serialrmt)
          }
        }
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
      this.form.value.activo_producto = 1;
      let response = await this.productoService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getProductos('');
        this.submitted = false;
        this.form.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar el registro!', 'error');
    }
  }

  update(producto) {
    const dialogRef = this.dialog.open(NuevoProductoComponent, {
      width: '40rem',
      data: {
        title: 'Editar producto: ' + producto.producto,
        btnText: 'Guardar',
        alertSuccesText: 'Producto modificado correctamente',
        alertErrorText: "No se puedo modificar el registro",
        modalMode: 'edit',
        _producto: producto
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getProductos('');
      this.MaquinaByProducto(producto.idproducto);
    });
  }

  verSKU(producto) {
    const dialogRef = this.dialog.open(AsignacionEquipoComponent, {
      width: '30rem',
      data: {
        title: 'Asignación de equipos para producción de SKU',
        alertSuccesText: 'SKU guardado',
        alertErrorText: "No se puedo modificar el SKU",
        idproducto: producto.idproducto
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getProductos('');
    });
  }


  newDefecto() {
    const dialogRef = this.dialog.open(NuevoRegistodefectosComponent, {
      width: '50rem',
      data: {
        title: 'Registro de modos de fallas',
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      //this.getUm();
    });
  }


  newScrap() {
    const dialogRef = this.dialog.open(NuevoRegistoscrapComponent, {
      width: '50rem',
      data: {
        title: 'Registro de causas de scrap',
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      //  this.getUm();
    });
  }

  Copy(obj) {
    const dialogRef = this.dialog.open(RegistrocopyComponent, {
      width: '50rem',
      data: {
        title: 'Copia de modos de falla y/o causas de scrap',
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      //  this.getUm();
    });
  }

  AddDefectos(obj) {
    const dialogRef = this.dialog.open(AsignarDefectosComponent, {
      width: '50rem',
      data: {
        title: 'Asignar modos de falla al producto: ' + obj.producto,
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      //  this.getUm();
    });
  }

  AddScrap(obj) {
    const dialogRef = this.dialog.open(AsignarScrapComponent, {
      width: '50rem',
      data: {
        title: 'Asignar causa de scrap al producto: ' + obj.producto,
        btnText: 'Guardar',
        alertSuccesText: 'Agregado correctamente!',
        alertErrorText: "No se puedo guardar el registro!",
        modalMode: 'new',
        obj: obj
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      //  this.getUm();
    });
  }

  delete(producto) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.productoService.delete(producto.idproducto, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getProductos('');
            this.MaquinaByProducto(producto.idproducto);
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
