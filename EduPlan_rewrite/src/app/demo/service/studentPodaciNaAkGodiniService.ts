import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentPodaciNaAkGodini } from '../domain/studentPodaciNaAkGodini';


@Injectable()
export class StudentPodaciNaAkGodiniService {
    constructor(private http: HttpClient) {}

    getStudentNaAkGodiniData() {
        return this.http
            .get<any>('assets/demo/data/dummy_StudentPodaciNaAkGodini.json')
            .toPromise()
            .then(res => res.PodaciStudentAkGodina as StudentPodaciNaAkGodini)
            .then(data => data);
    }
}
