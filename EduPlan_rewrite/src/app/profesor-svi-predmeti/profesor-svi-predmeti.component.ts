import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../_services/profesori.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';

@Component({
  selector: 'app-profesor-svi-predmeti',
  templateUrl: './profesor-svi-predmeti.component.html',
  styleUrls: ['./profesor-svi-predmeti.component.css']
})
export class ProfesorSviPredmetiComponent implements OnInit {
  ProfesorPredmeti: any;

  constructor(private profesorService: ProfesorService, private appVariables: AppVariables) { }

  ngOnInit() {
    const params = {
      PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
      PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik
    };

    this.profesorService.getNastavnikPredmeti(params).subscribe((data) => {
      console.log(data);
      this.ProfesorPredmeti = data;
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
