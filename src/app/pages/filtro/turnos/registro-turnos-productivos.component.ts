import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnosProductivosService } from '@app/services/turnos-productivos.service';
import { TurnosdescansoService } from '@app/services/turnosdescanso.service';
import { ProgprodlineaService } from '@app/services/progprodlinea.service';
import { Turnos } from '../../../models/turnos';
import { EditarTurnoComponent } from '@app/pages/forms/editar-turno/editar-turno.component';

@Component({
  selector: 'app-registro-turnos-productivos',
  templateUrl: './registro-turnos-productivos.component.html',
  styleUrls: ['./registro-turnos-productivos.component.scss']
})
export class TurnosProductivosComponent implements OnInit {

  form: FormGroup;
  MQTT: FormGroup;
  turnod: string;
  total: number;
  submitted = false;
  listaturnos: Turnos[];
  NumTurno = [{ id: 1 }];
  NumT = [];
  NumC = [];
  turnodescanso = [];
  /* listNav = [
     { "name": "Control de Producción", "router": "/" },
   ]*/
  constructor(
    private turnosproductivosService: TurnosProductivosService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private progprodlineaService: ProgprodlineaService,
    private turnoService: TurnosdescansoService,
    private auth: AuthService, private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      idturno: [],
      turno: ['', Validators.required],
      numturno: ['', [Validators.required, Validators.min(1)]],
      inicturno: ['', Validators.required],
      finturno: ['', Validators.required],
      turnodb: [''],
    });

    this.MQTT = this.formBuilder.group({
      topic: [''],
      message: [],
    });

    this.getTurnos('');
  }

  async getTurnos(searchValue: string) {
    try {
      let resp = await this.turnosproductivosService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaturnos = resp.response;
        this.total = this.listaturnos.length;
      }
    } catch (e) {
    }
  }

  async getTurnoDescanso() {
    try {
      let resp = await this.progprodlineaService.getseleccionturno(this.auth.token).toPromise();
      if (resp.code == 200) {
        this.turnodescanso = resp.response;
        for (let i = 0; i < this.turnodescanso.length; i++) {
          this.turnod = JSON.stringify(this.turnodescanso[i]);
          this.turnod = this.turnod.split(/]|{|}|"|/g).join('');
          this.turnod = this.turnod.split("idturdesc:").join('');
          this.turnod = this.turnod.split("descansos:").join('');
          this.turnod = this.turnod.split("Turno:").join('');
          this.turnod = this.turnod.split("[").join('');
          this.turnod = this.turnod.split(",").join('?');
          this.SendProductosMQTT(this.turnod)
        }

      }
    } catch (e) {
    }
  }

  async SendProductosMQTT(info) {
    this.MQTT.value.message = 'Turno:' + info + '/Fin';
    try {
      let resp = await this.turnoService.MQTTEncoder(this.MQTT.value).toPromise();

    } catch (e) {
    }
  }

  onSearchChange(searchValue: string) {
    this.getTurnos(searchValue);
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
    this.form.value.turnodb = this.form.value.turno;
    this.form.value.turnodb = this.form.value.turnodb.split(" ").join('_');
    try {
      let response = await this.turnosproductivosService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getTurnos('');
        this.submitted = false;
        this.form.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'Error al guardar el registro!', 'error');
    }
  }

  update(turno) {
    const dialogRef = this.dialog.open(EditarTurnoComponent, {
      width: '30rem',
      data: {
        title: 'Editar descanso: ' + turno.turno,
        btnText: 'Guardar',
        alertSuccesText: 'Tiempo efectivo modificado correctamente',
        alertErrorText: "Error al modificar el registro",
        modalMode: 'edit',
        _turno: turno
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getTurnos("");
      this.getTurnoDescanso();
    });
  }

  delete(turnos) {
    Swal.fire({
      title: '¿Desea eliminar el turno?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.turnosproductivosService.delete(turnos.idturno, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            Swal.fire('Eliminado', 'El turno ha sido borrado!', 'success');
            this.getTurnos('');
            this.getTurnoDescanso();
          } else {
            Swal.fire('Error', 'Error al borrar el turno!', 'error');
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

}
