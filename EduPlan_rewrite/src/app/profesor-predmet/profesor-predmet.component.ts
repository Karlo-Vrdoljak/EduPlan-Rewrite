import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AppVariables } from '../_interfaces/_configAppVariables';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../_services/profesori.service';

@Component({
  selector: 'app-profesor-predmet',
  templateUrl: './profesor-predmet.component.html',
  styleUrls: ['./profesor-predmet.component.css']
})
export class ProfesorPredmetComponent implements OnInit {
  predmetOsnovniPodaci: any;
  studentiNaPredmetu: any;
  cols: any[];

  constructor(private route: ActivatedRoute, private profesorService: ProfesorService, private appVariable: AppVariables) { }

  ngOnInit() {

    const params = {
      pkPredmet: this.route.snapshot.paramMap.get("pkPredmet"),
      pkStudijskaGodina: this.appVariable.PkSkolskaGodina
    };

    // Poziv servisa za dohvacanje osnovnih podataka o predmetu
    this.profesorService.getPredmetOsnovniPodaci().subscribe((data) => {
      this.predmetOsnovniPodaci = data[0];
      this.formatAllDates();
    },

      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }, () => { });

    // Poziv servisa za dohvacanje svih studenata koji slušaju zadani predmet
    this.profesorService.getPredmetStudenti().subscribe((data) => {
      this.studentiNaPredmetu = data;    
      this.cols = [
        {
            field: "ime",
            header: "Ime"
        },
        {
            field: "prezime",
            header: "Prezime"
        },
        {
            field: "studijNaziv",
            header: "Naziv studija"
        },
        {
            field: "semestar",
            header: "Semestar"
        },
        {
            field: "grupaZaNastavu",
            header: "Grupa za nastavu"
        },
        {
            field: "studijskaGodina",
            header: "Studijska godina"
        },
        {
            field: "osloboden",
            header:"Oslobođen"
        },
        {
            field: "polozen",
            header: "Položen"
        },
        {
          field: "ocjena",
          header: "Ocjena"
      },
      {
        field: "ocjenjivac",
        header: "Ocjenjivač"
      }];
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
    this.predmetOsnovniPodaci.pocetakTurnusa ? this.predmetOsnovniPodaci.pocetakTurnusa = new Date(this.predmetOsnovniPodaci.pocetakTurnusa) : this.predmetOsnovniPodaci.pocetakTurnusa = null;
    this.predmetOsnovniPodaci.krajTurnusa ? this.predmetOsnovniPodaci.krajTurnusa = new Date(this.predmetOsnovniPodaci.krajTurnusa) : this.predmetOsnovniPodaci.krajTurnusa = null;

  }

  isBoolean(val) {
    if (typeof val === "number") {
        return false;
    }
    return typeof val === "boolean";
}

}
