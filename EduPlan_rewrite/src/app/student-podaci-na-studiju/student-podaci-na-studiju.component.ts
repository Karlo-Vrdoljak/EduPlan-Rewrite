import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { AppVariables } from '../_interfaces/_configAppVariables';
import { OpciService } from './../_services/opci.service';

@Component({
    selector: "app-student-podaci-na-studiju",
    templateUrl: "./student-podaci-na-studiju.component.html",
    styleUrls: ["./student-podaci-na-studiju.component.css"]
})
export class StudentPodaciNaStudijuComponent implements OnInit {
    podaciStudij: any;
    cols: any[];
    colsSmall: any[];

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
                this.studentiService
                    .getStudentStudij(params)
                    .subscribe(data => {
                        this.podaciStudij = this.opciService.formatDates(data);
                        this.cols = [
                            // 7, 25, 8,15,8,8,16,7
                            {
                                field: "StudijNaziv",
                                header: res.STUDENT_BDSTUDENTPREDMETI_STUDIJ
                                //                        width: "7%"
                            },
                            {
                                field: "DatumUpisaStudija",
                                header:
                                    res.STUDENT_BDSTUDENTPODACINASTUDIJU_DATUM_UPISA
                                //                        width: "12%"
                            },
                            {
                                field: "StudentskaPravaNaStudijuOd",
                                header:
                                    res.STUDENT_BDSTUDENTPODACINASTUDIJU_STUDENTSKA_PRAVA_OD
                                //                        width: "13%"
                            },
                            {
                                field: "StudentskaPravaNaStudijuDo",
                                header:
                                    res.STUDENT_BDSTUDENTPODACINASTUDIJU_STUDENTSKA_PRAVA_DO
                                //                        width: "13%"
                            },
                            {
                                field: "TemeljFinanciranjaNaziv",
                                header:
                                    res.STUDENT_BDSTUDENTPODACINASTUDIJU_TEMELJ_FINANCIRANJA
                                //                        width: "13%"
                            },
                            {
                                field: "PlacanjeDaNe",
                                header:
                                    res.STUDENT_BDSTUDENTPODACINASTUDIJU_PLACANJE
                                //                        width: "12%"
                            },
                            {
                                field: "NastavnaGodina",
                                header:
                                    res.STUDENT_BDSTUDENTPODACINASTUDIJU_NASTAVNA_GODINA
                                //                        width: "10%"
                            },
                            {
                                field: "SerijskiBrojIndexa",
                                header:
                                    res.STUDENT_BDSTUDENTPODACINASTUDIJU_SERIJSKI_BROJ_INDEKSA /*"ECTS"*/
                                //                        width: "10%"
                            }
                        ];

                        this.colsSmall = [
                            {
                                field: "StudijNaziv",
                                header: res.STUDENT_BDSTUDENTPREDMETI_STUDIJ
                                //                        width: "7%"
                            }
                        ];
                    });
            });
    }

    isBoolean(val) {
        if (typeof val === "number") {
            return false;
        }
        return typeof val === "boolean";
    }
}
