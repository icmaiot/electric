import { Component, OnInit } from '@angular/core';
import { MaquinaService } from '@app/services/maquina.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  urlImg:string;
  chartPage:number = 0;
  constructor(public auth: AuthService, private router: Router, private maquinaService: MaquinaService) { }

  ngOnInit() {
    this.urlImg = "../../../assets/img/LOGOMIDAS.png";
    this.maquinaService.chartPage.subscribe((page: number) => this.chartPage = page);
  }

  logout(): void {
    this.auth.logout();
    Swal.fire('Sesión cerrada!', '', 'success');
    this.router.navigate(['/login']);
  }
}
