import { WebServiceService } from '@app/services/web-service.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";

@Component({
  selector: 'app-pboard',
  templateUrl: './pboard.component.html',
  styleUrls: ['./pboard.component.css']
})
export class PBoardComponent implements OnInit {
  intervalUpdate: any = null;
  velAct: string = "1000";
  distProd: string = "1000";
  skuActual: string = "0";
  metros_prog: string = "0";
  skuSig: string = "0";
  bandImg: boolean = true;


  constructor(private webService: WebServiceService) {
    setInterval(() => {
      this.showData();
    }, 1000);
  }

  ngOnInit(): void {
    this.showData();
  }

  private ngOnDestroy(): void {
    clearInterval(this.intervalUpdate);
  }

  getData(): Observable<any> {
    return this.webService.getEncoderData();
  }

  showData() {
    this.getData().subscribe(
      (data) => {
        this.velAct = data[0].velocidad;
        this.distProd = data[0].distancia;
      },
      (error) => {
      }
    );
  }

}
