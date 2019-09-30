import { Component, OnInit } from "@angular/core";
import { SubjectService } from "../demo/service/subjectService";
import { Subject } from "../demo/domain/subject";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "app-student-svi-predmeti",
    templateUrl: "./student-svi-predmeti.component.html",
    styleUrls: ["./student-svi-predmeti.component.css"],
    styles: [
        `
            .ui-dataview .filter-container {
                text-align: center;
            }

            @media (max-width: 40em) {
                .ui-dataview .car-details,
                .ui-dataview .search-icon {
                    text-align: center;
                    margin-top: 0;
                }

                .ui-dataview .filter-container {
                    text-align: left;
                }
                .ui-dataview-layout-options.ui-buttonset > .ui-button {
                    margin-left: 0;
                    display: inline-block;
                }
            }
            .car-item {
                padding-top: 5px;
            }

            .car-item .ui-md-3 {
                text-align: center;
            }

            .car-item .ui-g-10 {
                font-weight: bold;
            }

            .empty-car-item-index {
                background-color: #f1f1f1;
                width: 60px;
                height: 60px;
                margin: 36px auto 0 auto;
                animation: pulse 1s infinite ease-in-out;
            }

            .empty-car-item-image {
                background-color: #f1f1f1;
                width: 120px;
                height: 120px;
                animation: pulse 1s infinite ease-in-out;
            }

            .empty-car-item-text {
                background-color: #f1f1f1;
                height: 18px;
                animation: pulse 1s infinite ease-in-out;
            }

            .title-container {
                padding: 1em;
                text-align: right;
            }

            .sort-container {
                text-align: left;
            }

            @media (max-width: 40em) {
                .car-item {
                    text-align: center;
                }
                .index-col {
                    display: none;
                }
                .image-col {
                    display: none;
                }
            }
            @keyframes pulse {
                0% {
                    background-color: rgba(165, 165, 165, 0.1);
                }
                50% {
                    background-color: rgba(165, 165, 165, 0.3);
                }
                100% {
                    background-color: rgba(165, 165, 165, 0.1);
                }
            }
        `
    ]
})
export class StudentSviPredmetiComponent implements OnInit {
    subjects: Subject[];
    cols: any[];
    colsSmall: any[];
    selectedSubject: Subject;

    constructor(
        private subjectService: SubjectService,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        this.subjectService
            .getSubjects()
            .then(subjects => (this.subjects = subjects));

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
                this.cols = [
                    // 7, 25, 8,15,8,8,16,7
                    {
                        field: "predmet",
                        header:
                            res.KATALOZI_PREDMETNASTAVNACJELINA_PREDMET /*"Predmet"*/
                        //                    width: "7%"
                    },
                    {
                        field: "studij",
                        header: res.VIEWS_KATALOZI_PREDMET_STUDIJ //"Studij",
                        //                    width: "8%"
                    },
                    {
                        field: "godina",
                        header: res.KATALOZI_BDSTUDIJPREDMET_GODINA /*"Godina"*/
                        //                    width: "8%"
                    },
                    {
                        field: "ocjena",
                        header:
                            res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_OCJENA /*"Ocjena"*/
                        //                    width: "15%"
                    },
                    {
                        field: "semestar",
                        header:
                            res.VIEWS_KATALOZI_PREDMET_SEMESTAR /*"Semestar"*/
                        //                    width: "8%"
                    },
                    {
                        field: "voditelj",
                        header:
                            res.VIEWS_KATALOZI_PREDMET_VODITELJPREDMETA /*"Voditelj"*/
                        //                    width: "8%"
                    },
                    {
                        field: "polozenDaNe",
                        header:
                            res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN /*"Polozen"*/
                        //                    width: "16%"
                    },
                    {
                        field: "ects",
                        header: res.VIEWS_KATALOZI_PREDMET_ECTS /*"ECTS"*/
                        //                    width: "7%"
                    }
                ];
                this.colsSmall = [
                    {
                        field: "predmet",
                        header:
                            res.KATALOZI_PREDMETNASTAVNACJELINA_PREDMET /*"ECTS"*/
                        //                    width: "7%"
                    }
                ];
            });
    }
    /*ngOnInit() {
        this.subjectService
            .getSubjects()
            .then(subjects => (this.subjects = subjects));
        
        this.cols = [
            // 7, 25, 8,15,8,8,16,7
            {
                field: "predmet",
                header: this.translate.instant("KATALOZI_PREDMETNASTAVNACJELINA_PREDMET"), //"Predmet",
                width: "7%"
            },
            {
                field: "godina",
                header: this.translate.instant("KATALOZI_BDSTUDIJPREDMET_GODINA"), //"Godina",
                width: "25%"
            },
            {
                field: "studij",
                header: this.translate.instant("VIEWS_KATALOZI_PREDMET_STUDIJ"), //"Studij",
                width: "8%"
            },
            {
                field: "ocjena",
                header: this.translate.instant("KATALOZI_NASTAVNIKSURADNIKPREDMETI_OCJENA"), //"Ocjena",
                width: "15%"
            },
            {
                field: "semestar",
                header: this.translate.instant("VIEWS_KATALOZI_PREDMET_SEMESTAR"), //"Semestar",
                width: "8%"
            },
            {
                field: "voditelj",
                header: this.translate.instant("VIEWS_KATALOZI_PREDMET_VODITELJPREDMETA"), //"Voditelj",
                width: "8%"
            },
            {
                field: "polozenDaNe",
                header: this.translate.instant("KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN"), //"Polozen",
                width: "16%"
            },
            {
                field: "ects",
                header: this.translate.instant("VIEWS_KATALOZI_PREDMET_ECTS"), //"ECTS",
                width: "7%"
            }
        ];
    }*/
}
