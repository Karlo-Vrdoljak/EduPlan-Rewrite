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
    colsNastavniMaterijali: { field: string; header: any }[];
    selectedNastavniMaterijalIndex: any;
    selectedNastavniMaterijali: any;
    predmetOsnovniPodaci: any;
    predmetNaziv: string = this.route.snapshot.paramMap.get("PredmetNaziv");
    studijNaziv: string = this.route.snapshot.paramMap.get("StudijNaziv");
    actionItemsNastavniMaterijali: MenuItem[];
    prikaziDatoteku: boolean = false;

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
                "PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_TIPDOKUMENTA"
            ])
            .subscribe(
                res => {
                    this.translations = res;
                    this.colsNastavniMaterijali = [
                        {
                            field: "NazivDokumenta",
                            header: this.translations
                                .PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_NAZIVDOKUMENTA
                        },
                        {
                            field: "AkademskaGodina",
                            header: this.translations
                                .NASTAVA_GRUPAPREDMETA_AKADEMSKAGODINA
                        },
                        {
                            field: "OznakaDokumenta",
                            header: this.translations
                                .PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_OZNAKADOKUMENTA
                        },
                        {
                            field: "Opis",
                            header: this.translations
                                .PREDMET_PREDMETMATERIJALI_OPIS
                        },
                        {
                            field: "imgSrc",
                            header: this.translations
                                .PROFESOR_SVIPREDMETI_PREDMET_NASTAVNIMATERIJALI_TIPDOKUMENTA
                        }
                    ];
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

    openPreview() {
        this.prikaziDatoteku = true;
    }

    onClosePreview() {
        this.prikaziDatoteku = false;
    }
}
