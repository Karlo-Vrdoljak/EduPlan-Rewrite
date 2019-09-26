import { OnInit, Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';
import { AppMenuComponent } from '../app.menu.component';
import { NgZone } from "@angular/core";
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { LanguageHandler } from '../app.languageHandler';

//Ovo triba bit jedan .ts file, ne cila komponenta, to triba prominit
@Component({
    providers: [AppMenuComponent],
    selector: 'app-translate-sidebar',
    templateUrl: './translate-sidebar.component.html',
    styleUrls: ['./translate-sidebar.component.css']
})
export class TranslateSidebarComponent implements OnInit {
    public data: any = [];

    constructor(
        private _route: ActivatedRoute,
        private _location: Location,
        private translate: TranslateService,
        private languageHandler: LanguageHandler,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService
    ) {
            const lang = this._route.snapshot.paramMap.get("lang");
            this.translate.use(this.languageHandler.setDefaultLanguage(lang).getCurrentLanguage());
            this._location.back();

    }

    ngOnInit() {}
}
