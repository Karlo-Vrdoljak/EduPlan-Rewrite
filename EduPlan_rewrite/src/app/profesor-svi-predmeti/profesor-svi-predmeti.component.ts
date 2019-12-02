/************************************************************************************************************************************************************
 ** File
 ** Name      :      profesor-svi-predmeti
 ** DESC      :      Izlist svih predmeta vezanih za logiranog profesora grupirani po pkPredmeta 
                     (isti predmet može biti na više studija, pa se vodi kao drukčiji predmet),
                     omogučena navigacija do odabranog predmeta na studiju
 **
 ** Author    :      Filip Bikić
 ** Date      :      29.11.2019.
 *************************************************************************************************************************************************************
 ** Change history :
 *************************************************************************************************************************************************************
 ** Date:                   Author:                    Description :
 **------------             ------------- -------------------------------------
 **
 *************************************************************************************************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../_services/profesori.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';
import { LanguageHandler } from '../app.languageHandler'


@Component({
  selector: 'app-profesor-svi-predmeti',
  templateUrl: './profesor-svi-predmeti.component.html',
  styleUrls: ['./profesor-svi-predmeti.component.css']
})
export class ProfesorSviPredmetiComponent implements OnInit { //U proceduri koju koristi su hardkodirane neke vrijednosti
  ProfesorPredmeti: any;
  rowGroupMetadata: any = {};
  selectedLang: string;

  constructor ( private profesorService: ProfesorService 
               ,private appVariables: AppVariables
               ,private langHandler: LanguageHandler) { }

  ngOnInit() {
    const params = {
      PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
      PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik
    };

    this.selectedLang = this.langHandler.getCurrentLanguage();

    this.profesorService.getNastavnikPredmeti(params).subscribe((data) => {
      this.ProfesorPredmeti = data;
      this.updateRowGroupMetaData();
    },

      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }, () => { });

  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.ProfesorPredmeti) {
      for (let i = 0; i < this.ProfesorPredmeti.length; i++) {
        let rowData = this.ProfesorPredmeti[i];
        let predmet = rowData.PkPredmet;
        if (i === 0) {
          this.rowGroupMetadata[predmet] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.ProfesorPredmeti[i - 1];
          let previousRowGroup = previousRowData.PkPredmet;
          if (predmet === previousRowGroup) {
            this.rowGroupMetadata[predmet].size++;
            if (this.rowGroupMetadata[predmet].size <= 2){
              this.rowGroupMetadata[predmet].naslov = ''; // zbog undefined kad concata
            }  
            this.rowGroupMetadata[predmet].naslov += ', ' + rowData.StudijKratica;
      
          }
          else
            this.rowGroupMetadata[predmet] = { index: i, size: 1 };
        }
      }
    }
  }
}
