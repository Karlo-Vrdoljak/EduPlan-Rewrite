import { Component, OnInit } from '@angular/core';
import { StudentPodaciNaAkGodini } from './../demo/domain/studentPodaciNaAkGodini';
import { StudentPodaciNaAkGodiniService } from '../demo/service/studentPodaciNaAkGodiniService';

@Component({
  selector: 'app-student-podaci-na-akgodini',
  templateUrl: './student-podaci-na-akgodini.component.html',
  styleUrls: ['./student-podaci-na-akgodini.component.css']
})
export class StudentPodaciNaAkgodiniComponent implements OnInit {

  studentPodaciNaAkGodini: StudentPodaciNaAkGodini;

  constructor(private studentPodaciNaAkGodiniService: StudentPodaciNaAkGodiniService) { }

  ngOnInit() {
    this.studentPodaciNaAkGodiniService
    .getStudentNaAkGodiniData()
    .then(studentPodaciNaAkGodini => (this.studentPodaciNaAkGodini = studentPodaciNaAkGodini));

  }

}
