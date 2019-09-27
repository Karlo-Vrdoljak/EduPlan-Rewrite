import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StudentPodaciStudijService } from "../demo/service/studentPodaciStudijService";
import { StudentPodaciStudij } from "../demo/domain/StudentPodaciStudij";

@Component({
    selector: "app-student-podaci-na-studiju",
    templateUrl: "./student-podaci-na-studiju.component.html",
    styleUrls: ["./student-podaci-na-studiju.component.css"],
    /*
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
    */
})
export class StudentPodaciNaStudijuComponent implements OnInit {
    podaciStudij: StudentPodaciStudij[];
    cols: any[];

    constructor(
        private translate: TranslateService,
        private studentPodaciService: StudentPodaciStudijService
    ) {}
    /*
    fullScreen() {
      // Kind of painful, but this is how it works for now
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(res => { console.log(res);});
        }
    }
    */

    ngOnInit() {
    //    this.fullScreen();
    //    screen.orientation.lock("landscape-primary").catch(res => {console.log(res);});
        this.studentPodaciService
            .getStudentPodaciStudij()
            .then(podaciStudij => (this.podaciStudij = podaciStudij));

        this.translate
            .get([
                //"STUDENT_BDSTUDENTPREDMETI_KRATICA_STUDIJA",
                "STUDENT_BDSTUDENTPREDMETI_STUDIJ",
                //"STUDENT_BDSTUDENTPODACINASTUDIJU_SIFRA_UPISNOG_LISTA",
                "STUDENT_BDSTUDENTPODACINASTUDIJU_DATUM_UPISA",
                //"STUDENT_BDSTUDENTPODACINASTUDIJU_INDIKATOR_UPISA",
                "STUDENT_BDSTUDENTPODACINASTUDIJU_STUDENTSKA_PRAVA_OD",
                "STUDENT_BDSTUDENTPODACINASTUDIJU_STUDENTSKA_PRAVA_DO",
                //"STUDENT_BDSTUDENTPODACINASTUDIJU_STUDIJ_U_PREKIDU",
                //"STUDENT_BDSTUDENTPODACINASTUDIJU_RAZLOG_PRESTANKA_STUDENTSKIH_PRAVA",
                "STUDENT_BDSTUDENTPODACINASTUDIJU_TEMELJ_FINANCIRANJA",
                "STUDENT_BDSTUDENTPODACINASTUDIJU_PLACANJE",
                "STUDENT_BDSTUDENTPODACINASTUDIJU_NASTAVNA_GODINA",
                //"STUDENT_BDSTUDENTPODACINASTUDIJU_POSEBAN_STATUS_STUDENTA",
                //"STUDENT_BDSTUDENTPODACINASTUDIJU_TIP_INDEKSA",
                "STUDENT_BDSTUDENTPODACINASTUDIJU_SERIJSKI_BROJ_INDEKSA"
            ])
            .subscribe(res => {
                this.cols = [
                    // 7, 25, 8,15,8,8,16,7
                    {
                        field: "studij",
                        header: res.STUDENT_BDSTUDENTPREDMETI_STUDIJ
                        //                        width: "7%"
                    },
                    {
                        field: "datumUpisa",
                        header: res.STUDENT_BDSTUDENTPODACINASTUDIJU_DATUM_UPISA
                        //                        width: "12%"
                    },
                    {
                        field: "studentskaPravaOd",
                        header:
                            res.STUDENT_BDSTUDENTPODACINASTUDIJU_STUDENTSKA_PRAVA_OD
                        //                        width: "13%"
                    },
                    {
                        field: "studentskaPravaDo",
                        header:
                            res.STUDENT_BDSTUDENTPODACINASTUDIJU_STUDENTSKA_PRAVA_DO
                        //                        width: "13%"
                    },
                    {
                        field: "temeljFinanciranja",
                        header:
                            res.STUDENT_BDSTUDENTPODACINASTUDIJU_TEMELJ_FINANCIRANJA
                        //                        width: "13%"
                    },
                    {
                        field: "placanje",
                        header: res.STUDENT_BDSTUDENTPODACINASTUDIJU_PLACANJE
                        //                        width: "12%"
                    },
                    {
                        field: "nastavnaGodina",
                        header:
                            res.STUDENT_BDSTUDENTPODACINASTUDIJU_NASTAVNA_GODINA
                        //                        width: "10%"
                    },
                    {
                        field: "serijskiBrojIndeksa",
                        header:
                            res.STUDENT_BDSTUDENTPODACINASTUDIJU_SERIJSKI_BROJ_INDEKSA /*"ECTS"*/
                        //                        width: "10%"
                    }
                ];
            });
    }
}
