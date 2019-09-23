import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../demo/service/subjectService';
import { Subject } from '../demo/domain/subject';


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
    selectedSubject: Subject;


    constructor(private subjectService: SubjectService) {}

    ngOnInit() {
      this.subjectService
          .getSubjects()
          .then(subjects => (this.subjects = subjects));
      this.cols = [// 7, 25, 8,15,8,8,16,7
          { field: "predmet", header: "Predmet", width: '7%' },
          { field: "godina", header: "Godina", width: '25%' },
          { field: "studij", header: "Studij", width: '8%' },
          { field: "ocjena", header: "Ocjena", width: '15%' },
          { field: "semestar", header: "Semestar", width: '8%' },
          { field: "voditelj", header: "Voditelj", width: '8%' },
          { field: "polozenDaNe", header: "Polozen", width: '16%' },
          { field: "ects", header: "ECTS" , width: '7%'}
      ];
    }
}
