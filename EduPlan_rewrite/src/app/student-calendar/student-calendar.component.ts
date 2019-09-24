import { Component, OnInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from "../demo/service/calendarService";
import { Router } from "@angular/router";

@Component({
    selector: "app-student-calendar",
    templateUrl: "./student-calendar.component.html",
    styleUrls: ["./student-calendar.component.css"]
})
export class StudentCalendarComponent implements OnInit {
    calendarOptions: any;
    events: any;

    constructor(
        private _calendarService: CalendarService,
        public _router: Router
    ) {}

    navigateIfSmallDevice() {
        if (screen.width <= 700) {
            this._router.navigate(["/vStudentAgenda"]);
        }
    }

    ngOnInit() {
        this.navigateIfSmallDevice();
        window.addEventListener("orientationchange",this.navigateIfSmallDevice);

        this._calendarService.getCalendarData().then(events => {
            this.events = events;
        });
        let date = new Date();
        let fullDate =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();
        this.calendarOptions = {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            defaultDate: fullDate,
            firstDay: 1,
            header: {
                left: "prevYear,nextYear",
                center: "title,prev,today,next",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
            },
            eventRender: function(elem) {}
        };
    }
}
