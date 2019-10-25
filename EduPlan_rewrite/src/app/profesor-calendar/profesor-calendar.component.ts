import { Component, OnInit, AfterViewInit, ɵisListLikeIterable } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppVariables } from "../_interfaces/_configAppVariables";
import { CalendarConfig } from "../_interfaces/_configCalendar";
import { Calendar, View, cssToStr } from "@fullcalendar/core";
import { ProfesorService } from '../_services/profesori.service';
import { MenuItem } from 'primeng/api';

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
    monthButton: boolean = false;
    weekButton: boolean = false;
    dayButton: boolean = false;
    displayEventDialog: boolean = false;
    eventDetalji:any;
    legend: MenuItem[];
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
            .get([
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

                this.legend = [
                    {
                        label: res.STUDENTCALENDAR_PREDAVANJA,
                        icon: "fa fa-circle"
                    },
                    {
                        label: res.STUDENTCALENDAR_SEMINAR,
                        icon: "fa fa-circle"
                    },
                    {
                        label: res.STUDENTCALENDAR_VJEZBE,
                        icon: "fa fa-circle"
                    },
                    {
                        label: res.STUDENTCALENDAR_ISPITI,
                        icon: "fa fa-circle"
                    },
                    {
                        label: res.STUDENTCALENDAR_REALIZIRANO,
                        icon: "fa fa-circle"
                    },
                    {
                        label: res.STUDENTCALENDAR_NIJE_REALIZIRANO,
                        icon: "fa fa-circle"
                    },
                    {
                        label: res.STUDENTCALENDAR_PRISUTAN,
                        icon: "fa fa-circle"
                    },
                    {
                        label: res.STUDENTCALENDAR_ODSUTAN,
                        icon: "fa fa-circle"
                    }
                ];


                this.profesorSerivce.getNastavnikRaspored(this.params).subscribe(data => {
                    
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
                            // var datum = this.calendarConfig.formatDateFull(arg.event.extendedProps.start);
                            // var vrijeme = 
                            this.eventDetalji = {
                                
                                PredmetNaziv: arg.event.extendedProps.PredmetNaziv,
                                PodTipPredavanjaNaziv: arg.event.extendedProps.PodTipPredavanjaNaziv,
                                PredmetKratica: arg.event.extendedProps.PredmetKratica,
                                SifraPredavaonice: arg.event.extendedProps.SifraPredavaonice,
                                Realizirano: arg.event.extendedProps.Realizirano,
                                StudijNaziv: this.listBoxStudiji(arg.event.extendedProps.StudijNaziv),
                                start: start,
                                end: end,
                                // datum: datum,
                                termin : start + '-' + end,
                                Prisutan: arg.event.extendedProps.Prisutan
                            };
                            
                            this.displayEventDialog = true;
                        },
                        eventRender: arg => {
                            arg.el.style.opacity = this.calendarConfig.checkRealizacijaDaNe(
                                arg.event.extendedProps.Realizirano
                            );
                            this.getSelectedButton(arg.view);


                            if (this.monthButton === true) {
                                arg.el.innerHTML =
                                    `<div class="fc-content">
                                        <div class="ui-g-12">
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-time">` + this.calendarConfig.formatDateShort(arg.event.start) + `</span>
                                                -
                                                <span class="fc-time">` + this.calendarConfig.formatDateShort(arg.event.end) + `</span> 
                                                <span class="fc-time">` + this.parseRealizacija(arg.event.extendedProps.Realizirano) + `</span>
                                            </div>

                                            <div class="ui-g-12 ui-lg-4 ui-md-4 ui-sm-4" style="padding:0.1em;">
                                                <span class="fc-time">` + arg.event.title + `</span>

                                            </div>

                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` + this.parsePredmet(arg.event.extendedProps.PredmetNaziv) + `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">Kratica &bull; ` + arg.event.extendedProps.PredmetKratica + `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` 
                                                    + this.parseStudijLabel(arg.event.extendedProps.StudijNazivKratica) + this.parseStudijKratica( arg.event.extendedProps.StudijNazivKratica ) + 
                                                `</span>`
                                                + this.parseEducard(arg.event.extendedProps.Prisutan) +
                                            `</div>
                                        </div>

                                        


                                    </div>
                                        `;
                            }
                            
                            else if(this.weekButton === true || this.dayButton === true) {
                                arg.el.innerHTML =
                                    `<div class="fc-content ui-g ui-fluid">
                                        <div class="ui-g-12 ui-sm-12 ui-md-12 ui-lg-12">
                                            <span class="fc-time">` + this.calendarConfig.formatDateShort(arg.event.start) + `</span>
                                            -
                                            <span class="fc-time">` + this.calendarConfig.formatDateShort(arg.event.end) + `</span> 
                                            <span class="fc-time">` + this.parseRealizacija(arg.event.extendedProps.Realizirano) + `</span>`+
                                            (
                                                this.dayButton === true ? 
                                                `<span class="fc-title" style="padding-left:1.25em;">` + this.parsePredmet(arg.event.extendedProps.PredmetNaziv) + `</span>`+
                                                `<span class="fc-title" style="padding-left:1.25em;"> Kratica &bull; ` + arg.event.extendedProps.PredmetKratica + `</span>`+
                                                `<span class="fc-title" style="padding-left:1.25em;"> ` 
                                                    + this.parseStudijLabel(arg.event.extendedProps.StudijNazivKratica) + arg.event.extendedProps.StudijNazivKratica + 
                                                `</span>` : ``
                                            ) +
                                        
                                            `<span class="fc-time">` + this.parseEducard(arg.event.extendedProps.Prisutan) + `</span>
                                        
                                        </div>

                                    </div>`;
                            }
                            this.monthButton = false;
                            this.weekButton = false;
                            this.dayButton = false;

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

     getSelectedButton(view: View) {
         
         this.monthButton = view.type == "dayGridMonth" ? true : false;

         this.weekButton = view.type == "timeGridWeek" ? true : false;

         this.dayButton = view.type == "timeGridDay" ? true : false;

     }

     parseEducard(timbran){
        // this.appVariables.EducardAktivan = 0;
        if (this.appVariables.EducardAktivan) {
            return timbran ? 
            `<span class="fc-title" style="float:right; padding-right:1em; padding-top:0.2em;">
                <i class="fa fa-rss" style="color:` + this.calendarConfig.getColors().Realizirano + `; font-size:1.3em;"></i>
            </span>` :
            `<span class="fc-title" style="float:right; padding-right:1em; padding-top:0.2em;">
                <i class="fa fa-rss" style="color:` + this.calendarConfig.getColors().NijeRealizirano + `; font-size:1.3em;"></i>
            </span>`
            ;
        }
        return '';

         
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


    listBoxStudiji(studiji:string) { return studiji.split(','); }
    

   
    /**
     * @returns string: ovisno o realizaciji jeli true ili false.
     * @description Kartica Agenda i Kalendar, postavlja 'kvacicu' za realiziranu nastavu, a 'X' za nerealiziranu
     * @param realizirano boolean
     */
    parseRealizacija(realizirano?: boolean) {
        return realizirano
            ? `<span class="fa fa-check" style="color:` + this.calendarConfig.getColors().Realizirano + `; padding-left:0.2em; font-size:1.5em; "></span>`
            : `<span class="fa fa-times" style="color:` + this.calendarConfig.getColors().NijeRealizirano + `; padding-left:0.2em; font-size:1.5em; "></span>`;
    }
    /**
     * @returns string: 'Studij' ili 'Studiji' 
     * @description ovisno kolko ih je za predmet u satnici
     * @param studiji string
     */
    parseStudijLabel(studiji?: string ) :string{
        return studiji.split(',').length == 1 ? 'Studij &bull; ': 'Studiji &bull; ';
    }

    /**
     * @returns string
     * @description Kartica Kalendar, spojene kratice studija iz apia formatira tako da svako treceg stavlja u novi red zbog preglednosti
     * @param studiji string
     */
    parseStudijKratica(studiji?: string) {
        let length = studiji.split(",").length -1;
        return studiji
            .split(",")
            .map((e: string, index: number) => {
                
                if(index != length){
                    return e.concat(",<br>");
                } else {
                    return e;
                }
            })
            .join(" ")
            .trim();
    }
}

