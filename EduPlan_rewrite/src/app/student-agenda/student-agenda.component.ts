import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from '../demo/service/calendarService';
import { TranslateService } from '@ngx-translate/core';
import {  MenuItem } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { LanguageHandler } from '../app.languageHandler';

@Component({
    selector: "app-student-agenda",
    templateUrl: "./student-agenda.component.html",
    styleUrls: ["./student-agenda.component.css"]
})
export class StudentAgendaComponent implements OnInit, AfterViewInit {
    calendarOptions: any;
    events: any;
    _router: Router;
    locale: string;
    translate: TranslateService;
    constructor(
        private _route: ActivatedRoute,
        private _calendarService: CalendarService,
        translate: TranslateService,
        public router: Router,
        private languageHandler: LanguageHandler
    ) {
        this._router = router;
        this.translate = translate;
        this.translate.use(this.languageHandler.setDefaultLanguage().getCurrentLanguage());
    }

    ngOnInit() {
        const redirect = this._route.snapshot.paramMap.get("isRedirect");
        if(redirect == 'sm') {
            if (screen.width >= 700) {
                this._router.navigate(["/vStudentKalendar"]);
            }
            window.addEventListener("orientationchange", () => {
                if (screen.width >= 700) {
                    this._router.navigate(["/vStudentKalendar"]);
                }
            });
        }
        this.translate.get("STUDENT_KALENDAR_LOCALE").subscribe(res => {
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
                    locales: allLocales,
                    locale: res,
                    // customize the button names,
                    // otherwise they'd all just say "list"
                    views: {
                        listDay: { buttonText: "Day" },
                        listWeek: { buttonText: "Week" },
                        listMonth: { buttonText: "Month" }
                    },

                    height: "auto",
                    contentHeight: screen.height - 337 - 57.25,
                    header: {
                        left: "prev,next",
                        center: "today",
                        right: "listWeek,listMonth"
                    },
                    events: this.events,
                    windowResize: function(view) {
                        view.calendar.setOption(
                            "contentHeight",
                            screen.height - 337 - 57.25
                        );
                    }
                });
                calendar.render();
            });
        });
    }

    ngAfterViewInit(): void {}
}
