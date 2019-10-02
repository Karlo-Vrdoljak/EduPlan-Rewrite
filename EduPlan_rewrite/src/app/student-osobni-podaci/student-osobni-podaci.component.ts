import { StudentPodaci } from './../demo/domain/student';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../demo/service/studentService';
import { StudentiService } from '../_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-osobni-podaci',
  templateUrl: './student-osobni-podaci.component.html',
  styleUrls: ['./student-osobni-podaci.component.css'],
})
export class StudentOsobniPodaciComponent implements OnInit {
  studentPodaci = <any>{};

  constructor(private studentService: StudentService, private studentiService: StudentiService) { }

  ngOnInit() {
    // this.studentService
    //   .getStudentData()
    //   .then(studentPodaci => (this.studentPodaci = studentPodaci));
    //   console.log(this.studentPodaci);

    const params = {
      PkStudent: 2
    };
    this.studentiService.getStudent(params).subscribe((data) => {
      this.studentPodaci = data;
      console.log(this.studentPodaci);
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client-side error occured.');
      } else {
        console.log('Server-side error occured.');
      }
    }, () => { });
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
