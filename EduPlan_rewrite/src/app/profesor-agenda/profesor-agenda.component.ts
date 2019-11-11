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
import { ProfesorService } from "../_services/profesori.service";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-profesor-agenda",
    templateUrl: "./profesor-agenda.component.html",
    styleUrls: ["./profesor-agenda.component.css"]
})
export class ProfesorAgendaComponent implements OnInit {
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
    prisutniStudenti: any[];
    prisutnostStudenata: any[];

    params = {
        //  PkStudent: 1312,
        // PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
        PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
        DatumOd: this.calendarConfig.DatumOd,
        DatumDo: this.calendarConfig.DatumDo
    };

    constructor(
        private translate: TranslateService,
        private languageHandler: LanguageHandler,
        private profesorSerivce: ProfesorService,
        private appVariables: AppVariables,
        private calendarConfig: CalendarConfig,
        private studentiService: StudentiService
    ) {
        this.translate = translate;
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

            this.profesorSerivce.getNastavnikRaspored(this.params).subscribe(data => {
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
                "KATALOZI_NASTAVNIKSURADNIKPREDMETI_JMBAG",
                "PREDMET_BDPREDMETSTUDENTI_IME",
                "PREDMET_BDPREDMETSTUDENTI_PREZIME",
                "PREDMET_BDPREDMETSTUDENTI_KRATICA_STUDIJA",
                "PREDMET_BDPREDMETSTUDENTI_PRISUTAN",
                "NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRA_PREDMETKRATICA",
                "NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRATIPPREDAVANJA_STUDIJ",
                "GRUPEZANASTAVU_GRUPAZANASTAVUSTUDENTSTUDIJ_STUDIJI"
            ])
            .subscribe(res => {
                this.legend = this.calendarConfig.setupKalendarAgendaLegenda(res);
                this.prisutnostStudenata = this.calendarConfig.setupColsPrisutnostStudenata(res);

                this.profesorSerivce.getNastavnikRaspored(this.params).subscribe(data => {
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

                            let params = {
                                PkNastavaPlan: arg.event.extendedProps.PkNastavaPlan,
                                PkNastavaRealizacija: arg.event.extendedProps.PkNastavaRealizacija
                            };
                            this.studentiService
                                .getStudentPrisutnostNaNastavi(params)
                                .subscribe((data: any[]) => {
                                    this.prisutniStudenti = data;

                                    this.eventDetalji = {
                                        PredmetNaziv: arg.event.extendedProps.PredmetNaziv,
                                        PodTipPredavanjaNaziv:
                                            arg.event.extendedProps.PodTipPredavanjaNaziv,
                                        PredmetKratica: arg.event.extendedProps.PredmetKratica,
                                        SifraPredavaonice:
                                            arg.event.extendedProps.SifraPredavaonice,
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
                                        Prisutnost:
                                            this.prisutniStudenti.length > 0
                                                ? this.prisutniStudenti.length
                                                : null
                                    };

                                    this.displayEventDialog = true;
                                });
                        },
                        eventRender: arg => {
                            /*******************HTML***********************/

                            // arg.el.style.opacity = this.calendarConfig.checkRealizacijaDaNe(
                            //     arg.event.extendedProps.Realizirano
                            // );

                            arg.el.lastElementChild.previousElementSibling.innerHTML +=
                                `<br><span>` +
                                this.parseRealizacija(arg.event.extendedProps.Realizirano) +
                                `</span>` +
                                `<span>` +
                                this.parseEducard(arg.event.extendedProps.Prisutan) +
                                `</span>`;

                            arg.el.lastElementChild.innerHTML +=
                                `<td class="fc-list-item-title fc-widget-content">
                                    <div class="ui-g-12">


                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` +
                                arg.event.extendedProps.PredmetNaziv +
                                `</span>

                                        </div>
                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` +
                                res.NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRA_PREDMETKRATICA +
                                ` &bull; ` +
                                arg.event.extendedProps.PredmetKratica +
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

    parseEducard(timbran) {
        // this.appVariables.EducardAktivan = 0;
        if (this.appVariables.EducardAktivan) {
            return timbran
                ? `<span class="fa fa-rss" style="color:` +
                      this.calendarConfig.getColors().Realizirano +
                      `; font-size:1.3em;"></span><br>`
                : ``;
        }
    }

    closeDialogPrisutnost() {
        this.displayStudentiEventDialog = false;
    }
    closeDialogEvent() {
        this.displayEventDialog = false;
        this.eventDetalji = null;
        this.prisutniStudenti = null;
    }
    isBoolean(val) {
        return [0, 1].includes(val);
    }
}
