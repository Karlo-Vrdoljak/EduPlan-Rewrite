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
import { ProfesorService } from '../_services/profesori.service';

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
        private calendarConfig: CalendarConfig
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
        if (this.rangeDates) {
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
                "STUDENT_KALENDAR_TJEDAN"
            ])
            .subscribe(res => {
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
                        eventRender: arg => {
                            /*******************HTML***********************/
                            
                            arg.el.style.opacity = this.calendarConfig.checkRealizacijaDaNe(arg.event.extendedProps.Realizirano)

                            arg.el.lastElementChild.previousElementSibling.innerHTML +=
                                `<br><span>` + this.parseRealizacija(arg.event.extendedProps.Realizirano) +`</span>`;

                            arg.el.lastElementChild.innerHTML +=
                                `<td class="fc-list-item-title fc-widget-content">
                                    <div class="ui-g-12">


                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` + arg.event.extendedProps.PredmetNaziv + `</span>

                                        </div>
                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` + arg.event.extendedProps.PredmetKratica + `</span>

                                        </div>
                                        <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                            <span class="fc-title">` + arg.event.extendedProps.StudijNazivKratica + `</span>

                                        </div>
                                    </div>
                                </td>
                                    `;
                        },

                        datesRender: arg => {
                            this.calendarConfig.passedDate = arg.view.calendar.getDate();
                            this.rangeDates = [arg.view.calendar.getDate(),null];
                        }
                    });
                    this.calendar.render();
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
            ? `<span class="fa fa-check" style="color:` + this.calendarConfig.getColors().Realizirano + `;  font-size:1.1em; "></span>`
            : `<span class="fa fa-times" style="color:` + this.calendarConfig.getColors().NijeRealizirano + `; font-size:1.1em; "></span>`
         ;
    }
}
