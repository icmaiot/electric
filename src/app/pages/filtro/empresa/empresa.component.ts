import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@app/services/auth.service';
import { EmpresaService } from '@app/services/empresa.service';
import { RelcompService } from '@app/services/relcomp.service';
import { ContempService } from '@app/services/contemp.service';
import { WoService } from '@app/services/wo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Empresa } from '../../../models/empresa';
import { Wo } from '../../../models/wo';
import { Contemp } from '../../../models/contemp';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  form: FormGroup;
  formc: FormGroup;
  empresa: Empresa[];
  empresat: Empresa[];
  contemp: Contemp[];
  wo: Wo[];
  total: number = 0;
  listaRelcomp: [];
  activoemp = '1';
  status: string;
  s: number = 1;
  statusr: any[] = [
    { activoem: 0, statuse: 'Todos' },
    { activoem: 1, statuse: 'Activo' },
    { activoem: 2, statuse: 'Inactivo' },
  ];

  listNav = [
    { "name": "Clientes y proveedores", "router": "/empresa" },
  ]

  constructor(
    private empresaService: EmpresaService,
    private woService: WoService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private auth: AuthService,
    private relcompService: RelcompService,
    private activatedRoute: ActivatedRoute,
    private contempService: ContempService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getEmpresa();
    this.StatusEmp('');
    this.cdref.detectChanges();
  }

  StatusEmp(activoem) {
    if (activoem == '0') {
      this.activoemp = '';
      this.getEmpresa();
    }
    else if (activoem == '1') {
      this.activoemp = '1';
      this.getEmpresa();

    } else if (activoem == '2') {
      this.activoemp = '0';
      this.getEmpresa();
    }
  }


  async getEmpresa() {
    try {
      let resp = await this.empresaService.getEmpresa2(this.activoemp, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.empresa = resp.response;
        this.cdref.detectChanges();
        this.total = this.empresa.length;
      }
    } catch (e) {
    }
  }

  add() {
    this.router.navigate(['/empresa/add']);
    this.getEmpresa();
  }

  async delete(id: string) {
    try {
      let respc = await this.empresaService.getEmpresa(id, this.auth.token).toPromise();
      if (respc.code == 200) {
        this.empresat = respc.response;
        this.total = this.empresat.length;
      }
      let resp = await this.woService.getE(id, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.wo = resp.response;

        if (this.wo.length >= 1) {
          Swal.fire({
            title: '¿Estas seguro?', text: "La empresa no puede ser eliminada porque tiene registradas ordenes de manufactura, su estado se cambiarà a Inactiva",
            type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
          }).then((result) => {
            if (result.value) {
              this.empresat[0].activoemp = 0;
              this.empresaService.update(this.empresat[0], this.auth.token).subscribe(res => {
                if (res.code == 200) {
                  Swal.fire('Actualizado', 'La Empresa ha sido cambiada a Inactiva', 'success');
                  this.getEmpresa();
                } else {
                  Swal.fire('Error', 'Error al cambiar el estado', 'error');
                }
              });
            }
          });
        } else {
          Swal.fire({
            title: '¿Estas seguro?', text: "Desea eliminar la empresa",
            type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
          }).then((result2) => {
            if (result2.value) {
              this.empresaService.delete(id, this.auth.token).subscribe(res => {
                if (res.code == 200) {
                  Swal.fire('Eliminado', 'La Empresa ha sido eliminada correctamente', 'success');
                  this.getEmpresa();
                } else {
                  Swal.fire('Error', 'Error al eliminar la empresa', 'error');
                }
              });
              this.contempService.deleteall(id, this.auth.token).subscribe(res => {
                if (res.code == 200) {
                } else {
                }
              });
            }
          });
        }
      }
    } catch (e) {
    }
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
