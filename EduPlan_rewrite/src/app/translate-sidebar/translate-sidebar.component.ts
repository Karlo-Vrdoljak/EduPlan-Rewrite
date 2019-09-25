import { OnInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';
import { AppMenuComponent } from '../app.menu.component';

@Component({
    providers: [AppMenuComponent],
    selector: "app-translate-sidebar",
    templateUrl: "./translate-sidebar.component.html",
    styleUrls: ["./translate-sidebar.component.css"]
})
export class TranslateSidebarComponent implements OnInit {
    constructor(
        private _route: ActivatedRoute,
        private _location: Location,
        private translate: TranslateService,
        private appSideBar: AppMenuComponent,
    ) {
        let lang = this._route.snapshot.paramMap.get("lang");
        this.translate.use(lang);
        this._location.back();
    }

    ngOnInit() {}
}
