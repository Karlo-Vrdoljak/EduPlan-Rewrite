import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/primeng";
import { SubjectService } from "../demo/service/subjectService";
import { Subject } from "../demo/domain/subject";
import { ProsjekGodine } from "../demo/domain/prosjeci";
import { TranslateService } from "@ngx-translate/core";
import { AccordionModule } from "primeng/accordion";
import { StudentiService } from "../_services/studenti.service";

@Component({
    selector: "app-student-prosjeci",
    templateUrl: "./student-prosjeci.component.html",
    styleUrls: ["./student-prosjeci.component.css"]
})
export class StudentProsjeciComponent implements OnInit {
    subjects: any;
    cols: any[];
    _groupSubjects:any;
    godine: number[];
    rowGroupData: any;

    constructor(
        private subjectService: SubjectService,
        private translate: TranslateService,
        private studentiService: StudentiService
    ) {}
    // suma EctsBodovi polozeno, Prosjek ocjene, broj upisanih EctsBodovi, prosjek polozenih EctsBodovi/god
    ngOnInit() {
        const params = {
            PkStudent: 420
        };
        
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
                this.studentiService
                    .getStudentNaVisokomUcilistuPredmet(params)
                    .subscribe(data => {
                        this.subjects = data;
                        this.cols = [
                            // 7, 25, 8,15,8,8,16,7
                            {
                                field: "PredmetNaziv",
                                header:
                                    res.KATALOZI_KORISNIK_PREDMET /*"Predmet"*/,
                                width: "7%"
                            },
                            {
                                field: "StudijNaziv",
                                header:
                                    res.VIEWS_KATALOZI_PREDMET_STUDIJ /*"Studij"*/,
                                width: "8%"
                            },
                            {
                                field: "Ocjena",
                                header:
                                    res.STUDENT_BDSTUDENTPREDMETI_OCJENA /*"Ocjena"*/,

                                width: "15%"
                            },
                            {
                                field: "Semestar",
                                header:
                                    res.VIEWS_KATALOZI_PREDMET_SEMESTAR /*"Semestar"*/,
                                width: "8%"
                            },
                            {
                                field: "VoditeljPredmeta",
                                header:
                                    res.VIEWS_KATALOZI_PREDMET_VODITELJPREDMETA /*"Voditelj"*/,
                                width: "8%"
                            },
                            {
                                field: "PolozenDaNe",
                                header:
                                    res.KATALOZI_NASTAVNIKSURADNIKPREDMETI_POLOZEN /*"Polozen"*/,
                                width: "16%"
                            },
                            {
                                field: "EctsBodovi",
                                header:
                                    res.VIEWS_KATALOZI_PREDMET_ECTS /*"EctsBodovi"*/,
                                width: "7%"
                            }
                        ];

                    });
            });
    }

    onSort() {
        this.groupByYearForTable();
    }

    groupByYear() {
        const groups = [];
        this.subjects.forEach(function(item) {
            const list = groups[item.StudijskaGodina];

            if (list) {
                list.push(item);
            } else {
                groups[item.StudijskaGodina] = [item];
            }
        });
        return groups;
    }
    // PolozenDaNe

    filterData() {
        // var allEcts = this.subjects.map(e => e.EctsBodovi);
        this._groupSubjects = this.groupByYear();
        for(let i = 0; i < this._groupSubjects.length; i++){
            if (this._groupSubjects[i]) {
                const result = {} as ProsjekGodine;
                let countPolozenoEcts = 0;
                let countPolozenoPredmeta = 0;
                let sumOcjena = 0;
                const sumEcts = this._groupSubjects[i]
                    .map(e => e.EctsBodovi)
                    .reduce((a, b) => (isNaN(parseInt(a, 10)) ? 0 : parseInt(a, 10)) + (isNaN(parseInt(b, 10)) ? 0 : parseInt(b, 10)), 0);

                    this._groupSubjects[i].map(function(e) {
                    countPolozenoEcts +=
                        e.PolozenDaNe == true ? ( isNaN(parseInt(e.EctsBodovi, 10)) ? 0 : parseInt(e.EctsBodovi, 10)) : 0;
                    });
                    this._groupSubjects[i].map(function(e) {
                    sumOcjena +=
                        e.PolozenDaNe == true ? (isNaN(parseInt(e.Ocjena, 10)) ? 0 : parseInt(e.Ocjena, 10) ): 0;
                });

                this._groupSubjects[i].map(function(e) {
                    countPolozenoPredmeta += e.PolozenDaNe == true ? 1 : 0;
                });
                //console.log(sumEcts);
                result._sumEctsUpisano = sumEcts;
                result._avgECTS = (
                    (isNaN(countPolozenoEcts / sumEcts) ? 0 : (countPolozenoEcts / sumEcts)) * 100
                ).toFixed(2);
                result._sumEctsPolozeno = countPolozenoEcts;
                result._avgOcjena = (
                    isNaN(sumOcjena / countPolozenoPredmeta) ? 0 : sumOcjena / countPolozenoPredmeta)
                    .toFixed(2);
                this._groupSubjects[i] = result;
            }
        }

    }

    isBoolean(val) {
        if (typeof val === "number") {
            return false;
        }
        return typeof val === "boolean";
    }

    groupByYearForTable() {
        //console.log(this.subjects);
        this.rowGroupData = {};
        if (this.subjects) {
            for (let i = 0; i < this.subjects.length; i++) {
                const rowData = this.subjects[i];
                const StudijskaGodina = rowData.StudijskaGodina;
                if (i === 0) {
                    this.rowGroupData[StudijskaGodina] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.subjects[i - 1];
                    const previousRowGroup = previousRowData.StudijskaGodina;
                    if (StudijskaGodina === previousRowGroup) {
                        this.rowGroupData[StudijskaGodina].size++;
                    } else {
                        this.rowGroupData[StudijskaGodina] = {
                            index: i,
                            size: 1
                        };
                    }
                }
            }
            //console.log(this.rowGroupData);
            this.filterData();
        }
    }
}
