import { Component, OnInit, Inject } from '@angular/core';
import { ProduccionService } from '@app/services/produccion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import { TiempomuertopService } from '@app/services/tiempomuertop.service';
import { EventoUsuarioService } from '@app/services/evento-usuario.service';
import { EventocausaService } from '@app/services/eventocausa.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { get12Hours, truncateWithEllipsis } from '@amcharts/amcharts4/.internal/core/utils/Utils';

@Component({
  selector: 'app-nuevo-tm',
  templateUrl: './nuevo-tm.component.html',
  styleUrls: ['./nuevo-tm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoTMComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  produccion: [];
  lsevento: [];
  lseventoc: [];
  listatm: [];
  token;
  lote;
  id;
  idlote;

  idmaquina;


  constructor(
    private tiempomuertopService: TiempomuertopService,
    private eventoService: EventoUsuarioService,
    private eventocausaService: EventocausaService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoTMComponent>,
    private auth: AuthService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id_tm_periodo: [],
      evento: [''],
      subcausa: [''],
      inf: [''],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getTM();
    this.getEvento('');
    this.getEventoCausa();
  }

  onChange(event) {
    this.id = event.target.value
    this.getEventoCausa();
  }

  async getEvento(searchValue: string) {
    try {
      let resp = await this.eventoService.getEvento(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lsevento = resp.eventos;
      }
    } catch (e) {

    }
  }

  async getEventoCausa() {
    try {
      let resp = await this.eventocausaService.get('3', this.id, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lseventoc = resp.response;
      }
    } catch (e) {

    }
  }

  async getTM() {
    try {
      let resp = await this.tiempomuertopService.get(this.idlote, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listatm = resp.response;
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
    this.idlote = obj.lote;
    this.id = obj.evento;

    if (obj) {
      //this.maquina = _maquina;
      const { id_tm_periodo, evento, subcausa, inf } = obj;
      this.form.patchValue({ id_tm_periodo, evento, subcausa, inf });
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
      let response;
      response = await this.tiempomuertopService.update(this.form.value, this.token).toPromise();
      if (response.code == 200) {
        this.showAlert(this.alertSuccesText, true);
        this.getTM();
        this.submitted = false;
        //this.form.reset({});
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (e) {
      this.showAlert(e.error.message, false);
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
        this.tiempomuertopService.delete(obj.id_tm_periodo, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getTM();
          } else {
            Swal.fire('Error', 'Error al borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
