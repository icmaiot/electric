import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { ProgprodlineaService } from '@app/services/progprodlinea.service';
import { ProductoService } from '@app/services/producto.service'
@Component({
  selector: 'app-editar-progprodlinea',
  templateUrl: './editar-progprodlinea.component.html',
  styleUrls: ['./editar-progprodlinea.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditarProgprodlineaComponent extends Dialog implements OnInit {

  token;
  form: FormGroup;
  productos: [];
  status;
  submitted = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder, private auth: AuthService,
    public dialogRef: MatDialogRef<EditarProgprodlineaComponent>,
    private productoService: ProductoService, private progprodlineaService: ProgprodlineaService) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idskunow: ['', Validators.required],
      idskunext: ['', Validators.required],
      cant: ['', Validators.required],
      idprogprodlinea: ['']
    });
    this.token = this.auth.token;
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
    this.status = obj.statprodlinea;
    if (obj) {
      //this.maquina = _maquina;
      const { idskunow, idskunext, cant, idprogprodlinea } = obj;
      this.form.patchValue({ idskunow, idskunext, cant, idprogprodlinea });
    }
  }

  closeModal() {
    this.dialogRef.close();
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
      let response = await this.progprodlineaService.update(this.form.value, this.token).toPromise();
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
