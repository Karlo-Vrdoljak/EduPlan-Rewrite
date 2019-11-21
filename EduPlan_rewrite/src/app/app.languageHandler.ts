import { TranslateService } from "@ngx-translate/core";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { Inject } from "@angular/core";

export class LanguageHandler {
    private data: any = [];
    constructor(
        private translate: TranslateService,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    ) {
        // let auth = this.storage.get('EduPlanKarticeToken');
         //let token = this.cookieService.get('EduPlanKarticeToken');
         //let refToken = this.storage.get("authorizationData");
        // console.log(token);
   
        // this.storage.set('token',token);
        // this.storage.set('refToken',refToken);
        // console.log( document.cookie.replace(/(?:(?:^|.*;s*)token*=s*([^;]*).*$)|^.*$/, '$1') ); 
        //  localStorage.setItem('token', document.cookie.replace(/(?:(?:^|.*;s*)token*=s*([^;]*).*$)|^.*$/, '$1'));
        //  localStorage.setItem('refToken', document.cookie.replace(/(?:(?:^|.*;s*)token*=s*([^;]*).*$)|^.*$/, '$1'));

        
    }

    private saveInLocal(key, val): void {
        this.storage.set(key, val);
        this.data[key] = this.storage.get(key);
    }

    private getFromLocal(key): void {
        this.data[key] = this.storage.get(key);
    }

    getCurrentLanguage() { return this.data["lang"]; }

    setDefaultLanguage(lang?:string) {
        if(lang == null){
            this.getFromLocal("lang");
            if (this.data["lang"] != null) {
                this.translate.setDefaultLang(this.data["lang"]);
                this.translate.use(this.data["lang"]);
            } else {
                this.saveInLocal("lang", "hr");
                this.translate.setDefaultLang("hr");
                this.translate.use("hr");
            }
        } else {
            this.saveInLocal("lang", lang);
            this.translate.setDefaultLang(lang);
            this.translate.use(lang);
        }
        
        return this;
    }
}
