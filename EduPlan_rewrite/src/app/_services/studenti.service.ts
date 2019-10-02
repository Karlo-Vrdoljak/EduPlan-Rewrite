import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config';
import { catchError, retry } from 'rxjs/operators';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class StudentiService {
  config: Config;

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {
    this.config = new Config();
  }

  getStudent(data) {
    return this.http.get(this.config.API_URL + 'Student', { params: data })
      .pipe(retry(this.config.APIRetryCount), catchError(this.appService.handleError('StudentiService.getStudent')));
  }
}
