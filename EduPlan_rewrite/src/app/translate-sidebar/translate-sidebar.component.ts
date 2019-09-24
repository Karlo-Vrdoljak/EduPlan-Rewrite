import { OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';

export class TranslateSidebarComponent implements OnInit {
    constructor(
        private _route: ActivatedRoute,
        private _location: Location,
        private translate: TranslateService
    ) {
        let lang = this._route.snapshot.paramMap.get("lang");
        this.translate.use(lang);
        this._location.back();

    }

    ngOnInit() {}
}
