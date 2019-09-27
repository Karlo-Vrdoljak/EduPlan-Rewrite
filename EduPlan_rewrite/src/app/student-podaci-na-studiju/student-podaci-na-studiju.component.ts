import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StudentPodaciStudijService } from "../demo/service/studentPodaciStudijService";
import { StudentPodaciStudij } from "../demo/domain/StudentPodaciStudij";

@Component({
    selector: "app-student-podaci-na-studiju",
    templateUrl: "./student-podaci-na-studiju.component.html",
    styleUrls: ["./student-podaci-na-studiju.component.css"],
})

export class StudentPodaciNaStudijuComponent implements OnInit {
    podaciStudij: StudentPodaciStudij[];
    cols: any[];
    colsSmall: any[];

    constructor(
        private translate: TranslateService,
        private studentPodaciService: StudentPodaciStudijService
    ) {}

    ngOnInit() {
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

                this.colsSmall = [
                    {
                        field: "studij",
                        header: res.STUDENT_BDSTUDENTPREDMETI_STUDIJ
                        //                        width: "7%"
                    }];
            });
    }
}
