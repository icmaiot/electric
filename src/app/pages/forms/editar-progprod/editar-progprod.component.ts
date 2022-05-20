import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { ProgprodService } from '@app/services/progprod.service';
import { MaquinaService } from '@app/services/maquina.service'
import { ProductoService } from '@app/services/producto.service'
@Component({
  selector: 'app-editar-progprod',
  templateUrl: './editar-progprod.component.html',
  styleUrls: ['./editar-progprod.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditarProgprodComponent extends Dialog implements OnInit {

  token;
  form: FormGroup;
  maquinas: [];
  productos: [];
  submitted = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder, private auth: AuthService,
    public dialogRef: MatDialogRef<EditarProgprodComponent>, private maquinaService: MaquinaService,
    private productoService: ProductoService, private progprodService: ProgprodService) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idmaquina: ['', Validators.required],
      cant: ['', Validators.required],
      idprogprod: ['']
    });
    this.token = this.auth.token;
    this.getMaquinas();
    this.getProductos()
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, obj } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (obj) {
      //this.maquina = _maquina;
      const { idmaquina, cant, idprogprod } = obj;
      this.form.patchValue({ idmaquina, cant, idprogprod });
    }
  }

  closeModal() {
    this.dialogRef.close();
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

  async getProductos() {
    try {
      let resp = await this.productoService.get("", this.auth.token).toPromise();
      if (resp.code == 200) {
        this.productos = resp.response;
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
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response = await this.progprodService.update(this.form.value, this.token).toPromise();
      if (response.code = 200) {
        this.showAlert(this.alertSuccesText, true);
        this.closeModal();
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

}
