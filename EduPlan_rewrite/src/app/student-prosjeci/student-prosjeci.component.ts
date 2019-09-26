import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/primeng";
import { SubjectService } from "../demo/service/subjectService";
import { Subject } from "../demo/domain/subject";
import { ProsjekGodine } from "../demo/domain/prosjeci";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "app-student-prosjeci",
    templateUrl: "./student-prosjeci.component.html",
    styleUrls: ["./student-prosjeci.component.css"]
})
export class StudentProsjeciComponent implements OnInit {
    subjects: Subject[];
    cols: any[];
    _groupSubjects: ProsjekGodine[];
    godine: number[];
    rowGroupData: any;

    constructor(private subjectService: SubjectService, private translate: TranslateService) { }
    // suma ECTS polozeno, Prosjek ocjene, broj upisanih ects, prosjek polozenih ects/god
    ngOnInit() {
        this.subjectService
            .getSubjects()
            .then(subjects => (this.subjects = subjects));

        this.translate
            .get([
                "KATALOZI_KORISNIK_PREDMET",
                "VIEWS_KATALOZI_PREDMET_STUDIJ",
                "STUDENT_BDSTUDENTPREDMETI_OCJENA",
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
                        header: res.KATALOZI_KORISNIK_PREDMET /*"Predmet"*/,
                        width: "7%"
                    },
                    {
                        field: "studij",
                        header: res.VIEWS_KATALOZI_PREDMET_STUDIJ /*"Studij"*/,
                        width: "8%"
                    },
                    {
                        field: "ocjena",
                        header:
                            res.STUDENT_BDSTUDENTPREDMETI_OCJENA /*"Ocjena"*/,
                        width: "15%"
                    },
                    {
                        field: "semestar",
                        header:
                            res.VIEWS_KATALOZI_PREDMET_SEMESTAR /*"Semestar"*/,
                        width: "8%"
                    },
                    {
                        field: "voditelj",
                        header:
                            res.VIEWS_KATALOZI_PREDMET_VODITELJPREDMETA /*"Voditelj"*/,
                        width: "8%"
                    },
                    {
                        field: "polozenDaNe",
                        header:
                            res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN /*"Polozen"*/,
                        width: "16%"
                    },
                    {
                        field: "ects",
                        header: res.VIEWS_KATALOZI_PREDMET_ECTS /*"ECTS"*/,
                        width: "7%"
                    }
                ];
            });
    }

    onSort() {
        this.groupByYearForTable();
    }

    groupByYear() {
        const groups = [];
        this.subjects.forEach(function (item) {
            const list = groups[item.godina];

            if (list) {
                list.push(item);
            } else {
                groups[item.godina] = [item];
            }
        });
        return groups;
    }
    // polozenDaNe

    filterData() {
        // var allEcts = this.subjects.map(e => e.ects);
        this._groupSubjects = [];
        this.groupByYear().forEach(e => {
            if (e) {
                const result = {} as ProsjekGodine;
                let countPolozenoEcts = 0;
                let countPolozenoPredmeta = 0;
                let sumOcjena = 0;

                const sumEcts = e
                    .map(e => e.ects)
                    .reduce((a, b) => parseInt(a, 10) + parseInt(b, 10), 0);

                e.map(function (e) {
                    countPolozenoEcts +=
                        e.polozenDaNe === "Da" ? parseInt(e.ects, 10) : 0;
                });

                e.map(function (e) {
                    sumOcjena +=
                        e.polozenDaNe === "Da" ? parseInt(e.ocjena, 10) : 0;
                });

                e.map(function (e) {
                    countPolozenoPredmeta += e.polozenDaNe === "Da" ? 1 : 0;
                });

                result._sumEctsUpisano = sumEcts;
                result._avgECTS = (countPolozenoEcts / sumEcts) * 100;
                result._sumEctsPolozeno = countPolozenoEcts;
                result._avgOcjena = sumOcjena / countPolozenoPredmeta;
                this._groupSubjects.push(result);
            }
        });
        //console.log(this._groupSubjects);
    }

    groupByYearForTable() {
        this.rowGroupData = {};
        if (this.subjects) {
            for (let i = 0; i < this.subjects.length; i++) {
                const rowData = this.subjects[i];
                const godina = rowData.godina;
                if (i === 0) {
                    this.rowGroupData[godina] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.subjects[i - 1];
                    const previousRowGroup = previousRowData.godina;
                    if (godina === previousRowGroup) {
                        this.rowGroupData[godina].size++;
                    } else {
                        this.rowGroupData[godina] = { index: i, size: 1 };
                    }
                }
            }
            //console.log(this.rowGroupData);
            this.filterData();
        }
    }
}
