import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

//Ovo triba bit jedan .ts file, ne cila komponenta, to triba prominit
@Component ({
    selector: 'app-translate-sidebar',
    templateUrl: './translate-sidebar.component.html',
    styleUrls: ['./translate-sidebar.component.css']
})

export class TranslateSidebarComponent implements OnInit {

    constructor(
        private _route: ActivatedRoute,
        private _location: Location,
        private translate: TranslateService
    ) {
        const lang = this._route.snapshot.paramMap.get('lang');
        this.translate.use(lang);
        this._location.back();

    }

    ngOnInit() {}
}
