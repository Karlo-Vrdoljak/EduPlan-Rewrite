import { Component, OnInit } from '@angular/core';
import { StudentiService } from '../_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-student-osobni-podaci',
  templateUrl: './student-osobni-podaci.component.html',
  styleUrls: ['./student-osobni-podaci.component.css'],
})
export class StudentOsobniPodaciComponent implements OnInit {
  studentPodaci = {} as any;

  constructor(private studentiService: StudentiService) { }

  ngOnInit() {

    const params = {
      PkStudent: 4
    };

    this.studentiService.getStudent(params).subscribe((data) => {
      this.studentPodaci = data[0];
      this.formatAllDates();
    },

    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client-side error occured.');
      } else {
        console.log('Server-side error occured.');
      }
    }, () => { });
  }

  formatAllDates() {
    this.studentPodaci.DatumRodjenja ? this.studentPodaci.DatumRodjenja = new Date(this.studentPodaci.DatumRodjenja) :  this.studentPodaci.DatumRodjenja = null;
    this.studentPodaci.DatumPravaDo ? this.studentPodaci.DatumPravaDo = new Date(this.studentPodaci.DatumPravaDo) :  this.studentPodaci.DatumPravaDo = null;
    this.studentPodaci.DatumPravaOd ? this.studentPodaci.DatumPravaOd = new Date(this.studentPodaci.DatumPravaOd) :  this.studentPodaci.DatumPravaOd = null;
    this.studentPodaci.DatumUpisa ? this.studentPodaci.DatumUpisa = new Date(this.studentPodaci.DatumUpisa) :  this.studentPodaci.DatumUpisa = null;
    this.studentPodaci.DatumIspisa ? this.studentPodaci.DatumIspisa = new Date(this.studentPodaci.DatumIspisa) : this.studentPodaci.DatumIspisa = null;
    this.studentPodaci.DatumPodizanjaDokumenta ? this.studentPodaci.DatumPodizanjaDokumenta = new Date(this.studentPodaci.DatumPodizanjaDokumenta) : this.studentPodaci.DatumPodizanjaDokumenta = null;
  }
}


