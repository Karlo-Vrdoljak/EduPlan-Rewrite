import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "../domain/subject";


@Injectable()
export class SubjectService {
    constructor(private http: HttpClient) {}

    getSubjects() {
        return this.http
            .get<any>("assets/demo/data/dummy_subjects.json")
            .toPromise()
            .then(res => res.data as Subject[])
            .then(data => data);
    }
}
