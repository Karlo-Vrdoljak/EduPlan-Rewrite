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
     *  Select sve podatke o studentovom, studiju kroz upisne listove.
     *  Params: int ili null
     *  Returns: Niz od jednog objekta ili niz vise objekata
     */
    getStudentStudij(data) {
        return this.http
            .get(this.config.API_URL + "StudentStudij", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "StudentiService.getStudentStudij"
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
    /*
     *  Select raspored studenta za odredeni period.
     *  Params: int,string `YYYY-MM-DD`, string `YYYY-MM-DD`
     *  Returns: Niz od više objekata ili jednog objekta
     */
    getStudentRaspored(data) {
        const headerdata = {
            'Content-Type':'application/json',
            'Authorization':'Basic c3R1ZDpzdHVk'
        }
        return this.http
            .get(
                "https://cloudvm2.westeurope.cloudapp.azure.com/EduPlan_Turnusno_WebApi/HomePage/PrikazRasporeda",
                {
                    params: data,
                    headers: headerdata
                }
            )
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(
                    this.appService.handleError(
                        "StudentiService.getStudentRaspored"
                    )
                )
            );
    }
}
