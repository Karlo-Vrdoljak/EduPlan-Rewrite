import { Component, OnInit } from '@angular/core';
import { StudentiService } from '../_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';
import { OpciService } from './../_services/opci.service';

@Component({
  selector: 'app-student-osobni-podaci',
  templateUrl: './student-osobni-podaci.component.html',
  styleUrls: ['./student-osobni-podaci.component.css'],
})
export class StudentOsobniPodaciComponent implements OnInit {
  studentPodaci: any;

  constructor(
    private studentiService: StudentiService,
    private opciService: OpciService,
    private appVariables: AppVariables    
    ) { }

  ngOnInit() {

    const params = {
      PkStudent: this.appVariables.PkStudent
    };

    this.studentiService.getStudent(params).subscribe((data) => {
      this.studentPodaci = this.opciService.formatDates(data)[0];
    },

    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client-side error occured.');
      } else {
        console.log('Server-side error occured.');
      }
    }, () => { });
  }

}


