import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../_services/profesori.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';
import { OpciService } from './../_services/opci.service';


@Component({
  selector: 'app-profesor-osobni-podaci',
  templateUrl: './profesor-osobni-podaci.component.html',
  styleUrls: ['./profesor-osobni-podaci.component.css']
})
export class ProfesorOsobniPodaciComponent implements OnInit {
  nastavnikPodaci: any;

  constructor(
    private nastavnikService: ProfesorService,
    private appVariables: AppVariables,
    private opciService: OpciService,
    ) { }

  ngOnInit() {
    const params = {
      PkNastavnik: this.appVariables.PkNastavnikSuradnik
    };

    this.nastavnikService.getNastavnik(params).subscribe((data) => {
      this.nastavnikPodaci =this.opciService.formatDates(data)[0];
    },

      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }, () => { });
  }

}


