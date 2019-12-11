import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { OpciService } from "../../app/_services/opci.service";
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from '../../app/_interfaces/_configAppVariables';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';


@Component({
    selector: "login",
    templateUrl: "./login.component.html",

})
export class LoginComponent implements OnInit {

    constructor(
        public router: Router, 
        private opciService: OpciService, 
        private appVariables: AppVariables,

        ) { }

    ngOnInit() {
        
        
    }

    setUserConfig() {

       const params = {
            pkUsera: this.appVariables.PkUsera
        };

        this.opciService.getKorisnikPodaci(params).subscribe((data) => {
            data[0].PkStudent ? this.appVariables.PkStudent = data[0].PkStudent : this.appVariables.PkStudent = null;
            data[0].PkNastavnikSuradnik ? this.appVariables.PkNastavnikSuradnik =data[0].PkNastavnikSuradnik : this.appVariables.PkNastavnikSuradnik = null; //Provjera da li je rijeć o profesoru ili studentu i postavljanje na null onoga ko nije u pitanju
            this.router.navigate([
                this.appVariables.PkStudent? "/vStudentObavijesti" : "/vProfesorObavijesti"
            ]);
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
