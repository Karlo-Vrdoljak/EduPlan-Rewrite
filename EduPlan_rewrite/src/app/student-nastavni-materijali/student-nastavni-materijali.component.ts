import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProfesorService } from "../_services/profesori.service";
import { OpciService } from "../_services/opci.service";
import { TranslateService } from "@ngx-translate/core";
import { MessageService, MenuItem } from "primeng/api";
import { LanguageHandler } from "../app.languageHandler";
import { AppVariables } from "../_interfaces/_configAppVariables";
import { StudentiService } from "../_services/studenti.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: "app-student-nastavni-materijali",
    templateUrl: "./student-nastavni-materijali.component.html",
    styleUrls: ["./student-nastavni-materijali.component.css"]
})
export class StudentNastavniMaterijaliComponent implements OnInit {
    selectedLang: string;
    translations: any;
    params = {
        PkPredmet: null
    };
    predmetNastavniMaterijali: any;
    colsNastavniMaterijali: { field: string; header: any, width: string }[];
    colsNastavniMaterijaliSmall: { field: string; header: any }[];
    selectedNastavniMaterijalIndex: any;
    selectedNastavniMaterijali: any;
    predmetOsnovniPodaci: any;
    predmetNaziv: string = this.route.snapshot.paramMap.get("PredmetNaziv");
    studijNaziv: string = this.route.snapshot.paramMap.get("StudijNaziv");
    actionItemsNastavniMaterijali: MenuItem[];
    prikaziDatoteku: boolean = false;
    selectedNastavniMterijaliNaziv: string;
    pdfRuta: string;


    constructor(
        private route: ActivatedRoute,
        private studentService: StudentiService,
        private opciService: OpciService,
        private translate: TranslateService,
        private messageService: MessageService,
        private langHandler: LanguageHandler,
        private appVariables: AppVariables,
        private profesorService: ProfesorService
    ) {}

    ngOnInit() {
        this.params.PkPredmet = parseInt(
            this.route.snapshot.paramMap.get("PkPredmet")
        );

        this.selectedLang = this.langHandler.getCurrentLanguage();

        this.translate
            .get([
                "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREUZMIDATOTEKU",
                "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREGLEDDOKUMENTA"
            ])
            .subscribe(res => {
                this.actionItemsNastavniMaterijali = [
                    {
                        label:
                            res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREUZMIDATOTEKU,
                        icon: "fa fa-download",
                        command: () =>
                            this.selectedNastavniMaterijali
                                ? this.downloadNastavniMaterijali()
                                : this.showErrorZapisNijeOdabran()
                    },
                    {
                        label:
                            res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_PREGLEDDOKUMENTA,
                        icon: "fa fa-eye",
                        command: () =>
                            this.selectedNastavniMaterijali
                                ? this.openPreview()
                                : this.showErrorZapisNijeOdabran()
                    }
                ];
            });

        this.translate //dohvat podataka za nastavne materijale po predmetu
            .get([
                "PREDMET_PREDMETMATERIJALI_OPIS",
                "NASTAVA_GRUPAPREDMETA_AKADEMSKAGODINA",
                "PREDMET_PREDMETMATERIJALI_VIDLJIVO_STUDENTIMA",
                "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_NAZIVDOKUMENTA",
                "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_OZNAKADOKUMENTA",
                "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_TIPDOKUMENTA",
                "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_VELICINA"
            ])
            .subscribe(
                res => {
                    this.translations = res;
                    
                    this.colsNastavniMaterijali = [
                        {
                            field: "NazivDokumenta",
                            header: this.translations
                                .PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_NAZIVDOKUMENTA,
                            width: '23%'
                        },
                        {
                            field: "AkademskaGodina",
                            header: this.translations
                                .NASTAVA_GRUPAPREDMETA_AKADEMSKAGODINA,
                            width: '10%'
                        },
                        {
                            field: "OznakaDokumenta",
                            header: this.translations
                                .PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_OZNAKADOKUMENTA,
                            width: '21%'
                        },
                        {
                            field: "Opis",
                            header: this.translations
                                .PREDMET_PREDMETMATERIJALI_OPIS,
                            width: '24%'
                        },
                        {
                            field: "imgSrc",
                            header: this.translations
                                .PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_TIPDOKUMENTA,
                            width: '12%'
                        },
                        {
                            field: "size",
                            header: res.PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_VELICINA,
                            width: '10%'
                        }
                    ];

                    this.colsNastavniMaterijaliSmall = [
                        {
                            field: "NazivDokumenta",
                            header: this.translations
                                .PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_NAZIVDOKUMENTA
                        }];
                },
                err => {
                    console.error(err);
                },
                () => {
                    this.studentService
                        .getPredmetNastavniMaterijali(this.params)
                        .subscribe(
                            data => {
                                this.predmetNastavniMaterijali = data;
                                this.predmetNastavniMaterijali = this.predmetNastavniMaterijali
                                    .filter(e =>
                                        [1, true].includes(
                                            e.VidljivStudentimaDaNe
                                        )
                                    )
                                    .filter(e => {
                                        return [0, false].includes(
                                            e.IzbrisanDaNe
                                        );
                                    });
                            },
                            error => {
                                console.error(error);
                            },
                            () => {
                                for (let i = 0; i < this.predmetNastavniMaterijali.length; i++) {
                                    this.predmetNastavniMaterijali[i].imgSrc = this.opciService.extensionCellRenderer(
                                        this.predmetNastavniMaterijali[i].izvorniOriginalName? this.predmetNastavniMaterijali[i].izvorniOriginalName: null
                                    );
                                    this.predmetNastavniMaterijali[i].NazivDokumenta = this.predmetNastavniMaterijali[i].NazivDokumenta.split('.')[0];
                                    this.predmetNastavniMaterijali[i].size = (this.predmetNastavniMaterijali[i].size / 1000000).toFixed(2);

                                }   
                            }
                        );
                }
            );
    }

    onRowSelectNastavniMaterijali(event) {
        this.selectedNastavniMaterijalIndex = event.index;
    }

    onRowUnselectNastavniMaterijali() {
        this.selectedNastavniMaterijalIndex = null;
        this.selectedNastavniMaterijali = null;
    }

    isPng(value: string) {
        //provjerava da li je png
        if (typeof value === "string") {
            let checkPng = value.split(".");
            if (checkPng[checkPng.length - 1] == "png") {
                return true;
            }
        }
        return false;
    }

    showFileTypeTitle(value: string) {
        //Prikazuje tip file-a na hover
        return value
            .split(".")[0]
            .split("/")
            .pop();
    }

    downloadNastavniMaterijali() {
        this.profesorService.preuzmiDatoteku(this.selectedNastavniMaterijali);
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

    showErrorNepodrzaniTip() {
        this.translate
            .get([
                "PROFESORPREDMET_ERRORMESSAGE",
                "STUDENT_NASTAVNIMATERIJALI_NEPODRZANITIP"
            ])
            .subscribe(res => {
                this.messageService.add({
                    severity: "error",
                    summary: res.PROFESORPREDMET_ERRORMESSAGE,
                    detail: res.STUDENT_NASTAVNIMATERIJALI_NEPODRZANITIP
                });
            })
    }

    openPreview() {
        if (!['pdf','jpg','jpeg'].includes(this.selectedNastavniMaterijali.izvorniOriginalName.split('.')[1])) {
            this.showErrorNepodrzaniTip();
            return;
        }
        else {
            this.selectedNastavniMterijaliNaziv = this.selectedNastavniMaterijali.NazivDokumenta.split('.')[0];
            this.prikaziDatoteku = true;
        }

    }

    onClosePreview() {
        this.selectedNastavniMterijaliNaziv = null;
        this.prikaziDatoteku = false;
    }

    onClickDownloadFile() {
        this.selectedNastavniMaterijali
        ? this.downloadNastavniMaterijali()
        : this.showErrorZapisNijeOdabran()
    }
    
    onClickPreviewFile() {
        this.selectedNastavniMaterijali
        ? this.openPreview()
        : this.showErrorZapisNijeOdabran()
    }

}
