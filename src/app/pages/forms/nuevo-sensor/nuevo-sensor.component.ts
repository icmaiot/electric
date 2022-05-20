import { Component, OnInit, Inject } from '@angular/core';
import { MaquinaService } from '@app/services/maquina.service';
import { SensorService } from '@app/services/sensor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Maquina } from '@app/models/maquina';
import { Sensor } from '@app/models/sensor';
import { EventoSensor } from '@app/models/eventoSensor';
import { ColorService } from '@app/services/color.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-sensor',
  templateUrl: './nuevo-sensor.component.html',
  styleUrls: ['./nuevo-sensor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoSensorComponent extends Dialog implements OnInit {

  sensor: Sensor = new Sensor();
  sensorForm: FormGroup;
  submitted = false;
  maquinas: Maquina[];
  colores: EventoSensor[];
  token;

  constructor(private maquinaService: MaquinaService, private sensorService: SensorService,
    private formBuilder: FormBuilder, private colorService: ColorService,
    public dialogRef: MatDialogRef<NuevoSensorComponent>, private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data) {
    super();
  }

  ngOnInit() {
    this.sensorForm = this.formBuilder.group({
      sensor: ['', Validators.required],
      idmaquina: ['', Validators.required],
      color: ['', Validators.required],
      intermitente: ['', Validators.required],
      tipo: ['', Validators.required]
    });
    this.token = this.auth.token;
    this.getMaquinas();
    this.getColores();
    this.loadModalTexts();
  }

  async getColores() {
    try {
      let resp = await this.colorService.getColors(this.token).toPromise();
      if (resp.code == 200) {
        this.colores = resp.color;
      }
    } catch (e) {
    }
  }

  async getMaquinas() {
    try {
      let resp = await this.maquinaService.getMaquinas("", "", this.token).toPromise();
      if (resp.code == 200) {
        this.maquinas = resp.maquina;
      }
    } catch (e) {
    }
  }

  get f() { return this.sensorForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.sensorForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response;
      switch (this.modalMode) {
        case 'create': response = await this.sensorService.create(this.sensor, this.token).toPromise();
          break;
        case 'edit': response = await this.sensorService.update(this.sensor, this.token).toPromise();
          break;
      }
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

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _sensor, idMaquina } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_sensor) {
      const { idsensor, sensor, idmaquina, color, intermitente, tipo } = _sensor;
      this.sensor.idsensor = idsensor;
      this.sensor.sensor = sensor;
      this.sensor.idmaquina = idmaquina;
      this.sensor.color = color;
      this.sensor.intermitente = intermitente;
      this.sensor.tipo = tipo;
    }

    if (idMaquina) {
      this.sensor.idmaquina = idMaquina;
    }
  }
  closeModal() {
    this.dialogRef.close();
  }

}
