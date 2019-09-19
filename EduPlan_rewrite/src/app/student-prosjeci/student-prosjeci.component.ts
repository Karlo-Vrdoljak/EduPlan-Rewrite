import { Component, OnInit } from '@angular/core';
import { MenuItem } from "primeng/primeng";
import { SubjectService } from "../demo/service/subjectService";
import { Subject } from "../demo/domain/subject";

@Component({
    selector: "app-student-prosjeci",
    templateUrl: "./student-prosjeci.component.html",
    styleUrls: ["./student-prosjeci.component.css"]
})
export class StudentProsjeciComponent implements OnInit {
    subjects: Subject[];
    cols: any[];
    groupSubjects:any;
    godine:number[];
    constructor(private subjectService: SubjectService) {}

    ngOnInit() {
      this.subjectService
          .getSubjects()
          .then(subjects => (this.subjects = subjects))
          .then(subjects => (this.godine = subjects.map(e => e.godina))
          );
      this.godine.filter((val,id,self) => { return self.indexOf(val) === id; })
      this.godine.forEach(e => {
        console.log(e);
      });
      this.groupSubjects = this.subjects.filter(s => s.godina)
    }
}
