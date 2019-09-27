import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StudentPodaciStudij } from '../domain/StudentPodaciStudij';

@Injectable()
export class StudentPodaciStudijService {
    constructor(private http: HttpClient) {}

    async getStudentPodaciStudij() {
        const res = await this.http
            .get<any>("assets/demo/data/dummy_StudentPodaciStudij.json")
            .toPromise();
        const data = (res.data as StudentPodaciStudij[]);
        return data;
    }
}
