import { Component, OnInit, Inject, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { NuevoDiaTurnoComponent } from '@app/pages/forms/nuevo-diaturno/nuevo-diaturno.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';
import { TurnosProductivosService } from '@app/services/turnos-productivos.service';
import { TurnosdescansoService } from '@app/services/turnosdescanso.service';
import { ProgprodlineaService } from '@app/services/progprodlinea.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-nuevo-turnos',
  templateUrl: './nuevo-turnos.component.html',
  styleUrls: ['./nuevo-turnos.component.scss'],
})
export class NuevoTurnosComponent implements OnInit {

  form: FormGroup;
  MQTT: FormGroup;
  turnod: string;
  submitted = false;
  listaturnos = [];
  turnodescanso = [];
  idurl;
  token;


  listNav = [
    { "name": "Turnos Productivos", "router": "/TurnosProductivos" },
  ]

  constructor(
    private turnosproductivosService: TurnosProductivosService,
    private progprodlineaService: ProgprodlineaService,
    private turnoService: TurnosdescansoService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private cdref: ChangeDetectorRef,
    private dialog: MatDialog,
    private activate: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.idurl = this.activate.snapshot.paramMap.get('id');
    this.form = this.formBuilder.group({
      idturdesc: [],
      idturno: [],
      numdesc: ['', Validators.required],
      desc1: ['', Validators.required],
      desc1dur: ['', Validators.required],
      desc2: ['', Validators.required],
      desc2dur: ['', Validators.required],
      desc3: ['', Validators.required],
      desc3dur: ['', Validators.required],
    });

    this.MQTT = this.formBuilder.group({
      topic: [''],
      message: [],
    });

    this.token = this.auth.token;
    this.getTurno();
  }

  async getTurno() {
    try {
      let resp = await this.turnoService.get(this.idurl, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaturnos = resp.response;
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
    //console.log(this.MQTT.value)
    try {
      let resp = await this.turnoService.MQTTEncoder(this.MQTT.value).toPromise();

    } catch (e) {
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

      this.form.value.idturno = this.idurl;
      //console.log(this.form.value)
      let response = await this.turnoService.create(this.form.value, this.auth.token).toPromise();
      if (response.code == 200) {
        Swal.fire('Guardado', 'El registro ha sido guardado!', 'success');
        this.getTurno();
        this.getTurnoDescanso();
        this.submitted = false;
        this.form.reset({});
      }
    } catch (error) {
      Swal.fire('Error', 'Error al guardar el registro!', 'error');
    }
  }

  update(turno) {
    const dialogRef = this.dialog.open(NuevoDiaTurnoComponent, {
      width: '30rem',
      data: {
        title: 'Editar descanso: ' + turno.numdesc,
        btnText: 'Guardar',
        alertSuccesText: 'Tiempo efectivo modificado correctamente',
        alertErrorText: "Error al modificar el registro",
        modalMode: 'edit',
        _turno: turno
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      this.getTurno();
      this.getTurnoDescanso();
    });
  }

  delete(obj) {
    Swal.fire({
      title: '¿Desea eliminar el registro?', text: "",
      type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.value) {
        this.turnoService.delete(obj.idturdesc, this.auth.token).subscribe(res => {
          if (res.code == 200) {
            this.getTurnoDescanso();
            Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
            this.getTurno();
          } else {
            Swal.fire('Error', 'Error al borrar el registro!', 'error');
          }
        });
      }
    });
  }

}
