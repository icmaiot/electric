import { Component, OnInit, Inject } from '@angular/core';
import { AcumcalService } from '@app/services/acumcal.service';
import { UsuarioService } from '@app/services/usuario.service';
import { AsignarDefectosService } from '@app/services/asignardefectos.service';
import { DefectosService } from '@app/services/defectos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-reg-pieza',
  templateUrl: './nuevo-reg-pieza.component.html',
  styleUrls: ['./nuevo-reg-pieza.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoRegPiezaComponent extends Dialog implements OnInit {

  form: FormGroup;
  formins: FormGroup;
  submitted = false;
  pieza: [];
  defecto: [];
  usuario: [];
  responsable: [];
  activoUsuario = '1';
  token;
  id;
  idp;
  lote;
  cant;


  constructor(
    private asignardefectosService: AsignarDefectosService,
    private defectosService: DefectosService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoRegPiezaComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      cantdef: ['', Validators.required],
      lotedef: ['', Validators.required],
      iddefreg: ['', Validators.required],
      idusuarios: ['', Validators.required],
      idusuarioreg: [''],
      id: [''],
    });

    this.formins = this.formBuilder.group({
      tname: ['', Validators.required],
      lote: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getPieza();
    this.getUsuarios2();
    this.getdefecto();
  }

  async getPieza() {
    try {
      let resp = await this.defectosService.get(this.lote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.pieza = resp.response;
      }
    } catch (e) {
    }
  }

  async getdefecto() {
    try {
      let resp = await this.asignardefectosService.get(this.idp, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.defecto = resp.response;
      }
    } catch (e) {
    }
  }

  async getUsuarios2() {
    try {
      let resp = await this.usuarioService.getUsuariosName(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.usuario = resp.response;
        this.responsable = resp.response;
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
    this.lote = obj.idprogprodlinea;
    this.cant = obj.cant;
    this.idp = obj.idproducto;

    if (obj) {
      const { id, cantdef, lotedef } = obj;
      this.form.patchValue({ id, cantdef, lotedef });
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
    this.form.value.lotedef = this.lote;
    try {
      let response;
      response = await this.defectosService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getPieza();
        this.submitted = false;
        this.form.reset({});
        this.Defectosins();
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  async Defectosins() {
    this.formins.value.tname = 'lote' + this.lote;
    this.formins.value.lote = this.lote;
    try {
      let resp = await this.defectosService.getDefectosins(this.formins.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
      }
    } catch (e) {
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.defectosService.delete(obj.id, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getPieza();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
