import { Component, OnInit, AfterViewInit, Renderer2 } from "@angular/core";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from "../demo/service/calendarService";

@Component({
    selector: "app-student-agenda",
    templateUrl: "./student-agenda.component.html",
    styleUrls: ["./student-agenda.component.css"]
})
export class StudentAgendaComponent implements OnInit, AfterViewInit {
    calendarOptions: any;
    events: any;
    constructor(private _calendarService: CalendarService) {}

    ngOnInit() {
        this._calendarService.getCalendarData().then(events => {
            this.events = events;

            let date = new Date();

            let fullDate =
                date.getFullYear() +
                "-" +
                (date.getMonth() + 1) +
                "-" +
                date.getDate();

            var calendarEl = document.getElementById("agenda");

            var calendar = new Calendar(calendarEl, {
                plugins: [listPlugin, interactionPlugin],
                defaultView: "listWeek",
                defaultDate: fullDate,
                firstDay: 1,

                // customize the button names,
                // otherwise they'd all just say "list"
                views: {
                    listDay: { buttonText: "Day" },
                    listWeek: { buttonText: "Week" },
                    listMonth: { buttonText: "Month" }
                },
                aspectRatio: 3.2,
                header: {
                    left: "prev,next today",
                    center: "title",
                    right: "listDay,listWeek,listMonth"
                },
                events: this.events
            });
            calendar.render();
        });
    }

    ngAfterViewInit(): void {}
}
