import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  
  exportAsExcel(): void {
    /* table id is passed over here */
    let fileName = 'ProducciónHistorico.xlsx';
    let wb = XLSX.utils.book_new();
    let element = document.getElementById('ex');
    let element2 = document.getElementById('filtro_tm');
    let element3 = document.getElementById('filtro_scrap');
    let element4 = document.getElementById('filtro_defectos');
    const ws : XLSX.WorkSheet =  XLSX.utils.table_to_sheet(element);
    const ws2 : XLSX.WorkSheet =  XLSX.utils.table_to_sheet(element2);
    const ws3 : XLSX.WorkSheet = XLSX.utils.table_to_sheet(element3);
    const ws4 : XLSX.WorkSheet = XLSX.utils.table_to_sheet(element4);
       /* generate workbook and add the worksheet */
       XLSX.utils.book_append_sheet(wb, ws, 'Producción Historico');
       XLSX.utils.book_append_sheet(wb, ws2, 'Tiempos Muertos');
       XLSX.utils.book_append_sheet(wb, ws3, 'Scrap');
       XLSX.utils.book_append_sheet(wb, ws4, 'Defectos');
       /* save to file */
       XLSX.writeFile(wb, fileName);
  }



  exportAsExcelFile(idlote, PH, TMP, PZ, SC): void {
    /* table id is passed over here */
    let fileName = 'Reporte del Lote '+idlote+ '.xlsx';

 /*   var Heading = [
      ["Lote", "Distancia", "Velocidad", "Fecha", "Codigo"  ]
    ];
    var Heading2 = [
      ["Id", "Duración de Paro", "Lote", "Informacion", "Paro Final", "Paro Inicial", "Evento", "Sub-Causa","Event", "Descripción de Falla"  ]
    ];
    var Heading3 = [
      ["Id", "Cantidad", "Lote", "Fecha", "Codigo"  ]
    ];
    var Heading4 = [
      ["Lote", "Distancia", "Velocidad", "Fecha", "Codigo"  ]
    ];

    let wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    const ws4: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

     XLSX.utils.sheet_add_aoa(ws, Heading);
     XLSX.utils.sheet_add_aoa(ws2, Heading2);
     XLSX.utils.sheet_add_aoa(ws3, Heading3);
     XLSX.utils.sheet_add_aoa(ws4, Heading4);

     XLSX.utils.sheet_add_json(ws, PH, { origin: 'A2', skipHeader: true });
     XLSX.utils.sheet_add_json(ws2, TMP, { origin: 'A2', skipHeader: true });
     XLSX.utils.sheet_add_json(ws3, PZ, { origin: 'A2', skipHeader: true });
     XLSX.utils.sheet_add_json(ws4, SC, { origin: 'A2', skipHeader: true });
 */
   // const ws: XLSX.WorkSheet = XLSX.utils.table_to_book(element);
    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
     let wb = XLSX.utils.book_new();
     let element = document.getElementById('excel');
     let element2 = document.getElementById('excel2');
     let element3 = document.getElementById('excel3');
     let element4 = document.getElementById('excel4');
     const ws : XLSX.WorkSheet =  XLSX.utils.table_to_sheet(element);
     const ws2 : XLSX.WorkSheet =  XLSX.utils.table_to_sheet(element2);
     const ws3 : XLSX.WorkSheet = XLSX.utils.table_to_sheet(element3);
     const ws4 : XLSX.WorkSheet = XLSX.utils.table_to_sheet(element4);
     
   // let ws = XLSX.utils.json_to_sheet(PH)
   // const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(TMP);
   // const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(PZ);
   // const ws4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(SC);

    /* generate workbook and add the worksheet */
    XLSX.utils.book_append_sheet(wb, ws, 'Producción Historico');
    XLSX.utils.book_append_sheet(wb, ws2, 'Tiempos Muertos');
    XLSX.utils.book_append_sheet(wb, ws3, 'Defectos');
    XLSX.utils.book_append_sheet(wb, ws4, 'Scrap');



    /* save to file */
    XLSX.writeFile(wb, fileName);

  }
}