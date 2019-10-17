import { Component, OnInit, AfterViewInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { AppVariables } from "../_interfaces/_configAppVariables";
import { CalendarConfig } from "../_interfaces/_configCalendar";
import { Calendar } from "@fullcalendar/core";

@Component({
    selector: "app-profesor-calendar",
    templateUrl: "./profesor-calendar.component.html",
    styleUrls: ["./profesor-calendar.component.css"]
})
export class ProfesorCalendarComponent implements OnInit, AfterViewInit {
    calendarOptions: any;
    events: any[];
    apiData: any;
    calendar: Calendar;

    constructor(
        public router: Router,
        private translate: TranslateService,
        private studentiService: StudentiService,
        private appVariables: AppVariables,
        private calendarConfig: CalendarConfig // private windowOrientation: WindowCalendarOrientation
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
                    DatumOd: this.calendarConfig.DatumOd,
                    DatumDo: this.calendarConfig.DatumDo
                    // PkSkolskaGodinaStudijPredmetKatedra : null,
                    // PkPredmet : null,
                    // PkTipPredavanje : null,
                    // PkPredavaonica : null,
                    // PkStudij : null,
                    // PkKatedra : null,
                    // GostDaNE : null,
                    // PkStudent : null
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

                        var calendarEl = document.getElementById("calendar");
                        this.calendar = new Calendar(calendarEl, {
                            plugins: [
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin
                            ],
                            defaultDate: this.calendarConfig.getDateTimeCurrent(),
                            //aspectRatio: 2.8,
                            navLinks: true,
                            locales: allLocales,
                            selectable: true,
                            defaultView: "timeGridWeek",
                            locale: res,
                            height: "auto",
                            contentHeight:
                                screen.height - 70 - 57.25 - 19.5 - 90,
                            firstDay: 1,
                            events: this.events,
                            header: {
                                center: "prevYear,prev,today,next,nextYear",
                                right: "dayGridMonth,timeGridWeek,timeGridDay"
                            },
                            datesRender: (arg) => {
                                this.calendarConfig.passedDate = arg.view.calendar.getDate();
                            }
                            
                        });
                        this.calendar.render();
                    });
            });
    }

    setupDateListeners() {
        
        var navButtons = document.getElementsByClassName(
            "fc-prevYear-button fc-prev-button fc-today-button fc-next-button fc-nextYear-button fc-dayGridMonth-button fc-timeGridWeek-button fc-timeGridDay-button "
        );
        console.log(navButtons);
        Array.from(navButtons).map(e => console.log(e));
    }
    
    
    ngAfterViewInit(){}
}
