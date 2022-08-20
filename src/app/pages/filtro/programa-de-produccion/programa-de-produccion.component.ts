import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaquinaService } from '@app/services/maquina.service'
import { ProductoService } from '@app/services/producto.service'
import { LineaprodService } from '@app/services/lineaprod.service'
import { ProgprodlineaService } from '@app/services/progprodlinea.service'
import { ProduccionloteService } from '@app/services/produccionlote.service';
import { TurnosProductivosService } from '@app/services/turnos-productivos.service'
import { EditarProgprodlineaComponent } from '@app/pages/forms/editar-progprodlinea/editar-progprodlinea.component'
import { EditarStatusComponent } from '@app/pages/forms/editar-progprod/editar-status/editar-status.component'


@Component({
  selector: 'app-programa-de-produccion',
  templateUrl: './programa-de-produccion.component.html',
  styleUrls: ['./programa-de-produccion.component.scss']
})
export class ProgramaDeProduccionComponent implements OnInit {

  progprodlinea = [];
  progprodlineapa = [];
  maq = [];
  turno = [];
  productos = [];
  productolinea = [];
  selectturno = [];
  filterArray = [];
  filterArray2 = [];
  moduloi = [];
  id;

  enviar_linea: string;

  tipos: any[] = [
    { idtipo: 1, tipo: 'Normal' },
    { idtipo: 2, tipo: 'Muestra' },
  ];

  Status: any[] = [
    { id: 0, status: 'Pendiente' },
    { id: 1, status: 'En preparación' },
    { id: 2, status: 'En producción' },
    { id: 3, status: 'Terminado' },
  ];

  submitted = false;
  form: FormGroup
  formp: FormGroup;
  formFilter: FormGroup;
  MQTT: FormGroup;

  listNav = [
    { "name": "Programa de producción", "router": "/programa-de-produccion" },
    { "name": "Programa en ejecución", "router": "/produccion-ejecucion" },
    { "name": "Histórico de producción", "router": "/historico-produccion" },
  ]

  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private turnosService: TurnosProductivosService,
    private lineaprodService: LineaprodService,
    private maquinaService: MaquinaService,
    private progprodlineaService: ProgprodlineaService,
    private produccionloteService: ProduccionloteService,
    private productoService: ProductoService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      //     idprogprodlinea: [],
           idlineaprod: ['', Validators.required],
      //     idturnoprodlinea: ['', Validators.required],
      idskunow: ['', Validators.required],
      //     idskunext: ['', Validators.required],
      cant: ['', Validators.required],
      //      statprodlinea: [''],
      tipoprod: ['', Validators.required],
    });

    this.formFilter = this.formBuilder.group({
      idLinea: ['-1'],
      idProducto: ['-1']
    })

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.getSelectTurno();
    this.getProductos();
    this.getTurnos();
    this.getLineaprod();
    this.getFiltro();
    this.getFiltro2();
    this.cdRef.detectChanges();

    this.cdRef.detach();
    this.id = setInterval(() => {
      this.getFiltro();
      this.cdRef.detectChanges();
    }, 3000);

  }

  NStatus(status: Array<any>) {
    for (const st of status) {
      if (st.statprodlinea === 0) {
        st.slinea = 'Pendiente'
      }
      if (st.statprodlinea === 1) {
        st.slinea = 'En Preparación'
      }
      if (st.statprodlinea === 2) {
        st.slinea = 'En Producción'
      }
      if (st.statprodlinea === 3) {
        st.slinea = 'Terminado'
      }
    }
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
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
         let resp = await this.maquinaService.getInterfaz(this.form.value.idlineaprod, this.auth.token).toPromise();
         if (resp.code == 200) {
            this.moduloi = resp.response;
            this.SendMQTT(this.moduloi[0].serialrmt);
         
        }
       } catch (e) {
       }

  }

  async SendMQTT(modulo) {
    this.MQTT.value.topic = modulo;
            this.MQTT.value.message = 'LINEA: SKU-' + this.form.value.idskunow + ' CANTIDAD-' + this.form.value.cant + ' TIPO-' + this.form.value.tipoprod  + '/Fin';
            try {
              let respon = await this.progprodlineaService.MQTTEncoder(this.MQTT.value).toPromise();
              if(respon.code = 200){
                this.form.reset({});
              }
            } catch (e) {
            }
  }

  async getTurnos() {
    try {
      let resp = await this.turnosService.get("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.turno = resp.response;
      }
    } catch (e) {
    }
  }

  async getLineaprod() {
    try {
      let resp = await this.maquinaService.getLinea('Línea', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.maq = resp.response;
        this.cdRef.detectChanges();
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


  async getFiltro2() {
    try {
      let resp = await this.progprodlineaService.filtro(this.auth.token, this.formFilter.value).toPromise();
      if (resp.code == 200) {
        this.productolinea = resp.response;
        this.cdRef.detectChanges();
        
        this.filterArray = this.productolinea.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.idskunow === current.idskunow)) {
            accumalator.push(current);
          }

          return accumalator;
        }, []);
        this.filterArray2 = this.productolinea.reduce((accumalator, current) => {
          if (!accumalator.some(item => item.idlineaprod === current.idlineaprod)) {
            accumalator.push(current);
          }
          return accumalator;
        }, []);
      }
    } catch (e) {

    }
  }


  async getSelectTurno() {
    try {
      let resp = await this.progprodlineaService.getseleccionturno(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.selectturno = resp.response;
      }
    } catch (e) {

    }
  }
  async getFiltro() {
    try {
      let resp = await this.progprodlineaService.filtro(this.auth.token, this.formFilter.value).toPromise();
      if (resp.code == 200) {
        this.progprodlineapa = resp.response;
        this.NStatus(this.progprodlineapa);
      }
    } catch (e) {

    }
  }

  async limpiarFiltro() {
    this.formFilter.controls['idLinea'].setValue('-1');
    this.formFilter.controls['idProducto'].setValue('-1');
    this.getFiltro();
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.progprodlineaService.delete(obj, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.form.reset({});
            this.getFiltro();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

  editProgprodlinea(obj) {
    const dialogRef = this.dialog.open(EditarProgprodlineaComponent, {
      //width: '40rem',
      data: {
        title: 'Editar: ' + obj.maquina,
        btnText: 'Guardar',
        alertSuccesText: 'Línea modificada!',
        alertErrorText: "Error modificando la línea",
        modalMode: 'create',
        obj: obj
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.getFiltro();
    });
  }

  editStatus(obj) {
    const dialogRef = this.dialog.open(EditarStatusComponent, {
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
      this.getFiltro();
    });
  }
}