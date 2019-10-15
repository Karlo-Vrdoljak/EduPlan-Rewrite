import { Component, OnInit, ViewChild } from "@angular/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarService } from "../demo/service/calendarService";
import allLocales from "@fullcalendar/core/locales-all";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { StudentiService } from "../_services/studenti.service";
import { CalendarEvent } from "../_interfaces/CalendarEvent";
import { EventColor } from "../_interfaces/ColorEventEnum";
import { OverlayPanelModule, OverlayPanel } from "primeng/overlaypanel";

@Component({
    selector: "app-profesor-calendar",
    templateUrl: "./profesor-calendar.component.html",
    styleUrls: ["./profesor-calendar.component.css"]
})
export class ProfesorCalendarComponent implements OnInit {
    calendarOptions: any;
    events: any[];
    selectedEvent: any;
    apiData: any;

    constructor(
        public router: Router,
        private translate: TranslateService,
        private studentiService: StudentiService
    ) {}

    public chooseColor(tipPredavanja): string {
        switch (true) {
            case tipPredavanja == "Predavanja": {
                return EventColor.Predavanja;
            }
            case tipPredavanja == "Seminar": {
                return EventColor.Seminar;
            }
            case tipPredavanja == "Vježbe": {
                return EventColor.Vjezbe;
            }
            case tipPredavanja == "Ispiti": {
                return EventColor.Ispiti;
            }
            case tipPredavanja == "Kliničke vježbe": {
                return EventColor.Vjezbe;
            }
            case tipPredavanja == "Pretkliničke vježbe": {
                return EventColor.Vjezbe;
            }
            case tipPredavanja == "Vježbe tjelesnog odgoja": {
                return EventColor.Vjezbe;
            }
            case tipPredavanja == "Vježbe u praktikumu": {
                return EventColor.Vjezbe;
            }
            case tipPredavanja == "Laboratorijske vježbe": {
                return EventColor.Vjezbe;
            }
            case tipPredavanja == "Terenske vježbe": {
                return EventColor.Vjezbe;
            }

            default: {
                return EventColor.Predavanja;
            }
        }
    }

    ngOnInit() {
      if (screen.width <= 600) {
          this.router.navigate(["/vProfesorAgenda", "sm"]);
      }
      this.translate
          .get("STUDENT_KALENDAR_LOCALE")
          .toPromise()
          .then(res => {
              const params = {
                  // PkStudent: 1312,
                  PkSkolskaGodina: 8,
                  PkNastavnikSuradnik : 5,
                  DatumOd: "2018-10-10",
                  DatumDo: "2018-11-10"
              };
              this.studentiService
                  .getStudentRaspored(params)
                  .subscribe(data => {
                      // this._calendarService.getCalendarData().then(res => {
                      //     console.log(res);
                      // });
                      this.events = [];
                      this.apiData = data;
                      // console.log(data);
                      this.apiData.forEach(e => {
                          let predmet = e.PredmetNaziv as string;
                          // let predmetRefactured = ;
                          let event: CalendarEvent = {
                              id: e.PkNastavaPlan,
                              groupId: e.BrojSkupine,
                              title:
                                  predmet.split(" ").map(s => s.length > 3 ? s+='\n' : s ).join(' ') +
                                  e.PodTipPredavanjaNaziv +
                                  "\n" +
                                  e.PredmetKratica +
                                  "\n" +
                                  e.SifraPredavaonice,
                              start: e.DatumVrijemeOd,
                              end: e.DatumVrijemeDo,
                              allDay: false,
                              color: this.chooseColor(e.PodTipPredavanjaNaziv)
                          };
                          this.events.push(event);
                      });
                  });
              let date = new Date();
              let fullDate =
                  date.getFullYear() +
                  "-" +
                  (date.getMonth() + 1) +
                  "-" +
                  date.getDate();
              this.calendarOptions = {
                  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                  defaultDate: fullDate,
                  //aspectRatio: 2.8,
                  navLinks: true,
                  locales: allLocales,
                  defaultView: "timeGridWeek",
                  locale: res,
                  height: "auto",
                  contentHeight: screen.height - 70 - 57.25 - 19.5 - 90,
                  firstDay: 1,
                  header: {
                      center: "prevYear,prev,today,next,nextYear",
                      right: "dayGridMonth,timeGridWeek,timeGridDay"
                  }
              };
          });
    }
}
