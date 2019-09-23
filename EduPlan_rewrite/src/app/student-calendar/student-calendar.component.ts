import { Component, OnInit } from '@angular/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

@Component({
    selector: "app-student-calendar",
    templateUrl: "./student-calendar.component.html",
    styleUrls: ["./student-calendar.component.css"]
})
export class StudentCalendarComponent implements OnInit {
    
  calendarOptions: any;

  constructor() {}

  ngOnInit() {
    let date = new Date();
    let fullDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.calendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultDate: fullDate,
        header: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        }
    };
  }
}
