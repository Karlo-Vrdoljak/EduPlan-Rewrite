import { Component, OnInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { Calendar, View } from "@fullcalendar/core";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { AppVariables } from "../_interfaces/_configAppVariables";
import { CalendarConfig } from "../_interfaces/_configCalendar";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-student-calendar",
    templateUrl: "./student-calendar.component.html",
    styleUrls: ["./student-calendar.component.css"]
})
export class StudentCalendarComponent implements OnInit {
    events: any[] = null;
    apiData: any;
    calendar: Calendar;
    rangeDates: Date[];
    monthButton: boolean = false;
    weekButton: boolean = false;
    dayButton: boolean = false;
    displayEventDialog: boolean = false;
    displayStudentiEventDialog: boolean = false;
    eventDetalji: any;
    legend: MenuItem[];
    params = {
        PkStudent: this.appVariables.PkStudent,
        // PkSkolskaGodina: this.appVariables.PkSkolskaGodina,
        DatumOd: this.calendarConfig.DatumOd,
        DatumDo: this.calendarConfig.DatumDo
    };
    translate: TranslateService;

    constructor(
        public router: Router,
        translate: TranslateService,
        private studentiService: StudentiService,
        private calendarConfig: CalendarConfig,
        private appVariables: AppVariables
    ) {
        this.translate = translate;
        
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
        if (screen.width <= 600) {
            this.router.navigate(["/vStudentAgenda", "sm"]);
        }
        this.translate
            .get([
                "STUDENT_KALENDAR_LOCALE",
                "STUDENT_KALENDAR_LOCALE",
                "STUDENTCALENDAR_PREDAVANJA",
                "STUDENTCALENDAR_SEMINAR",
                "STUDENTCALENDAR_VJEZBE",
                "STUDENTCALENDAR_ISPITI",
                "STUDENTCALENDAR_REALIZIRANO",
                "STUDENTCALENDAR_NIJE_REALIZIRANO",
                "STUDENTCALENDAR_PRISUTAN",
                "STUDENTCALENDAR_ODSUTAN"
            ])
            .toPromise()
            .then(res => {
                this.legend = this.calendarConfig.setupKalendarAgendaLegenda(res).filter((e:MenuItem) => {
                    return e.label != res.STUDENTCALENDAR_REALIZIRANO;
                });

                this.studentiService.getStudentRaspored(this.params).subscribe(data => {
                    this.apiData = data;
                    this.events = this.calendarConfig.prepareCalendarEventsProfesor(this.apiData);
                    var calendarEl = document.getElementById("calendar");
                    this.calendar = new Calendar(calendarEl, {
                        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                        defaultDate: this.calendarConfig.getDateTimeCurrent(),
                        //aspectRatio: 2.8,
                        navLinks: true,
                        locales: allLocales,
                        selectable: true,
                        defaultView: "timeGridWeek",
                        locale: res.STUDENT_KALENDAR_LOCALE,
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

                            // console.log(studentiPredmet);
                            this.eventDetalji = {
                                eventId: arg.event.id,
                                PredmetNaziv: arg.event.extendedProps.PredmetNaziv,
                                PodTipPredavanjaNaziv:
                                    arg.event.extendedProps.PodTipPredavanjaNaziv,
                                PredmetKratica: arg.event.extendedProps.PredmetKratica,
                                SifraPredavaonice: arg.event.extendedProps.SifraPredavaonice,
                                Realizirano: arg.event.extendedProps.Realizirano,
                                StudijNaziv: this.calendarConfig.listBoxStudiji(arg.event.extendedProps.StudijNaziv),
                                KraticaStudija: this.calendarConfig.listBoxStudiji(arg.event.extendedProps.StudijNazivKratica),
                                start: start,
                                end: end,
                                // datum: datum,
                                termin: start + "-" + end,
                                Prisutan: arg.event.extendedProps.Prisutan,
                                NastavnikSuradnikNaziv: arg.event.extendedProps.NastavnikSuradnikNaziv
                            };
                            this.displayEventDialog = true;
                        },
                        eventRender: arg => {
                            // arg.el.style.opacity = this.calendarConfig.checkRealizacijaDaNe(
                            //     arg.event.extendedProps.Realizirano
                            // );

                            this.getSelectedButton(arg.view);

                            if (this.monthButton === true) {
                                // console.log(arg);
                                arg.el.style.fontSize = this.calendarConfig.chooseFontSize(screen.width);
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
                                                `</span>` +
                                                // `<span class="fc-time">` +
                                                //     this.parseRealizacija(arg.event.extendedProps.Realizirano) +
                                                // `</span>`
                                            `</div>
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
                                                <span class="fc-title">Kratica &bull; ` +
                                    arg.event.extendedProps.PredmetKratica +
                                    `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` +
                                    this.calendarConfig.parseStudijLabel(
                                        arg.event.extendedProps.StudijNazivKratica
                                    ) +
                                    this.parseStudijKratica(
                                        arg.event.extendedProps.StudijNazivKratica
                                    ) + `<br>` +
                                    arg.event.extendedProps.NastavnikSuradnikNaziv + `</span>` +
                                    this.parseEducard(arg.event.extendedProps.Prisutan) +
                                    `</div>
                                        </div>

                                        


                                    </div>
                                        `;
                            } else if (this.weekButton === true || this.dayButton === true) {
                                arg.el.innerHTML =
                                    `<div class="fc-content ui-g ui-fluid">
                                        <div class="ui-g-12 ui-sm-12 ui-md-12 ui-lg-12">` +
                                    (this.dayButton
                                        ? `<span class="fc-time">` +
                                          this.calendarConfig.formatDateShort(arg.event.start) +
                                          `</span>
                                                -
                                                <span class="fc-time">` +
                                          this.calendarConfig.formatDateShort(arg.event.end) +
                                          `</span>` +
                                        //   `<span class="fc-time">` +
                                        //   this.parseRealizacija(
                                        //       arg.event.extendedProps.Realizirano
                                        //   ) +
                                        //   `</span>` +
                                          `<span class="fc-time">` +
                                          this.parseEducard(arg.event.extendedProps.Prisutan) +
                                          `</span>` +
                                          `<span class="fc-title" style="padding-left:0.2em;"> Predavaonica &bull; ` +
                                          arg.event.title +` Nastavnik &bull; `+
                                          arg.event.extendedProps.NastavnikSuradnikNaziv +
                                          `</span>` +
                                          `<span class="fc-title" style="padding-left:0.2em;">` + ` &bull; ` +
                                          arg.event.extendedProps.PredmetNaziv +
                                          `</span>` +
                                          `<span class="fc-title" style="padding-left:0.2em;"> Kratica &bull; ` +
                                          arg.event.extendedProps.PredmetKratica +
                                          `</span>` +
                                          `<span class="fc-title" style="padding-left:0.2em;"> ` +
                                          this.calendarConfig.parseStudijLabel(
                                              arg.event.extendedProps.StudijNazivKratica
                                          ) +
                                          arg.event.extendedProps.StudijNazivKratica +
                                          `</span>`
                                        : ``) +
                                    (this.weekButton
                                        ? (this.calendarConfig.checkDeviceWidth(screen.width)
                                              ? `<span class="fc-time">` +
                                                this.calendarConfig.formatDateShort(
                                                    arg.event.start
                                                ) +
                                                `</span>
                                                -
                                                <span class="fc-time">` +
                                                this.calendarConfig.formatDateShort(arg.event.end) +
                                                `</span>`
                                              : ``) +
                                          `<span class="fc-title" style="font-size:0.85em;">` +
                                          arg.event.title + ' ' + arg.event.extendedProps.NastavnikSuradnikInicijali + ' ' +
                                          `</span>` +
                                          `<span class="fc-title" style="font-size:0.85em;">&bull; ` +
                                          arg.event.extendedProps.PredmetKratica +
                                          `</span>` +
                                        //   `<span class="fc-time" style="font-size:0.65em;">` +
                                        //   this.parseRealizacija(
                                        //       arg.event.extendedProps.Realizirano
                                        //   ) +
                                        //   `</span>` +
                                          `<span class="fc-time" style="font-size:0.65em; padding-top:"0.4em;">` +
                                          this.parseEducard(arg.event.extendedProps.Prisutan) +
                                          `</span>`
                                        : ``) +
                                    `</div>

                                    </div>`;
                            }
                            this.monthButton = false;
                            this.weekButton = false;
                            this.dayButton = false;
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

    getSelectedButton(view: View) {
        this.monthButton = view.type == "dayGridMonth" ? true : false;

        this.weekButton = view.type == "timeGridWeek" ? true : false;

        this.dayButton = view.type == "timeGridDay" ? true : false;
    }

    /**
     * @returns string: ovisno o realizaciji jeli true ili false.
     * @description Kartica Agenda i Kalendar, postavlja 'kvacicu' za realiziranu nastavu, a 'X' za nerealiziranu
     * @param realizirano boolean
     */
    parseRealizacija(realizirano?: boolean) {
        return realizirano
            ? `<span class="fa fa-check" style="color:` +
                  this.calendarConfig.getColors().Realizirano +
                  `; float:right; ` +
                  (this.monthButton ? ` padding-right:0.75em;` : ``) +
                  (this.weekButton ? ` padding-top:0.3em;` : ``) +
                  ` font-size:1.5em; "></span>`
            : // : `<span class="fa fa-times" style="color:` + this.calendarConfig.getColors().NijeRealizirano + `; float:right; `+ (this.monthButton? ` padding-right:0.75em;` : `` ) + ` font-size:1.5em; "></span>`;
              ``;
    }

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
     * @returns string
     * @description Kartica Kalendar, spojene kratice studija iz apia formatira tako da svakog stavlja u novi red zbog preglednosti
     * @param studiji string
     */
    parseStudijKratica(studiji?: string) {
        let length = studiji.split(",").length - 1;
        return studiji
            .split(",")
            .map((e: string, index: number) => {
                if (index != length) {
                    return e.concat(",<br>");
                } else {
                    return e;
                }
            })
            .join(" ")
            .trim();
    }

    parseEducard(timbran) {
        // this.appVariables.EducardAktivan = 0;
        if (this.appVariables.EducardAktivan) {
            return timbran
                ? `<span class="fc-title" style="float:right; ` +
                      (this.monthButton ? `padding-right:1.2em;` : ``) +
                      (this.weekButton ? ` padding-top:0.4em;` : ` padding-top:0.2em;`) +
                      `">
                <i class="fa fa-rss" style="color:` +
                      this.calendarConfig.getColors().Realizirano +
                      `; font-size:1.3em;"></i>
            </span>`
                : // `<span class="fc-title" style="float:right; `+ (this.monthButton? `padding-right:1.2em;` : `` )+` padding-top:0.2em;">
                  //     <i class="fa fa-rss" style="color:` + this.calendarConfig.getColors().NijeRealizirano + `; font-size:1.3em;"></i>
                  // </span>`
                  ``;
        }
        return "";
    }

    closeDialogEvent() {
        this.displayEventDialog = false;
        this.eventDetalji = null;
    }
    isBoolean(val) {
        return [0, 1].includes(val);
    }
}
