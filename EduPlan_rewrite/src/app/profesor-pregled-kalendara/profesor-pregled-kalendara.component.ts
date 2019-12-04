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
import { MenuItem, MessageService } from "primeng/api";
import { ProfesorService } from '../_services/profesori.service';
import { PrisutniStudenti } from '../_interfaces/PrisutniStudenti';
import { OpciService } from '../_services/opci.service';
import { StudentiService } from '../_services/studenti.service';
import { AppService } from '../_services/app.service';
import { NastavnikSuradnik } from '../_interfaces/NastavnikSuradnik';


@Component({
    selector: "app-profesor-pregled-kalendara",
    templateUrl: "./profesor-pregled-kalendara.component.html",
    styleUrls: ["./profesor-pregled-kalendara.component.css"]
})
export class ProfesorPregledKalendaraComponent implements OnInit {
    events: any[] = null;
    apiData: any[];
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
    displayStudentiEventDialog: boolean = false;
    displayComboBoxStudenti:boolean = false;

    eventDetalji: any;
    legend: MenuItem[];
    odabirKalendara: MenuItem[];
    

    prisutniStudenti: any[];
    bloksatPrisutniStudenti: any[];
    studentiZaBrisanje: any[];
    studentiRealizacija: PrisutniStudenti[];
    eventsBloksat:any[];
    apiStudenti:any[];
    hasBloksat:boolean = false;
    resolvedPromisesCount:number;

    comboBoxStudenti:any[];
    selectedComboBoxStudenti:any[];
    colsComboBoxStudenti:any[];
    prisutnostStudenata: any[];

    errorMsg:string;
    errorBlockRealizacija:boolean = false;
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
        private profesoriService: ProfesorService,
        private opciService: OpciService,
        private studentiService: StudentiService,
        private messageService: MessageService,
        private errorService: AppService

    ) {}

    synchronizeCalendarEvents(isRealizacija = false, isRefresh = false) {
        
        if(isRefresh) {
            if(!this.events) {
                this.messageService.add({
                    severity: "warn",
                    summary: this.translate.instant("STUDENT_STUDENTOSOBNIPODACI_IZMJENA_ERROR"),
                    detail: this.translate.instant("PROFESOR_KALENDAR_MSG_REFRESH_ERROR")
                });
                return;
            } else {
                this.messageService.add({
                    severity: "info",
                    summary: this.translate.instant("STUDENT_BDSTUDENTPODACINASTUDIJU_PROMJENA_SUCCESS"),
                    detail: this.translate.instant("PROFESOR_KALENDAR_MSG_REFRESH")
                });
            }
        }
        this.calendarConfig.passedDate = this.rangeDates;

        this.params.DatumOd = this.calendarConfig.formatDate(
            this.rangeDates[0]
        );
        this.params.DatumDo = this.calendarConfig.formatDate(
            this.rangeDates[1]
        );
        this.params.PkNastavnikSuradnik = this.appVariables.SelectedPkNastavnikSuradnik.PkNastavnikSuradnik;

        this.profesoriService
            .getNastavnikRaspored(this.params)
            .subscribe(data => {
                var events = this.calendarConfig.prepareCalendarEventsProfesor(
                    data
                );
                this.calendar.removeAllEventSources();
                this.events = events;

                this.calendar.addEventSource(events);
                this.calendar.rerenderEvents();
                if (!isRealizacija) {
                    this.calendar.gotoDate(this.rangeDates[0]);
                }

            });
    }

    submitRasporedSyncronize() {
        if (this.rangeDates && this.appVariables.SelectedPkNastavnikSuradnik) {
            this.synchronizeCalendarEvents();
            this.closeRasporedEvent();
        }
    }
    checkRasporedSubmitionOnInit() {
        if (this.appVariables.SelectedPkNastavnikSuradnik && this.calendarConfig.DatumOd && this.calendarConfig.DatumDo) {
            this.rangeDates = this.calendarConfig.passedDate;
            this.submitRasporedSyncronize();
        }
    }
    checkRasporedSubmitStatus() {
        if(this.appVariables.SelectedPkNastavnikSuradnik && this.rangeDates) {
            this.dateReadySubmit = true;
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
            this.dateReadySubmit = true;
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
            // console.log("PRISUTNI",this.prisutniStudenti);
            // console.log("ZA_API",this.studentiRealizacija);
            let params = { 
                PkNastavaPlan: this.eventDetalji.PkNastavaPlan,
                PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
                PkUsera: this.appVariables.PkUsera,
                PrisutniStudenti: this.studentiRealizacija
            };
            // console.log(this.prisutniStudenti);
            this.profesoriService
                .postNastavaRealizacijaPlana(params)
                .subscribe(data => {
                    
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
                }, (error) => {
                    this.errorMsg = this.errorService.prepareErrorForToast(error);
                    if(this.errorMsg) {
                        this.messageService.add({
                            severity: "error",
                            summary: this.translate.instant(
                                "STUDENT_STUDENTOSOBNIPODACI_IZMJENA_ERROR"
                            ),
                            detail: this.errorMsg
                        });
                        this.errorBlockRealizacija = true;
                    }
                    
                });
            // console.log('ZA_REALIZACIJU',this.studentiRealizacija);
        } else {
            let params = {
                PkNastavaRealizacija: this.eventDetalji.PkNastavaRealizacija,
                PkUsera: this.appVariables.PkUsera
            };
            this.profesoriService
                .deleteNastavaRealizacija(params)
                .subscribe(data => {
                    // console.log(data);
                    this.messageService.add({
                        severity: "success",
                        summary: this.translate.instant(
                            "STUDENT_BDSTUDENTPODACINASTUDIJU_PROMJENA_SUCCESS"
                        ),
                        detail: this.translate.instant(
                            "PROFESOR_KALENDAR_MSG_DETAIL_REALIZACIJA_REMOVE_SUCCESS"
                        )
                    });
                    console.log(data);
                    
                    this.synchronizeCalendarEvents(true);
                    this.closeDialogEvent();
                });
        }
    }

    ngOnInit() {
        if (this.appVariables.SelectedPkNastavnikSuradnik) {
            this.params.PkNastavnikSuradnik = this.appVariables.SelectedPkNastavnikSuradnik.PkNastavnikSuradnik;
        }
        
        if (screen.width <= 600) {
            this.router.navigate(["/vPregledProfesorKalendar", "sm"]);
        }
        this.checkRasporedSubmitionOnInit();
        this.odabirKalendara = [
            { label: this.translate.instant("KATALOZI_STUDIJ_NASTAVNIK_SURADNIK") },
            { label: this.translate.instant("PROFESOR_PREGLEDKALENDARA_PERIOD_KALENDARA") }
        ];
        this.eventsBloksat = [];
        this.studentiZaBrisanje = [];
        this.selectedComboBoxStudenti = [];
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
                this.legend = this.calendarConfig.setupKalendarAgendaLegenda(
                    res
                );
                this.prisutnostStudenata = this.calendarConfig.setupColsPrisutnostStudenata(
                    res
                );
                this.colsComboBoxStudenti = this.calendarConfig.setupColsComboBoxStudenti(res);

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
                    defaultDate: this.calendarConfig.selectedDate || this.calendarConfig.getDateTimeCurrent(),
                    //aspectRatio: 2.8,
                    navLinks: true,
                    locales: allLocales,
                    selectable: true,
                    defaultView: this.calendarConfig.selectedView || "timeGridWeek",
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
                        // console.log(parameters);
                        this.opciService
                            .getPrikazDogadajaNaDatum(parameters)
                            .subscribe((data: any[]) => {
                                if (this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe == 0 && arg.event.extendedProps.PkNastavaRealizacija == null){
                                    this.eventsBloksat = this.calendarConfig.generateBloksatEvents(data, arg.event.extendedProps, this.appVariables.granicneSatnice[1].RbrSatnice);
                                    // console.log(this.eventsBloksat);
                                    this.bloksatPrisutniStudenti = [];
                                    this.resolvedPromisesCount = 0;
                                    if (this.eventsBloksat.length > 0) {
                                        this.eventsBloksat = this.calendarConfig.groupByOneKey(this.eventsBloksat,'RbrSatnice');

                                        this.eventsBloksat.forEach((e,index,self) => {
                                            let params = {
                                                PkNastavaPlan: e.PkNastavaPlan || null,
                                                PkNastavaRealizacija: e.PkNastavaRealizacija || null
                                            }
                                            // console.log(params);
                                            this.studentiService 
                                            .getStudentPrisutnostNaNastavi(params)
                                            .subscribe((data:any[]) => {
                                                    this.resolvedPromisesCount ++;
                                                    // console.log("bloksatPrijeMergea",this.bloksatPrisutniStudenti);
                                                    this.bloksatPrisutniStudenti = this.bloksatPrisutniStudenti.concat(data);
                                                    
                                                    // console.log("bloksatNakonMergea",this.bloksatPrisutniStudenti);
                                                    // console.log("BLOKSAT_EVENT",self);
                                                    
                                                },(err) => {console.log(err);
                                                },() => {
                                                    if (this.resolvedPromisesCount == this.eventsBloksat.length + 1) {
                                                        this.resolvedPromisesCount = 0;
                                                        
                                                        if(!this.eventDetalji) {
                                                            this.hasBloksat = true;
                                                            this.makeStudentList();
                                                            this.eventDetalji = this.calendarConfig.generateEventDetails(arg,start,end, this.prisutniStudenti.length);
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
                                                    this.eventDetalji = this.calendarConfig.generateEventDetails(arg,start,end,this.prisutniStudenti.length);
                                                    if (this.eventsBloksat.length > 0) {
                                                        this.hasBloksat = true;
                                                    }
                                                }
                                            }
                                        } else {
                                            
                                            this.prisutniStudenti = this.apiStudenti;
                                            this.eventDetalji = this.calendarConfig.generateEventDetails(arg,start,end,this.prisutniStudenti.length);
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
                        // console.log(arg.event.extendedProps);
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
                                `<br>` +
                                    arg.event.extendedProps.NastavnikSuradnikNaziv +
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
                    },
                    datesRender: arg => {
                        
                        this.calendarConfig.passedDate = this.rangeDates;
                        this.calendarConfig.selectedView = arg.view.type;
                        this.calendarConfig.selectedDate = arg.view.calendar.getDate().toISOString();
                    }
                });

                if (!this.calendarConfig.passedDate) {
                    this.rangeDates = [
                        new Date(this.calendarConfig.DatumOd),
                        new Date(this.calendarConfig.DatumDo)
                    ];
                } else {
                    this.rangeDates = this.calendarConfig.passedDate;
                }
                this.calendar.render();

            });
    }
    
    closeRasporedEvent() {
        this.displayRasporedDialog = false;
        // this.appVariables = null;
        this.dateReadySubmit = false;
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


    closeDialogPrisutnost() {
        this.displayStudentiEventDialog = false;

    }
    closeDialogComboBoxStudenti(accept) {
        if(!accept) {
            this.selectedComboBoxStudenti = [];
            this.comboBoxStudenti = null;
        } else {
            this.selectedComboBoxStudenti.forEach(e => {
                if (!("ProfesorIskljucioDaNe" in e)) {
                    e.ProfesorIskljucioDaNe = 0;
                }
            });
            this.makeStudentList();
        }
        this.displayComboBoxStudenti = false;
    }
    closeDialogEvent() {
        this.displayEventDialog = false;
        this.eventDetalji = null;
        this.prisutniStudenti = null;
        this.eventsBloksat = [];
        this.bloksatPrisutniStudenti = [];
        this.apiStudenti = [];
        this.studentiZaBrisanje = [];
        this.selectedComboBoxStudenti = [];
        this.errorBlockRealizacija = false;
    }
    isBoolean(val) {
        return [0, 1, true, false].includes(val);
    }

    /**
     * 
     * @param arg svi propovi događaja
     * @param start vrijeme od
     * @param end vrijeme do
     * @Opis spaja blok sat otimbrane studente sa planskim otimbranim studentima
     * @returns EventDetalji => objekt koji sadrzi sve propove za render dijaloga
     */
    makeStudentList() {
        let prisutniStudenti = [];

        // console.log("PLANSKI STUDENTI",this.apiStudenti);

        if(this.apiStudenti) {
            prisutniStudenti = prisutniStudenti.concat(this.apiStudenti);
        }
        if(this.bloksatPrisutniStudenti && this.hasBloksat == true) {
            prisutniStudenti = prisutniStudenti.concat(this.bloksatPrisutniStudenti);
        }
        if(this.selectedComboBoxStudenti && this.eventDetalji) {
            let length = this.selectedComboBoxStudenti.length;
            // console.log(this.eventDetalji.KraticaStudijaProvjera);
            // console.log(this.selectedComboBoxStudenti.map(e => e.StudijNazivKratica));
            
            this.selectedComboBoxStudenti = this.selectedComboBoxStudenti.filter(e => {
                return this.eventDetalji.KraticaStudijaProvjera.includes(e.StudijNazivKratica)
            })
            if (length != this.selectedComboBoxStudenti.length) {
                this.messageService.add({
                    severity: "warn",
                    summary: this.translate.instant(
                        "STUDENT_BDSTUDENTPODACINASTUDIJU_PROMJENA_SUCCESS"
                    ),
                    detail: this.translate.instant(
                        "PROFESOR_KALENDAR_MSG_STUDENI_WARNING"
                    )
                });
            }
            prisutniStudenti = prisutniStudenti.concat(this.selectedComboBoxStudenti);
        }
        // console.log("PRISUTNI STUDENTI",prisutniStudenti);
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
            let prisutniStudenti = !this.prisutniStudenti ? [] : [...this.apiStudenti, ...this.selectedComboBoxStudenti];
            this.prisutniStudenti.length = 0;
            this.prisutniStudenti = [...prisutniStudenti].sort((a,b) => {
                return a.Prezime.toLowerCase() > b.Prezime.toLowerCase() ? 1 : a.Prezime.toLowerCase() === b.Prezime.toLowerCase() ? (a.Ime.toLowerCase() > b.Ime.toLowerCase() ? 1 : -1 ) : -1
            });
            this.prisutniStudenti = this.calendarConfig.groupByOneKey(this.prisutniStudenti,'JMBAG');
        }
    }
    openDialogComboBoxStudenti() {
        this.displayComboBoxStudenti = true;
        this.studentiService
            .getStudentiKalendarComboBox({ 
                PkSkolskaGodina : this.appVariables.PkSkolskaGodina
            }).subscribe( (data:any[]) => {
                this.comboBoxStudenti = data;
            });
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
    handleRealiziranoReadOnly() {
        if( this.appVariables.PkNastavnikSuradnik != this.params.PkNastavnikSuradnik && this.eventDetalji.Realizirano == false) {
            this.messageService.add({
                severity: "error",
                summary: this.translate.instant("STUDENT_STUDENTOSOBNIPODACI_IZMJENA_ERROR"),
                detail: this.translate.instant("PROFESOR_KALENDAR_MSG_DETAIL_REALIZACIJA_REMOVE_NEMA_PRAVA")
            });
            return false;
        }
        else if (this.eventDetalji.Realizirano == true) {
            return true;
        }
        return false;
    }
}
