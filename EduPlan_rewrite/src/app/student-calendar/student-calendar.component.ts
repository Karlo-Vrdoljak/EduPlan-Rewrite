import { Component, OnInit, ViewChild } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from "../demo/service/calendarService";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { EventColor } from "../_interfaces/ColorEventEnum";
import { OverlayPanelModule, OverlayPanel } from "primeng/overlaypanel";
import { CalendarColorPicker } from '../_interfaces/CalendarColorPicker';
import { AppVariables } from '../_interfaces/_configAppVariables';

@Component({
    selector: "app-student-calendar",
    templateUrl: "./student-calendar.component.html",
    styleUrls: ["./student-calendar.component.css"]
})
export class StudentCalendarComponent implements OnInit {
    calendarOptions: any;
    events: any[];
    selectedEvent: any;
    apiData: any;

    translate: TranslateService;
    constructor(
        private _calendarService: CalendarService,
        public router: Router,
        translate: TranslateService,
        private studentiService: StudentiService,
        private colorPicker: CalendarColorPicker,
        private appVariables: AppVariables
    ) {
        this.translate = translate;
    }

    ngOnInit() {
        
        if (screen.width <= 600) {
            this.router.navigate(["/vStudentAgenda", "sm"]);
        }
        this.translate
            .get("STUDENT_KALENDAR_LOCALE")
            .toPromise()
            .then(res => {
                const params = {
                    PkStudent: this.appVariables.PkStudent,
                    PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
                    DatumOd: this.appVariables.DatumOd,
                    DatumDo: this.appVariables.DatumDo
                };
                this.studentiService
                    .getStudentRaspored(params)
                    .subscribe(data => {
                        
                        this.events = [];
                        this.apiData = data;
                        // console.log(data);
                        this.apiData.forEach(e => {
                            let event: CalendarEvent = {
                                id: e.PkNastavaPlan,
                                groupId: e.BrojSkupine,
                                title:
                                    e.PredmetNaziv + '\n'+
                                    e.PodTipPredavanjaNaziv + '\n'+
                                    e.PredmetKratica + '\n'+
                                    e.NastavnikSuradnikNaziv,
                                start: e.DatumVrijemeOd,
                                end: e.DatumVrijemeDo,
                                allDay: false,
                                color: this.colorPicker.chooseColor(e.PodTipPredavanjaNaziv)
                            };
                            this.events.push(event);
                        });
                    });
                
                this.calendarOptions = {
                    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                    defaultDate: this.appVariables.getDateTimeCurrent(),
                    //aspectRatio: 2.8,
                    navLinks: true,
                    locales: allLocales,
                    defaultView: 'timeGridWeek',
                    locale: res,
                    height: "auto",
                    contentHeight: screen.height - 70 - 57.25 - 19.5 - 90,
                    firstDay: 1,
                    header: {
                        center: "prevYear,prev,today,next,nextYear",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    },
                };
            });
    }
}
