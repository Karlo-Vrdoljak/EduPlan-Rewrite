import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../_services/profesori.service';
import { TranslateService } from "@ngx-translate/core";
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';
import { isString } from 'util';
import { DatePipe } from '@angular/common'

interface predmetNastavneCjelineDummy {
  imeNastavneCjeline: string;
  korisnikUnosa: string;
  datumUnosa: String;
  korisnik: string;
  zadnjaPromjena: String;
  koristiSe: boolean;
  //pkNastavneCjeline: number; sadrži, ali se on generira u bazi, valjda
}

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
  actionItemsNastavneCjeline: MenuItem[];
  actionItemsStudenti: MenuItem[];
  ukupanBrojStudenata: number;
  prolaznost: number;
  prosjekOcjena: string;
  brojOslobodenihStudenata: number;
  nastavneCjelineDodajNovuDialog: boolean = false;
  nastavneCjelineEditDialog: boolean = false;
  StudentEditDialog: boolean = false;
  selectedNastavniMaterijali: any = null;
  selectedStudent: any = null;
  rout: any = null;
  NastavneCjelineModel: predmetNastavneCjelineDummy = {
    imeNastavneCjeline: null,
    korisnikUnosa: null,
    datumUnosa: null,
    korisnik: null,
    zadnjaPromjena: null,
    koristiSe: false
  };


  constructor(private route: ActivatedRoute,
    private profesorService: ProfesorService,
    private translate: TranslateService,
    private messageService: MessageService,
    private datepipe: DatePipe) { }

  ngOnInit() {

    const params = {
      PkSkolskaGodinaStudijPredmetKatedra: this.route.snapshot.paramMap.get('PkSkolskaGodinaStudijPredmetKatedra'),
      PkPredmet: 7 //this.route.snapshot.paramMap.get('PkPredmet')      
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
        this.actionItemsSmall = [
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
              icon: 'fa fa-plus',
              command: () => this.nastavneCjelineDodajNovuDialog = true
            },
            {
              label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
              icon: 'fa fa-pencil',
              command: () => this.selectedNastavniMaterijali ? this.nastavneCjelineEditDialog = true : this.showErrorZapisNijeOdabran()
            },
            {
              label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS,
              icon: 'fa fa-trash-o',
              command: () => this.selectedNastavniMaterijali ?
                this.showSuccessDeleteNastavneCjeline() :
                this.showErrorZapisNijeOdabran()
            }]
          },
          { separator: true },
          {
            label: 'Quit', icon: 'pi pi-fw pi-times'
          }
        ];

        this.actionItemsNastavneCjeline = [
          {
            label: res.KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS,
            icon: 'fa fa-plus',
            command: () => this.nastavneCjelineDodajNovuDialog = true //otvaranje modalne forme za dodavanje novih cjelina
          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
            icon: 'fa fa-pencil',
            command: () => this.selectedNastavniMaterijali ? this.nastavneCjelineEditDialog = true : this.showErrorZapisNijeOdabran()  //Otvaranje modalne forme za editanje odabranog nastavnog materijala

          },
          {
            label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS,
            icon: 'fa fa-trash-o',
            command: () => this.selectedNastavniMaterijali ?
              this.showSuccessDeleteNastavneCjeline() :
              this.showErrorZapisNijeOdabran() //Dummy funkcija za brisanje odabranog nastavnog materijala
          }];

        this.actionItemsStudenti = [{
          label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
          icon: 'fa fa-pencil',
          command: () => this.selectedStudent ? this.StudentEditDialog = true : this.showErrorZapisNijeOdabran()
        }]
      })


    // Poziv servisa za dohvacanje osnovnih podataka o predmetu
    this.profesorService.getPredmetOsnovniPodaci(params).subscribe((data) => {
      this.predmetOsnovniPodaci = data[0];
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
        this.profesorService.getPredmetStudenti(params).subscribe((data) => {
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
        this.profesorService.getPredmetNastavneCjeline(params).subscribe((data) => {
          this.predmetNastavneCjeline = this.formatDates(data, this.datepipe);
  
          this.colsNastavneCjeline = [
            {
              header: res.KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA,
              field: "NazivPredmetNastavnaCjelina"
            },
            {
              header: res.SERVICES_GENERALSERVICE_KORISNIKUNOSA,
              field: "KorisnikUnos"
            },
            {
              header: res.SERVICES_GENERALSERVICE_DATUMUNOSA,
              field: "DatumUnosa"
            },
            {
              header: res.SERVICES_GENERALSERVICE_KORISNIK,
              field: "KorisnikPromjena"
            },
            {
              header: res.KATALOZI_STATUSUGOVORA_ZADNJAPROMJENA,
              field: "DatumZadnjePromjene"
            },
            {
              header: res.KATALOZI_PREDMETNASTAVNACJELINA_KORISTISE,
              field: "KoristiSeDaNe"
            }];

          this.colsNastavneCjelineSmall = [
            {
              header: res.KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA,
              field: "NazivPredmetNastavnaCjelina"
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

  formatDates(datum: any, datepipe: DatePipe) { 
    datum.forEach(element => {
      Object.keys(element).map(function (key) {
        if(!isNaN(Date.parse(element[key])) && isString(element[key])){
          element[key] = datepipe.transform(new Date(element[key]), 'MM/dd/yyyy')
        }
      });
    });
    return datum;
}

  setUkupanBrojStudenata() { //Računa kolko ima studenata na odabranom predmetu
    this.ukupanBrojStudenata = this.studentiNaPredmetu.length;
  }

  setPostotakProlaznosti() { //Računa postotak prolaznosti (uzima u obzir broj upisanih studenata i onih koji su položili)
    var rez = this.studentiNaPredmetu.reduce((accumulator, currentValue) => {
      return currentValue.polozen == 'true' ? accumulator + 1 : accumulator + 0
    }, 0)

    this.prolaznost = (rez / this.studentiNaPredmetu.length) * 100;
  }

  setProsjekOcjena() { //Računa prosjek ocjena svih studenata na dvi decimale
    var rez = this.studentiNaPredmetu.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.ocjena;
    }, 0)

    var prosjek = (rez / this.studentiNaPredmetu.length);
    this.prosjekOcjena = prosjek.toFixed(2);
  }

  setBrojOslobodenihStudenata() { //Računa broj studenata koji su oslobodeni polaganja predmeta
    this.brojOslobodenihStudenata = this.studentiNaPredmetu.reduce((accumulator, currentValue) => {
      return currentValue.osloboden == 'true' ? accumulator + 1 : accumulator + 0
    }, 0)
  }

  showErrorZapisNijeOdabran() { //Error poruka ukoliko se ide brisati ili editati bez odabira rowa
    this.translate.get([
      "PROFESORPREDMET_ERRORMESSAGE",
      "PROFESORPREDMET_ZAPISIJEODABRAN"
    ]).subscribe(res => {
      this.messageService.add({ severity: 'error', summary: res.PROFESORPREDMET_ERRORMESSAGE, detail: res.PROFESORPREDMET_ZAPISIJEODABRAN });
    })
  }

  showSuccessDeleteNastavneCjeline() { //Success poruka ukoliko se brisanje uspješno izvršilo
    this.translate.get([
      "KATALOZI_BDNASTAVNIKSURADNIKPOVIJESNIPODACI_USPJESNOOBRISANO",
      "KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA"
    ]).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: res.KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA, detail: res.KATALOZI_BDNASTAVNIKSURADNIKPOVIJESNIPODACI_USPJESNOOBRISANO });
    })
  }

  showSuccessEdit() { //Success poruka ukoliko se editanje uspješno izvršilo
    this.translate.get([
      "NASTAVA_SKOLSKAGODINA_USPJESNOSPREMLJENI",
      "KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA"
    ]).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: res.KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA, detail: res.NASTAVA_SKOLSKAGODINA_USPJESNOSPREMLJENI });
    })
  }

  closeNastavneCjelineDodajNovuDialog() {
    this.nastavneCjelineDodajNovuDialog = false;
  }

  setNastavneCjelineModel() { //Sada treba ucinis post request s objektom NastavneCjelineModel
    this.NastavneCjelineModel.datumUnosa = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.NastavneCjelineModel.zadnjaPromjena = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.nastavneCjelineDodajNovuDialog = false;
    this.showSuccessEdit();
    this.NastavneCjelineModel = {
      imeNastavneCjeline: null,
      korisnikUnosa: null,
      datumUnosa: null,
      korisnik: null,
      zadnjaPromjena: null,
      koristiSe: false
    };
  }

  editNastavniMaterijali() { //triba ucinit put request za editanje podataka u bazi
    this.nastavneCjelineEditDialog = false;
    this.showSuccessEdit();
  }

  closeNastavneCjelineEditNovuDialog() {
    this.nastavneCjelineEditDialog = false;
  }

  editStudent() { //put request prema bazi, two-way binding nije dobar nacin rješavanja ovoga (vjerojatno)
    this.StudentEditDialog = false;
    this.showSuccessEdit();
  }


  closeStudentEditDialog() {
    this.StudentEditDialog = false;
  }

}