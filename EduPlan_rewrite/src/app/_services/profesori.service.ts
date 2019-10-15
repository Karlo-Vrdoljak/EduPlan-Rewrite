import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from "../config";
import { catchError, retry } from "rxjs/operators";
import { AppService } from "./app.service";

@Injectable({
    providedIn: "root"
})
export class ProfesorService {
    config: Config;

    constructor(private http: HttpClient, private appService: AppService) {
        this.config = new Config();
    }

     /*
     *  Select sve podatke o profesoru.
     *  Params: int ili null
     *  Returns: Niz od jednog objekta ili niz vise objekata
     */
    getNastavnik(data) {
        return this.http
            .get(this.config.API_URL + "Nastavnik", { params: data })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError("ProfesorService.getNastavnik")
                )
            );
    }
    
    /*
     *  Selecta sve obavijesti filtrirane po studentima.
     *  Params: int (pkUsera -> iz logina) ili null
     *  Returns: Niz objekata
     */
    getProfesorObavijesti(data) {
        return this.http
            .get(this.config.API_URL + "ProfesorObavijesti", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getProfesorObavijesti"
                    )
                )
            );
    }
}
