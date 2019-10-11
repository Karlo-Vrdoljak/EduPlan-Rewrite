import { Component, OnInit } from '@angular/core';
import { StudentiService } from '../_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-obavijesti',
  templateUrl: './student-obavijesti.component.html',
  styleUrls: ['./student-obavijesti.component.css']
})
export class StudentObavijestiComponent implements OnInit {
  
  StudentObavijesti = {} as any;

  constructor(private studentiService: StudentiService) { }

  ngOnInit() {
    const params = {
      PkUsera: 3675
    };

      this.studentiService.getStudentObavijesti(params).subscribe((data) => {
      this.StudentObavijesti = data;
      console.log(this.StudentObavijesti);
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
