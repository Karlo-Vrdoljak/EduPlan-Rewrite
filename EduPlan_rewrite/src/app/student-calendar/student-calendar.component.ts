import { Component, OnInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from "../demo/service/calendarService";
import allLocales from '@fullcalendar/core/locales-all';
import { Router } from "@angular/router";

@Component({
    selector: "app-student-calendar",
    templateUrl: "./student-calendar.component.html",
    styleUrls: ["./student-calendar.component.css"]
})
export class StudentCalendarComponent implements OnInit {
    calendarOptions: any;
    events: any;
    _router:Router;
    constructor(
        private _calendarService: CalendarService,
        public router: Router
    ) { this._router = router; }

    ngOnInit() {
        if (screen.width <= 700) {
            this._router.navigate(["/vStudentAgenda"]);
        }
        window.addEventListener("orientationchange", () => {
            if (screen.width <= 700) {
                this._router.navigate(["/vStudentAgenda"]);
            }
        });

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
            //aspectRatio: 2.8,
            locales: allLocales,
            locale: "hr",
            height: screen.height - 70 - 10 - 32-10,
            contentHeight: screen.height - 70 - 57.25 - 19.5 - 32,
            firstDay: 1,
            header: {
                left: "prevYear,nextYear",
                center: "prev,today,next,title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
            },
            eventRender: function(elem) {
                console.log(screen.height);
            }
        };
    }
}
