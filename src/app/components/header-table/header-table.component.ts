import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CatalogoFuncionesComponent } from '@app/pages/filtro/catalogo-funciones/catalogo-funciones.component';

@Component({
  selector: 'app-header-table',
  templateUrl: './header-table.component.html',
  styleUrls: ['./header-table.component.scss']
})
export class HeaderTableComponent implements OnInit {
  @Input() public titleHeader;
  @Input() public titleSelect;
  @Input() public renderSelect;
  @Input() public renderButton;
  @Input() public search;
  @Input() public funcionButton;
  @Input() public statuswosubButton;
  @Input() public listNav;
  @Input() public contemp;
  @Output() buttonOutput = new EventEmitter();
  @Output() searchOutput = new EventEmitter();
  @Output() funcionesOutput = new EventEmitter();
  @Output() statuswosubOutput = new EventEmitter();
  @Output() contempOutput = new EventEmitter();

  constructor( private dialog: MatDialog) { }

  ngOnInit() {
  }

  onSearchChange(searchValue: string){
    this.searchOutput.emit(searchValue);
  }

  onClickButon(){
    this.buttonOutput.emit();
  }
  onClickFunciones(){
    this.funcionesOutput.emit();
  }

  onClickStatuswosub() {
    this.statuswosubOutput.emit();
  }

  onClickContemp() {
    this.contempOutput.emit();
  }
  openFunciones(){
    const dialogRef = this.dialog.open(CatalogoFuncionesComponent, {
      width: '40rem',
      data: {
        title: 'Catalogo de funciones autorizadas en el sistema',
        btnText: 'Guardar',
        alertSuccesText: 'Funcion agregada correctamente',
        alertErrorText: "No se puede agregar función",
      }
    });    
  }

}
