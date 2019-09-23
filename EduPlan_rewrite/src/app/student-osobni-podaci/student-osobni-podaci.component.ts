import { StudentPodaci } from './../demo/domain/student';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../demo/service/studentService';
@Component({
  selector: 'app-student-osobni-podaci',
  templateUrl: './student-osobni-podaci.component.html',
  styleUrls: ['./student-osobni-podaci.component.css']
})
export class StudentOsobniPodaciComponent implements OnInit {
  studentPodaci: StudentPodaci;

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.studentService
      .getStudentData()
      .then(studentPodaci => (this.studentPodaci = studentPodaci));

  }

 /* formatAllDates() {
    this.studentPodaci.datumRodenja = new Date (this.studentPodaci.datumRodenja);
    this.studentPodaci.datumIspisa = new Date (this.studentPodaci.datumIspisa);
    this.studentPodaci.datumPodizanjaDokumenta = new Date (this.studentPodaci.datumPodizanjaDokumenta);
    this.studentPodaci.datumPravaDo = new Date (this.studentPodaci.datumPravaDo);
    this.studentPodaci.datumPravaOd = new Date (this.studentPodaci.datumPravaOd);
    this.studentPodaci.datumUpisa = new Date (this.studentPodaci.datumUpisa);

  }*/
}
