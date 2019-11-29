/************************************************************************************************************************************************************
 ** File
 ** Name      :      profesor-predmet
 ** DESC      :      Kartica predmeta na studija sa svim podacima vezanim uz njega, sastoji se od tab viewa
                     koji sadrži osnovne podatke o predmetu (read only), ispis studenata koji slušaju predmet
                     sve podatke o njima, omogučuje se edit ocjena, (pregled prisutnosti studenata i excel export???),
                     Nastavne cjeline sa svim CRUD operacijama, grupe za nastavu (read only) i (nastavne cjeline
                     koje se mogu downloadati, uploadati, pregledavati???)
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
import { AppVariables } from './../_interfaces/_configAppVariables';
import { OpciService } from './../_services/opci.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { ProfesorService } from '../_services/profesori.service';
import { TranslateService } from "@ngx-translate/core";
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { LanguageHandler } from '../app.languageHandler';
import { editStudentModal } from '../_interfaces/EditStudent';
import { NastavneCjelineModel } from '../_interfaces/NastavneCjelineModel';

@Component({
    selector: "app-profesor-predmet",
    templateUrl: "./profesor-predmet.component.html",
    styleUrls: ["./profesor-predmet.component.css"]
})
export class ProfesorPredmetComponent implements OnInit {
    //Osnovni podaci o predmetu
    predmetOsnovniPodaci: any;

    //Studenti na predmetu
    studentiNaPredmetu: any;
    colsStudenti: any[];
    colsStudentiSmall: any[];
    ukupanBrojStudenata: number;
    prolaznost: string;
    brojPolozenih: number;
    prosjekOcjena: string;
    brojNepolozenih: number;
    brojOslobodenihStudenata: number;
    StudentEditDialog: boolean = false;
    selectedStudent: any = null;
    editStudentModel: editStudentModal;
    minOcjena: number = this.appVariables.minOcjena;
    maxOcjena: number = this.appVariables.maxOcjena;
    ocjenaOcjenjivacDisabled: boolean = false;
    saveButtonDisabled: boolean = true;
    enableOcjenaEdit: number = this.appVariables.editOcjenaEnabled;
    selectedStudentIndex: number;

    //Nastavne cjeline
    predmetNastavneCjeline: any;
    colsNastavneCjeline: any[];
    colsNastavneCjelineSmall: any[];
    nastavneCjelineDodajNovuDialog: boolean = false;
    nastavneCjelineEditDialog: boolean = false;
    selectedNastavnaCjelina: any = null;
    editNastavneCjelineModel: NastavneCjelineModel;
    addNastavneCjelineModel: NastavneCjelineModel;
    selectedNastavnaCjelinaIndex: number;

    //Grupe za nastavu
    podtipoviPredavanja: any;
    grupeZaNastavu: any;
    studentiRasporedeniPoGrupama: any;
    colsStudentiRasporedeniPoGrupama: any[];
    colsGrupeZaNastavu: any[];
    colsPodTipoviPredavanja: any[];
    selectedPodTipPredavanja: any = null;
    selectedGrupeZaNastavu: any = null;

    //Botuni
    actionItemsSmall: MenuItem[];
    actionItemsNastavneCjeline: MenuItem[];
    actionItemsStudenti: MenuItem[];

    //Opće
    rout: any = null;
    selectedLang: any;
    user: any;

    constructor(
        private route: ActivatedRoute,
        private profesorService: ProfesorService,
        private opciService: OpciService,
        private translate: TranslateService,
        private messageService: MessageService,
        private langHandler: LanguageHandler,
        private appVariables: AppVariables
    ) {}

    ngOnInit() {
        const params = {
            PkSkolskaGodinaStudijPredmetKatedra: this.route.snapshot.paramMap.get(
                "PkSkolskaGodinaStudijPredmetKatedra"
            ),
            PkPredmet: this.route.snapshot.paramMap.get("PkPredmet"), //7
            PkNastavnik: this.appVariables.PkNastavnikSuradnik
        };

        this.selectedLang = this.langHandler.getCurrentLanguage();

        // prijevod i inicijalizacija za botune s crud operacijama
        this.translate
            .get([
                "VIEWS_KATALOZI_PREDMET_OSNOVNIPODACI",
                "VIEWS_KATALOZI_PREDMET_STUDENTI",
                "VIEWS_KATALOZI_PREDMET_NASTAVNECJELINE",
                "KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS",
                "NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS",
                "NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS"
            ])
            .subscribe(res => {
                this.actionItemsSmall = [
                    {
                        label: res.VIEWS_KATALOZI_PREDMET_STUDENTI,
                        items: [
                            {
                                label:
                                    res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
                                icon: "fa fa-pencil",
                                command: () =>
                                    this.selectedStudent
                                        ? this.openStudentEditDialog()
                                        : this.showErrorZapisNijeOdabran()
                            }
                        ]
                    },
                    {
                        label: res.VIEWS_KATALOZI_PREDMET_NASTAVNECJELINE,
                        items: [
                            {
                                label:
                                    res.KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS,
                                icon: "fa fa-plus",
                                command: () =>
                                    this.openNastavneCjelineDodajNovuDialog()
                            },
                            {
                                label:
                                    res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
                                icon: "fa fa-pencil",
                                command: () =>
                                    this.selectedNastavnaCjelina
                                        ? this.openEditNastavnaCjelina()
                                        : this.showErrorZapisNijeOdabran()
                            },
                            {
                                label:
                                    res.NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS,
                                icon: "fa fa-trash-o",
                                command: () =>
                                    this.selectedNastavnaCjelina
                                        ? this.deleteSelectedNastavnaCjelina()
                                        : this.showErrorZapisNijeOdabran()
                            }
                        ]
                    },
                    { separator: true },
                    {
                        label: "Quit",
                        icon: "pi pi-fw pi-times"
                    }
                ];

                this.actionItemsNastavneCjeline = [
                    {
                        label:
                            res.KATALOZI_PREDMETNASTAVNACJELINA_DODAJNOVIZAPIS,
                        icon: "fa fa-plus",
                        //otvaranje modalne forme za dodavanje novih cjelina
                        command: () => this.openNastavneCjelineDodajNovuDialog()
                    },
                    {
                        label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
                        icon: "fa fa-pencil",
                        command: () =>
                            this.selectedNastavnaCjelina
                                ? this.openEditNastavnaCjelina()
                                : this.showErrorZapisNijeOdabran()
                    },
                    {
                        label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_OBRISI_ZAPIS,
                        icon: "fa fa-trash-o",
                        command: () =>
                            this.selectedNastavnaCjelina
                                ? this.deleteSelectedNastavnaCjelina()
                                : this.showErrorZapisNijeOdabran()
                    }
                ];

                this.actionItemsStudenti = [
                    {
                        label: res.NASTAVA_BDSKOLSKAGODINAPREDMETI_UREDI_ZAPIS,
                        icon: "fa fa-pencil",
                        command: () =>
                            this.selectedStudent
                                ? this.openStudentEditDialog()
                                : this.showErrorZapisNijeOdabran()
                    }
                ];
            });

        // Poziv servisa za dohvacanje osnovnih podataka o predmetu
        this.profesorService.getPredmetOsnovniPodaci(params).subscribe(
            data => {
                this.predmetOsnovniPodaci = this.opciService.formatDates(
                    data
                )[0]; //znamo da je uvijek niz od jednog objekta pa možemo pisati [0]
            },

            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            },
            () => {}
        );

        // Poziv servisa za dohvacanje podataka o useru
        this.profesorService.getNastavnik(params).subscribe(
            data => {
                this.user = data[0];
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            },
            () => {}
        );

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
            ])
            .subscribe(res => {
                this.profesorService.getPredmetStudenti(params).subscribe(
                    data => {
                        this.studentiNaPredmetu = this.opciService.formatDates(
                            data
                        );
                        this.setUkupanBrojStudenata();
                        this.setBrojOslobodenihStudenata();
                        this.setBrojPolozenihStudenata();
                        this.setBrojNepolozenihStudenata();
                        this.setPostotakProlaznosti();
                        this.setProsjekOcjena();

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
                                field: "Semestar",
                                header: res.VIEWS_KATALOZI_PREDMET_SEMESTAR
                            },
                            {
                                field: "StudijskaGodina",
                                header:
                                    res.VIEWS_KATALOZI_PREDMET_STUDIJSKAGODINA
                            },
                            {
                                field: "osloboden",
                                header:
                                    res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_OSLOBODEN
                            },
                            {
                                field: "polozen",
                                header:
                                    res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN
                            },
                            {
                                field: "ocjena",
                                header:
                                    res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_OCJENA
                            },
                            {
                                field: "ocjenjivac",
                                header: res.PREDMET_BDPREDMETSTUDENTI_OCJENJIVAC
                            }
                        ];

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
                            console.log("Client-side error occured.");
                        } else {
                            console.log("Server-side error occured.");
                        }
                    },
                    () => {}
                );
            });

        // Poziv servisa za dohvacanje nastavnih cjelina na predmetu
        this.translate
            .get([
                "KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA",
                "SERVICES_GENERALSERVICE_KORISNIKUNOSA",
                "NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRAZAKLJUCAVANJE_KORISNIKPROMJENE",
                "SERVICES_GENERALSERVICE_DATUMUNOSA",
                "KATALOZI_STATUSUGOVORA_ZADNJAPROMJENA",
                "KATALOZI_PREDMETNASTAVNACJELINA_KORISTISE"
            ])
            .subscribe(res => {
                this.profesorService
                    .getPredmetNastavneCjeline(params)
                    .subscribe(
                        data => {
                            this.predmetNastavneCjeline = this.opciService.formatDates(
                                data
                            );
                            this.colsNastavneCjeline = [
                                {
                                    header:
                                        res.KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA,
                                    field: "NazivPredmetNastavnaCjelina"
                                },
                                {
                                    header:
                                        res.SERVICES_GENERALSERVICE_KORISNIKUNOSA,
                                    field: "KorisnikUnos"
                                },
                                {
                                    header:
                                        res.SERVICES_GENERALSERVICE_DATUMUNOSA,
                                    field: "DatumUnosa"
                                },
                                {
                                    header:
                                        res.NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRAZAKLJUCAVANJE_KORISNIKPROMJENE,
                                    field: "KorisnikPromjena"
                                },
                                {
                                    header:
                                        res.KATALOZI_STATUSUGOVORA_ZADNJAPROMJENA,
                                    field: "DatumZadnjePromjene"
                                },
                                {
                                    header:
                                        res.KATALOZI_PREDMETNASTAVNACJELINA_KORISTISE,
                                    field: "KoristiSeDaNe"
                                }
                            ];

                            this.colsNastavneCjelineSmall = [
                                {
                                    header:
                                        res.KATALOZI_PREDMETNASTAVNACJELINA_NASTAVNACJELINA,
                                    field: "NazivPredmetNastavnaCjelina"
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
                        () => {}
                    );
            });

        // Poziv servisa za dohvacanje podtipova nasatve
        this.translate
            .get([
                "ISVU_APIPREDMETI_SIFRA",
                "KATALOZI_PODTIPPREDAVANJA_PODTIPNASTAVE"
            ])
            .subscribe(res => {
                this.profesorService.getPodTipPredavanja(params).subscribe(
                    data => {
                        this.podtipoviPredavanja = data;

                        this.colsPodTipoviPredavanja = [
                            {
                                field: "PodTipPredavanjaSifra",
                                header: res.ISVU_APIPREDMETI_SIFRA
                            },
                            {
                                field: "PodTipPredavanjaNaziv",
                                header:
                                    res.KATALOZI_PODTIPPREDAVANJA_PODTIPNASTAVE
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
                    () => {}
                );
            });

        //Prijevod za Grupe za nastavu
        this.translate
            .get([
                "VIEWS_GRUPEZANASTAVUDIALOG_OZNAKAGRUPE",
                "VIEWS_GRUPEZANASTAVUDIALOG_KAPACITET"
            ])
            .subscribe(res => {
                this.colsGrupeZaNastavu = [
                    {
                        field: "OznakaGrupeZaNastavu",
                        header: res.VIEWS_GRUPEZANASTAVUDIALOG_OZNAKAGRUPE
                    },
                    {
                        field: "Kapacitet",
                        header: res.VIEWS_GRUPEZANASTAVUDIALOG_KAPACITET
                    }
                ];
            });

        //Prijevod za studente raspoređene po grupama za nastavu
        this.translate
            .get([
                "VIEWS_GRUPEZANASTAVUDIALOG_OZNAKAGRUPE",
                "VIEWS_GRUPEZANASTAVUDIALOG_KAPACITET",
                "VIEWS_KATALOZI_PREDMET_SEMESTAR"
            ])
            .subscribe(res => {
                this.colsStudentiRasporedeniPoGrupama = [
                    {
                        field: "Ime",
                        header: res.VIEWS_APLIKACIJA_HOME_IME
                    },
                    {
                        field: "Prezime",
                        header: res.VIEWS_APLIKACIJA_HOME_PREZIME
                    },
                    {
                        field: "Semestar",
                        header: res.VIEWS_KATALOZI_PREDMET_SEMESTAR
                    }
                ];
            });
    }

    //Studenti na predmetu
    setUkupanBrojStudenata() {
        //Računa kolko ima studenata na odabranom predmetu
        this.ukupanBrojStudenata = this.studentiNaPredmetu.length;
    }

    setPostotakProlaznosti() {
        //Računa postotak prolaznosti (uzima u obzir (broj upisanih studenata - broj oslobodenih) i onih koji su položili)
        this.prolaznost = (
            (this.brojPolozenih /
                (this.ukupanBrojStudenata - this.brojOslobodenihStudenata)) *
            100
        ).toFixed(2);
    }

    setProsjekOcjena() {
        //Računa prosjek ocjena svih studenata na dvi decimale, oni koji nisu polozili ne ulaze u jednadzbu!!!???
        var ukupanZbrojOcjena = this.studentiNaPredmetu.reduce(
            (accumulator, currentValue) => {
                return currentValue.polozen == true
                    ? accumulator + currentValue.ocjena
                    : accumulator + 0;
            },
            0
        );

        this.prosjekOcjena = (ukupanZbrojOcjena / this.brojPolozenih).toFixed(
            2
        );
    }

    setBrojPolozenihStudenata() {
        //funkcija vraća broj studenata koji su položili predmet
        this.brojPolozenih = this.studentiNaPredmetu.reduce(
            (accumulator, currentValue) => {
                return currentValue.polozen == true
                    ? accumulator + 1
                    : accumulator + 0;
            },
            0
        );
    }

    setBrojNepolozenihStudenata() {
        this.brojNepolozenih =
            this.ukupanBrojStudenata -
            this.brojOslobodenihStudenata -
            this.brojPolozenih;
    }

    setBrojOslobodenihStudenata() {
        //Računa broj studenata koji su oslobodeni polaganja predmeta
        this.brojOslobodenihStudenata = this.studentiNaPredmetu.reduce(
            (accumulator, currentValue) => {
                return currentValue.osloboden == true
                    ? accumulator + 1
                    : accumulator + 0;
            },
            0
        );
    }

    onRowSelectStudent(event) {
        this.selectedStudentIndex = event.index;
    }

    editStudent() {
        //poziv funkcije klikom na botun spremi, funkcija mijenja podadke u tablici i okida put proceduru
        if (
            this.editStudentModel.ocjenaEdit == null &&
            this.editStudentModel.polozenOslobodenSelectedValue != "ostalo"
        ) {
            this.saveButtonDisabled = true;
        }

        this.studentiNaPredmetu[
            this.selectedStudentIndex
        ].ime = this.editStudentModel.imeEdit;
        this.studentiNaPredmetu[
            this.selectedStudentIndex
        ].prezime = this.editStudentModel.prezimeEdit;
        this.studentiNaPredmetu[
            this.selectedStudentIndex
        ].ocjena = this.editStudentModel.ocjenaEdit;
        this.studentiNaPredmetu[
            this.selectedStudentIndex
        ].ocjenjivac = this.editStudentModel.ocjenjivacEdit;
        if (this.editStudentModel.polozenOslobodenSelectedValue == "polozen") {
            this.studentiNaPredmetu[this.selectedStudentIndex].polozen = true;
            this.studentiNaPredmetu[
                this.selectedStudentIndex
            ].osloboden = false;
        } else if (
            this.editStudentModel.polozenOslobodenSelectedValue == "osloboden"
        ) {
            this.studentiNaPredmetu[this.selectedStudentIndex].polozen = false;
            this.studentiNaPredmetu[this.selectedStudentIndex].osloboden = true;
        } else {
            this.studentiNaPredmetu[this.selectedStudentIndex].polozen = false;
            this.studentiNaPredmetu[
                this.selectedStudentIndex
            ].osloboden = false;
        }

        this.ocjenaOcjenjivacDisabled = false;
        this.saveButtonDisabled = true;

        this.updateRekapitulacija();
        this.selectedStudent = null;
        this.StudentEditDialog = false;
        this.showSuccessEdit();
    }

    closeStudentEditDialog() {
        this.StudentEditDialog = false;
        this.ocjenaOcjenjivacDisabled = false;
        this.saveButtonDisabled = true;
    }

    openStudentEditDialog() {
        //otvaranje edit dialoga i fillanje podacima
        let polozenOslobodenTempValue: any;

        if (
            this.selectedStudent.polozen == true &&
            this.selectedStudent.osloboden == false
        ) {
            polozenOslobodenTempValue = "polozen";
        } else if (
            this.selectedStudent.polozen == false &&
            this.selectedStudent.osloboden == true
        ) {
            polozenOslobodenTempValue = "osloboden";
        } else {
            polozenOslobodenTempValue = "ostalo";
            this.ocjenaOcjenjivacDisabled = true;
        }

        this.editStudentModel = {
            imeEdit: this.selectedStudent.ime,
            prezimeEdit: this.selectedStudent.prezime,
            ocjenaEdit: this.selectedStudent.ocjena,
            ocjenjivacEdit: this.selectedStudent.ocjenjivac,
            polozenOslobodenSelectedValue: polozenOslobodenTempValue
        };

        this.StudentEditDialog = true;
    }

    resetAndDisableOcjenaOcjenjivac() {
        //klikom na radio botun 'ostalo'
        this.editStudentModel.ocjenaEdit = null;
        this.editStudentModel.ocjenjivacEdit = null;
        this.ocjenaOcjenjivacDisabled = true;
        this.saveButtonDisabled = false;
    }

    onChangeSpinner() {
        //Funkcija koja ogranicava input view korisnika, koji je dosad moga pisat pizdarije u spinneru
        let element = <HTMLInputElement>(
            document.getElementById("spinnerContainer").childNodes[0].firstChild
        );
        let insertedValue = +element.value;

        if (insertedValue > this.maxOcjena) {
            (<HTMLInputElement>(
                document.getElementById("spinnerContainer").childNodes[0]
                    .firstChild
            )).value = this.maxOcjena.toString();
        }

        if (insertedValue < this.minOcjena) {
            (<HTMLInputElement>(
                document.getElementById("spinnerContainer").childNodes[0]
                    .firstChild
            )).value = this.minOcjena.toString();
        }

        insertedValue != 0
            ? (this.saveButtonDisabled = false)
            : (this.saveButtonDisabled = true);
    }

    enableOcjenaOcjenjivac() {
        //klikom na radio botun 'polozen' ili 'osloboden'
        this.ocjenaOcjenjivacDisabled = false;
        this.editStudentModel.ocjenaEdit != null
            ? (this.saveButtonDisabled = false)
            : (this.saveButtonDisabled = true);
    }

    updateRekapitulacija() {
        this.setBrojOslobodenihStudenata();
        this.setBrojPolozenihStudenata();
        this.setBrojNepolozenihStudenata();
        this.setPostotakProlaznosti();
        this.setProsjekOcjena();
    }

    //Nastavne cjeline

    closeNastavneCjelineDodajNovuDialog() {
        this.nastavneCjelineDodajNovuDialog = false;
        this.addNastavneCjelineModel = null;
    }

    dodajNovuNastavnuCjelinu() {
        //Procedura poziva post api za insert nastavne cjelune, update-a frontend view

        let params = {
            PkPredmet: +this.route.snapshot.paramMap.get("PkPredmet"),
            NazivPredmetNastavnaCjelina: this.addNastavneCjelineModel
                .NazivPredmetNastavnaCjelina,
            KoristiSeDaNe: this.addNastavneCjelineModel.KoristiSeDaNe,
            PkUsera: this.appVariables.PkUsera
        };

        this.addNastavneCjelineModel.DatumUnosa = new Date().toLocaleDateString(
            this.translate.instant("STUDENT_KALENDAR_LOCALE")
        );
        this.addNastavneCjelineModel.DatumZadnjePromjene = new Date().toLocaleDateString(
            this.translate.instant("STUDENT_KALENDAR_LOCALE")
        );
        this.addNastavneCjelineModel.KorisnikPromjena =
            this.user.Prezime + " " + this.user.Ime; //tria vidit koji je property
        this.addNastavneCjelineModel.KorisnikUnos =
            this.user.Prezime + " " + this.user.Ime;
        //user.username;

        let nastavneCjeline = [...this.predmetNastavneCjeline];
        nastavneCjeline.push(this.addNastavneCjelineModel);
        this.predmetNastavneCjeline = nastavneCjeline;

        this.profesorService.postNastavnaCjelina(params).subscribe();

        this.nastavneCjelineDodajNovuDialog = false;
        this.showSuccessEdit();
        this.addNastavneCjelineModel = null;
    }

    openEditNastavnaCjelina() {
        this.editNastavneCjelineModel = {
            NazivPredmetNastavnaCjelina: this.selectedNastavnaCjelina
                .NazivPredmetNastavnaCjelina,
            KoristiSeDaNe: this.selectedNastavnaCjelina.KoristiSeDaNe,
            KorisnikPromjena: null,
            KorisnikUnos: null,
            DatumUnosa: null,
            DatumZadnjePromjene: null
        };

        this.nastavneCjelineEditDialog = true;
    }

    editNastavnuCjelinu() {
        //triba ucinit put request za editanje podataka u bazi

        let params = {
            PkPredmetNastavnaCjelina: this.predmetNastavneCjeline[
                this.selectedNastavnaCjelinaIndex
            ].PkPredmetNastavnaCjelina,
            PkPredmet: +this.route.snapshot.paramMap.get("PkPredmet"),
            NazivPredmetNastavnaCjelina: this.editNastavneCjelineModel
                .NazivPredmetNastavnaCjelina,
            KoristiSeDaNe: this.editNastavneCjelineModel.KoristiSeDaNe,
            PkUsera: this.appVariables.PkUsera
        };

        this.profesorService.updateNastavnaCjelina(params).subscribe();

        this.predmetNastavneCjeline[
            this.selectedNastavnaCjelinaIndex
        ].NazivPredmetNastavnaCjelina = this.editNastavneCjelineModel.NazivPredmetNastavnaCjelina;

        this.predmetNastavneCjeline[
            this.selectedNastavnaCjelinaIndex
        ].KoristiSeDaNe = this.editNastavneCjelineModel.KoristiSeDaNe;

        this.predmetNastavneCjeline[
            this.selectedNastavnaCjelinaIndex
        ].DatumZadnjePromjene = new Date().toLocaleDateString(
            this.translate.instant("STUDENT_KALENDAR_LOCALE")
        );

        this.predmetNastavneCjeline[
            this.selectedNastavnaCjelinaIndex
        ].KorisnikPromjena = this.user.Prezime + " " + this.user.Ime; //promjenit

        this.selectedNastavnaCjelina = null;
        this.nastavneCjelineEditDialog = false;
        this.showSuccessEdit();
    }

    openNastavneCjelineDodajNovuDialog() {
        this.addNastavneCjelineModel = {
            NazivPredmetNastavnaCjelina: null,
            KorisnikUnos: null,
            KorisnikPromjena: null,
            DatumUnosa: null,
            DatumZadnjePromjene: null,
            KoristiSeDaNe: false
        };
        this.nastavneCjelineDodajNovuDialog = true;
    }

    deleteSelectedNastavnaCjelina() {
        let index = this.selectedNastavnaCjelinaIndex;
        let params = {
            PkPredmetNastavnaCjelina: this.predmetNastavneCjeline[index]
                .PkPredmetNastavnaCjelina,
            PkUsera: this.appVariables.PkUsera
        };
        this.profesorService.deleteNastavnaCjelina(params).subscribe();
        this.predmetNastavneCjeline = this.predmetNastavneCjeline.filter(
            (val, i) => i != index
        );

        this.selectedNastavnaCjelina = null;
        this.showSuccessDeleteNastavneCjeline();
    }

    closeNastavneCjelineEditNovuDialog() {
        this.editNastavneCjelineModel = null;
        this.nastavneCjelineEditDialog = false;
    }

    onRowSelectNastavnaCjelina(event) {
        this.selectedNastavnaCjelinaIndex = event.index;
    }

    //Grupe za nastavu
    podTipPredavanjaRowSelection() {
        //Poziv servisa za renderanje grupa za nastavu
        let params = {
            PkPredmet: this.route.snapshot.paramMap.get("PkPredmet"),
            PkStudij: this.route.snapshot.paramMap.get("PkStudij"),
            PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
            PkPodTipPredavanja: this.selectedPodTipPredavanja.PkPodTipPredavanja
        };

        this.profesorService.getGrupeZaNastavu(params).subscribe(data => {
            console.log(data);
        });
    }

    grupeZaNastavuRowSelection() {
        //Poziv servisa za renderanje studenata raspoređenih po grupama
        let params = {
            PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
            PkSkolskaGodinaStudijGrupaZaNastavu: this.selectedGrupeZaNastavu
                .PkSkolskaGodinaStudijGrupaZaNastavu
        };

        this.profesorService
            .getStudentiRasporedeniPoGrupama(params)
            .subscribe(data => {
                console.log(data);
            });
    }

    //Toast poruke
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

    //opće
    isBoolean(val) {
        if (typeof val === "number") {
            return false;
        }
        return typeof val === "boolean";
    }
}
