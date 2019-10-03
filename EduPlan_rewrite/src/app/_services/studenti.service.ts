import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from "../config";
import { catchError, retry } from "rxjs/operators";
import { AppService } from "./app.service";

@Injectable({
    providedIn: "root"
})
export class StudentiService {
    config: Config;

    constructor(private http: HttpClient, private appService: AppService) {
        this.config = new Config();
    }

    /*
     *  Select sve podatke o studentu.
     *  Params: int ili null
     *  Returns: Niz od jednog objekta ili niz vise objekata
     */
    getStudent(data) {
        return this.http
            .get(this.config.API_URL + "Student", { params: data })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError("StudentiService.getStudent")
                )
            );
    }

    /*
     *  Select sve podatke o studentu, studiju na kojem je i sve njegove predmete.
     *  Params: int ili null
     *  Returns: Niz od jednog objekta ili niz vise objekata
     */
    getStudentNaVisokomUcilistuPredmet(data) {
        return this.http
            .get(this.config.API_URL + "StudentNaVisokomUcilistuPredmet", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "StudentiService.getStudentNaVisokomUcilistuPredmet"
                    )
                )
            );
    }
    /*
     *  Select sve podatke o studentu na akadmeskim godinama koje je pohađao.
     *  Params: int ili null
     *  Returns: Niz od više objekata ili jednog objekta
     */
    getStudentNaAkGodini(data) {
        return this.http
            .get(this.config.API_URL + "StudentNaAkGodini", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "StudentiService.getStudentNaAkGodini"
                    )
                )
            );
    }
}
