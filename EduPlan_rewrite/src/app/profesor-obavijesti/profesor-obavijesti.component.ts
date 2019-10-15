import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../_services/profesori.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profesor-obavijesti',
  templateUrl: './profesor-obavijesti.component.html',
  styleUrls: ['./profesor-obavijesti.component.css']
})
export class ProfesorObavijestiComponent implements OnInit {

  ProfesorObavijesti: any;
  NemaObavijestiDogadanja : boolean = true;
  NemaObavijestiSluzbeno : boolean = true;
  NemaObavijestiOstalo : boolean = true;

  constructor(private profesorService: ProfesorService) { }

  ngOnInit() {
    const params = {
      PkUsera: 3675
    };
      
      this.profesorService.getProfesorObavijesti(params).subscribe((data) => {
      this.ProfesorObavijesti = data;

      for (let s of this.ProfesorObavijesti) {
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
