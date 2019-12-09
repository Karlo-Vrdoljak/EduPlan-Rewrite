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
import { Calendar, View } from "@fullcalendar/core";
import { ProfesorService } from "../_services/profesori.service";
import { MenuItem, MessageService } from "primeng/api";
import { StudentiService } from "../_services/studenti.service";
import { OpciService } from "../_services/opci.service";
import { PrisutniStudenti } from "../_interfaces/PrisutniStudenti";
import { Satnice, Predavaonica } from '../_interfaces/Satnice';
import { AppService } from '../_services/app.service';

@Component({
    selector: "app-profesor-calendar",
    templateUrl: "./profesor-calendar.component.html",
    styleUrls: ["./profesor-calendar.component.css"]
})
export class ProfesorCalendarComponent implements OnInit, AfterViewInit {
    events: any[] = null;
    apiData: any[];
    calendar: Calendar;
    calendarEditTermin: Calendar;
    rangeDates: Date[];
    legend: MenuItem[];
    editTerminLegend: MenuItem[];
    monthButton: boolean = false;
    weekButton: boolean = false;
    dayButton: boolean = false;
    translations:any;

    displayEventDialog: boolean = false;
    displayStudentiEventDialog: boolean = false;
    displayComboBoxStudenti:boolean = false;
    displayEditTerminDialog:boolean = false;
    enableDatePick:boolean = false;
    editTermin:boolean = false;
    
    eventDetalji: any;
    prisutniStudenti: any[];
    bloksatPrisutniStudenti: any[];
    prisutnostStudenata: any[];
    studentiZaBrisanje: any[];
    studentiRealizacija: PrisutniStudenti[];
    eventsBloksat:any[];
    apiStudenti:any[];
    hasBloksat:boolean = false;
    resolvedPromisesCount:number;
    SatniceComboBox:Satnice[];

    comboBoxStudenti:any[];
    selectedComboBoxStudenti:any[];
    colsComboBoxStudenti:any[];
    calendarEditDogadajiKonflikt:any[];
    konfliktMaxDateInline:Date;
    eventEdit:any;
    editTerminDefaultState:any;
    errorMsg:string;

    params = {
        PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
        DatumOd: this.calendarConfig.DatumOd,
        DatumDo: this.calendarConfig.DatumDo
    };

    constructor(
        public router: Router,
        private translate: TranslateService,
        private profesorSerivce: ProfesorService,
        private appVariables: AppVariables,
        private calendarConfig: CalendarConfig,
        private studentiService: StudentiService,
        private opciService: OpciService,
        private messageService: MessageService,
        private errorService: AppService
    ) {
        // this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe = 1;
        
    }

    
    /***********************************************************************************************************
    *           METODE ZA RENDERANJE EVENTOVA - BEGIN
    /***********************************************************************************************************/
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
    /**
     * @Opis SLuži za upućivanje korisnika gdje postoje konflikti u satnici za DATUM => SATNICU => PREDAVAONICU
     */
    renderEditCalendar() {

        if (this.eventDetalji.Predavaonica == null || this.eventDetalji.Satnica == null || this.eventDetalji.Datum == null) {
            return;
        }
        this.enableDatePick = true;
        this.eventDetalji.DatumString = this.calendarConfig.formatDate(this.eventDetalji.Datum);
        this.eventDetalji.DatumVrijemeOd = this.eventDetalji.DatumString + 'T' + this.eventDetalji.Satnica.VrijemeOd;
        this.eventDetalji.DatumVrijemeDo = this.eventDetalji.DatumString + 'T' + this.eventDetalji.Satnica.VrijemeDo;
        // console.log(this.eventDetalji.DatumString);
        
        this.opciService.getPrikazDogadajaNaDatum(
            {
                Datum: this.eventDetalji.DatumString,
                PkPredavaonica: this.eventDetalji.Predavaonica.PkPredavaonica
            }
        ).subscribe((data:any[]) => {
            data = data.filter((e:any) => {
                if (!("PkNastavaPlan" in e)) {
                    return e;
                }
            });
            // console.log(data);
            this.calendarEditDogadajiKonflikt = this.calendarConfig.formatCalendarEditTermin(data);
            this.eventEdit = this.calendarConfig.formatCalendarEditTerminNewEvent({
                start: this.eventDetalji.DatumString + 'T' + this.eventDetalji.Satnica.VrijemeOd,
                end: this.eventDetalji.DatumString + 'T' + this.eventDetalji.Satnica.VrijemeDo,
                color: "#004e8a"
            });
            // console.log(this.eventEdit);
            
            if(!this.calendarEditDogadajiKonflikt.includes(this.eventEdit)) {
                this.calendarEditDogadajiKonflikt.push(this.eventEdit);
            }

            if (this.calendarEditDogadajiKonflikt.filter(e => e.start == this.eventEdit.start).length > 1) {
                this.editTermin = false;
                this.messageService.add({
                    severity: "warn",
                    summary: this.translate.instant("PROFESOR_IZMJENA_TERMINA_WARNING"),
                    detail: this.translate.instant("PROFESOR_IZMJENA_TERMINA_WARNING_LABEL")
                });
            } else {
                this.editTermin = true;
                this.messageService.add({
                    severity: "info",
                    summary: this.translate.instant("PROFESOR_IZMJENA_TERMINA_SUCCESS"),
                    detail: this.translate.instant("PROFESOR_IZMJENA_TERMINA_SUCCESS_LABEL")
                });
            }
            
            if (this.calendarEditTermin) {
                this.calendarEditTermin.gotoDate(this.eventDetalji.Datum);
                this.calendarEditTermin.removeAllEventSources();

                this.calendarEditTermin.addEventSource(this.calendarEditDogadajiKonflikt);
                this.calendarEditTermin.rerenderEvents();
                return;
            }
            
            var calendarEl = document.getElementById("terminCalendar");
            this.calendarEditTermin = new Calendar(calendarEl, {
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin
                ],
                defaultDate: this.eventDetalji.Datum,
                aspectRatio: 1.35,
                locales: allLocales,
                // selectable: true,
                defaultView: "timeGridDay",
                locale: this.translations.STUDENT_KALENDAR_LOCALE,
                height: "auto",//300,
                contentHeight: "auto",//250,
                // handleWindowResize: true,
                firstDay: 1,
                events: this.calendarEditDogadajiKonflikt,
                header: {
                    // center: "prev,next",
                    right: "resetView"
                },
                minTime: "07:00:00",
                eventClick: arg => { },
                eventRender: arg => { },
                datesRender: arg => { }
            });
            this.calendarEditTermin.render();
        });

    }

    /***********************************************************************************************************
    *           METODE ZA RENDERANJE EVENTOVA - END
    /***********************************************************************************************************/


    /***********************************************************************************************************
    *           METODE ZA MANIPULACIJU KALENDARA - BEGIN
    /***********************************************************************************************************/
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
            
        this.profesorSerivce
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
    /***********************************************************************************************************
    *           METODE ZA MANIPULACIJU KALENDARA - END
    /***********************************************************************************************************/



    /***********************************************************************************************************
    *           METODE ZA MANIPULACIJU STUDENATA - BEGIN
    /***********************************************************************************************************/
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

        if(this.apiStudenti) {
            prisutniStudenti = prisutniStudenti.concat(this.apiStudenti);
        }
        if(this.bloksatPrisutniStudenti && this.hasBloksat == true) {
            prisutniStudenti = prisutniStudenti.concat(this.bloksatPrisutniStudenti);
        }
        if(this.selectedComboBoxStudenti && this.eventDetalji) {
            let length = this.selectedComboBoxStudenti.length;
            
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
        this.prisutniStudenti = [...prisutniStudenti].sort((a,b) => {
            return a.Prezime.toLowerCase() > b.Prezime.toLowerCase() ? 1 : a.Prezime.toLowerCase() === b.Prezime.toLowerCase() ? (a.Ime.toLowerCase() > b.Ime.toLowerCase() ? 1 : -1 ) : -1
        });
        this.prisutniStudenti = this.calendarConfig.groupByOneKey(this.prisutniStudenti,'JMBAG');
    }

    handleDeleteStudentsClick() {
        this.studentiZaBrisanje.forEach(e => {
            let index = this.prisutniStudenti.indexOf(e);
            this.prisutniStudenti = this.prisutniStudenti.filter(
                (val, i) => i != index
            );
        });
        this.studentiZaBrisanje = [];
    }

    promjenaTerminaRealoadStudenti() {
        
        let parameters = {
            Datum: this.eventDetalji.DatumString,
            PkPredavaonica:
                this.eventDetalji.PkPredavaonica
        };
        this.opciService
        .getPrikazDogadajaNaDatum(parameters)
        .subscribe((data: any[]) => {
            if (this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe == 0 && this.eventDetalji.PkNastavaRealizacija == null){
                
                this.eventsBloksat = this.calendarConfig.generateBloksatEvents(data, this.eventDetalji, this.appVariables.granicneSatnice[1].RbrSatnice);
                this.bloksatPrisutniStudenti = [];
                this.resolvedPromisesCount = 0;
                
                if (this.eventsBloksat.length > 0) {
                    this.eventsBloksat = this.calendarConfig.groupByOneKey(this.eventsBloksat,'RbrSatnice');

                    this.eventsBloksat.forEach((e,index,self) => {
                        let params = {
                            PkPredavaonica: e.PkPredavaonica,
                            PkSatnica: e.PkSatnica,
                            Datum: e.Datum
                        }
                        
                        this.studentiService 
                        .getStudentPrisutnostNaNastaviZaTermin(params)
                        .subscribe((data:any[]) => {

                                this.resolvedPromisesCount ++;
                                this.bloksatPrisutniStudenti = this.bloksatPrisutniStudenti.concat(data);
                                
                            },(err) => {console.log(err);
                            },() => {
                                if (this.resolvedPromisesCount == this.eventsBloksat.length + 1) {
                                    this.resolvedPromisesCount = 0;
                                    
                                    if(this.eventDetalji) {
                                        if(this.eventsBloksat.length > 0) {
                                            this.hasBloksat = true;
                                        }
                                        this.makeStudentList();
                                        this.eventDetalji.Prisutnost = this.prisutniStudenti.length > 0 ? this.prisutniStudenti.length : null;

                                    }
                                }
                            });
                        });
                    } else {
                        this.hasBloksat = false;
                    }
                } 
            
                let params = {
                    PkPredavaonica: this.eventDetalji.Predavaonica.PkPredavaonica,
                    PkSatnica: this.eventDetalji.Satnica.PkSatnica,
                    Datum: this.eventDetalji.DatumString
                }

            this.studentiService
                .getStudentPrisutnostNaNastaviZaTermin(params)
                .subscribe((data: any[]) => {

                    this.apiStudenti = [];
                    this.apiStudenti = [...data];
                    
                    if (this.appVariables.ObaveznoOcitavanjeSvakiSatDaNe == 0 && this.eventDetalji.PkNastavaRealizacija == null){
                        this.resolvedPromisesCount ++;
                        if (this.resolvedPromisesCount == this.eventsBloksat.length + 1) {
                            this.resolvedPromisesCount = 0;
                            if(this.eventDetalji) {
                                this.makeStudentList();
                                this.eventDetalji.Prisutnost = this.prisutniStudenti.length > 0 ? this.prisutniStudenti.length : null;

                                if (this.eventsBloksat.length > 0) {
                                    this.hasBloksat = true;
                                }
                            }
                        }
                    } else {
                        
                        this.prisutniStudenti = this.apiStudenti;
                        
                        this.eventDetalji.Prisutnost = this.prisutniStudenti.length > 0 ? this.prisutniStudenti.length : null;
                        this.prisutniStudenti = this.prisutniStudenti
                            .sort((a,b) => {
                            return a.Prezime.toLowerCase() > b.Prezime.toLowerCase() ? 1 : a.Prezime.toLowerCase() === b.Prezime.toLowerCase() ? (a.Ime.toLowerCase() > b.Ime.toLowerCase() ? 1 : -1 ) : -1
                        });
                        this.prisutniStudenti = this.calendarConfig.groupByOneKey(this.prisutniStudenti,'JMBAG');

                    }
                });
            });
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
    isBoolean(val) {
        return [0, 1, true, false].includes(val);
    }
    /***********************************************************************************************************
    *           METODE ZA MANIPULACIJU STUDENATA - END
    /***********************************************************************************************************/



    /***********************************************************************************************************
    *           METODA ZA REALIZACIJU NASTAVE 
    /***********************************************************************************************************/
    handleRealizacija() {
        var izmjenaDatum = null;
        var izmjenaPredavaonica = null;
        var izmjenaSatnica = null;

        if (this.editTerminDefaultState != null && this.eventDetalji.Satnica != null) {
            if (this.editTerminDefaultState.Satnica != this.eventDetalji.Satnica){
                izmjenaSatnica = this.eventDetalji.Satnica;
            }
        }
        
        if (this.editTerminDefaultState != null && this.eventDetalji.Predavaonica != null) {
            if(this.editTerminDefaultState.Predavaonica != this.eventDetalji.Predavaonica) {
                izmjenaPredavaonica = this.eventDetalji.Predavaonica;
            }
        }
        if (this.editTerminDefaultState != null && this.eventDetalji.DatumString != null) {
            if(this.editTerminDefaultState.DatumString != this.eventDetalji.DatumString) {
                izmjenaDatum = this.eventDetalji.DatumString;
            }
        }
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
                PkNastavnikSuradnik: this.appVariables.PkNastavnikSuradnik,
                PkUsera: this.appVariables.PkUsera,
                PrisutniStudenti: this.studentiRealizacija,
                PkPredavaonica: izmjenaPredavaonica ? izmjenaPredavaonica.PkPredavaonica : null,
                PkSatnica: izmjenaSatnica ? izmjenaSatnica.PkSatnica : null,
                Datum: izmjenaDatum
            };
            
            this.profesorSerivce
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
                },error => {
                    this.errorMsg = this.errorService.prepareErrorForToast(error);
                    if(this.errorMsg) {
                        this.messageService.add({
                            severity: "error",
                            summary: this.translate.instant(
                                "STUDENT_STUDENTOSOBNIPODACI_IZMJENA_ERROR"
                            ),
                            detail: this.errorMsg
                        });
                    }
                    this.closeDialogEvent();
                });
        } else {
            let params = {
                PkNastavaRealizacija: this.eventDetalji.PkNastavaRealizacija,
                PkUsera: this.appVariables.PkUsera
            };
            this.profesorSerivce
                .deleteNastavaRealizacija(params)
                .subscribe(data => {
                    this.messageService.add({
                        severity: "success",
                        summary: this.translate.instant(
                            "STUDENT_BDSTUDENTPODACINASTUDIJU_PROMJENA_SUCCESS"
                        ),
                        detail: this.translate.instant(
                            "PROFESOR_KALENDAR_MSG_DETAIL_REALIZACIJA_REMOVE_SUCCESS"
                        )
                    });
                    this.synchronizeCalendarEvents(true);
                    this.closeDialogEvent();
                });
        }
    }

    /***********************************************************************************************************
    *           INIT KALENDARA I SVIH POTREBNIH VARIJABLI/CALLBACKOVA 
    /***********************************************************************************************************/
    ngOnInit() {

        this.SatniceComboBox = this.appVariables.sveSatnice.filter((e:Satnice) => {
            if(e.PkSatnica <=20 ) { return e; }
        });
        // console.log(this.calendarConfig.passedDate);
        
        // console.log(this.appVariables.PkSkolskaGodina);
        if (screen.width <= 600) {
            this.router.navigate(["/vProfesorAgenda", "sm"]);
        }
        this.eventsBloksat = [];
        this.studentiZaBrisanje = [];
        this.selectedComboBoxStudenti = [];
        this.calendarEditDogadajiKonflikt = [];
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
            .then(translations => {
                this.translations = translations;
                this.legend = this.calendarConfig.setupKalendarAgendaLegenda(this.translations);

                this.prisutnostStudenata = this.calendarConfig.setupColsPrisutnostStudenata(this.translations);
                this.colsComboBoxStudenti = this.calendarConfig.setupColsComboBoxStudenti(this.translations);

                this.profesorSerivce
                    .getNastavnikRaspored(this.params)
                    .subscribe((data: any[]) => {
                        this.apiData = data;
                        this.events = this.calendarConfig.prepareCalendarEventsProfesor(
                            this.apiData
                        );
                        
                        var calendarEl = document.getElementById("calendar");
                        this.calendar = new Calendar(calendarEl, {
                            plugins: [
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin
                            ],
                            defaultDate: this.calendarConfig.selectedDate || this.calendarConfig.getDateTimeCurrent(),
                            //aspectRatio: 2.8,
                            navLinks: true,
                            locales: allLocales,
                            // selectable: true,
                            defaultView: this.calendarConfig.selectedView || "timeGridWeek",
                            locale: this.translations.STUDENT_KALENDAR_LOCALE,
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
                                // console.log("INIT PARAMS",parameters);
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
                                                } else {
                                                    this.hasBloksat = false;
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
                                                            this.eventDetalji = this.calendarConfig.generateEventDetails(arg,start,end,this.prisutniStudenti.length,);
                                                            if (this.eventsBloksat.length > 0) {
                                                                this.hasBloksat = true;
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    
                                                    this.prisutniStudenti = this.apiStudenti;
                                                    this.eventDetalji = this.calendarConfig.generateEventDetails(arg,start,end,this.prisutniStudenti.length,);
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
                                        this.translations.NASTAVA_GRUPAPREDMETA_KRATICA +
                                        ` &bull; ` +
                                        arg.event.extendedProps.PredmetKratica +
                                        `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` +
                                        this.calendarConfig.parseStudijLabel(
                                            arg.event.extendedProps.StudijNazivKratica,
                                            this.translations
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
                                              this.translations.NASTAVA_NASTAVAREALIZACIJA_PREDAVAONICA +
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
                                                  this.translations
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
            });
    }

    ngAfterViewInit() {}


    /***********************************************************************************************************
    *           ONCLICK EVENTOVI OPEN/CLOSE DIALOG - BEGIN 
    /***********************************************************************************************************/
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
        this.calendarEditTermin = null;
        this.selectedComboBoxStudenti = [];
        this.enableDatePick = false;
        this.calendarEditDogadajiKonflikt = [];
        this.editTermin = false;

    }
    closeEditTerminDialog() {
        if(!this.editTermin) {
            this.undoEditTerminDialog();
            this.displayEditTerminDialog = false;
        } else {
            this.displayEditTerminDialog = false;
            if((this.editTerminDefaultState.Satnica == this.eventDetalji.Satnica) || (this.eventDetalji.Satnica == null)){
                this.undoEditTerminDialog();
            } else if ((this.editTerminDefaultState.Predavaonica == this.eventDetalji.Predavaonica) || (this.eventDetalji.Predavaonica == null)) {
                this.undoEditTerminDialog();
            } else if ((this.editTerminDefaultState.DatumString == this.eventDetalji.Predavaonica) || (this.eventDetalji.Predavaonica == null)) {
                this.undoEditTerminDialog();
            }
            this.promjenaTerminaRealoadStudenti();
        }
    }
    
    openEditTerminDialog() {
        if (!this.konfliktMaxDateInline) {
            this.konfliktMaxDateInline = new Date();
        }
        this.opciService.getPredavaonice().subscribe((data:Predavaonica[]) => {
            this.appVariables.Predavaonice = data;
            this.displayEditTerminDialog = true;
            if(!this.editTerminDefaultState) {
                // console.log(this.eventDetalji.SifraPredavaonice);
                // console.log(this.appVariables.Predavaonice);
                
                this.eventDetalji.Predavaonica = null;//this.appVariables.Predavaonice.find(e => e.SifraPredavaonice.includes(this.eventDetalji.SifraPredavaonice));
                this.eventDetalji.Satnica = null;//this.SatniceComboBox.find(e => e.VrijemeOd.slice(0,-3) == this.eventDetalji.start);
                this.editTerminDefaultState = {
                    Predavaonica: this.eventDetalji.Predavaonica,
                    Satnica: this.eventDetalji.Satnica,
                    Datum: this.eventDetalji.Datum,
                    DatumString: this.calendarConfig.formatDate(this.eventDetalji.Datum),
                    DatumVrijemeOd: this.calendarConfig.formatDate(this.eventDetalji.Datum) + 'T' + this.eventDetalji.VrijemeOd,
                    DatumVrijemeDo: this.calendarConfig.formatDate(this.eventDetalji.Datum) + 'T' + this.eventDetalji.VrijemeDo
                }
            }
            // console.log("defaults",this.editTerminDefaultState);
        });

        
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
    
    saveChangesEditTermin() {
        if(!this.editTermin) {
            this.undoEditTerminDialog();
            this.closeEditTerminDialog();
            
        }
        // console.log(this.eventDetalji.Predavaonica, this.eventDetalji.Satnica,this.eventDetalji.DatumString);
        this.eventDetalji.termin = this.eventDetalji.Satnica.VrijemeOd.slice(0,-3) + '-' + this.eventDetalji.Satnica.VrijemeDo.slice(0,-3);
        this.eventDetalji.SifraPredavaonice = this.eventDetalji.Predavaonica.SifraPredavaonice;
        this.closeEditTerminDialog();
    }
    
    /**
     * @Opis Resetira sve promjene 
     */
    undoEditTerminDialog() {
        this.eventDetalji.Predavaonica = null;
        this.eventDetalji.Satnica = null;
        this.eventDetalji.Datum = this.editTerminDefaultState.Datum;
        this.eventDetalji.DatumVrijemeOd = this.editTerminDefaultState.DatumVrijemeOd;
        this.eventDetalji.DatumVrijemeDo = this.editTerminDefaultState.DatumVrijemeDo;

        if(this.editTerminDefaultState.Satnica == null){
            this.eventDetalji.termin = this.eventDetalji.start + '-' + this.eventDetalji.end;    
        } else {
            this.eventDetalji.termin = this.editTerminDefaultState.Satnica.VrijemeOd.slice(0,-3) + '-' + this.editTerminDefaultState.Satnica.VrijemeDo.slice(0,-3);
        }
        if(this.editTerminDefaultState.SifraPredavaonice != null) {
            this.eventDetalji.SifraPredavaonice = this.editTerminDefaultState.Predavaonica.SifraPredavaonice;
        }

        this.enableDatePick = false;
    }
    /***********************************************************************************************************
    *           ONCLICK EVENTOVI OPEN/CLOSE DIALOG - END 
    /***********************************************************************************************************/
    

}
