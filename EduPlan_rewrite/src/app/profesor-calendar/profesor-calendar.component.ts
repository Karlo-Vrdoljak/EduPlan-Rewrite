import { Component, OnInit, AfterViewInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {InputSwitchModule} from 'primeng/inputswitch';
import { AppVariables } from "../_interfaces/_configAppVariables";
import { CalendarConfig } from "../_interfaces/_configCalendar";
import { Calendar, View } from "@fullcalendar/core";
import { ProfesorService } from '../_services/profesori.service';

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
    rangeDates: Date[];
    selectedViewButton: boolean = false;
    displayEventDialog: boolean = false;
    eventDetalji:any;
    params = {
        // PkStudent: 1312,
        // PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
        PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
        DatumOd: this.calendarConfig.DatumOd,
        DatumDo: this.calendarConfig.DatumDo
    };

    constructor(
        public router: Router,
        private translate: TranslateService,
        // private studentiService: StudentiService,
        private profesorSerivce: ProfesorService,
        private appVariables: AppVariables,
        private calendarConfig: CalendarConfig // private windowOrientation: WindowCalendarOrientation
    ) {}

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
            });
        }
    }
    ngOnInit() {
        // console.log(this.appVariables.PkSkolskaGodina);
        if (screen.width <= 600) {
            this.router.navigate(["/vProfesorAgenda", "sm"]);
        }
        this.translate
            .get("STUDENT_KALENDAR_LOCALE")
            .toPromise()
            .then(res => {
                this.profesorSerivce.getNastavnikRaspored(this.params).subscribe(data => {
                    // this._calendarService.getCalendarData().then(res => {
                    //     console.log(res);
                    // });
                    // console.log(data);
                    this.events = this.calendarConfig.prepareCalendarEventsProfesor(data);
                    // console.log(this.events);
                    var calendarEl = document.getElementById("calendar");
                    this.calendar = new Calendar(calendarEl, {
                        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                        defaultDate: this.calendarConfig.getDateTimeCurrent(),
                        //aspectRatio: 2.8,
                        navLinks: true,
                        locales: allLocales,
                        selectable: true,
                        defaultView: "timeGridWeek",
                        locale: res,
                        height: "auto",
                        contentHeight: screen.height - 70 - 57.25 - 19.5 - 90,
                        firstDay: 1,
                        events: this.events,
                        header: {
                            center: "prevYear,prev,today,next,nextYear",
                            right: "dayGridMonth,timeGridWeek,timeGridDay"
                        },

                        eventClick: arg => {
                            var start = this.calendarConfig.formatDateShort(arg.event.start);
                            var end = this.calendarConfig.formatDateShort(arg.event.end);
                            // var datum = this.calendarConfig.formatDateFull(arg.event.extendedProps.start);
                            // var vrijeme = 
                            this.eventDetalji = {
                                
                                PredmetNaziv: arg.event.extendedProps.PredmetNaziv,
                                PodTipPredavanjaNaziv: arg.event.extendedProps.PodTipPredavanjaNaziv,
                                PredmetKratica: arg.event.extendedProps.PredmetKratica,
                                SifraPredavaonice: arg.event.extendedProps.SifraPredavaonice,
                                Realizirano: arg.event.extendedProps.Realizirano,
                                StudijNaziv: arg.event.extendedProps.StudijNaziv,
                                start: start,
                                end: end,
                                // datum: datum,
                                termin : start + '-' + end
                            };
                            
                            this.displayEventDialog = true;
                        },
                        eventRender: arg => {
                            arg.el.style.opacity = this.calendarConfig.checkRealizacijaDaNe(
                                arg.event.extendedProps.Realizirano
                            );

                            let button = document.getElementsByClassName(
                                "fc-dayGridMonth-button fc-button fc-button-primary fc-button-active"
                            );
                            this.selectedViewButton = button.length > 0 ? true : false;

                            if (this.selectedViewButton === true) {
                                arg.el.innerHTML =
                                    `<div class="fc-content">
                                        <div class="ui-g-12">
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-time">` +
                                    this.calendarConfig.formatDateShort(arg.event.start) +
                                    `</span>
                                                -
                                                <span class="fc-time">` +
                                    this.calendarConfig.formatDateShort(arg.event.end) +
                                    `</span> 
                                                <span class="fc-time">` +
                                    this.parseRealizacija(arg.event.extendedProps.Realizirano) +
                                    `</span>
                                            </div>

                                            <div class="ui-g-12 ui-lg-4 ui-md-4 ui-sm-4" style="padding:0.1em;">
                                                <span class="fc-time">` +
                                    arg.event.title +
                                    `</span>

                                            </div>

                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` +
                                    this.parsePredmet(arg.event.extendedProps.PredmetNaziv) +
                                    `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` +
                                    arg.event.extendedProps.PredmetKratica +
                                    `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` +
                                    this.parseStudijKratica(
                                        arg.event.extendedProps.StudijNazivKratica
                                    ) +
                                    `</span>

                                            </div>
                                        </div>

                                        


                                    </div>
                                        `;
                            }
                        },
                        datesRender: arg => {
                            this.calendarConfig.passedDate = arg.view.calendar.getDate();
                            this.rangeDates = [arg.view.calendar.getDate(), null];
                        }
                    });
                    this.calendar.render();
                });
            });
    }

    ngAfterViewInit() {}

    /**
     * @returns string: formatirani predmet ili prazan string.
     * @description Kartica Kalendar, formatira ispis predmeta na kartici ovisno o sirini ekrana
     * @param predmet string
     */
    parsePredmet(predmet?) {
        // console.log(screen.width);
        if (predmet) {
            return this.calendarConfig.checkDeviceWidth(screen.width)
                ? predmet
                : this.calendarConfig.parsePredmetSmallDevice(predmet);
        }
        return "";
    }

    /**
     * @returns string: ovisno o realizaciji jeli true ili false.
     * @description Kartica Agenda i Kalendar, postavlja 'kvacicu' za realiziranu nastavu, a 'X' za nerealiziranu
     * @param realizirano boolean
     */
    parseRealizacija(realizirano?) {
        return realizirano
            ? `<span class="fa fa-check" style="color:` +
                  this.calendarConfig.getColors().Realizirano +
                  `; padding-left:0.2em; font-size:1.5em; "></span>`
            : `<span class="fa fa-times" style="color:` +
                  this.calendarConfig.getColors().NijeRealizirano +
                  `; padding-left:0.2em; font-size:1.5em; "></span>`;
    }

    /**
     * @returns string
     * @description Kartica Kalendar, spojene kratice studija iz apia formatira tako da svako treceg stavlja u novi red zbog preglednosti
     * @param studiji string
     */
    parseStudijKratica(studiji?: string) {
        return studiji
            .split(",")
            .map((e: string, index: number) => {
                return e.concat(index % 2 == 0 && index != 0 ? ",<br> " : ", ").slice(0, -1);
                // console.log(e);
            })
            .join(" ")
            .trim()
            .slice(0, -1);
    }
}

