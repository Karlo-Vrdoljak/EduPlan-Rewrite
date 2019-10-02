import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from 'src/app/config'; // konfiguracijske varijable
import { catchError, retry } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import { TranslateService } from '@ngx-translate/core';
import { CanLoad, CanActivate, Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    public config: Config,
    private http: HttpClient,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router
  ) { }

  // ----------------------------------------------------------------
  // ERROR HANDLER
  // ----------------------------------------------------------------
  public handleError<T>(operacija) {
    return (error: any): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
        console.error('3 Komponenta/funkcija greške:', operacija);
        console.error('4 Klijentska/mrežna greška ', error.error.message);
      } else {
        console.error('5 Komponenta/funkcija greške:', operacija);
        console.error('6 Serverska greška ', error.message);
      }
      let returnErrMsg;
      if (error.error.message) {
        if (error.error.message.length > 0) {
          returnErrMsg = error.error.message;
        } else {
          returnErrMsg = error.name + ': ' + error.statusText;
        }
      } else if (error.error.error) {
        if (error.error.error.length > 0) {
          returnErrMsg = error.error.error;
        } else {
          returnErrMsg = error.name + ': ' + error.statusText;
        }
      }
      return throwError(
        returnErrMsg
      );
    };
  }
}