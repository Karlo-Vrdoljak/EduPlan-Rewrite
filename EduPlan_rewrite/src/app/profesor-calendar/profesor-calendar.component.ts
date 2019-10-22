import { Component, OnInit, AfterViewInit } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
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
                        
                        eventRender: arg => {
                            /*******************HTML***********************/
                            // console.log("BCKGRNDcolor:", arg.event.backgroundColor);
                            // console.log("BORDERcolor:", arg.event.borderColor);
                            // console.log("PROPS", arg.event.extendedProps);
                            // console.log(arg.view.viewSpec);
                            let button = document.getElementsByClassName("fc-dayGridMonth-button fc-button fc-button-primary fc-button-active");
                            this.selectedViewButton = button.length > 0 ? true: false;

                            if (this.selectedViewButton === true) {
                                arg.el.innerHTML =
                                    `<div class="fc-content">
                                        <div class="ui-g-12">
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-time">` + this.calendarConfig.formatDateShort(arg.event.start) + `</span>
                                                -
                                                <span class="fc-time">` + this.calendarConfig.formatDateShort(arg.event.end) + `</span> 
                                                <span class="fc-time">` + this.parseRealizacija(arg.event.extendedProps.Realizirano) +`</span>
                                            </div>

                                            <div class="ui-g-12 ui-lg-4 ui-md-4 ui-sm-4" style="padding:0.1em;">
                                                <span class="fc-time">` + arg.event.title + `</span>

                                            </div>

                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` + this.parsePredmet(arg.event.extendedProps.PredmetNaziv) + `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` + arg.event.extendedProps.PredmetKratica + `</span>

                                            </div>
                                            <div class="ui-g-12 ui-lg-12 ui-md-12 ui-sm-12" style="padding:0.1em;">
                                                <span class="fc-title">` + this.parseStudijKratica(arg.event.extendedProps.StudijNazivKratica) + `</span>

                                            </div>
                                        </div>

                                        


                                    </div>
                                        `
                            }
                        },
                        datesRender: arg => {
                            
                            this.calendarConfig.passedDate = arg.view.calendar.getDate();
                        }
                    });
                    this.calendar.render();
                });
            });
    }

    ngAfterViewInit() {}

    parsePredmet(predmet?) {
        // console.log(screen.width);
        if(predmet) {
            return this.calendarConfig.checkDeviceWidth(screen.width) ? predmet : this.calendarConfig.parsePredmetSmallDevice(predmet); 
        }
        return "";
    }
    parseRealizacija(realizirano?) {
        return realizirano
            ? `<span class="fa fa-check" style="color:` + this.calendarConfig.getColors().Realizirano + `; padding-left:0.2em; font-size:1.5em; "></span>`
            : `<span class="fa fa-times" style="color:` + this.calendarConfig.getColors().NijeRealizirano + `; padding-left:0.2em; font-size:1.5em; "></span>`
         ;
    }

    parseStudijKratica(studiji?:string) {
        let retVal = studiji.split(',').map((e:string,index:number) => {
            return e
                .concat(index % 2 == 0 && index != 0 ? ",<br> " : ", ")
                .slice(0, -1);
            // console.log(e);

        }).join(' ').trim().slice(0,-1);
        return retVal;
    }
}

