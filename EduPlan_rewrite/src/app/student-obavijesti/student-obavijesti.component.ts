import { Component, OnInit } from '@angular/core';
import { StudentiService } from '../_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../_interfaces/_configAppVariables';

@Component({
  selector: 'app-student-obavijesti',
  templateUrl: './student-obavijesti.component.html',
  styleUrls: ['./student-obavijesti.component.css']
})
export class StudentObavijestiComponent implements OnInit {
  
  StudentObavijesti: any;
  NemaObavijestiDogadanja : boolean = true;
  NemaObavijestiSluzbeno : boolean = true;
  NemaObavijestiOstalo : boolean = true;


  constructor(
    private studentiService: StudentiService,
    private appVariables: AppVariables
    ) { }

  ngOnInit() {
    const params = {
        PkUsera: this.appVariables.PkUsera
    };
      
      this.studentiService.getStudentObavijesti(params).subscribe((data) => {
      this.StudentObavijesti = data;

      for (let s of this.StudentObavijesti) {
        if(s.PkTipObavijesti === 1) { this.NemaObavijestiDogadanja = false }
        if(s.PkTipObavijesti === 2) { this.NemaObavijestiSluzbeno = false } 
        if(s.PkTipObavijesti === 3) { this.NemaObavijestiOstalo = false } 
      }
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
