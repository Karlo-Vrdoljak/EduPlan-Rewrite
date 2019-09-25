import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from '../demo/service/calendarService';
import allLocales from '@fullcalendar/core/locales-all';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: "app-student-calendar",
    templateUrl: "./student-calendar.component.html",
    styleUrls: ["./student-calendar.component.css"]
})
export class StudentCalendarComponent implements OnInit {
    calendarOptions: any;
    events: any;
    _router: Router;
    translate: TranslateService;
    constructor(
        private _calendarService: CalendarService,
        public router: Router,
        translate: TranslateService
    ) {
        this._router = router;
        this.translate = translate;
    }

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

            locale: this.translate.instant("STUDENT_KALENDAR_LOCALE"),
            height: "auto",
            contentHeight: screen.height - 70 - 57.25 - 19.5 - 90,
            firstDay: 1,
            header: {
                center: "prevYear,prev,today,next,nextYear",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
            },
            eventRender: function(elem) {}
        };
    }
}
