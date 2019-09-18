import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { SubjectService } from '../service/subjectService';
import { Subject } from '../domain/subject';

@Component({
    templateUrl: './emptydemo.component.html',
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

export class EmptyDemoComponent implements OnInit {

    subjects: Subject[];
    cols: any[];
    selectedSubject: Subject;

    studentNavigationModel: MenuItem[];

    constructor(private subjectService: SubjectService) {}

    ngOnInit() {
        this.studentNavigationModel = [
            {
                label: "Student",
                items: [
                    { label: "Osobni podaci", icon: "fa fa-user fa-fw" },
                    {
                        label: "Podaci na studiju",
                        icon: "fa fa-graduation-cap fa-fw"
                    },
                    { label: "Predmeti", icon: "fa fa-book fa-fw" },
                    { label: "Raspored", icon: "fa fa-calendar fa-fw" }
                ]
            }
        ];
        this.subjectService.getSubjects().then(subjects => (this.subjects = subjects));
        this.cols = [
            { field: "kraticaPredmeta", header: "Kratica" },
            { field: "predmet", header: "Predmet" },
            { field: "studij", header: "Studij" },
            { field: "semestar", header: "Semestar" },
            { field: "voditelj", header: "Voditelj" },
            { field: 'ects', header: 'ECTS' }

        ];
    }
}
