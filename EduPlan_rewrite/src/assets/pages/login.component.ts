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

       
      
        
    }

}
