import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from "../config";
import { catchError, retry } from "rxjs/operators";
import { AppService } from "./app.service";

@Injectable({
    providedIn: "root"
})
export class OpciService {
    config: Config;

    constructor(private http: HttpClient, private appService: AppService) {
        this.config = new Config();
    }

    /*
     *  Selecta sve akademske godine. Temp service (tria filtrirat po pkUsera, za sta treba procedura)
     *  Params: null
     *  Returns: Niz objekata
     */
    getAkademskeGodine() {
        return this.http
            .get(this.config.API_URL + "AkademskaGodinaCombo", {})
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "OpciService.getAkademskeGodine"
                    )
                )
            );
    }

    /*
     *  Selecta pkStudent i pkNastavnikSuradnik na osnovu logiranog pkUsera
     *  Params: pkUsera
     *  Returns: niz od jednog objekta
     */
    getKorisnikPodaci(data) {
        return this.http
            .get(this.config.API_URL + "KorisnikPodaci", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "OpciService.getKorisnikPodaci"
                    )
                )
            );
    }
}