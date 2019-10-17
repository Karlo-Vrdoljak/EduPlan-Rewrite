import { Component, OnInit } from "@angular/core";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import { TranslateService } from "@ngx-translate/core";
import { LanguageHandler } from "../app.languageHandler";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { AppVariables } from '../_interfaces/_configAppVariables';
import { CalendarConfig } from '../_interfaces/_configCalendar';

@Component({
    selector: "app-profesor-agenda",
    templateUrl: "./profesor-agenda.component.html",
    styleUrls: ["./profesor-agenda.component.css"]
})
export class ProfesorAgendaComponent implements OnInit {
    events: any[];
    apiData: any;

    constructor(
        private translate: TranslateService,
        private languageHandler: LanguageHandler,
        private studentiService: StudentiService,
        private appVariables: AppVariables,
        private calendarConfig: CalendarConfig
    ) {
        this.translate = translate;
        this.translate.use(
            this.languageHandler.setDefaultLanguage().getCurrentLanguage()
        );
    }

    ngOnInit() {
        this.translate
            .get([
                "STUDENT_KALENDAR_LOCALE",
                "STUDENT_KALENDAR_DAN",
                "STUDENT_KALENDAR_MJESEC",
                "STUDENT_KALENDAR_TJEDAN"
            ])
            .subscribe(res => {
                const params = {
                    //  PkStudent: 1312,
                    PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
                    PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
                    DatumOd: this.calendarConfig.DatumOd,
                    DatumDo: this.calendarConfig.DatumDo
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
                                    e.PredmetNaziv +
                                    "\n" +
                                    e.PodTipPredavanjaNaziv +
                                    "\n" +
                                    // "Kratica &bull;" +
                                    e.PredmetKratica +
                                    "\n" +
                                    // "Predavaonica &bull;" +
                                    e.SifraPredavaonice,
                                start: e.DatumVrijemeOd,
                                end: e.DatumVrijemeDo,
                                allDay: false,
                                color: this.calendarConfig.chooseColor(
                                    e.PodTipPredavanjaNaziv
                                )
                            };
                            this.events.push(event);
                        });


                        var calendarEl = document.getElementById("agenda");

                        var calendar = new Calendar(calendarEl, {
                            plugins: [listPlugin, interactionPlugin],
                            defaultView: "listWeek",
                            defaultDate: this.calendarConfig.getDateTimeCurrent(),
                            firstDay: 1,
                            navLinks: true,
                            locales: allLocales,
                            locale: res.STUDENT_KALENDAR_LOCALE,
                            // customize the button names,
                            // otherwise they'd all just say "list"
                            views: {
                                listDay: {
                                    buttonText: res.STUDENT_KALENDAR_DAN
                                },
                                listWeek: {
                                    buttonText: res.STUDENT_KALENDAR_TJEDAN
                                },
                                listMonth: {
                                    buttonText: res.STUDENT_KALENDAR_MJESEC
                                }
                            },
                            // eventRender: function(info) {
                            // let title = info.event.title as string;
                            // if(title.match("$")) {
                            // title = title.split("$")
                            // .map(
                            // s => s.match("&bull;") ?
                            // "<b>"
                            // .concat(s.split("&bull;")[0])
                            // .concat(" </b>")
                            // .concat(' ' + s.split("&bull;")[1]) : s
                            // )
                            // .join("<br/>");
                            // info.el.innerHTML = title;
                            // console.log(title);
                            // }
                            // },
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
                            },
                            datesRender: arg => {
                                this.calendarConfig.passedDate = arg.view.calendar.getDate();
                            }
                        });
                        calendar.render();
                    });
            });
    }
}
