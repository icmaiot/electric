import { Component, OnInit, Inject } from '@angular/core';
import { SkuMaquinaService } from '@app/services/sku-maquina.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { MaquinaService } from '@app/services/maquina.service'
import { TipoEquipoService } from '@app/services/tipo-equipo.service'
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-asignacion-equipo',
  templateUrl: './asignacion-equipo.component.html',
  styleUrls: ['./asignacion-equipo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignacionEquipoComponent extends Dialog implements OnInit {

  form: FormGroup;
  MQTT: FormGroup;
  submitted = false;
  idProducto: number;
  listap: string;
  prioridad;
  idmaquina;
  idrmt;
  tipos = [];
  listaSKU = [];
  listaEquipos = [];
  ListaProductosByMaquina = [];
  Rmt = [];

  constructor(
    private formBuilder: FormBuilder,
    private skuService: SkuMaquinaService,
    public dialogRef: MatDialogRef<AsignacionEquipoComponent>,
    private auth: AuthService, private maquinaService: MaquinaService,
    private tipoService: TipoEquipoService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idmaquina: ['', Validators.required],
      idproducto: ['']
    });

    this.MQTT = this.formBuilder.group({
      topic: [],
      message: [],
    });

    this.loadModalTexts();

    this.getTipos();
    this.getMaquinas();
    this.getSKU();
  }

  loadModalTexts() {
    const { title, alertErrorText, alertSuccesText, idproducto } = this.data;
    this.title = title;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.idProducto = idproducto;
  }

  closeModal() {
    this.dialogRef.close();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.hiddeAlert();
      this.guardar();
    }
  }

  async getMaquinas() {
    try {
      let resp = await this.maquinaService.getMaquinas("", "", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaEquipos = resp.maquina;

      }
    } catch (e) {
    }
  }


  async getSKU() {
    try {
      let resp = await this.skuService.get(this.auth.token, this.idProducto).toPromise();
      if (resp.code == 200) {
        this.listaSKU = resp.response;
        let sku = this.listaSKU[this.listaSKU.length - 1];
      }
    } catch (e) {
    }
  }

  async getTipos() {
    try {
      let resp = await this.tipoService.getTipos(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.tipos = resp.tipo_equipos;
      }
    } catch (e) {
    }
  }

  async getProductosMaquina(idmaquina) {
    try {
      this.getRmt(idmaquina);
      let resp = await this.skuService.getProductosMaquina(idmaquina,this.auth.token).toPromise();
      if (resp.code == 200) {
        this.ListaProductosByMaquina = resp.response;
        this.listap = JSON.stringify(this.ListaProductosByMaquina);
          this.listap = this.listap.split(/]|{|}|"|idproducto|ciclo_producto|producto|intervalo_tm|te_producto|:|/g).join('');
          this.listap = this.listap.split("[").join('');
          this.listap = this.listap.split(",").join('?');
          this.SendProductosMQTT(this.listap);
      }
    } catch (e) {
    }
  }

  async getRmt(idmaquina) {
    try {
      let resp = await this.skuService.getRmt(idmaquina,this.auth.token).toPromise();
      if (resp.code == 200) {
        this.Rmt = resp.response;
        this.MQTT.controls['topic'].setValue(this.Rmt[0].serialrmt);
      }
    } catch (e) {
    }
  }

  async SendProductosMQTT(info) {
    this.MQTT.value.message =  'SKU:'+ info +'/Fin';
    try {
      let resp = await this.skuService.MQTTEncoder(this.MQTT.value).toPromise();
      
    } catch (e) {
    }
  }

  async guardar() {
    try {
      this.idmaquina = this.form.value.idmaquina;
      let response;
      this.form.controls['idproducto'].setValue(this.idProducto);
      response = await this.skuService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        this.getSKU();
        this.getProductosMaquina(this.idmaquina);
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
      this.submitted = false;
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.skuService.delete(obj, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            this.getProductosMaquina(obj.idmaquina);
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getSKU();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
