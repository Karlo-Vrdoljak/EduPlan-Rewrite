import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import allLocales from '@fullcalendar/core/locales-all';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from '../demo/service/calendarService';
import { TranslateService } from '@ngx-translate/core';
import {  MenuItem } from 'primeng/api';

@Component({
    selector: 'app-student-agenda',
    templateUrl: './student-agenda.component.html',
    styleUrls: ['./student-agenda.component.css']
})
export class StudentAgendaComponent implements OnInit, AfterViewInit {
    calendarOptions: any;
    events: any;
    locale: string;
    translate: TranslateService;
    constructor(
        private _calendarService: CalendarService,
        translate: TranslateService
    ) {
        this.translate = translate;
    }

    ngOnInit() {
        this._calendarService.getCalendarData().then(events => {
            this.events = events;
            let date = new Date();
            let fullDate =
                date.getFullYear() +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getDate();

            var calendarEl = document.getElementById('agenda');

            var calendar = new Calendar(calendarEl, {
                plugins: [listPlugin, interactionPlugin],
                defaultView: 'listWeek',
                defaultDate: fullDate,
                firstDay: 1,
                locales: allLocales,
                locale: this.translate.instant('STUDENT_KALENDAR_LOCALE'),
                // customize the button names,
                // otherwise they'd all just say "list"
                views: {
                    listDay: { buttonText: 'Day' },
                    listWeek: { buttonText: 'Week' },
                    listMonth: { buttonText: 'Month' }
                },

                height: 'auto',
                contentHeight: screen.height - 337 - 57.25,
                header: {
                    left: 'prev,next',
                    center: 'today',
                    right: 'listWeek,listMonth'
                },
                events: this.events,
                windowResize: function(view) {
                    view.calendar.setOption(
                        'contentHeight',
                        screen.height - 337 - 57.25
                    );
                }
            });
            calendar.render();
        });
    }

    ngAfterViewInit(): void {}
}
