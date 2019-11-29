/************************************************************************************************************************************************************
 ** File
 ** Name      :      student-podaci-na-ak-godini
 ** DESC      :      Tab view sa svim ak.godinama koje je student pohađao i podacima vezanim za pripadajuće
                     ak. godine
 **
 ** Author    :      Filip Bikić
 ** Date      :      29.11.2019.
 *************************************************************************************************************************************************************
 ** Change history :
 *************************************************************************************************************************************************************
 ** Date:                   Author:                    Description :
 **------------             ------------- -------------------------------------
 **
 *************************************************************************************************************************************************************/
import { Component, OnInit } from '@angular/core';
import { StudentiService } from '../_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';
import { OpciService } from './../_services/opci.service';


@Component({
  selector: 'app-student-podaci-na-akgodini',
  templateUrl: './student-podaci-na-akgodini.component.html',
  styleUrls: ['./student-podaci-na-akgodini.component.css']
})
export class StudentPodaciNaAkgodiniComponent implements OnInit {

  studentPodaciNaAkGodinama: any;
  academicYear: string;
  studentPodaciNaAkGodiniFiltrirani: any;
 
  constructor(
    private studentiService: StudentiService,
    private appVariables: AppVariables,
    private opciService: OpciService
    ) { }

  ngOnInit() {
    const params = {
      PkStudent: this.appVariables.PkStudent
    }; 

    this.studentiService.getStudentNaAkGodini(params).subscribe((data) => {
      this.studentPodaciNaAkGodinama = this.opciService.formatDates(data);
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

  filterByYearOnInit(CurrentAcademicYear) {
    this.academicYear = CurrentAcademicYear;
    this.studentPodaciNaAkGodiniFiltrirani = this.studentPodaciNaAkGodinama.filter((studentPodaciNaAkGodini) => studentPodaciNaAkGodini.SkolskaGodinaNaziv === this.academicYear)[0];
  }
  
  filterByYearOnChange(e) {
    this.academicYear = e.originalEvent.target.innerText;
    this.studentPodaciNaAkGodiniFiltrirani = this.studentPodaciNaAkGodinama.filter((studentPodaciNaAkGodini) => studentPodaciNaAkGodini.SkolskaGodinaNaziv === this.academicYear)[0];
  }
}
