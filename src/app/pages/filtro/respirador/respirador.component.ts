import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { RespiradorService } from '@app/services/respirador.service';
import { AuthService } from '@app/services/auth.service';
import { interval } from 'rxjs';

export interface Registro {
  cpresion: string,
  ctexalacion: string,
  ctinalacion: string,
  cbpm: number,
  cflujo: number,
  crelacion: number,
  eencendido: number,
  eflujo: string,
  eoxigeno: string,
  eoximetro: number,
  epresion: string,
  eritmoc: number,
  ns: string,
  eerror: number
}

@Component({
  selector: 'app-respirador',
  templateUrl: './respirador.component.html',
  styleUrls: ['./respirador.component.scss']
})
export class RespiradorComponent implements OnInit, OnDestroy {
  listInfo: Registro[];
  dataSource;
  listNav = [
    { "name": "Respiradores", "router": "/respirador" },
  ]
  intervalTimer = interval(1300);
  intervalTable;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private auth: AuthService,
    private respiradorService: RespiradorService) {
  }

  ngOnInit() {
    this.getInfoRespirador();
  }

  async getInfoRespirador() {
    try {
      this.unsubscribeInterval();
      let resp = await this.respiradorService.getInfoRespirador('0', this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listInfo = resp.respirador;
        this.dataSource = new MatTableDataSource<Registro>(this.listInfo);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.intervalTable = this.intervalTimer.subscribe(() => this.getInfoRespirador());
      }
    } catch (e) {
    }
  }

  unsubscribeInterval() {
    if (this.intervalTable) {
      this.intervalTable.unsubscribe();
    }
  }

  ngOnDestroy() {
    //clearInterval(this.intervalTable);
    this.intervalTable.unsubscribe();
  }

}
