/************************************************************************************************************************************************************
 ** File
 ** Name      :      [Registar].[spRegistarBrodovaProvjeraValidnostiSvjedodzbe]
 ** DESC      :
 **
 ** Author    :      Srdan Druzeic
 ** Date      :      28.08.2019.
 *************************************************************************************************************************************************************
 ** Change history :
 *************************************************************************************************************************************************************
 ** Date:                   Author:                    Description :
 **------------             ------------- -------------------------------------
 **
 *************************************************************************************************************************************************************/
import { Component, OnInit, AfterViewInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppVariables } from "../_interfaces/_configAppVariables";
import { CalendarConfig } from "../_interfaces/_configCalendar";
import { Calendar, View, cssToStr } from "@fullcalendar/core";
import { ProfesorService } from "../_services/profesori.service";
import { MenuItem, MessageService } from "primeng/api";
import { CalendarService } from "../_services/calendar.service";
import { StudentiService } from "../_services/studenti.service";
import { OpciService } from "../_services/opci.service";
import { PrisutniStudenti } from "../_interfaces/PrisutniStudenti";

@Component({
    selector: "app-profesor-calendar",
    templateUrl: "./profesor-calendar.component.html",
    styleUrls: ["./profesor-calendar.component.css"]
})
export class ProfesorCalendarComponent implements OnInit, AfterViewInit {
    calendarOptions: any;

    events: any[] = null;
    apiData: any[];
    calendar: Calendar;
    rangeDates: Date[];
    monthButton: boolean = false;
    weekButton: boolean = false;
    dayButton: boolean = false;
    displayEventDialog: boolean = false;
    displayStudentiEventDialog: boolean = false;
    eventDetalji: any;
    legend: MenuItem[];
    prisutniStudenti: any[];
    bloksatPrisutniStudenti: any[];
    prisutnostStudenata: any[];
    studentiZaBrisanje: any[];
    studentiPrethodnihSatnica: any[];
    blokSatDaNe: boolean = false;
    studentiRealizacija: PrisutniStudenti[];
    eventsBloksat:any[];
    apiStudenti:any[];
    hasBloksat:boolean = false;
    resolvedPromisesCount:number;

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
        private calendarConfig: CalendarConfig, // private windowOrientation: WindowCalendarOrientation
        private studentiService: StudentiService,
        private opciService: OpciService,
        private messageService: MessageService
    ) {
        // this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe = 1;
        
    }

    synchronizeCalendarEvents(isRealizacija = false) {
        this.calendarConfig.passedDate = this.rangeDates;

        this.params.DatumOd = this.calendarConfig.formatDate(
            this.rangeDates[0]
        );
        this.params.DatumDo = this.calendarConfig.formatDate(
            this.rangeDates[1]
        );

        this.profesorSerivce
            .getNastavnikRaspored(this.params)
            .subscribe(data => {
                var events = this.calendarConfig.prepareCalendarEventsProfesor(
                    data
                );
                this.calendar.removeAllEventSources();

                this.calendar.addEventSource(events);
                this.calendar.rerenderEvents();
                if (!isRealizacija) {
                    this.calendar.gotoDate(this.rangeDates[0]);
                }
            });
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
            this.synchronizeCalendarEvents();
        }
    }

    handleRealizacija() {
        // console.log(this.eventDetalji.Realizirano);

        if (this.eventDetalji.Realizirano == true) {
            this.studentiRealizacija = [];

            this.prisutniStudenti.forEach((e: any) => {
                this.studentiRealizacija.push({
                    PkStudent: e.PkStudent,
                    PkEduCardReaderData: e.PkEduCardReaderData,
                    PkStudij: e.PkStudij,
                    ProfesorIskljucioDaNe: e.ProfesorIskljucioDaNe
                });
            });
            let params = {
                PkNastavaPlan: this.eventDetalji.PkNastavaPlan,
                PkNastavnikSuradnik: this.eventDetalji.PkNastavnikSuradnik,
                PkUsera: this.appVariables.PkUsera,
                PrisutniStudenti: this.studentiRealizacija
            };
            // console.log(this.prisutniStudenti);
            this.profesorSerivce
                .postNastavaRealizacijaPlana(params)
                .subscribe(data => {
                    // console.log(data);
                    this.synchronizeCalendarEvents(true);
                    this.messageService.add({
                        severity: "success",
                        summary: this.translate.instant(
                            "STUDENT_BDSTUDENTPODACINASTUDIJU_PROMJENA_SUCCESS"
                        ),
                        detail: this.translate.instant(
                            "PROFESOR_KALENDAR_MSG_DETAIL_REALIZACIJA_SUCCESS"
                        )
                    });
                    this.closeDialogEvent();
                });
            // console.log('ZA_REALIZACIJU',this.studentiRealizacija);
        } else {
            let params = {
                PkNastavaRealizacija: this.eventDetalji.PkNastavaRealizacija,
                PkUsera: this.appVariables.PkUsera
            };
            this.profesorSerivce
                .deleteNastavaRealizacija(params)
                .subscribe(data => {
                    // console.log(data);
                    this.messageService.add({
                        severity: "success",
                        summary: this.translate.instant(
                            "STUDENT_BDSTUDENTPODACINASTUDIJU_PROMJENA_SUCCESS"
                        ),
                        detail: this.translate.instant(
                            "PROFESOR_KALENDAR_MSG_DETAIL_REALIZACIJA_SUCCESS"
                        )
                    });
                    this.synchronizeCalendarEvents(true);
                    this.closeDialogEvent();
                });
        }
    }
    ngOnInit() {
        // console.log(this.appVariables.PkSkolskaGodina);
        if (screen.width <= 600) {
            this.router.navigate(["/vProfesorAgenda", "sm"]);
        }
        this.eventsBloksat = [];
        this.studentiZaBrisanje = [];
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
                "KATALOZI_NASTAVNIKSURADNIKPREDMETI_JMBAG",
                "PREDMET_BDPREDMETSTUDENTI_IME",
                "PREDMET_BDPREDMETSTUDENTI_PREZIME",
                "PREDMET_BDPREDMETSTUDENTI_KRATICA_STUDIJA",
                "PREDMET_BDPREDMETSTUDENTI_PRISUTAN",
                "NASTAVA_GRUPAPREDMETA_KRATICA",
                "NASTAVA_NASTAVAREALIZACIJA_PREDAVAONICA",
                "NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRATIPPREDAVANJA_STUDIJ",
                "GRUPEZANASTAVU_GRUPAZANASTAVUSTUDENTSTUDIJ_STUDIJI"
            ])
            .toPromise()
            .then(res => {
                this.legend = this.calendarConfig.setupKalendarAgendaLegenda(
                    res
                );

                this.prisutnostStudenata = this.calendarConfig.setupColsPrisutnostStudenata(
                    res
                );

                this.profesorSerivce
                    .getNastavnikRaspored(this.params)
                    .subscribe((data: any[]) => {
                        this.apiData = data;
                        // this.apiData.sort((a:any , b:any) => {
                        //     return new Date(a.DatumVrijemeOd).getTime() > new Date(b.DatumVrijemeOd).getTime() ? 1 : -1;
                        // });
                        this.events = this.calendarConfig.prepareCalendarEventsProfesor(
                            this.apiData
                        );
                        // console.log(this.events);
                        var calendarEl = document.getElementById("calendar");
                        this.calendar = new Calendar(calendarEl, {
                            plugins: [
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin
                            ],
                            defaultDate: this.calendarConfig.getDateTimeCurrent(),
                            //aspectRatio: 2.8,
                            navLinks: true,
                            locales: allLocales,
                            selectable: true,
                            defaultView: "timeGridWeek",
                            locale: res.STUDENT_KALENDAR_LOCALE,
                            height: "auto",
                            contentHeight:
                                screen.height - 70 - 57.25 - 19.5 - 90,
                            firstDay: 1,
                            events: this.events,
                            header: {
                                center: "prevYear,prev,today,next,nextYear",
                                right: "dayGridMonth,timeGridWeek,timeGridDay"
                            },

                            eventClick: arg => {
                                var start = this.calendarConfig.formatDateShort(
                                    arg.event.start
                                );
                                var end = this.calendarConfig.formatDateShort(
                                    arg.event.end
                                );
                                let parameters = {
                                    Datum: arg.event.extendedProps.Datum,
                                    PkPredavaonica:
                                        arg.event.extendedProps.PkPredavaonica
                                };
                                console.log(parameters);
                                this.opciService
                                    .getPrikazDogadajaNaDatum(parameters)
                                    .subscribe((data: any[]) => {
                                        if (this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe == 0 && arg.event.extendedProps.PkNastavaRealizacija == null){
                                            this.eventsBloksat = this.calendarConfig.generateBloksatEvents(data, arg.event.extendedProps, this.appVariables.granicneSatnice[1].RbrSatnice);
                                            console.log(this.eventsBloksat);
                                            this.bloksatPrisutniStudenti = [];
                                            this.resolvedPromisesCount = 0;
                                            if (this.eventsBloksat.length > 0) {
                                                this.eventsBloksat = this.calendarConfig.groupByOneKey(this.eventsBloksat,'RbrSatnice');

                                                this.eventsBloksat.forEach((e,index,self) => {
                                                    let params = {
                                                        PkNastavaPlan: e.PkNastavaPlan || null,
                                                        PkNastavaRealizacija: e.PkNastavaRealizacija || null
                                                    }
                                                    console.log(params);
                                                    this.studentiService 
                                                    .getStudentPrisutnostNaNastavi(params)
                                                    .subscribe((data:any[]) => {
                                                            this.resolvedPromisesCount ++;
                                                            console.log("bloksatPrijeMergea",this.bloksatPrisutniStudenti);
                                                            this.bloksatPrisutniStudenti = this.bloksatPrisutniStudenti.concat(data);
                                                            
                                                            console.log("bloksatNakonMergea",this.bloksatPrisutniStudenti);
                                                            console.log("BLOKSAT_EVENT",self);
                                                            
                                                        },(err) => {console.log(err);
                                                        },() => {
                                                            if (this.resolvedPromisesCount == this.eventsBloksat.length + 1) {
                                                                this.resolvedPromisesCount = 0;
                                                                
                                                                if(!this.eventDetalji) {
                                                                    this.makeStudentList();
                                                                    this.eventDetalji = this.generateEventDetails(arg,start,end);
                                                                    this.hasBloksat = true;
                                                                }
                                                            }
                                                        });
                                                    });
                                                }
                                            } 
                                        
                                        let params = {
                                            PkNastavaPlan:
                                                arg.event.extendedProps.PkNastavaPlan,
                                            PkNastavaRealizacija:
                                                arg.event.extendedProps.PkNastavaRealizacija
                                        };
                                        // console.log(params);

                                        this.studentiService
                                            .getStudentPrisutnostNaNastavi(params)
                                            .subscribe((data: any[]) => {
                                                this.apiStudenti = data;
                                                if (this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe == 0 && arg.event.extendedProps.PkNastavaRealizacija == null){
                                                    this.resolvedPromisesCount ++;
                                                    if (this.resolvedPromisesCount == this.eventsBloksat.length + 1) {
                                                        this.resolvedPromisesCount = 0;
                                                        if(!this.eventDetalji) {
                                                            this.makeStudentList();
                                                            this.eventDetalji = this.generateEventDetails(arg,start,end);
                                                            if (this.eventsBloksat.length > 0) {
                                                                this.hasBloksat = true;
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    console.log("Nebi smia okinit ako je u nula i nema realizacije",this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe,arg.event.extendedProps.PkNastavaRealizacija );
                                                    
                                                    this.prisutniStudenti = this.apiStudenti;
                                                    this.eventDetalji = this.generateEventDetails(arg,start,end);
                                                    this.prisutniStudenti = this.prisutniStudenti
                                                        .sort((a,b) => {
                                                        return a.Prezime.toLowerCase() > b.Prezime.toLowerCase() ? 1 : a.Prezime.toLowerCase() === b.Prezime.toLowerCase() ? (a.Ime.toLowerCase() > b.Ime.toLowerCase() ? 1 : -1 ) : -1
                                                    });
                                                    this.prisutniStudenti = this.calendarConfig.groupByOneKey(this.prisutniStudenti,'JMBAG');

                                                }
                                                
                                            });
                                        });


                                this.displayEventDialog = true;
                            },
                            eventRender: arg => {
                                // arg.el.style.opacity = this.calendarConfig.checkRealizacijaDaNe(
                                //     arg.event.extendedProps.Realizirano
                                // );

                                this.getSelectedButton(arg.view);

                                if (this.monthButton === true) {
                                    arg.el.innerHTML =
                                        `<div class="fc-content">
                                        <div class="ui-g-12">
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-time">` +
                                        this.calendarConfig.formatDateShort(
                                            arg.event.start
                                        ) +
                                        `</span>
                                                -
                                                <span class="fc-time">` +
                                        this.calendarConfig.formatDateShort(
                                            arg.event.end
                                        ) +
                                        `</span> 
                                                <span class="fc-time">` +
                                        this.parseRealizacija(
                                            arg.event.extendedProps.Realizirano
                                        ) +
                                        `</span>
                                            </div>

                                            <div class="ui-g-12 ui-lg-4 ui-md-4 ui-sm-4" style="padding:0.1em;">
                                                <span class="fc-time">` +
                                        arg.event.title +
                                        `</span>

                                            </div>

                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` +
                                        this.parsePredmet(
                                            arg.event.extendedProps.PredmetNaziv
                                        ) +
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
                                            arg.event.extendedProps.StudijNazivKratica,
                                            res
                                        ) +
                                        this.parseStudijKratica(
                                            arg.event.extendedProps.StudijNazivKratica
                                        ) +
                                        `</span>` +
                                        this.parseEducard(
                                            arg.event.extendedProps.Prisutan
                                        ) +
                                        `</div>
                                        </div>
                                    </div>
                                        `;
                                } else if (
                                    this.weekButton === true ||
                                    this.dayButton === true
                                ) {
                                    arg.el.innerHTML =
                                        `<div class="fc-content ui-g ui-fluid">
                                        <div class="ui-g-12 ui-sm-12 ui-md-12 ui-lg-12">` +
                                        (this.dayButton
                                            ? `<span class="fc-time">` +
                                              this.calendarConfig.formatDateShort(
                                                  arg.event.start
                                              ) +
                                              `</span>
                                                -
                                                <span class="fc-time">` +
                                              this.calendarConfig.formatDateShort(
                                                  arg.event.end
                                              ) +
                                              `</span> 
                                                <span class="fc-time">` +
                                              this.parseRealizacija(
                                                  arg.event.extendedProps.Realizirano
                                              ) +
                                              `</span>` +
                                              `<span class="fc-time">` +
                                              this.parseEducard(
                                                  arg.event.extendedProps.Prisutan
                                              ) +
                                              `</span>` +
                                              `<span class="fc-title" style="padding-left:0.2em;"> ` +
                                              res.NASTAVA_NASTAVAREALIZACIJA_PREDAVAONICA +
                                              ` &bull; ` +
                                              arg.event.title +
                                              `</span>` +
                                              `<span class="fc-title" style="padding-left:0.2em;">` +
                                              arg.event.extendedProps.PredmetNaziv +
                                              `</span>` +
                                              `<span class="fc-title" style="padding-left:0.2em;"> Kratica &bull; ` +
                                              arg.event.extendedProps.PredmetKratica +
                                              `</span>` +
                                              `<span class="fc-title" style="padding-left:0.2em;"> ` +
                                              this.calendarConfig.parseStudijLabel(
                                                  arg.event.extendedProps.StudijNazivKratica,
                                                  res
                                              ) +
                                              arg.event.extendedProps.StudijNazivKratica +
                                              `</span>`
                                            : ``) +
                                        (this.weekButton
                                            ? (this.calendarConfig.checkDeviceWidth(
                                                  screen.width
                                              )
                                                  ? `<span class="fc-time">` +
                                                    this.calendarConfig.formatDateShort(
                                                        arg.event.start
                                                    ) +
                                                    `</span>
                                                -
                                                <span class="fc-time">` +
                                                    this.calendarConfig.formatDateShort(
                                                        arg.event.end
                                                    ) +
                                                    `</span>`
                                                  : ``) +
                                              `<span class="fc-title" style="font-size:0.85em;">` +
                                              arg.event.title +
                                              `</span>` +
                                              `<span class="fc-title" style="font-size:0.85em;">&bull; ` +
                                              arg.event.extendedProps.PredmetKratica +
                                              `</span>` +
                                              `<span class="fc-time" style="font-size:0.65em;">` +
                                              this.parseRealizacija(
                                                  arg.event.extendedProps.Realizirano
                                              ) +
                                              `</span>` +
                                              `<span class="fc-time" style="font-size:0.65em; padding-top:"0.4em;">` +
                                              this.parseEducard(
                                                  arg.event.extendedProps.Prisutan
                                              ) +
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
                        } else {
                            this.rangeDates = this.calendarConfig.passedDate;
                        }
                    });
            });
    }

    ngAfterViewInit() {}

    getSelectedButton(view: View) {
        this.monthButton = view.type == "dayGridMonth" ? true : false;

        this.weekButton = view.type == "timeGridWeek" ? true : false;

        this.dayButton = view.type == "timeGridDay" ? true : false;
    }

    parseEducard(timbran) {
        // this.appVariables.EducardAktivan = 0;
        if (this.appVariables.EducardAktivan) {
            return timbran
                ? `<span class="fc-title" style="float:right; ` +
                      (this.monthButton ? `padding-right:1.2em;` : ``) +
                      (this.weekButton
                          ? ` padding-top:0.4em;`
                          : ` padding-top:0.2em;`) +
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
     * @returns string
     * @description Kartica Kalendar, spojene kratice studija iz apia formatira tako da svako treceg stavlja u novi red zbog preglednosti
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

    closeDialogPrisutnost() {
        this.displayStudentiEventDialog = false;
    }
    closeDialogEvent() {
        this.displayEventDialog = false;
        this.eventDetalji = null;
        this.prisutniStudenti = null;
        this.eventsBloksat = [];
        this.bloksatPrisutniStudenti = [];
        this.apiStudenti = [];
    }
    isBoolean(val) {
        return [0, 1, true, false].includes(val);
    }
    generateEventDetails(arg,start,end) {
        return {
            PkNastavaRealizacija:
                arg.event.extendedProps.PkNastavaRealizacija,
            PkNastavaPlan:
                arg.event.extendedProps.PkNastavaPlan,
            PkNastavnikSuradnik:
                arg.event.extendedProps.PkNastavnikSuradnik,
            eventId: arg.event.id,
            PredmetNaziv:
                arg.event.extendedProps.PredmetNaziv,
            PodTipPredavanjaNaziv:
                arg.event.extendedProps.PodTipPredavanjaNaziv,
            PredmetKratica:
                arg.event.extendedProps.PredmetKratica,
            SifraPredavaonice:
                arg.event.extendedProps.SifraPredavaonice,
            Realizirano:
                arg.event.extendedProps.Realizirano,
            StudijNaziv: this.calendarConfig.listBoxStudiji(
                arg.event.extendedProps.StudijNaziv
            ),
            KraticaStudija: this.calendarConfig.listBoxStudiji(
                arg.event.extendedProps.StudijNazivKratica
            ),
            start: start,
            end: end,
            termin: start + "-" + end,
            Prisutan:
                arg.event.extendedProps.Prisutan,
            Prisutnost:
                this.prisutniStudenti.length > 0
                    ? this.prisutniStudenti
                        .length
                    : null
        };
    }
    /**
     * 
     * @param arg svi propovi događaja
     * @param start vrijeme od
     * @param end vrijeme do
     * @Opis spaja blok sat otimbrane studente sa planskim otimbranim studentima
     * @returns EventDetalji => objekt koji sadrzi sve propove za render dijaloga
     */

     /**
      * let editedStudent = rowData;
        editedStudent.ProfesorIskljucioDaNe =
            editedStudent.ProfesorIskljucioDaNe == 1 ? 0 : 1;
        editedStudent.Prisutan = editedStudent.Prisutan == 1 ? 0 : 1;
        let studenti = [...this.prisutniStudenti];
        studenti[this.prisutniStudenti.indexOf(rowData)] = editedStudent;
        this.prisutniStudenti = studenti;
         */
    makeStudentList() {
        let prisutniStudenti = [];
        // let prisutniStudenti = !this.prisutniStudenti ? [] : [...this.prisutniStudenti];

        console.log("PLANSKI STUDENTI",this.apiStudenti);

        if(this.apiStudenti) {
            prisutniStudenti = prisutniStudenti.concat(this.apiStudenti);
        }
        if(this.bloksatPrisutniStudenti) {
            prisutniStudenti = prisutniStudenti.concat(this.bloksatPrisutniStudenti);
        }
        console.log("PRISUTNI STUDENTI",prisutniStudenti);
        this.prisutniStudenti = [...prisutniStudenti].sort((a,b) => {
            return a.Prezime.toLowerCase() > b.Prezime.toLowerCase() ? 1 : a.Prezime.toLowerCase() === b.Prezime.toLowerCase() ? (a.Ime.toLowerCase() > b.Ime.toLowerCase() ? 1 : -1 ) : -1
        });
        this.prisutniStudenti = this.calendarConfig.groupByOneKey(this.prisutniStudenti,'JMBAG');

    }

    handleBloksatSwapData() {
        if (this.eventDetalji.Realizirano || (this.eventsBloksat.length == 0)) {
            return;
        }
        if(this.hasBloksat == true) {
            this.makeStudentList();
        } else {
            let prisutniStudenti = !this.prisutniStudenti ? [] : [...this.apiStudenti];
            // let prisutniStudenti = []; 9.1.2019 9:40 duplikati
            this.prisutniStudenti.length = 0;
            this.prisutniStudenti = [...prisutniStudenti].sort((a,b) => {
                return a.Prezime.toLowerCase() > b.Prezime.toLowerCase() ? 1 : a.Prezime.toLowerCase() === b.Prezime.toLowerCase() ? (a.Ime.toLowerCase() > b.Ime.toLowerCase() ? 1 : -1 ) : -1
            });
            this.prisutniStudenti = this.calendarConfig.groupByOneKey(this.prisutniStudenti,'JMBAG');
        }
    }

    openStudentListDialog() {
        
        this.displayStudentiEventDialog = true;
    }

    handleDeleteStudentsClick() {
        // console.log('ARR',this.prisutniStudenti);
        // console.log('DEL',this.studentiZaBrisanje);
        this.studentiZaBrisanje.forEach(e => {
            let index = this.prisutniStudenti.indexOf(e);
            this.prisutniStudenti = this.prisutniStudenti.filter(
                (val, i) => i != index
            );
        });
        this.studentiZaBrisanje = [];
    }
    togglePrisutnost(rowData) {
        let editedStudent = rowData;
        editedStudent.ProfesorIskljucioDaNe =
            editedStudent.ProfesorIskljucioDaNe == 1 ? 0 : 1;
        editedStudent.Prisutan = editedStudent.Prisutan == 1 ? 0 : 1;
        let studenti = [...this.prisutniStudenti];
        studenti[this.prisutniStudenti.indexOf(rowData)] = editedStudent;
        this.prisutniStudenti = studenti;
    }
}
