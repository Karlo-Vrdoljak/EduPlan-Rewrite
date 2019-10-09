import { Component, OnInit, AfterViewInit, Renderer2 } from "@angular/core";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from "../demo/service/calendarService";
import { TranslateService } from "@ngx-translate/core";
import { MenuItem } from "primeng/api";
import { Router, ActivatedRoute } from "@angular/router";
import { LanguageHandler } from "../app.languageHandler";
import { StudentiService } from "../_services/studenti.service";
import { EventColor } from "../_interfaces/ColorEventEnum";
import { CalendarEvent } from "../_interfaces/CalendarEvent";

@Component({
    selector: "app-student-agenda",
    templateUrl: "./student-agenda.component.html",
    styleUrls: ["./student-agenda.component.css"]
})
export class StudentAgendaComponent implements OnInit {
    calendarOptions: any;
    events: any[];
    apiData: any;
    _router: Router;
    locale: string;
    translate: TranslateService;
    constructor(
        private _route: ActivatedRoute,
        private _calendarService: CalendarService,
        translate: TranslateService,
        public router: Router,
        private languageHandler: LanguageHandler,
        private studentiService: StudentiService
    ) {
        this._router = router;
        this.translate = translate;
        this.translate.use(
            this.languageHandler.setDefaultLanguage().getCurrentLanguage()
        );
    }

    public chooseColor(tipPredavanja): string {
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
        const redirect = this._route.snapshot.paramMap.get("isRedirect");
        /*
        if(redirect == 'sm') {
            if (screen.width >= 600) {
                this._router.navigate(["/vStudentKalendar"]);
            }
        }
        */
        this.translate.get("STUDENT_KALENDAR_LOCALE").subscribe(res => {
            const params = {
                PkStudent: 1312,
                PkSkolskaGodina: 8,
                DatumOd: "2017-10-10",
                DatumDo: "2019-10-30"
            };
            this.studentiService.getStudentRaspored(params).subscribe(data => {
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
                            e.PredmetKratica +
                            "\n" +
                            e.PredmetNaziv +
                            "\n" +
                            e.PodTipPredavanjaNaziv +
                            "\n" +
                            e.NastavnikSuradnikNaziv,
                        start: e.DatumVrijemeOd,
                        end: e.DatumVrijemeDo,
                        allDay: false,
                        color: this.chooseColor(e.PodTipPredavanjaNaziv)
                    };
                    this.events.push(event);
                });

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
}
