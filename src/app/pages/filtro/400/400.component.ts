import { Component, OnInit } from '@angular/core';
import { ProduccionService } from '@app/services/produccion.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-400',
  templateUrl: './400.component.html',
  styleUrls: ['./400.component.scss']
})
export class ProduccionComponent implements OnInit {

  produccion: [];
  form: FormGroup;
  total: number;
  intervalTimer = interval(15000);
  intervalSubs;

  constructor(private produccionService: ProduccionService,
    private dialog: MatDialog, private spinner: NgxSpinnerService,
    private auth: AuthService, private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  
    var doo = new Date();
    let dates = new Date(doo.getTime() + Math.abs(doo.getTimezoneOffset() - 60000))
    let date = new Date();
    console.log(dates)
    console.log(date)
  }

  async getProductos(searchValue: string) {
    try {
      let resp = await this.produccionService.get(searchValue, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.produccion = resp.response;
        console.log(this.produccion)
        this.total = this.produccion.length;
        this.intervalSubs = this.intervalTimer.subscribe(() => this.getProductos(''));
      }
    } catch (e) {
    }
  }

  unsubscribeInterval() {
    if (this.intervalSubs) {
      this.intervalSubs.unsubscribe();
    }
  }

  onSearchChange(searchValue: string) {
    this.getProductos(searchValue);
  }
}
