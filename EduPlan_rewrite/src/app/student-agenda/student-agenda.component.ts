import { Component, OnInit } from "@angular/core";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import { TranslateService } from "@ngx-translate/core";
import { LanguageHandler } from "../app.languageHandler";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { CalendarColorPicker } from '../_interfaces/CalendarColorPicker';
import { AppVariables } from '../_interfaces/_configAppVariables';

@Component({
    selector: "app-student-agenda",
    templateUrl: "./student-agenda.component.html",
    styleUrls: ["./student-agenda.component.css"]
})
export class StudentAgendaComponent implements OnInit {

    events: any[];
    apiData: any;

    constructor(
        private translate: TranslateService,
        private languageHandler: LanguageHandler,
        private studentiService: StudentiService,
        private colorPicker: CalendarColorPicker,
        private appVariables: AppVariables
    ) {
        this.translate.use(
            this.languageHandler.setDefaultLanguage().getCurrentLanguage()
        );
    }



    ngOnInit() {
        this.translate
            .get([
                "STUDENT_KALENDAR_LOCALE",
                "STUDENT_KALENDAR_DAN",
                "STUDENT_KALENDAR_TJEDAN",
                "STUDENT_KALENDAR_MJESEC"
            ])
            .subscribe(res => {
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
                                    e.PredmetKratica +
                                    "\n" +
                                    e.PredmetNaziv +
                                    "\n" +
                                    e.PodTipPredavanjaNaziv +
                                    "\n" +
                                    e.SifraPredavaonice +
                                    "\n" +
                                    e.NastavnikSuradnikNaziv,
                                start: e.DatumVrijemeOd,
                                end: e.DatumVrijemeDo,
                                allDay: false,
                                color: this.colorPicker.chooseColor(e.PodTipPredavanjaNaziv)
                            };
                            this.events.push(event);
                        });

                    
                        var calendarEl = document.getElementById("agenda");

                        var calendar = new Calendar(calendarEl, {
                            plugins: [listPlugin, interactionPlugin],
                            defaultView: "listWeek",
                            defaultDate: this.appVariables.getDateTimeCurrent(),
                            firstDay: 1,
                            navLinks: true,
                            locales: allLocales,
                            locale: res.STUDENT_KALENDAR_LOCALE,
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
