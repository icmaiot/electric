import { Component, OnInit, NgZone } from '@angular/core';
import { GraficaMatsService } from '@app/services/grafica-mats.service';
import { AuthService } from '@app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { element } from 'protractor';
import { getTreeMultipleDefaultNodeDefsError } from '@angular/cdk/tree';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-grafico-mats',
  templateUrl: './grafico-mats.component.html',
  styleUrls: ['./grafico-mats.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GraficoMatsComponent  implements OnInit {

  // Varibales
  form: FormGroup;
  form2: FormGroup; 
  submitted = false;
  submitted2 = false;
  r1;
  r2;
  maquina;
  causa;
  inft;
  des;
  ta;
  token;
  mycall /*= {folio: am4core.string, codigo: am4core.string, descripcion: am4core.string, tiempo:am4core.number, cantidad:am4core.number } */;
  datadb: [];
  opt: [];
  area: "Contrac" ; 
  private chart: am4charts.XYChart;
  private charts: am4charts.XYChart;

  constructor(
    private zone: NgZone,
    private grafico_matsService: GraficaMatsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      r1: ['', Validators.required],
      r2: ['', Validators.required],
      maquina: ['', Validators.required],
    });

    this.form2 = this.formBuilder.group({
      causa:['',Validators.required],
    });
    
    this.token = this.auth.token;
    this.getGraficaMats();
    this.getSelect();
  }

  async getGraficaMats() {
      try {
        let res = await this.grafico_matsService.get( this.auth.token ).toPromise();
        if (res.code = 200) {
          this.datadb = res.response;
         /* console.log(this.datadb)*/
        }
      } catch(error){
      }
  }

  async getSelect(){
    try{
      let res = await this.grafico_matsService.getMaq( this.auth.token ).toPromise();
      if(res.code = 200){
        this.opt = res.response;
      }
    } catch (error){
    }
  }

  get efe() { return this.form2.controls; }

  onSubmits2(){
    this.submitted2 = true;
    if( this.form2.invalid){
      return;
    } else {
      this.otp();
    }
  }

  async otp(){
    try{
      let response = await this.grafico_matsService.getCausa(this.form2.value.causa, this.form.value.maquina, this.form.value.r1, this.form.value.r2, this.auth.token).toPromise();
      if( response.code = 200 ){
        this.inft = response.response;
      }
    }catch(error){
    }
  }

  ///CAlL 
  get f() { return this.form.controls; }

  onSubmits() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.call();
      /*console.log(this.form);*/
    }
  }

  async call(){   
    /*console.log(, this.form.value.r1, this.form.value.r2);*/
    //swal.fire
    try{
      let response = await this.grafico_matsService.getConsul(this.form.value.maquina, this.form.value.r1, this.form.value.r2,  this.auth.token).toPromise();
      if (response.code = 200) {
        this.mycall = response.response;
        /*console.log(this.mycall);*/
       /* for(let i=0; i < this.mycall.length; i++){
          console.log(this.mycall[i]["descripcion"]);

          
        }
        
        /*this.mycall.forEach(object => {
          console.log(object.descripcion);
        });*/
        //*console.log(this.mycall[2]);
        //*console.log(this.mycall[3]);



/// grafico timer
        let chart = am4core.create("chartdiv", am4charts.XYChart);
    
        let titulo = chart.titles.create();
        titulo.text = "[bold, font-size: 25px]Grafico Tiempo[/]";

        chart.cursor = new am4charts.XYCursor();

        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "descripcion";
        categoryAxis.title.text = "[bold, font-size: 25px]Alarma[/]"
        categoryAxis.renderer.minGridDistance = 1;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;
        
        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.title.text = "[bold, font-size: 20px]Minutos[/]"
        
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "descripcion";
        series.dataFields.valueX = "tiempo";
        series.tooltipText = "{valueX.value}"
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusBottomRight = 5;
        series.columns.template.column.cornerRadiusTopRight = 5;

        let labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.horizontalCenter = "left";
        labelBullet.label.dx = 10;
        labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
        labelBullet.locationX = 1;
        
        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add("fill", function(fill, target){
          return chart.colors.getIndex(target.dataItem.index);
        });

        categoryAxis.sortBySeries = series;

        ///LOLOGRO EL HIJO DE PERRA LO LOGRO 
        chart.data = this.mycall
 //// grafico timer      

 /// grafico cantidad
 let charts = am4core.create("chartdivcantidad", am4charts.XYChart);
 
 let titulos = charts.titles.create();
 /// para modificar el texto css se agrega dentro del mismo y setrabaja igual....
 titulos.text = "[bold, font-size: 25px]Grafico Cantidad[/]";

 charts.cursor = new am4charts.XYCursor();
    
 let categoryAxiss = charts.yAxes.push(new am4charts.CategoryAxis());
 categoryAxiss.renderer.grid.template.location = 0;
 categoryAxiss.dataFields.category = "descripcion";
 categoryAxiss.title.text = "[bold, font-size: 25px]Alarma[/]"
 categoryAxiss.renderer.minGridDistance = 1;
 categoryAxiss.renderer.inversed = true;
 categoryAxiss.renderer.grid.template.disabled = true;
 
 let valueAxiss = charts.xAxes.push(new am4charts.ValueAxis());
 valueAxiss.min = 0;
 valueAxiss.title.text = "[bold, font-size: 20px]Numero de repeticiones[/]"
 
 let seriess = charts.series.push(new am4charts.ColumnSeries());
 seriess.dataFields.categoryY = "descripcion";
 seriess.dataFields.valueX = "cantidad";
 seriess.tooltipText = "{valueX.value}"
 seriess.columns.template.strokeOpacity = 0;
 seriess.columns.template.column.cornerRadiusBottomRight = 5;
 seriess.columns.template.column.cornerRadiusTopRight = 5;
 
 let labelBullets = seriess.bullets.push(new am4charts.LabelBullet())
 labelBullets.label.horizontalCenter = "left";
 labelBullets.label.dx = 10;
 labelBullets.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
 labelBullets.locationX = 1;
 
 // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
 seriess.columns.template.adapter.add("fill", function(fill, target){
   return charts.colors.getIndex(target.dataItem.index);
 });

 categoryAxiss.sortBySeries = seriess;

 ///LOLOGRO EL HIJO DE PERRA LO LOGRO 
 charts.data = this.mycall
//// grafico cantidad     

        /*chart.dataSource =  this.mycall.forEach(object =>
          {
         this.des = object.descripcion;
         //console.log(this.des);
          [  
          {
              ///"descripcion": descripcion,
              "descripcion": this.des,
              //"tiempo": this.ta,
            }, 
           
          ]});*/
        /*  console.log(this.mycall)
         for(let i=0; i<this.mycall.length; i++){
            console.log(this.mycall[i]["descripcion"])
            console.log(this.mycall[i]["tiempo"])
          chart.data = [
            {
              "descripcion": this.mycall[0]["descripcion"], 
              "tiempo": this.mycall[0]["tiempo"],
            },
            {
              "descripcion": this.mycall[1]["descripcion"], 
              "tiempo": this.mycall[1]["tiempo"],
            },
            {
              "descripcion": this.mycall[2]["descripcion"], 
              "tiempo": this.mycall[2]["tiempo"],
            },
            {
              "descripcion": this.mycall[0],
              "tiempo": this.mycall[0],
            }
          ];
          }
          /**/ 

          
      }
    }catch(error){
     // Swal.fire('Error', 'el rango no esta bien establecido', 'error');
    }    
  }
/// end call

  /*ngAfteerViewInit(){
    this.zone.runOutsideAngular(() => {
      let chartt = am4core.create("chartdiv", am4charts.XYChart);


      let title = chartt.titles.create();
      title.text = "Histórico de fallas" ;

      let label = chartt.plotContainer.createChild(am4core.Label);
      label.x = am4core.percent(97);
      label.y = am4core.percent(95);
      label.horizontalCenter = "right";
      label.verticalCenter = "middle";
      label.dx = -15;
      label.fontSize = 50;
    
      chartt.cursor = new am4charts.XYCursor();
      chartt.cursor.behavior = "zoomY";

      
    })
  }*/
 /* ngAfterViewInit(){

   
   
    this.mycall
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    
    
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "descripcion";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;
    
    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "descripcion";
    series.dataFields.valueX = "tiempo";
    series.tooltipText = "{valueX.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    
    let labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "left";
    labelBullet.label.dx = 10;
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.locationX = 1;
    
    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });

    
    this.mycall.forEach(object => {
      console.log(object.descripcion);
    });    
    
    categoryAxis.sortBySeries = series;
    chart.data = this.mycall.forEach( object => [
        {
          
          "descripcion": object.descripcion,
          "tiempo": 2255250000
        }, 
      ]);
    
  }*/

 
  showData(){
    return (this.r1 = true, this.r2= true, this.maquina = true);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular( () => {
      if(this.chart) {
        this.chart.dispose();
      }
    })
  }
  
}
