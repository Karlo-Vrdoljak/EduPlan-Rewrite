import { OnInit, Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';
import { AppMenuComponent } from '../app.menu.component';
import { NgZone } from "@angular/core";
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

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
        private appSideBar: AppMenuComponent,
        private zone: NgZone,
        private router: Router,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService
    ) {
            const lang = this._route.snapshot.paramMap.get("lang");
            this.translate.use(lang);
            this._location.back();

    }

    ngOnInit() {}

/*
    ngOnInit() {
        const lang = this._route.snapshot.paramMap.get("lang");
        this.getFromLocal("lang");
        if (this.data["lang"] == lang){
            //this._location.back();
        } else {
            this.saveInLocal("lang",lang);
            this.translate.use(lang);
            //this._location.back();
            window.location.reload();
        }
    }

    saveInLocal(key, val): void {
        console.log("recieved= key:" + key + "value:" + val);
        this.storage.set(key, val);
        this.data[key] = this.storage.get(key);
    }

    getFromLocal(key): void {
        console.log("recieved= key:" + key);
        this.data[key] = this.storage.get(key);
        console.log(this.data);
    }
*/
}
