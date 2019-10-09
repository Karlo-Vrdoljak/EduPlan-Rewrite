import { Component, OnInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from "../demo/service/calendarService";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from '../_services/studenti.service';
import { CalendarEvent } from '../_interfaces/CalendarEvent';
import { EventColor } from '../_interfaces/ColorEventEnum';

@Component({
    selector: "app-student-calendar",
    templateUrl: "./student-calendar.component.html",
    styleUrls: ["./student-calendar.component.css"]
})
export class StudentCalendarComponent implements OnInit {
    calendarOptions: any;
    events: any[];
    apiData: any;
    _router: Router;
    translate: TranslateService;
    constructor(
        private _calendarService: CalendarService,
        public router: Router,
        translate: TranslateService,
        private studentiService: StudentiService
    ) {
        this._router = router;
        this.translate = translate;
    }

    public chooseColor( tipPredavanja ):string {
        switch (true) {
            case tipPredavanja == "Predavanja": {
                return EventColor.Predavanja;
            }
            case tipPredavanja == "Seminar": {
                return EventColor.Seminar;
            }
            case tipPredavanja == "Vježbe": {
                return EventColor.Vjezbe;
            }
            case tipPredavanja == "Ispiti": {
                return EventColor.Ispiti;
            }
            case tipPredavanja == "Kliničke vježbe": {
                return EventColor.KlinickeVjezbe;
            }
            case tipPredavanja == "Pretkliničke vježbe": {
                return EventColor.PretKlinickeVjezbe;
            }
            case tipPredavanja == "Vježbe tjelesnog odgoja": {
                return EventColor.VjezbeTjelesniOdgoj;
            }
            case tipPredavanja == "Vježbe u praktikumu": {
                return EventColor.VjezbePratikum;
            }
            case tipPredavanja == "Laboratorijske vježbe": {
                return EventColor.LaboratorijskeVjezbe;
            }
            case tipPredavanja == "Terenske vježbe": {
                return EventColor.TerenskeVjezbe;
            }

            default: {
                return EventColor.Predavanja;
            }
        }
    }

    ngOnInit() {
        window.addEventListener("orientationchange", () => {
            switch (true) {
                case screen.width <= 600 &&
                    this.router.url == "/vStudentKalendar": {
                    this._router.navigate(["/vStudentAgenda", "sm"]);
                    break;
                }
                case screen.width >= 600 &&
                    this.router.url == "/vStudentAgenda/sm": {
                    this._router.navigate(["/vStudentKalendar"]);
                    break;
                }
                default: {
                    //none
                    break;
                }
            }
        });
        if (screen.width <= 600) {
            this._router.navigate(["/vStudentAgenda", "sm"]);
        }
        this.translate
            .get("STUDENT_KALENDAR_LOCALE")
            .toPromise()
            .then(res => {
                const params = {
                    PkStudent: 1312,
                    PkSkolskaGodina: 8,
                    DatumOd: "2017-10-10",
                    DatumDo: "2019-10-30"
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
                            let event: CalendarEvent = {
                                id: e.PkNastavaPlan,
                                groupId: e.BrojSkupine,
                                title:
                                    e.PredmetKratica + '\n'+
                                    e.PredmetNaziv + '\n'+
                                    e.PodTipPredavanjaNaziv + '\n'+
                                    e.NastavnikSuradnikNaziv,
                                start: e.DatumVrijemeOd,
                                end: e.DatumVrijemeDo,
                                allDay: false,
                                color: this.chooseColor(e.PodTipPredavanjaNaziv)
                            };
                            this.events.push(event);
                        });
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

                    locale: res,
                    height: "auto",
                    contentHeight: screen.height - 70 - 57.25 - 19.5 - 90,
                    firstDay: 1,
                    header: {
                        center: "prevYear,prev,today,next,nextYear",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    },
                    eventRender: function(elem) {}
                };
            });
    }
}
