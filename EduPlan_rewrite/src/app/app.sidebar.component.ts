/************************************************************************************************************************************************************
 ** File
 ** Name      :      app.sidebar
 ** DESC      :      Side bar navigacija 
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
import {Component, Inject, forwardRef} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import {AppComponent} from './app.component';

@Component({
    selector: "app-sidebar",
    templateUrl: "./app.sidebar.component.html"
})
export class AppSideBarComponent {
        translate: TranslateService;

    constructor(public app: AppComponent, translate: TranslateService) {
        this.translate = translate;

    }

    useLanguage(language: string) {
        this.translate.use(language);
    }
}
