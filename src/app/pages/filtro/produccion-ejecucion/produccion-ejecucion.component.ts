import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { MaquinaService } from '@app/services/maquina.service';
import { ProduccionloteService } from '@app/services/produccionlote.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-produccion-ejecucion',
  templateUrl: './produccion-ejecucion.component.html',
  styleUrls: ['./produccion-ejecucion.component.scss'],
})

export class ProduccionEjecucionComponent implements OnInit {

  lotefinal = [];
  descanso = [];
  token;
  tid;
  total = 0;
  formdes: FormGroup;
  intervalTimer = interval(15000);
  status: boolean = false;
  Operando = "../../../assets/img/Operando_B.jpg";
  Enparo = "../../../assets/img/EN PARO X - 5.png";

  listNav = [
    { "name": "Programa de producción", "router": "/programa-de-produccion" },
    { "name": "Programa en ejecución", "router": "/produccion-ejecucion" },
    { "name": "Histórico de producción", "router": "/historico-produccion" },
  ]

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private maquinaService: MaquinaService,
    private produccionService: ProduccionloteService,
  ) { }

  ngOnInit() {
    this.token = this.auth.token;
    this.getMaquinaEjecucion();

    this.formdes = this.formBuilder.group({
      lote: [],
    })

    setInterval(() => {
      this.status = true;
      this.cdRef.detectChanges()
      this.getMaquinaEjecucion();
    }, 30000);

  }

  async getMaquinaEjecucion() {
    try {
      let resp = await this.maquinaService.getMaquinaEjecucion('Línea', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.lotefinal = resp.response;
        this.total = this.lotefinal.length;
      }
    } catch (e) {
    }
  }

  async getDescanso(lote) {
    this.formdes.value.lote = lote;
    try {
      let resp = await this.produccionService.getDescanso(this.formdes.value, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.descanso = resp.response;
        this.tid = this.descanso[0].tidescanso;
      }
    } catch (e) {
    }
  }

}