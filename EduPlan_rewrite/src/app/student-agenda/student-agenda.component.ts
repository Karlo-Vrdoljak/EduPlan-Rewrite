import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import {ElementRef} from '@angular/core';


@Component({
    selector: "app-student-agenda",
    templateUrl: "./student-agenda.component.html",
    styleUrls: ["./student-agenda.component.css"]
})
export class StudentAgendaComponent implements OnInit,AfterViewInit {
    calendar: Calendar;


    constructor(private renderer: Renderer2) {}

    ngOnInit() { }

    ngAfterViewInit(): void {

      this.calendar = new Calendar(
          document.createElement('div'), {
            plugins: [ listPlugin ],
            defaultView: 'listWeek'
          }
      );
      
    }
}
