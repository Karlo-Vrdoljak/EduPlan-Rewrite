import { Component, OnInit } from '@angular/core';
import { osobniDokumenti } from '../_interfaces/osobniDokumenti';
import { OpciService } from './../_services/opci.service';
import { ProfesorService } from '../_services/profesori.service';
import { AppVariables } from './../_interfaces/_configAppVariables';
import { TranslateService } from "@ngx-translate/core";
import { HttpErrorResponse } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-profesor-osobni-dokumenti',
  templateUrl: './profesor-osobni-dokumenti.component.html',
  styleUrls: ['./profesor-osobni-dokumenti.component.css']
})
export class ProfesorOsobniDokumentiComponent implements OnInit {

  predmetOsobniDokumenti: any;
  osobniDokumentiModel: osobniDokumenti;
  osobniDokumentiUploadDialog: boolean = false;
  akademskeGodine: any;
  selectedOsobniDokumenti: any;
  selectedOsobniDokumentiIndex: number;
  colsOsobniDokumenti: any[];
  osobniDokumentiPlaceholder: string = '';
  myUploaderObservable: any;
  dodanaDatoteka: any;
  odabranaDatoteka: any;
  osobniDokumentiEditDialog: boolean = false;
  colsOsobniDokumentiSmall: any[];
  prikaziDatotekuOsobniDokumenti: boolean = false;
  actionItemsOsobniDokumenti: MenuItem[];


  constructor(
    private profesorService: ProfesorService,
    private opciService: OpciService,
    private appVariables: AppVariables,
    private translate: TranslateService,
    private messageService: MessageService) { }

  ngOnInit() {
    const params = {
      PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik
    };

    this.translate //translate i inicijalizacija botuna
      .get([
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_DODAJDATOTEKU",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_OBRISIDATOTEKU",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREUZMIDATOTEKU",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_UREDITENASTAVNEMATERIJALE",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREGLEDDOKUMENTA"
      ])
      .subscribe(res => {
        this.actionItemsOsobniDokumenti = [
          {
            label: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_DODAJDATOTEKU,
            icon: "fa fa-plus",
            command: () => this.openUploadOsobniDokumenti()
          },
          {
            label: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREUZMIDATOTEKU,
            icon: "fa fa-download",
            command: () => this.selectedOsobniDokumenti
              ? this.downloadOsobniDokumenti()
              : this.showErrorZapisNijeOdabran()
          },
          {
            label: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_OBRISIDATOTEKU,
            icon: "fa fa-trash-o",
            command: () => this.selectedOsobniDokumenti
              ? this.deleteOsobniDokumenti()
              : this.showErrorZapisNijeOdabran()
          },
          {
            label: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_UREDITENASTAVNEMATERIJALE,
            icon: "fa fa-pencil",
            command: () => this.selectedOsobniDokumenti
              ? this.openEditOsobniDokumenti()
              : this.showErrorZapisNijeOdabran()
          },
          {
            label: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREGLEDDOKUMENTA,
            icon: "fa fa-eye",
            command: () => this.selectedOsobniDokumenti
              ? this.openPreview()
              : this.showErrorZapisNijeOdabran()
          }
        ];
      })

    this.translate //translate i poziv servisa za dohvacanje svih osobnih dokumenata
      .get([
        "PREDMET_PREDMETMATERIJALI_OPIS",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_NAZIVDOKUMENTA",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_OZNAKADOKUMENTA",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_TIPDOKUMENTA",
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_VELICINA"
      ])
      .subscribe((res) => {
        this.profesorService.getOsobniDokumenti(params).subscribe(data => {
          this.predmetOsobniDokumenti = data;
          this.predmetOsobniDokumenti = this.predmetOsobniDokumenti.filter((e) => { return e.IzbrisanDaNe == 0 })

          for (let i = 0; i < this.predmetOsobniDokumenti.length; i++) {
            this.predmetOsobniDokumenti[i].imgSrc = this.opciService.extensionCellRenderer(this.predmetOsobniDokumenti[i].izvorniOriginalName ? this.predmetOsobniDokumenti[i].izvorniOriginalName : null);
            // this.predmetOsobniDokumenti[i].VidljivStudentimaDaNe = this.predmetOsobniDokumenti[i].VidljivStudentimaDaNe == 1 ? true : false;
            this.predmetOsobniDokumenti[i].NazivDokumenta = this.predmetOsobniDokumenti[i].originalname.split('.')[0];
            this.predmetOsobniDokumenti[i].size = (this.predmetOsobniDokumenti[i].size / 1000000).toFixed(2);
          }

          this.colsOsobniDokumenti = [
            {
              field: "OznakaDokumenta",
              header: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_OZNAKADOKUMENTA,
              // width: '20%'
            },
            {
              field: "NazivDokumenta",
              header: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_NAZIVDOKUMENTA,
              // width: '20%'
            },
            {
              field: "Opis",
              header: res.PREDMET_PREDMETMATERIJALI_OPIS,
              // width: '25%'
            },
            {
              field: "imgSrc",
              header: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_TIPDOKUMENTA,
              // width: '10%'
            },
            {
              field: "size",
              header: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_VELICINA,
              // width: '8%'
            }
          ];
        },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
          },
          () => { }
        );
      });
  }

  showFileTypeTitle(value: string) { //Prikazuje tip file-a na hover
    return value.split('.')[0].split('/').pop();
  }

  isPng(value: string) { //provjerava da li je png
    if (typeof value === "string") {
      let checkPng = value.split('.');
      if (checkPng[checkPng.length - 1] == 'png') {
        return true;
      }
    }
    return false;
  }

  openUploadOsobniDokumenti() {
    this.osobniDokumentiModel = <osobniDokumenti>{};
    this.osobniDokumentiUploadDialog = true;
  }

  downloadOsobniDokumenti() {
    this.profesorService.preuzmiDatoteku(this.selectedOsobniDokumenti);
  }

  showErrorZapisNijeOdabran() {
    //Error poruka ukoliko se ide brisati ili editati bez odabira rowa
    this.translate
      .get([
        "PROFESORPREDMET_ERRORMESSAGE",
        "PROFESORPREDMET_ZAPISIJEODABRAN"
      ])
      .subscribe(res => {
        this.messageService.add({
          severity: "error",
          summary: res.PROFESORPREDMET_ERRORMESSAGE,
          detail: res.PROFESORPREDMET_ZAPISIJEODABRAN
        });
      });
  }

  showSuccessEdit() {
    //Success poruka ukoliko se editanje uspješno izvršilo
    this.translate
      .get([
        "NASTAVA_SKOLSKAGODINA_USPJESNOSPREMLJENI",
        "KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA"
      ])
      .subscribe(res => {
        this.messageService.add({
          severity: "success",
          summary:
            res.KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA,
          detail: res.NASTAVA_SKOLSKAGODINA_USPJESNOSPREMLJENI
        });
      });
  }

  showSuccessDeleteNastavneCjeline() {
    //Success poruka ukoliko se brisanje uspješno izvršilo
    this.translate
      .get([
        "KATALOZI_BDNASTAVNIKSURADNIKPOVIJESNIPODACI_USPJESNOOBRISANO",
        "KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA"
      ])
      .subscribe(res => {
        this.messageService.add({
          severity: "success",
          summary:
            res.KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA,
          detail:
            res.KATALOZI_BDNASTAVNIKSURADNIKPOVIJESNIPODACI_USPJESNOOBRISANO
        });
      });
  }

  showSuccessUploadNastavniMaterijali() {
    this.translate
      .get([
        "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_UPLOADDATOTEKUUSPJESNO",
        "KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA"
      ])
      .subscribe(res => {
        this.messageService.add({
          severity: "success",
          summary:
            res.KOPIRANJEPLANA_KOPIRANJEPLANAPROMJENANSTAVNIK_PROMJENAUSPJESNA,
          detail:
            res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_UPLOADDATOTEKUUSPJESNO
        });
      });
  }

  deleteOsobniDokumenti() {
    let index = this.selectedOsobniDokumentiIndex;

    this.profesorService.deleteDatoteku(
      { PkDokument: this.selectedOsobniDokumenti.PkDokument }
    ).subscribe((res) => {
      this.predmetOsobniDokumenti = this.predmetOsobniDokumenti.filter(
        (val, i) => i != index
      );
      this.showSuccessDeleteNastavneCjeline();
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      },
      () => {
        this.selectedOsobniDokumenti = null;
        this.selectedOsobniDokumentiIndex = null;
      }
    );
  }

  openEditOsobniDokumenti() {
    this.osobniDokumentiModel = <osobniDokumenti>{
      OznakaDokumenta: this.selectedOsobniDokumenti.OznakaDokumenta,
      Opis: this.selectedOsobniDokumenti.Opis,
    };

    this.osobniDokumentiEditDialog = true;

  }

  openPreview() {
    this.prikaziDatotekuOsobniDokumenti = true;
  }

  onClosePreview() {

    this.prikaziDatotekuOsobniDokumenti = false;
  }

  showOsobniDokumentiPlaceholder() {
    this.osobniDokumentiPlaceholder = 'Ispiti/Primjeri';
  }

  removeOsobniDokumentiPlaceholder() {
    this.osobniDokumentiPlaceholder = '';
  }

  onSelect(event, fileUpload) {   // eventi za upload datoteke

    if (fileUpload.files.length > 1) {  // moze se samo jedna stavit

      const temp = [];
      temp.push(fileUpload.files[fileUpload.files.length - 1]);
      fileUpload.files = temp;

    }

    this.odabranaDatoteka = fileUpload.files[0].name;
    this.dodanaDatoteka = [];
  }

  clearDatoteka(fileUpload) {
    fileUpload.clear();
    this.odabranaDatoteka = null;
  }

  uploadOsobniDokumenti(event, fileUpload) {

    if (fileUpload.files.length > 0) {

      for (let i = 0, file; file = fileUpload.files[i]; i++) {

        const fd = new FormData();

        fd.append('file', file);

        let osobniDokumentiTemp = { //Postavljanje privremene varijable za prikaz dodanog materijala bez refresha
          OznakaDokumenta: this.osobniDokumentiModel.OznakaDokumenta,
          NazivDokumenta: file.name.split('.')[0],
          Opis: this.osobniDokumentiModel.Opis,
          imgSrc: this.opciService.extensionCellRenderer(file.name ? file.name : null),
          size: (file.size / 1000000).toFixed(2),
        }

        this.opciService.uploadDataDokumenti({
          PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
          PkUsera: this.appVariables.PkUsera,
          PkKategorijaDokumenta: 1, //Osobni materijali
          opis: this.osobniDokumentiModel.Opis,
          oznakaDokumenta: this.osobniDokumentiModel.OznakaDokumenta,

        }, fd).subscribe(data => {
          this.dodanaDatoteka = data;

          // Dodavanje novog materijala bez refresha, ukoliko je insert u bazu uspješno završen
          let noviOsobniDokument = [...this.predmetOsobniDokumenti];
          noviOsobniDokument.push(osobniDokumentiTemp);
          this.predmetOsobniDokumenti = noviOsobniDokument;
        },

          (err: HttpErrorResponse) => {

            if (err.error instanceof Error) {

              console.log('Client-side error occured.');

              // this.AppServis.prikaziToast('error', null, err, this.globalVar.trajanjeErrAlert, err);

            } else {

              console.log('Server-side error occured.');

              // this.AppServis.prikaziToast('error', null, err, this.globalVar.trajanjeErrAlert, err);

            }
          },

          () => {
            fileUpload.clear();
            this.dodanaDatoteka = null;
            this.odabranaDatoteka = null;
            this.osobniDokumentiModel = null;
            this.osobniDokumentiUploadDialog = false;
            this.showSuccessUploadNastavniMaterijali();
          });

      }
    }

  }

  closeUploadOsobniDokumenti() {
    this.osobniDokumentiModel = null;
    this.odabranaDatoteka = null;
    this.dodanaDatoteka = null;
    this.osobniDokumentiUploadDialog = false;
  }

  editOsobniDokumenti() {
    let params = {
      PkOsobniDokumentiNS: this.predmetOsobniDokumenti[this.selectedOsobniDokumentiIndex].PkOsobniDokumentiNS,
      PkUseraPromjena: this.appVariables.PkUsera,
      Opis: this.osobniDokumentiModel.Opis,
      OznakaDokumenta: this.osobniDokumentiModel.OznakaDokumenta
    };

    this.profesorService.editOsobniDokumenti(params).subscribe((res) => {
      this.predmetOsobniDokumenti[this.selectedOsobniDokumentiIndex].Opis = this.osobniDokumentiModel.Opis;
      this.predmetOsobniDokumenti[this.selectedOsobniDokumentiIndex].OznakaDokumenta = this.osobniDokumentiModel.OznakaDokumenta;
      this.showSuccessEdit();
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      },
      () => {
        this.osobniDokumentiModel = null;
        this.selectedOsobniDokumenti = null;
        this.osobniDokumentiEditDialog = false;
        this.selectedOsobniDokumentiIndex = null;
      }
    );

  }

  closeEditOsobniDokumenti() {
    this.osobniDokumentiModel = null;
    this.osobniDokumentiEditDialog = false;
  }

  onRowSelectOsobniDokumenti(event) {
    this.selectedOsobniDokumentiIndex = event.index
  }

  onRowUnselectOsobniDokumenti() {
    this.selectedOsobniDokumentiIndex = null;
    this.selectedOsobniDokumenti = null;
  }

}
