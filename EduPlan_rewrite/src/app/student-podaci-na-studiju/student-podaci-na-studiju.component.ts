import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StudentPodaciStudijService } from "../demo/service/studentPodaciStudijService";
import { StudentPodaciStudij } from "../demo/domain/StudentPodaciStudij";
import { StudentiService } from "../_services/studenti.service";

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
        private studentPodaciService: StudentPodaciStudijService,
        private studentiService: StudentiService
    ) {}

    ngOnInit() {
        const params = {
            PkStudent: 2
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
                        this.podaciStudij = this.formatAllDates(data);
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

      formatAllDates(ApiData) {

        let locale = this.translate.instant("STUDENT_KALENDAR_LOCALE");
        let formattedData = [];
        ApiData.forEach(data => {
            
            data.DatumUpisaStudija ? data.DatumUpisaStudija = new Date(data.DatumUpisaStudija).toLocaleDateString(locale) :  data.DatumUpisaStudija = null;
            data.StudentskaPravaNaStudijuOd ? data.StudentskaPravaNaStudijuOd = new Date(data.StudentskaPravaNaStudijuOd).toLocaleDateString(locale) :  data.StudentskaPravaNaStudijuOd = null;
            data.StudentskaPravaNaStudijuDo ? data.StudentskaPravaNaStudijuDo = new Date(data.StudentskaPravaNaStudijuDo).toLocaleDateString(locale) :  data.StudentskaPravaNaStudijuDo = null;
            formattedData.push(data);
        });
        return formattedData;
    }

    isBoolean(val) {
        if (typeof val === "number") {
            return false;
        }
        return typeof val === "boolean";
    }
}
