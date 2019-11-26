import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from "../config";
import { catchError, retry } from "rxjs/operators";
import { AppService } from "./app.service";
import { DatePipe } from '@angular/common'
import { isString } from 'util';
import { TranslateService } from "@ngx-translate/core";
import { ProfesorService } from './profesori.service';



@Injectable({
    providedIn: "root"
})
export class OpciService {
    config: Config;

    constructor(private http: HttpClient, 
        private appService: AppService,
        private translate: TranslateService,
        private profesorService: ProfesorService
        ) {    
            this.config = new Config();
    }


    /**
     * @Opis Selecta sve akademske godine. Temp service (tria filtrirat po pkUsera, za sta treba procedura)
     * @Params null
     * @Returns Niz objekata
     */
    getAkademskeGodine() {
        return this.http.get(this.config.API_URL + "AkademskaGodinaCombo", {}).pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.getAkademskeGodine"))
        );
    }

    /**
     *  @Opis Selecta pkStudent i pkNastavnikSuradnik na osnovu logiranog pkUsera
     *  @Params pkUsera
     *  @Returns niz od jednog objekta
     */
    getKorisnikPodaci(data) {
        return this.http
            .get(this.config.API_URL + "KorisnikPodaci", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(this.appService.handleError("OpciService.getKorisnikPodaci"))
            );
    }

    getDohvatDomicilnihVrijednostiEduCard(data) {
        return this.http
        .get(this.config.API_URL + "DohvatDomicilnihVrijednostiEduCard", {
            params: data
        })
        .pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.getDohvatDomicilnihVrijednostiEduCard"))
        );
    }
    postGetAuthToken() {
        return this.http
        .post(this.config.API_URL + "token", {})
        .pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.postGetAuthToken"))
        );
    }

     /**
     *  @Opis Formatira sve varijable zadanog niza objekata koje su iz baze dovucene kao string, a trebaju biti Date i format ovisi o odabranom jeziku
     *  @Params niz objekata nad kojim vršimo formatiranje, datepipe
     *  @Returns niz od jednog ili više objekata
     */
    formatDates(data: any) { 
        let locale = this.translate.instant("STUDENT_KALENDAR_LOCALE");

        data.forEach(element => {
          Object.keys(element).map(function (key) {
            if(!isNaN(Date.parse(element[key])) && isString(element[key])){
              element[key] = new Date(element[key]).toLocaleDateString(locale)
            }
          });
        });
        return data;
    }
    /**
     *  @Opis Donese sve kalendarske događaje povezane na poslani datum + dan prije, ali u poslanoj predavaonici
     *  @Params Datum, PkPredavaonica
     *  @Returns niz od jednog ili više objekata
     */
    getPrikazDogadajaNaDatum(data) {
        return this.http
            .get(this.config.API_URL + "PrikazDogadajaNaDatum", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(this.appService.handleError("OpciService.getPrikazDogadajaNaDatum"))
            );
    }
    /**
     * @Opis Dohvaca sve nastavne satnice sa svojim rednim brojem i vremenom od/do
     */
    getSveSatnicePoRednomBroju() {
        return this.http.get(this.config.API_URL + "SveSatnicePoRednomBroju", {}).pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.getSveSatnicePoRednomBroju"))
        );
    }
}
