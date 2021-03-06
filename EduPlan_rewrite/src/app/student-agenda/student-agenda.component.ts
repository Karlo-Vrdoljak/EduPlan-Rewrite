import { Component, OnInit } from "@angular/core";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import allLocales from "@fullcalendar/core/locales-all";
import interactionPlugin from "@fullcalendar/interaction";
import { TranslateService } from "@ngx-translate/core";
import { LanguageHandler } from "../app.languageHandler";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { AppVariables } from "../_interfaces/_configAppVariables";
import { CalendarConfig } from "../_interfaces/_configCalendar";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-student-agenda",
    templateUrl: "./student-agenda.component.html",
    styleUrls: ["./student-agenda.component.css"]
})
export class StudentAgendaComponent implements OnInit {
    events: any[];
    apiData: any;
    calendar: Calendar;
    rangeDates: Date[];
    eventDetalji: any;
    legend: MenuItem[];
    monthButton: boolean = false;
    weekButton: boolean = false;
    dayButton: boolean = false;
    displayEventDialog: boolean = false;
    displayStudentiEventDialog: boolean = false;
    params = {
        PkStudent: this.appVariables.PkStudent,
        // PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
        DatumOd: this.calendarConfig.DatumOd,
        DatumDo: this.calendarConfig.DatumDo
    };

    constructor(
        private translate: TranslateService,
        private languageHandler: LanguageHandler,
        private studentiService: StudentiService,
        private calendarConfig: CalendarConfig,
        private appVariables: AppVariables
    ) {
        this.translate.use(this.languageHandler.setDefaultLanguage().getCurrentLanguage());
        
        
    }

    /**
     *
     * @returns void
     * @description Kartica Agenda, Ovisno o odabranome DatumOd i DatumDo, api poziva getNastavnikRaspored i kalendar obnavlja dogadaje
     * @param None
     */
    handleSelectedDate() {
        let dateTrue = this.rangeDates
            .map(e => {
                return e ? true : false;
            })
            .every(e => {
                return e == true;
            });
        if (dateTrue) {
            this.calendarConfig.passedDate = this.rangeDates;
            this.params.DatumOd = this.calendarConfig.formatDate(this.rangeDates[0]);
            this.params.DatumDo = this.calendarConfig.formatDate(this.rangeDates[1]);

            this.studentiService.getStudentRaspored(this.params).subscribe(data => {
                var events = this.calendarConfig.prepareCalendarEventsProfesor(data);
                this.calendar.removeAllEventSources();

                this.calendar.addEventSource(events);
                this.calendar.rerenderEvents();
                this.calendar.gotoDate(this.rangeDates[0]);
            });
        }
    }

    ngOnInit() {
        this.translate
            .get([
                "STUDENT_KALENDAR_LOCALE",
                "STUDENT_KALENDAR_DAN",
                "STUDENT_KALENDAR_MJESEC",
                "STUDENT_KALENDAR_TJEDAN",
                "STUDENTCALENDAR_PREDAVANJA",
                "STUDENTCALENDAR_SEMINAR",
                "STUDENTCALENDAR_VJEZBE",
                "STUDENTCALENDAR_ISPITI",
                "STUDENTCALENDAR_REALIZIRANO",
                "STUDENTCALENDAR_NIJE_REALIZIRANO",
                "STUDENTCALENDAR_PRISUTAN",
                "STUDENTCALENDAR_ODSUTAN",
                "NASTAVA_GRUPAPREDMETA_KRATICA",
                "NASTAVA_NASTAVAPLANIRANJE_SEMESTRALNO_NASTAVNIK",
                "NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRATIPPREDAVANJA_STUDIJ",
                "GRUPEZANASTAVU_GRUPAZANASTAVUSTUDENTSTUDIJ_STUDIJI"
            ])
            .subscribe(res => {
                this.legend = this.calendarConfig
                    .setupKalendarAgendaLegenda(res)
                    .filter((e: MenuItem) => {
                        return e.label != res.STUDENTCALENDAR_REALIZIRANO;
                    });
                this.legend = this.calendarConfig.setupKalendarAgendaLegenda(res);

                this.studentiService.getStudentRaspored(this.params).subscribe(data => {
                    this.events = [];
                    // console.log(data);
                    this.events = this.calendarConfig.prepareCalendarEventsProfesor(data);

                    var calendarEl = document.getElementById("agenda");

                    this.calendar = new Calendar(calendarEl, {
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
                        height: "auto",
                        contentHeight: screen.height - 337 - 57.25,
                        header: {
                            left: "prev,next",
                            center: "today",
                            right: "listWeek,listMonth"
                        },
                        events: this.events,
                        windowResize: function(view) {
                            view.calendar.setOption("contentHeight", screen.height - 337 - 57.25);
                        },
                        eventClick: arg => {
                            var start = this.calendarConfig.formatDateShort(arg.event.start);
                            var end = this.calendarConfig.formatDateShort(arg.event.end);

                            this.eventDetalji = {
                                PredmetNaziv: arg.event.extendedProps.PredmetNaziv,
                                PodTipPredavanjaNaziv:
                                    arg.event.extendedProps.PodTipPredavanjaNaziv,
                                PredmetKratica: arg.event.extendedProps.PredmetKratica,
                                SifraPredavaonice: arg.event.extendedProps.SifraPredavaonice,
                                Realizirano: arg.event.extendedProps.Realizirano,
                                StudijNaziv: this.calendarConfig.listBoxStudiji(
                                    arg.event.extendedProps.StudijNaziv
                                ),
                                KraticaStudija: this.calendarConfig.listBoxStudiji(
                                    arg.event.extendedProps.StudijNazivKratica
                                ),
                                start: start,
                                end: end,
                                // datum: datum,
                                termin: start + "-" + end,
                                Prisutan: arg.event.extendedProps.Prisutan,
                                NastavnikSuradnikNaziv:
                                    arg.event.extendedProps.NastavnikSuradnikNaziv
                            };

                            this.displayEventDialog = true;
                        },
                        eventRender: arg => {
                            /*******************HTML***********************/

                            arg.el.lastElementChild.previousElementSibling.innerHTML +=
                                // `<br><span>` +
                                // this.parseRealizacija(arg.event.extendedProps.Realizirano) +
                                // `</span>` +
                                `<span>` +
                                this.parseEducard(arg.event.extendedProps.Prisutan) +
                                `</span>`;

                            arg.el.lastElementChild.innerHTML +=
                                `<td class="fc-list-item-title fc-widget-content">
                                    <div class="ui-g-12">

                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` +
                                res.NASTAVA_GRUPAPREDMETA_KRATICA +
                                ` &bull; ` +
                                arg.event.extendedProps.PredmetKratica +
                                `</span>

                                        </div>
                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` +
                                arg.event.extendedProps.PredmetNaziv +
                                `</span>

                                        </div>
                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` +
                                res.NASTAVA_NASTAVAPLANIRANJE_SEMESTRALNO_NASTAVNIK +
                                ` &bull; ` +
                                arg.event.extendedProps.NastavnikSuradnikNaziv +
                                `</span>

                                        </div>
                                        
                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` +
                                this.calendarConfig.parseStudijLabel(
                                    arg.event.extendedProps.StudijNazivKratica,res
                                ) +
                                arg.event.extendedProps.StudijNazivKratica +
                                `</span>
                                        </div>
                                    </div>
                                </td>
                                    `;
                        }
                    });
                    this.calendar.render();

                    if (!this.calendarConfig.passedDate) {
                        this.rangeDates = [
                            new Date(this.calendarConfig.DatumOd),
                            new Date(this.calendarConfig.DatumDo)
                        ];
                        this.calendarConfig.passedDate = this.rangeDates;
                    } else {
                        this.rangeDates = this.calendarConfig.passedDate;
                    }
                });
            });

            
    }

    /**
     * @returns string: ovisno o realizaciji jeli true ili false.
     * @description Kartica Agenda i Kalendar, postavlja 'kvacicu' za realiziranu nastavu, a 'X' za nerealiziranu
     * @param realizirano
     */
    parseRealizacija(realizirano?) {
        return realizirano
            ? `<span class="fa fa-check" style="color:` +
                  this.calendarConfig.getColors().Realizirano +
                  `;  font-size:1.1em; "></span><br>`
            : // : `<span class="fa fa-times" style="color:` +
              //       this.calendarConfig.getColors().NijeRealizirano +
              //       `; font-size:1.1em; "></span>`;
              ``;
    }

    /**
     * @Opis Ispisuje status o timbravanju Educarda ukoliko se koristi
     * @param timbran
     */
    parseEducard(timbran) {

        // this.appVariables.EducardAktivan = 0;
        if (this.appVariables.EducardAktivan) {
            return timbran 
                ? `<br><span class="fa fa-rss" style="color:` +
                      this.calendarConfig.getColors().Realizirano +
                      `; font-size:1.3em;"></span>`
                : ``;
        }
    }

    closeDialogEvent() {
        this.displayEventDialog = false;
        this.eventDetalji = null;
    }
}
