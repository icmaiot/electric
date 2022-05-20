import { Component, OnInit, Inject } from '@angular/core';
import { RegistroscrapService } from '@app/services/registroscrap.service';
import { ProductoService } from '@app/services/producto.service';
import { ScrapService } from '@app/services/scrap.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-copy',
  templateUrl: './registro-copy.component.html',
  styleUrls: ['./registro-copy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrocopyComponent extends Dialog implements OnInit {

  form: FormGroup;
  formins: FormGroup;
  submitteds = false;
  scrap: [];
  producto: [];
  token;
  idp;
  op1 = 1;
  op2 = 2;
  op3 = 3;

  constructor(
    private RegistroscrapService: RegistroscrapService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistrocopyComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      productocopy: ['', Validators.required],
      productonew: ['', Validators.required],
      opcion: ['', Validators.required],
    });

    this.token = this.auth.token;
    this.loadModalTexts();
    this.getProducto();
  }


  async getProducto() {
    try {
      let resp = await this.productoService.get('', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.producto = resp.response;
      }
    } catch (e) {
    }
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.idp = obj.idproducto;

    /* if (obj) {
       //this.maquina = _maquina;
       const { idproducto } = obj;
       this.form.patchValue({idscrapreg, descripcion_scrap,cod_scrap});
     }*/
  }

  get f() { return this.form.controls; }

  onSubmits(op) {
    this.submitteds = true;
    if (this.form.invalid) {
      return;
    } else {
      this.guardar(op);
    }
  }

  async guardar(op) {
    this.form.value.productonew = this.idp;
    this.form.value.opcion = op;
    try {
      let response;
      response = await this.RegistroscrapService.copy(this.form.value, this.token).toPromise();

      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.submitteds = false;
        this.form.reset({});
      }
    } catch (e) {

    }
  }


  closeModal() {
    this.dialogRef.close();
  }


}
