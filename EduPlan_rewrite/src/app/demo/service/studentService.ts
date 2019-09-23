import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentPodaci } from '../domain/student';


@Injectable()
export class StudentService {
    constructor(private http: HttpClient) {}

    getStudentData() {
        return this.http
            .get<any>('assets/demo/data/dummy_student.json')
            .toPromise()
            .then(res => res.studentData as StudentPodaci)
            .then(data => data);
    }
}
