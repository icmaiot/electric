import { Component, OnInit, Inject } from '@angular/core';
import { AcumscrapService } from '@app/services/acumscrap.service';
import { ScrapService } from '@app/services/scrap.service';
import { UsuarioService } from '@app/services/usuario.service';
import { AsignarScrapService } from '@app/services/asignarscrap.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { truncateWithEllipsis } from '@amcharts/amcharts4/.internal/core/utils/Utils';

@Component({
  selector: 'app-nuevo-reg-scrap',
  templateUrl: './nuevo-reg-scrap.component.html',
  styleUrls: ['./nuevo-reg-scrap.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoRegScrapComponent extends Dialog implements OnInit {

  form: FormGroup;
  formins: FormGroup;
  submitted = false;
  scrap: [];
  scraps: [];
  usuario: [];
  responsable: [];
  activoUsuario = '1';
  token;
  date;
  idp;
  id;
  lote;
  cant;
  tipo_scrap: any[] = [
    { id: 1, tipo: 'Setup' }
    , { id: 2, tipo: 'Producción' }];

  constructor(
    private asignarscrapService: AsignarScrapService,
    private usuarioService: UsuarioService,
    private scrapService: ScrapService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoRegScrapComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.date = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    this.form = this.formBuilder.group({
      cantscrap: ['', Validators.required],
      lotescrap: ['', Validators.required],
      idscrapreg: ['', Validators.required],
      idusuarios: ['', Validators.required],
      idtipo_scrap: ['', Validators.required],
      idusuarioreg: ['', Validators.required],
      Idacscrap: [''],
    });

    this.formins = this.formBuilder.group({
      tname: ['', Validators.required],
      lote: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getScrap();
    this.getUsuarios2();
    this.getscrap();
  }

  async getScrap() {
    try {
      let resp = await this.scrapService.get(this.lote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.scrap = resp.response;
      }
    } catch (e) {
    }
  }

  async getscrap() {
    try {
      let resp = await this.asignarscrapService.get(this.idp, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.scraps = resp.response;
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
      //this.maquina = _maquina;
      const { Idacscrap, cantscrap, lotescrap } = obj;
      this.form.patchValue({ Idacscrap, cantscrap, lotescrap });
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
    this.form.value.lotescrap = this.lote;
    try {
      let response;
      response = await this.scrapService.create(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getScrap();
        this.submitted = false;
        this.form.reset({});
        this.Scrapins();
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (e) {
      this.showAlert(e.error.message, false);
    }
  }

  async Scrapins() {
    this.formins.value.tname = 'lote' + this.lote;
    this.formins.value.lote = this.lote;
    try {
      let resp = await this.scrapService.getScrapins(this.formins.value, this.auth.token).toPromise();
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
        this.scrapService.delete(obj.Idacscrap, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getScrap();
          } else {
            Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
