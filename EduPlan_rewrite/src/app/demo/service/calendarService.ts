import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Calendar } from '../domain/calendar';


@Injectable()
export class CalendarService {
    constructor(private http: HttpClient) {}

    getCalendarData() {
        return this.http
            .get<any>("assets/demo/data/dummy_calendar.json")
            .toPromise()
            .then(res => res.data as Calendar[])
            .then(data => data);
    }
}
