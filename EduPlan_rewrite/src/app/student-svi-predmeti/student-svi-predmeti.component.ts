import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AppVariables } from '../_interfaces/_configAppVariables';
import { OpciService } from './../_services/opci.service';


@Component({
    selector: "app-student-svi-predmeti",
    templateUrl: "./student-svi-predmeti.component.html",
    styleUrls: ["./student-svi-predmeti.component.css"]
})
export class StudentSviPredmetiComponent implements OnInit {
    cols: any[];
    colsSmall: any[];
    studentData: any;

    constructor(
        private translate: TranslateService,
        private studentiService: StudentiService,
        private appVariables: AppVariables,
        private opciService: OpciService
    ) {}

    ngOnInit() {
        const params = {
            PkStudent: this.appVariables.PkStudent
        };

        this.translate
            .get([
                "KATALOZI_PREDMETNASTAVNACJELINA_PREDMET",
                "KATALOZI_BDSTUDIJPREDMET_GODINA",
                "VIEWS_KATALOZI_PREDMET_STUDIJ",
                "KATALOZI_NASTAVNIKSURADNIKPREDMETI_OCJENA",
                "VIEWS_KATALOZI_PREDMET_SEMESTAR",
                "VIEWS_KATALOZI_PREDMET_VODITELJPREDMETA",
                "KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN",
                "VIEWS_KATALOZI_PREDMET_ECTS"
            ])
            .subscribe(res => {
                this.studentiService
                    .getStudentNaVisokomUcilistuPredmet(params)
                    .subscribe(
                        data => {
                            this.studentData = this.opciService.formatDates(data);
                            this.cols = [
                                // 7, 25, 8,15,8,8,16,7
                                {
                                    field: "PredmetNaziv",
                                    header:
                                        res.KATALOZI_PREDMETNASTAVNACJELINA_PREDMET /*"Predmet"*/
                                    //                    width: "7%"
                                },
                                {
                                    field: "StudijNaziv",
                                    header: res.VIEWS_KATALOZI_PREDMET_STUDIJ //"Studij",
                                    //                    width: "8%"
                                },
                                {
                                    field: "StudijskaGodina",
                                    header:
                                        res.KATALOZI_BDSTUDIJPREDMET_GODINA /*"Godina"*/
                                    //                    width: "8%"
                                },
                                {
                                    field: "Ocjena",
                                    header:
                                        res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_OCJENA /*"Ocjena"*/
                                    //                    width: "15%"
                                },
                                {
                                    field: "Semestar",
                                    header:
                                        res.VIEWS_KATALOZI_PREDMET_SEMESTAR /*"Semestar"*/
                                    //                    width: "8%"
                                },
                                {
                                    field: "VoditeljPredmeta",
                                    header:
                                        res.VIEWS_KATALOZI_PREDMET_VODITELJPREDMETA /*"Voditelj"*/
                                    //                    width: "8%"
                                },
                                {
                                    field: "PolozenDaNe",
                                    header:
                                        res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN /*"Polozen"*/
                                    //                    width: "16%"
                                },
                                {
                                    field: "EctsBodovi",
                                    header:
                                        res.VIEWS_KATALOZI_PREDMET_ECTS /*"ECTS"*/
                                    //                    width: "7%"
                                }
                            ];
                            this.colsSmall = [
                                {
                                    field: "PredmetNaziv",
                                    header:
                                        res.KATALOZI_PREDMETNASTAVNACJELINA_PREDMET /*"ECTS"*/
                                    //                    width: "7%"
                                }
                            ];
                            // console.log(this.studentData);
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

    }

    isBoolean(val) {
        if (typeof val === 'number') {
            return false;
        }
        return typeof val === 'boolean';
    }
}
