import { Component, OnInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { AppVariables } from '../_interfaces/_configAppVariables';
import { CalendarConfig } from '../_interfaces/_configCalendar';

@Component({
    selector: "app-profesor-calendar",
    templateUrl: "./profesor-calendar.component.html",
    styleUrls: ["./profesor-calendar.component.css"]
})
export class ProfesorCalendarComponent implements OnInit {
    calendarOptions: any;
    events: any[];
    apiData: any;

    constructor(
        public router: Router,
        private translate: TranslateService,
        private studentiService: StudentiService,
        private appVariables: AppVariables,
        private calendarConfig: CalendarConfig
    ) {}


    ngOnInit() {
        if (screen.width <= 600) {
            this.router.navigate(["/vProfesorAgenda", "sm"]);
        }
        this.translate
            .get("STUDENT_KALENDAR_LOCALE")
            .toPromise()
            .then(res => {
                const params = {
                    // PkStudent: 1312,
                    PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
                    PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
                    DatumOd: this.appVariables.DatumOd,
                    DatumDo: this.appVariables.DatumDo
                };
                this.studentiService
                    .getStudentRaspored(params)
                    .subscribe(data => {
                        // this._calendarService.getCalendarData().then(res => {
                        //     console.log(res);
                        // });
                        this.events = [];
                        this.apiData = data;
                        // console.log(data);
                        this.apiData.forEach(e => {
                            // let predmetRefactured = ;
                            let event: CalendarEvent = {
                                id: e.PkNastavaPlan,
                                groupId: e.BrojSkupine,
                                title: this.calendarConfig.checkDeviceWidth(
                                    screen.width
                                )
                                    ? this.calendarConfig.parseTitleLargeDevice(
                                          e,
                                          [
                                              e.PredmetNaziv,
                                              e.PodTipPredavanjaNaziv,
                                              e.PredmetKratica,
                                              e.SifraPredavaonice
                                          ]
                                      )
                                    : this.calendarConfig.parseTitleSmallDevice(
                                          e.PredmetNaziv,
                                          [
                                              e.PodTipPredavanjaNaziv,
                                              e.PredmetKratica,
                                              e.SifraPredavaonice
                                          ]
                                      ),
                                start: e.DatumVrijemeOd,
                                end: e.DatumVrijemeDo,
                                allDay: false,
                                color: this.calendarConfig.chooseColor(
                                    e.PodTipPredavanjaNaziv
                                )
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
                    defaultView: "timeGridWeek",
                    locale: res,
                    height: "auto",
                    contentHeight: screen.height - 70 - 57.25 - 19.5 - 90,
                    firstDay: 1,
                    header: {
                        center: "prevYear,prev,today,next,nextYear",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }
                };
            });
    }
}
