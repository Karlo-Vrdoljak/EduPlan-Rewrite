import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AppVariables } from '../_interfaces/_configAppVariables';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../_services/profesori.service';
import { TranslateService } from "@ngx-translate/core";
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-profesor-predmet',
  templateUrl: './profesor-predmet.component.html',
  styleUrls: ['./profesor-predmet.component.css']
})
export class ProfesorPredmetComponent implements OnInit {
  predmetOsnovniPodaci: any;
  studentiNaPredmetu: any;
  predmetNastavneCjeline: any;
  colsStudenti: any[];
  colsStudentiSmall: any[];
  colsNastavneCjeline: any[];
  colsNastavneCjelineSmall: any[];
  actionItemsSmall: MenuItem[];
  actionItemsOsnovniPodaciNastavneCjeline: MenuItem[];
  actionItemsStudenti: MenuItem[];
  ukupanBrojStudenata: number;
  prolaznost: number;
  prosjekOcjena: string;
  brojOslobodenihStudenata: number;


  constructor(private route: ActivatedRoute, private profesorService: ProfesorService, private appVariable: AppVariables, private translate: TranslateService) { }

  ngOnInit() {

    const params = {
      pkPredmet: this.route.snapshot.paramMap.get("pkPredmet"),
      pkStudijskaGodina: this.appVariable.PkSkolskaGodina
    };

    // prijevod i inicijalizacija za botune s crud operacijama
    this.translate
      .get([
        "VIEWS_KATALOZI_PREDMET_OSNOVNIPODACI",
        "VIEWS_KATALOZI_PREDMET_STUDENTI",
        "VIEWS_KATALOZI_PREDMET_NASTAVNECJELINE",
        "KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS",
        "NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS",
        "NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS"
      ]).subscribe(res => {
        this.actionItemsSmall = [{
          label: res.VIEWS_KATALOZI_PREDMET_OSNOVNIPODACI,
          items: [{
            label: res.KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS,
            icon: 'fa fa-plus'
          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
            icon: 'fa fa-pencil'
          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS,
            icon: 'fa fa-trash-o'
          }]
        },
        {
          label: res.VIEWS_KATALOZI_PREDMET_STUDENTI,
          items: [
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
            icon: 'fa fa-pencil'
          }]
        },
        {
          label: res.VIEWS_KATALOZI_PREDMET_NASTAVNECJELINE,
          items: [{
            label: res.KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS,
            icon: 'fa fa-plus'
          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
            icon: 'fa fa-pencil'
          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS,
            icon: 'fa fa-trash-o'
          }]
        },
        {separator:true},
        {
            label: 'Quit', icon: 'pi pi-fw pi-times'
        }];
        
        this.actionItemsOsnovniPodaciNastavneCjeline = [
          {
            label: res.KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS,
            icon: 'fa fa-plus'
          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
            icon: 'fa fa-pencil'
          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS,
            icon: 'fa fa-trash-o'
          }];

        this.actionItemsStudenti = [{
          label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
          icon: 'fa fa-pencil'     
        }]
      })


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
    this.translate
      .get([
        "VIEWS_APLIKACIJA_HOME_IME",
        "VIEWS_APLIKACIJA_HOME_PREZIME",
        "NASTAVA_BDSKOLSKAGODINASTUDIJI_NAZIVSTUDIJA",
        "VIEWS_KATALOZI_PREDMET_SEMESTAR",
        "VIEWS_GRUPEZANASTAVUDIALOG_GRUPAZANASTAVU",
        "VIEWS_KATALOZI_PREDMET_STUDIJSKAGODINA",
        "KATALOZI_NASTAVNIKSURADNIKPREDMETI_OSLOBODEN",
        "KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN",
        "KATALOZI_NASTAVNIKSURADNIKPREDMETI_OCJENA",
        "PREDMET_BDPREDMETSTUDENTI_OCJENJIVAC"
      ]).subscribe(res => {
        this.profesorService.getPredmetStudenti().subscribe((data) => {
          this.studentiNaPredmetu = data;
          this.setUkupanBrojStudenata();
          this.setPostotakProlaznosti();
          this.setProsjekOcjena();
          this.setBrojOslobodenihStudenata();

          this.colsStudenti = [
            {
              field: "ime",
              header: res.VIEWS_APLIKACIJA_HOME_IME
            },
            {
              field: "prezime",
              header: res.VIEWS_APLIKACIJA_HOME_PREZIME
            },
            {
              field: "studijNaziv",
              header: res.NASTAVA_BDSKOLSKAGODINASTUDIJI_NAZIVSTUDIJA
            },
            {
              field: "semestar",
              header: res.VIEWS_KATALOZI_PREDMET_SEMESTAR
            },
            {
              field: "grupaZaNastavu",
              header: res.VIEWS_GRUPEZANASTAVUDIALOG_GRUPAZANASTAVU
            },
            {
              field: "studijskaGodina",
              header: res.VIEWS_KATALOZI_PREDMET_STUDIJSKAGODINA
            },
            {
              field: "osloboden",
              header: res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_OSLOBODEN
            },
            {
              field: "polozen",
              header: res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN
            },
            {
              field: "ocjena",
              header: res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_OCJENA
            },
            {
              field: "ocjenjivac",
              header: res.PREDMET_BDPREDMETSTUDENTI_OCJENJIVAC
            }];

          this.colsStudentiSmall = [
            {
              field: "ime",
              header: res.VIEWS_APLIKACIJA_HOME_IME
            },
            {
              field: "prezime",
              header: res.VIEWS_APLIKACIJA_HOME_PREZIME
            }
          ];
        },

          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('Client-side error occured.');
            } else {
              console.log('Server-side error occured.');
            }
          }, () => { });
      })

    // Poziv servisa za dohvacanje nastavnih cjelina na predmetu
    this.translate
      .get([
        "KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA",
        "SERVICES_GENERALSERVICE_KORISNIKUNOSA",
        "SERVICES_GENERALSERVICE_KORISNIK",
        "SERVICES_GENERALSERVICE_DATUMUNOSA",
        "KATALOZI_STATUSUGOVORA_ZADNJAPROMJENA",
        "KATALOZI_PREDMETNASTAVNACJELINA_KORISTISE"
      ]).subscribe(res => {
        this.profesorService.getPredmetNastavneCjeline().subscribe((data) => {
          this.predmetNastavneCjeline = data;

          this.colsNastavneCjeline = [
            {
              header: res.KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA,
              field: "imeNastavneCjeline"
            },
            {
              header: res.SERVICES_GENERALSERVICE_KORISNIKUNOSA,
              field: "korisnikUnosa"
            },
            {
              header: res.SERVICES_GENERALSERVICE_DATUMUNOSA,
              field: "datumUnosa"
            },
            {
              header: res.SERVICES_GENERALSERVICE_KORISNIK,
              field: "korisnik"
            },
            {
              header: res.KATALOZI_STATUSUGOVORA_ZADNJAPROMJENA,
              field: "zadnjaPromjena"
            },
            {
              header: res.KATALOZI_PREDMETNASTAVNACJELINA_KORISTISE,
              field: "koristiSe"
            }];

          this.colsNastavneCjelineSmall = [
            {
              header: res.KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA,
              field: "imeNastavneCjeline"
            }];
        },

          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('Client-side error occured.');
            } else {
              console.log('Server-side error occured.');
            }
          }, () => { });
      })
  }

  formatAllDates() { //Triat ce prilagodit funkciju kada se dobiju stvarni podaci, ovo je vise podsjetik da ce bit potrebna
    this.predmetOsnovniPodaci.pocetakTurnusa ? this.predmetOsnovniPodaci.pocetakTurnusa = new Date(this.predmetOsnovniPodaci.pocetakTurnusa) : this.predmetOsnovniPodaci.pocetakTurnusa = null;
    this.predmetOsnovniPodaci.krajTurnusa ? this.predmetOsnovniPodaci.krajTurnusa = new Date(this.predmetOsnovniPodaci.krajTurnusa) : this.predmetOsnovniPodaci.krajTurnusa = null;

  }

  setUkupanBrojStudenata() { //Računa kolko ima studenata na odabranom predmetu
    this.ukupanBrojStudenata = this.studentiNaPredmetu.length;
  }

  setPostotakProlaznosti() { //Računa postotak prolaznosti (uzima u obzir broj upisanih studenata i onih koji su položili)
    var rez = this.studentiNaPredmetu.reduce((accumulator, currentValue) => {
      return currentValue.polozen == 'true' ? accumulator + 1 : accumulator + 0 }, 0)

    this.prolaznost = (rez / this.studentiNaPredmetu.length) * 100;
  }

  setProsjekOcjena() { //Računa prosjek ocjena svih studenata na dvi decimale
    var rez = this.studentiNaPredmetu.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.ocjena;
    },0)

    var prosjek = (rez / this.studentiNaPredmetu.length);
    this.prosjekOcjena = prosjek.toFixed(2);
  }

  setBrojOslobodenihStudenata() { //Računa broj studenata koji su oslobodeni polaganja predmeta
    this.brojOslobodenihStudenata = this.studentiNaPredmetu.reduce((accumulator, currentValue) => {
      return currentValue.osloboden == 'true' ? accumulator + 1 : accumulator + 0 }, 0)
  }
}
