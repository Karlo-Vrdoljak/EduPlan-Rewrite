import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../_services/profesori.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';

@Component({
  selector: 'app-profesor-svi-predmeti',
  templateUrl: './profesor-svi-predmeti.component.html',
  styleUrls: ['./profesor-svi-predmeti.component.css']
})
export class ProfesorSviPredmetiComponent implements OnInit { //U proceduri koju koristi su hardkodirane neke vrijednosti
  ProfesorPredmeti: any;
  rowGroupMetadata: any = {};

  constructor(private profesorService: ProfesorService, private appVariables: AppVariables) { }

  ngOnInit() {
    const params = {
      PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
      PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik
    };

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
            this.rowGroupMetadata[predmet].naslov = ''; // zbog undefined kad concata
            this.rowGroupMetadata[predmet].naslov += ', ' + rowData.StudijKratica;
      
          }
          else
            this.rowGroupMetadata[predmet] = { index: i, size: 1 };
        }
      }
    }
  }
}
