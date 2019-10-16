import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../_services/profesori.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';

@Component({
  selector: 'app-profesor-osobni-podaci',
  templateUrl: './profesor-osobni-podaci.component.html',
  styleUrls: ['./profesor-osobni-podaci.component.css']
})
export class ProfesorOsobniPodaciComponent implements OnInit {
  nastavnikPodaci = {} as any;

  constructor(
    private nastavnikService: ProfesorService,
    private appVariables: AppVariables
    ) { }

  ngOnInit() {
    const params = {
      PkNastavnik: this.appVariables.PkNastavnikSuradnik
    };

    this.nastavnikService.getNastavnik(params).subscribe((data) => {
      this.nastavnikPodaci = data[0];
      this.formatAllDates();
    },

      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }, () => { });
  }

  formatAllDates() {
    this.nastavnikPodaci.DatumRodenja ? this.nastavnikPodaci.DatumRodenja = new Date(this.nastavnikPodaci.DatumRodenja) :  this.nastavnikPodaci.DatumRodenja = null;
    this.nastavnikPodaci.DatumZaposlenjaUVU ? this.nastavnikPodaci.DatumZaposlenjaUVU = new Date(this.nastavnikPodaci.DatumZaposlenjaUVU) :  this.nastavnikPodaci.DatumZaposlenjaUVU = null;

  }
}


