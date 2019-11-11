import { Component, OnInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Calendar, View } from "@fullcalendar/core";
import { AppVariables } from "../_interfaces/_configAppVariables";
import { CalendarConfig } from "../_interfaces/_configCalendar";
import { MenuItem } from "primeng/api";
import { ProfesorService } from '../_services/profesori.service';

interface NastavnikSuradnik {
  display:string;
  Ime:string;
  Prezime:string;
  PkNastavnikSuradnik:number;
  OIB:string;
}

@Component({
    selector: "app-profesor-pregled-kalendara",
    templateUrl: "./profesor-pregled-kalendara.component.html",
    styleUrls: ["./profesor-pregled-kalendara.component.css"]
})
export class ProfesorPregledKalendaraComponent implements OnInit {
    events: any[] = null;
    apiData: any;
    nastavniciList: NastavnikSuradnik[];
    activeIndex: number = 0;
    dateReadySubmit:boolean=false;
    calendar: Calendar;
    rangeDates: Date[];
    monthButton: boolean = false;
    weekButton: boolean = false;
    dayButton: boolean = false;
    displayEventDialog: boolean = false;
    displayRasporedDialog: boolean = false;
    eventDetalji: any;
    legend: MenuItem[];
    odabirKalendara: MenuItem[];
    SelectedPkNastavnikSuradnik: NastavnikSuradnik;
    params = {
        PkNastavnikSuradnik: null,
        DatumOd: this.calendarConfig.DatumOd,
        DatumDo: this.calendarConfig.DatumDo
    };
    constructor(
        public router: Router,
        private translate: TranslateService,
        private calendarConfig: CalendarConfig,
        private appVariables: AppVariables,
        private profesoriService: ProfesorService
    ) {}
    submitRaspored() {
        if (this.rangeDates && this.SelectedPkNastavnikSuradnik) {
            this.params.PkNastavnikSuradnik = this.SelectedPkNastavnikSuradnik.PkNastavnikSuradnik;
            this.profesoriService.getNastavnikRaspored(this.params).subscribe(data => {
                var events = this.calendarConfig.prepareCalendarEventsProfesor(data);
                this.calendar.removeAllEventSources();
                this.events = events;
                this.calendar.addEventSource(events);
                this.calendar.rerenderEvents();
                this.calendar.gotoDate(this.rangeDates[0]);
                this.rangeDates = null;
                
            });
            this.closeRasporedEvent();
        }
    }

    handleSelectedDate() {
        let dateTrue = this.rangeDates
            .map(e => {
                return e ? true : false;
            })
            .every(e => {
                return e == true;
            });
        if (dateTrue) {
            this.calendarConfig.pregledNastavnikaPassedDate = this.rangeDates;
            this.params.DatumOd = this.calendarConfig.formatDate(this.rangeDates[0]);
            this.params.DatumDo = this.calendarConfig.formatDate(this.rangeDates[1]);
            this.dateReadySubmit = true;
        }
    }

    ngOnInit() {
        if (screen.width <= 600) {
            this.router.navigate(["/vPregledProfesorKalendar", "sm"]);
        }
        this.odabirKalendara = [
            { label: this.translate.instant("KATALOZI_STUDIJ_NASTAVNIK_SURADNIK") },
            { label: this.translate.instant("PROFESOR_PREGLEDKALENDARA_PERIOD_KALENDARA") }
        ];

        this.translate
            .get([
                "STUDENT_KALENDAR_LOCALE",
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
            .toPromise()
            .then(res => {
                this.legend = this.calendarConfig
                    .setupKalendarAgendaLegenda(res)
                    .filter((e: MenuItem) => {
                        return (
                            e.label != res.STUDENTCALENDAR_REALIZIRANO &&
                            e.label != res.STUDENTCALENDAR_PRISUTAN
                        );
                    });

                // this.profesoriService.getNastavnikRaspored(this.params).subscribe(data => {
                //     this.apiData = data;
                //     this.events = this.calendarConfig.prepareCalendarEventsProfesor(this.apiData);

                // });
                this.profesoriService
                    .getNastavnikSuradnikSvi()
                    .subscribe((data: NastavnikSuradnik[]) => {
                        this.nastavniciList = data;
                        this.nastavniciList.forEach((e: NastavnikSuradnik) => {
                            e.display = "";
                            e.display += e.Ime + " " + e.Prezime + " " + (e.OIB ? e.OIB : "");
                        });
                    });

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
                    events: null,
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
                            PodTipPredavanjaNaziv: arg.event.extendedProps.PodTipPredavanjaNaziv,
                            PredmetKratica: arg.event.extendedProps.PredmetKratica,
                            SifraPredavaonice: arg.event.extendedProps.SifraPredavaonice,
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
                            arg.el.style.fontSize = this.calendarConfig.chooseFontSize(
                                screen.width
                            );
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
                                                <span class="fc-title">` +
                                res.NASTAVA_GRUPAPREDMETA_KRATICA +
                                ` &bull; ` +
                                arg.event.extendedProps.PredmetKratica +
                                `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` +
                                this.calendarConfig.parseStudijLabel(
                                    arg.event.extendedProps.StudijNazivKratica,res
                                ) +
                                this.parseStudijKratica(
                                    arg.event.extendedProps.StudijNazivKratica
                                ) +
                                `<br>` +
                                arg.event.extendedProps.NastavnikSuradnikNaziv +
                                `</span>` +
                                // this.parseEducard(arg.event.extendedProps.Prisutan) +
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
                                      // `<span class="fc-time">` +
                                      // this.parseEducard(arg.event.extendedProps.Prisutan) +
                                      // `</span>` +
                                      `<span class="fc-title" style="padding-left:0.2em;"> Predavaonica &bull; ` +
                                      arg.event.title +
                                      res.NASTAVA_NASTAVAPLANIRANJE_SEMESTRALNO_NASTAVNIK +
                                      ` &bull; ` +
                                      arg.event.extendedProps.NastavnikSuradnikNaziv +
                                      `</span>` +
                                      `<span class="fc-title" style="padding-left:0.2em;">` +
                                      ` &bull; ` +
                                      arg.event.extendedProps.PredmetNaziv +
                                      `</span>` +
                                      `<span class="fc-title" style="padding-left:0.2em;"> Kratica &bull; ` +
                                      arg.event.extendedProps.PredmetKratica +
                                      `</span>` +
                                      `<span class="fc-title" style="padding-left:0.2em;"> ` +
                                      this.calendarConfig.parseStudijLabel(
                                          arg.event.extendedProps.StudijNazivKratica,res
                                      ) +
                                      arg.event.extendedProps.StudijNazivKratica +
                                      `</span>`
                                    : ``) +
                                (this.weekButton
                                    ? (this.calendarConfig.checkDeviceWidth(screen.width)
                                          ? `<span class="fc-time">` +
                                            this.calendarConfig.formatDateShort(arg.event.start) +
                                            `</span>
                                                -
                                                <span class="fc-time">` +
                                            this.calendarConfig.formatDateShort(arg.event.end) +
                                            `</span>`
                                          : ``) +
                                      `<span class="fc-title" style="font-size:0.85em;">` +
                                      arg.event.title +
                                      " " +
                                      arg.event.extendedProps.NastavnikSuradnikInicijali +
                                      " " +
                                      `</span>` +
                                      `<span class="fc-title" style="font-size:0.85em;">&bull; ` +
                                      arg.event.extendedProps.PredmetKratica +
                                      `</span>`
                                    : //   `<span class="fc-time" style="font-size:0.65em;">` +
                                      //   this.parseRealizacija(
                                      //       arg.event.extendedProps.Realizirano
                                      //   ) +
                                      //   `</span>` +
                                      // `<span class="fc-time" style="font-size:0.65em; padding-top:"0.4em;">` +
                                      // this.parseEducard(arg.event.extendedProps.Prisutan) +
                                      // `</span>`
                                      ``) +
                                `</div>

                                    </div>`;
                        }
                        this.monthButton = false;
                        this.weekButton = false;
                        this.dayButton = false;
                    }
                });
                this.calendar.render();

                if (!this.calendarConfig.pregledNastavnikaPassedDate) {
                    this.calendarConfig.pregledNastavnikaPassedDate = this.rangeDates;
                } else {
                    this.rangeDates = this.calendarConfig.pregledNastavnikaPassedDate;
                }
            });
    }

    getSelectedButton(view: View) {
        this.monthButton = view.type == "dayGridMonth" ? true : false;

        this.weekButton = view.type == "timeGridWeek" ? true : false;

        this.dayButton = view.type == "timeGridDay" ? true : false;
    }
    parsePredmet(predmet?) {
        // console.log(screen.width);
        if (predmet) {
            return this.calendarConfig.checkDeviceWidth(screen.width)
                ? predmet
                : this.calendarConfig.parsePredmetSmallDevice(predmet);
        }
        return "";
    }
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
    closeDialogEvent() {
        this.displayEventDialog = false;
        this.eventDetalji = null;
    }
    closeRasporedEvent() {
        this.displayRasporedDialog = false;
        this.SelectedPkNastavnikSuradnik = null;
        this.dateReadySubmit = false;
    }
}
