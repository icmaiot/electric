import { Component, OnInit, Inject } from '@angular/core';
import { AreaService } from '@app/services/area.service';
import { CiaService } from '@app/services/cia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area } from '@app/models/area';
import { Cia } from '@app/models/cia';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { Dialog } from '@app/classes/Dialog';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-nuevo-area',
  templateUrl: './nuevo-area.component.html',
  styleUrls: ['./nuevo-area.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NuevoAreaComponent extends Dialog implements OnInit {

  area: Area = new Area();
  areaForm: FormGroup;
  submitted = false;
  cias: Cia[];
  token;

  constructor(
    private ciaService: CiaService, private areaService: AreaService,
    private formBuilder: FormBuilder, private auth: AuthService,
    public dialogRef: MatDialogRef<NuevoAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    super();
  }

  ngOnInit() {
    this.areaForm = this.formBuilder.group({
      area: ['', Validators.required]
    });
    this.token = this.auth.token;
    this.area.idcia = 1;
    this.loadModalTexts();
  }

  loadModalTexts() {
    const { title, btnText, alertErrorText, alertSuccesText, modalMode, _area } = this.data;
    this.title = title;
    this.btnText = btnText;
    this.alertSuccesText = alertSuccesText;
    this.alertErrorText = alertErrorText;
    this.modalMode = modalMode;

    if (_area) {
      const { idarea, area } = _area;
      this.area.idarea = idarea;
      this.area.area = area;
    }
  }

  get f() { return this.areaForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.areaForm.invalid) {
      return;
    } else {
      this.guardar();
    }
  }

  async guardar() {
    try {
      let response;
      switch (this.modalMode) {
        case 'create': response = await this.areaService.create(this.area, this.token).toPromise();
          break;
        case 'edit': response = await this.areaService.update(this.area, this.token).toPromise();
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
      this.showAlert(this.alertErrorText, false);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

}
