import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ProduccionloteService } from '@app/services/produccionlote.service';
import { MaquinaService } from '@app/services/maquina.service';
import { UsuarioService } from '@app/services/usuario.service';
import { LineaemailService } from '@app/services/lineaemail.service';
import { Title } from '@angular/platform-browser';
import { TiempomuertopService } from '@app/services/tiempomuertop.service';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SkuMaquinaService } from '@app/services/sku-maquina.service';

@Component({ selector: 'app-board', templateUrl: './board.component.html', styleUrls: ['./board.component.scss'] })
export class BoardComponent implements OnInit {

    form: FormGroup; 
    formb: FormGroup;
    formd: FormGroup;
    formdes: FormGroup;
    formla: FormGroup;
    formFilter: FormGroup;
    SendEmail: FormGroup;
    maquinaupdate: FormGroup;
    maquinaupdate2: FormGroup;
    MQTT: FormGroup;

    board = [];
    board2 = [];
    maquinalista = [];
    boarddata = [];
    descanso = [];
    listatmp = [];
    correo: [];
    usuario: [];
    moduloi = [];

    idmaquina: string;
    maquina: string;
    prodSend: string;
    urlMidas: string;
    title: string;
    distan = "300";
    prodesp = "300";
    chartdiv: 'chartdiv';

    idlote;
    paro;
    velocidad;
    tid;
    activo;
    idusuario;
    token;
    data;
    Gaugue;
    date;

    estandar: number;
    
    vel: boolean;
    verde: boolean = false;
    rojo: boolean = false;
    desc: boolean = false;
    actv: boolean = false;

    email;
    estado_email;
    estado_desc;

    constructor(
        private auth: AuthService, 
        private formBuilder: FormBuilder,
        private activate: ActivatedRoute, 
        private usuarioService: UsuarioService,
        private produccionService: ProduccionloteService, 
        private maquinaService: MaquinaService,
        private cdRef: ChangeDetectorRef,
        private titleService: Title,
        private tiempomuertopService: TiempomuertopService,
        private datePipe: DatePipe,
        private skumaquinaService: SkuMaquinaService,
        ) { }

    ngOnInit() {
        this.idmaquina = this.activate.snapshot.paramMap.get('id');
        this.getMaquina();
        this.urlMidas = "../../../assets/img/MIDAS.jpg";

        this.formb = this.formBuilder.group({ tmaquina: [] });

        this.formd = this.formBuilder.group({ tmaquina: [] });

        this.formdes = this.formBuilder.group({ lote: [] });

        this.formla = this.formBuilder.group({ tlote: [], tname: [], tmaquina: [] });

        this.SendEmail = this.formBuilder.group({ 
            email: [], 
            maquina: [],
            paroi: [],
        });

        this.maquinaupdate = this.formBuilder.group({ 
            idmaquina: [],
            estado_email: []
        });

         this.maquinaupdate2 = this.formBuilder.group({ 
            idmaquina: [],
            estado_desc: []
        });

        this.MQTT = this.formBuilder.group({
            topic: [],
            message: [],
          });

        this.formd.value.tmaquina = this.idmaquina;
        this.maquinaupdate.value.idmaquina = this.idmaquina;
        this.maquinaupdate2.value.idmaquina = this.idmaquina;
        this.formb.value.tmaquina = this.idmaquina;
        
        this.getBoard2();
        this.getBoard('');
        this.Desc();
    }

     async Desc() {
        if (this.tid > 0 && this.estado_desc == 0) {
            this.Serial(1);
            this.UpdateEstadoDESC(1);
        } else if (this.tid == 0 && this.estado_desc == 1) {
            this.UpdateEstadoDESC(0);
            this.Serial(0);
        }
    }

    async UpdateEstadoDESC(ee) {
        this.maquinaupdate2.value.estado_desc = ee;
    try {
        let resp;
        resp = await this.maquinaService.update(this.maquinaupdate2.value, this.auth.token).toPromise();
        if (resp.code == 200) {
        }
    } catch (e) { }
}

    async Serial(desc) {
        try {
             let resp = await this.maquinaService.getInterfaz(this.idmaquina, this.auth.token).toPromise();
             if (resp.code == 200) {
                this.moduloi = resp.response;
                this.SendMQTT(this.moduloi[0].serialrmt, desc);
             
            }
           } catch (e) {
           }
    
      }

    async SendMQTT(serial, desc) {
        this.MQTT.value.topic = serial;
        this.MQTT.value.message =  'DESC:'+ desc +'/Fin';
        
        try {
          let resp = await this.maquinaService.MQTTEncoder(this.MQTT.value).toPromise();
         
        } catch (e) {
        }
      }

    async getUsuarios(idusuario) {
        try {
            let resp = await this.usuarioService.readUsuario(idusuario, this.auth.token).toPromise();
            if (resp.code == 200) {
                this.usuario = resp.usuario;
            }
        } catch (e) { }
    }

    async getDescanso(lote) {
        this.formdes.value.lote = lote;
        try {
            let resp = await this.produccionService.getDescanso(this.formdes.value, this.auth.token).toPromise();
            if (resp.code == 200) {
                this.descanso = resp.response;
                this.tid = this.descanso[0].tidescanso;
            }
        } catch (e) { }
    }


    async getMaquina() {
        try {
            let resp = await this.maquinaService.getMaquina(this.idmaquina, this.auth.token).toPromise();
            if (resp.code == 200) {
                this.maquinalista = resp.maquina;
                this.maquina = this.maquinalista[0].maquina;
                this.SendEmail.value.maquina = this.maquina;
                this.titleService.setTitle('Board - ' + this.maquina);
            }
        } catch (e) { }
    }

    async getLoteActivo() {
       // this.formd.value.tmaquina = this.idmaquina;
        try {
            let resp = await this.produccionService.getLoteActivo(this.formd.value, this.auth.token).toPromise();
            if (resp.code == 200) {
                this.boarddata = resp.response;
                this.idlote = this.boarddata[0].loteac;
                this.getDescanso(this.idlote);
                this.getBoard(this.idlote);
            }
        } catch (e) { }
    }

    async sendEmail(correos) {
        this.date = this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss');
        console.log(this.date)
        this.SendEmail.value.email = correos;
        this.SendEmail.value.maquina = this.maquina;
        this.SendEmail.value.paroi = this.date;
        console.log(this.SendEmail.value)
        try {
            let response;
            response = await this.maquinaService.sendEmail(this.SendEmail.value, this.auth.token).toPromise();
            if (response.code == 200) {
                console.log('enviado')
                this.UpdateEstadoEmail(2);
            }
        } catch (error) { }
    }

    async UpdateEstadoEmail(ee) {
            
            this.maquinaupdate.value.estado_email = ee;
        try {
            let resp;
            resp = await this.maquinaService.update(this.maquinaupdate.value, this.auth.token).toPromise();
            if (resp.code == 200) {
            }
        } catch (e) { }
    }

    async SE(correos) {
        
        if (this.velocidad == 0 && this.estado_email == 1) {
            this.gettmp();
            this.sendEmail(correos);
        } else if (this.velocidad > 0 && this.estado_email == 2) {
            this.UpdateEstadoEmail(1);
        }
    }

    async gettmp() {
        try {
          let resp = await this.tiempomuertopService.tm(this.idlote, this.auth.token).toPromise();
          if (resp.code == 200) {
            this.listatmp = resp.response;
        
          }
        } catch (e) {
    
        }
      }

    async getCorreos(){
        try {
            let resp = await this.maquinaService.getCorreos(this.idmaquina, this.auth.token).toPromise();
            this.correo = resp.response;
            this.prodSend = JSON.stringify(this.correo);
        this.prodSend = this.prodSend.split(/]|{|}|:|/g).join('');
        this.prodSend = this.prodSend.split('"email"').join('');
        this.prodSend = this.prodSend.split("[").join('');
        this.SE(this.prodSend);
        } catch (e) { }
    }

    async getBoard(lote) {
        //this.formb.value.tmaquina = this.idmaquina;
        try {
            let resp = await this.produccionService.getBoard(this.formb.value, this.auth.token).toPromise();
            if (resp.code == 200) {
                this.board = resp.response;
                this.estado_email = this.board[0].estado_email;
                this.estado_desc = this.board[0].estado_desc;
                this.idmaquina = this.board[0].idmaquina;
                this.paro = this.board[0].duracion_ult_paro.substring(0, this.board[0].duracion_ult_paro.length - 3);
                if (this.board[0].distan <= this.board[0].prodesp) {
                    this.verde = true;
                    this.rojo = false;
                    this.cdRef.detectChanges();
                } else if (this.board[0].distan > this.board[0].prodesp) {
                    this.verde = false;
                    this.rojo = true;
                    this.cdRef.detectChanges();
                } else {
                    this.verde = true;
                    this.rojo = false;
                }
                if (lote == 0) {
                    this.vel = false;
                    this.desc = false;
                } else {
                    this.velocidad = this.board[0].veloc;
                    //this.SE(); 
                    this.getCorreos();
                    this.activo = this.board[0].statprodlinea;
                    if (this.activo == 1) {
                        this.actv = true;
                    } else if (this.activo < 1 || this.activo > 1) {
                        this.actv = false;
                        this.Desc();
                        if (this.tid > 0) {
                            this.desc = true
                            if (this.desc == true) {
                                this.vel = false
                            }
                        } else {
                            this.desc = false;
                            if (this.velocidad == 0) {
                                this.vel = true;
                            } else {
                                this.vel = false;
                            }
                        }
                    }
                }
                this.cdRef.detectChanges();
            }
        } catch (e) { }
    }


    async getBoard2() {
       // this.formb.value.tmaquina = this.idmaquina;
        try {
            let resp = await this.produccionService.getBoard(this.formb.value, this.auth.token).toPromise();
            if (resp.code == 200) {

                this.board2 = resp.response;
                setInterval(() => {
                    this.getLoteActivo();
                }, 5000);

            }
        } catch (e) { }
    }


}
