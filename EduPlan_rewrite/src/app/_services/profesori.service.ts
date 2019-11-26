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
            .get(this.config.API_URL + "PrikazRasporedaProfesor", {
                params: data
                // headers: headerdata
            })
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
            .get(this.config.API_URL + "PrikazPredmetaProfesor", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getNastavnikPredmeti"
                    )
                )
            );
    }

    /*
     *  Select odabranog predmeta na studiju i prikaz osnovnih iformacija.
     *  Params: PkSkolskaGodinaStudijPredmetKatedra
     *  Returns: Niz od  jednog objekta
     */
    getPredmetOsnovniPodaci(data) {
        //Dummy service
        return this.http
            .get(this.config.API_URL + "PrikazPredmetaOsnovniPodaci", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getPredmetOsnovniPodaci"
                    )
                )
            );
    }

    /*
     *  Select svih studenata koji slušaju odabrani predmet.
     *  Params: PkSkolskaGodinaStudijPredmetKatedra
     *  Returns: Niz od  jednog ili više objekata
     */
    getPredmetStudenti(data) {
        return this.http
            .get(this.config.API_URL + "PrikazStudenataPoPredmetu", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getPredmetStudenti"
                    )
                )
            );
    }

    /*
     *  Select svih Nastavnih cjelina koje se obrađuju na predmetu.
     *  Params: pkPredmet i pkStudijskaGodina (sa dummy procedurom nista)
     *  Returns: Niz od  jednog ili više objekata
     */
    getPredmetNastavneCjeline(data) {
        return this.http
            .get(this.config.API_URL + "PrikazNastavnihCjelina", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getPredmetNastavneCjeline"
                    )
                )
            );
    }
    /*
     *  Select svih Nastavnih cjelina koje se obrađuju na predmetu.
     *  Params: pkPredmet i pkStudijskaGodina (sa dummy procedurom nista)
     *  Returns: Niz od  jednog ili više objekata
     */
    getNastavnikSuradnikSvi() {
        return this.http
            .get(this.config.API_URL + "NastavnikSuradnikSvi", {})
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getNastavnikSuradnikSvi"
                    )
                )
            );
    }
    /**
     * 
     * @Opis Realizira nastavu koja se odvila tocno po planu
     * @Param PkNastavaPlan, PkNastavnikSuradnik, PkUsera, PrisutniStudenti: [{..},{..},...]
     */
    postNastavaRealizacijaPlana(data) {
        return this.http.post(this.config.API_URL + "NastavaRealizacijaPlana", {
            params: data
        }).pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("ProfesorService.postNastavaRealizacijaPlana"))
            );
        }
    /**
     * @Opis Ponistava realizaciju nastave
     * @param data PkNastavaRealizacija, PkUsera
     * @returns []
     */
    deleteNastavaRealizacija(data) {
        return this.http.delete(this.config.API_URL + "NastavaRealizacijaPlana", {
            params: data
        }).pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("ProfesorService.deleteNastavaRealizacijaPlana"))
            );
    }
    /*
     *  Select svih Tipova nastave koje se izvode ovisno o studiju,godini i predmetu.
     *  Params: PkSkolskaGodinaStudijPredmetKatedra
     *  Returns: Niz od  jednog ili više objekata
     */
    getPodTipPredavanja(data) {
        return this.http
            .get(this.config.API_URL + "getPodTipovePredavanja", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError("ProfesorService.getTipNastave")
                )
            );
    }

    /*
     *  Select svih Grupa za nastavu nastave koje se izvode ovisno o studiju,godini,predmetu i podtipu nastave.
     *  Params: PkPredmet, PkStudij, PkSkolskaGodina, PkPodTipPredavanja
     *  Returns: Niz od  jednog ili više objekata
     */
    getGrupeZaNastavu(data) {
        return this.http
            .get(this.config.API_URL + "getGrupeZaNastavu", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getGrupeZaNastavu"
                    )
                )
            );
    }

    /*
     *  Select svih stuenata raspoređenh po grupama za nastavu.
     *  Params: 
     *  Returns: Niz od  jednog ili više objekata
     */
    getStudentiRasporedeniPoGrupama(data) {
        return this.http
            .get(this.config.API_URL + "getStudentiRasporedeniPoGrupama", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "ProfesorService.getStudentiRasporedeniPoGrupama"
                    )
                )
            );
    }
}
