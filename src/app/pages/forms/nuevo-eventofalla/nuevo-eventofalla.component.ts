import { Component, OnInit, Inject } from '@angular/core';
import { EventoRegistroService } from '@app/services/eventoregistro.service';
import { Evento_AsignacionService } from '@app/services/eventoasignacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-nuevo-eventofalla',
  templateUrl: './nuevo-eventofalla.component.html',
  styleUrls: ['./nuevo-eventofalla.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoEventoCausaComponent extends Dialog implements OnInit {

  form: FormGroup;
  submitted = false;
  number;
  listaevento: [];
  listafalla: [];
  token;
  idequipo;
  litafalla: [];

  constructor(
    private evento_registroService: EventoRegistroService,
    private evento_asignacionService: Evento_AsignacionService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NuevoEventoCausaComponent>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      codigo_falla: ['', Validators.required],
      descripcion_falla: ['', Validators.required],
    });
    this.token = this.auth.token;
    this.loadModalTexts();
    this.getEventoc();
    this.getEventoCatalago();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _eventoc, idevento, idequipo } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;
    this.number = idevento;
    //this.idequipo = idequipo;

    if (_eventoc) {
      const { id_falla, id_evento, codigo_falla, descripcion_falla} = _eventoc;

    this.form.patchValue({ id_falla, id_evento, codigo_falla, descripcion_falla });
    }
  }

  /* Llamar a todos los datos*/
  async getEventoc() {
    try {
      let resp = await this.evento_registroService.getEventoEquipo(this.number, this.idequipo,  this.auth.token).toPromise();
      if (resp.code == 200) {
        this.listaevento = resp.resp;
      //  console.log(this.listaevento)
      }
    } catch (e) {
    }
  }

  /* Llamar datos en especifico al evento*/
  async getEventoCatalago(){
    try {
      let resp = await this.evento_registroService.getEventoCatalago(this.number, this.auth.token).toPromise();
      if (resp.code == 200) {
        this.litafalla = resp.resp;
       // console.log(this.listafalla)
      }
    } catch (e){
    }
  }

   /*Eliminar fallas asignadas*/ 
   delete(_eventoc) {
    /*try {
      this.evento_registroService.delete(_eventoc, this.auth.token).subscribe(res =>{
        if (res.code == 200){
          Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
        }
        else {
          Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
        }
      });
    } catch (error) {
      Swal.fire('Error', 'Oh! a ocurrido un error. la opcion a eliminar esta en uso.', 'error')
    }
  }*/
    
    
    
    
    try{
      Swal.fire ({
        title: '¿Esta seguro de eliminar la opcion seleccionada?', text: "Advertencia: asegurece de que la opcion a eliminar no este en uso. En caso de estar usandola elimine la opcion donde se encuentra en uso",
        type: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33', confirmButtonText: 'Si!', cancelButtonText: 'Cancelar!'
      }).then((result) => {
          if(result.value){
            this.evento_registroService.delete(_eventoc,  this.auth.token).subscribe(res => {
            //  console.log(_eventoc);
               if (res.code == 200) {
                Swal.fire('Eliminado', 'La falla ha sido eliminada!', 'success');
                this.getEventoCatalago();
              }
              else {
                this.showAlert(this.alertErrorText, false);;
              } 
            });
          }
          Swal.fire('Error', 'Oh! a ocurrido un error. la opcion a eliminar esta en uso.', 'error');
      });
    
    } catch (error){
      Swal.fire('Error', 'Oh! a ocurrido un error. la opcion a eliminar esta en uso.', 'error');
    }
    


    /*this.evento_registroService.delete(_eventoc,  this.auth.token).subscribe(res => {
      console.log(_eventoc);
       if (res.code == 200) {
        Swal.fire('Eliminado', 'El registro ha sido borrado!', 'success');
        this.getEventoCatalago();
        
      }
      else {
        Swal.fire('Error', 'No fue posible borrar el registro!', 'error');
      } 
    });*/
  }

  /* Guardar */ 
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.form.value.id_falla;
      this.form.value.id_evento = this.number;
      //console.log(this.form.value)
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response = await this.evento_registroService.create(this.form.value, this.auth.token).toPromise();
      if (response.code = 200) {
        Swal.fire('Guardado', 'La nueva falla se agrego correctamente!', 'success');
        this.getEventoCatalago();
        this.submitted = false;
        this.form.reset({});
      }
      else {
        this.showAlert(this.alertErrorText, false);
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible guardar la falla!, codigo o descripcion ya existen', 'error');
    }
  }
 /* Guardar */

  closeModal() {
    this.dialogRef.close();
  }
}
