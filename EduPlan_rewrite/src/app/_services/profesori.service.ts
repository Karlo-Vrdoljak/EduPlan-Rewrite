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

     /*
     *  Select raspored nastavnika za odredeni period.
     *  Params: int,string `YYYY-MM-DD`, string `YYYY-MM-DD`
     *  Returns: Niz od više objekata ili jednog objekta
     */
    getNastavnikRaspored(data) {
        // const headerdata = {
            // 'Content-Type':'application/json',
            // 'Authorization':'Basic c3R1ZDpzdHVk'
        // }
        return this.http
            .get(this.config.API_URL + "PrikazRasporedaProfesor",
                {
                    params: data
                    // headers: headerdata
                }
            )
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getNastavnikRaspored"
                    )
                )
            );
    }

    /*
     *  Select svih predmeta koji pripadaju profesoru.
     *  Params: pkSkolska godina int, PkNastavnikSuradnik
     *  Returns: Niz od više objekata ili jednog objekta
     */
    getNastavnikPredmeti(data) {
        return this.http
            .get(this.config.API_URL + "PrikazPredmetaProfesor",
                {
                    params: data
                }
            )
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getNastavnikPredmeti"
                    )
                )
            );
    }
}
