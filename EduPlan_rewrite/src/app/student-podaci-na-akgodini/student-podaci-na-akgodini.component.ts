import { Component, OnInit } from '@angular/core';
import { StudentiService } from '../_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-student-podaci-na-akgodini',
  templateUrl: './student-podaci-na-akgodini.component.html',
  styleUrls: ['./student-podaci-na-akgodini.component.css']
})
export class StudentPodaciNaAkgodiniComponent implements OnInit {

  studentPodaciNaAkGodinama: any;
  academicYear: string;
  studentPodaciNaAkGodiniFiltrirani: any;
 
  constructor(private studentiService: StudentiService) { }

  ngOnInit() {
    const params = {
      PkStudent: 333
    };

    this.studentiService.getStudentNaAkGodini(params).subscribe((data) => {
      this.studentPodaciNaAkGodinama = data;
      this.filterByYearOnInit(this.studentPodaciNaAkGodinama[this.studentPodaciNaAkGodinama.length - 1].SkolskaGodinaNaziv);
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
      this.studentPodaciNaAkGodiniFiltrirani.DatumIzdavanjaPotvrdeOPrebivalistu ? this.studentPodaciNaAkGodiniFiltrirani.DatumIzdavanjaPotvrdeOPrebivalistu = new Date(this.studentPodaciNaAkGodiniFiltrirani.DatumIzdavanjaPotvrdeOPrebivalistu) :  this.studentPodaciNaAkGodiniFiltrirani.DatumIzdavanjaPotvrdeOPrebivalistu = null;
  }

  filterByYearOnInit(CurrentAcademicYear) {
    this.academicYear = CurrentAcademicYear;
    this.studentPodaciNaAkGodiniFiltrirani = this.studentPodaciNaAkGodinama.filter((studentPodaciNaAkGodini) => studentPodaciNaAkGodini.SkolskaGodinaNaziv === this.academicYear)[0];
    this.formatAllDates(); 
  }
  
  filterByYearOnChange(e) {
    this.academicYear = e.originalEvent.target.innerText;
    this.studentPodaciNaAkGodiniFiltrirani = this.studentPodaciNaAkGodinama.filter((studentPodaciNaAkGodini) => studentPodaciNaAkGodini.SkolskaGodinaNaziv === this.academicYear)[0];
    this.formatAllDates();
  }
}
