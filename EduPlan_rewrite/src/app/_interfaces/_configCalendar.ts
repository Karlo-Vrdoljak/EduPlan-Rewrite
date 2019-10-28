import { EventColor } from "./ColorEventEnum";
import { CalendarEvent } from "./CalendarEvent";

export class CalendarConfig {
           passedDate: Date = null;
           DatumOd: string; // = "2017-10-10";
           DatumDo: string; // = "2019-10-30";
           DefaultRasponDatuma: number = 365;
           RealizacijaOpacity: any;

           constructor() {
               this.setupDefaultDateTime();
               this.RealizacijaOpacity = { fUll: "1", reduced: "0.6" };
           }

           /**
            * @Opis vraca enum EventColor sa svim definiranim bojama
            */
           public getColors() {
               return EventColor;
           }
           /**
            * @Opis Boja kalendarove eventove ovisno o podtipu predavanja
            * @param tipPredavanja
            */
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
           /**
            * @Opis Vraca true ili false ovisno o tome jel ekran veci od 1280px
            * @param screenWidth
            */
           public checkDeviceWidth(screenWidth): boolean {
               return screenWidth >= 1280 ? true : false;
           }

           public parseTitleLargeDevice(event?, data?: string[]) {
               return data.join("\n").trim();
           }
           public parseTitleSmallDevice(predmet: string, data?: string[]) {
               return (
                   predmet
                       .split(" ")
                       .map(s => (s.length > 3 ? (s += "\n") : s))
                       .join(" ") + data.join("\n").trim()
               );
           }
           public parsePredmetSmallDevice(predmet) {
               return predmet
                   .split(" ")
                   .map(s => (s.length > 3 ? (s += "</br>") : s))
                   .join(" ")
                   .trim();
           }

           /**
            *
            * @param changeDay opcionalan, pozitivna vrijednost gura datum naprid,a negativna vrijednost gura datum nazad
            * @returns string format datuma
            */
           public getDateTimeCurrent(changeDay?: number): string {
               let date = new Date();
               if (changeDay) {
                   date.setDate(date.getDate() + changeDay);
               }
               if (this.passedDate) {
                   date = this.passedDate;
               }
               return this.formatDate(date);
           }
           /**
            *
            * @param date vraca string datum 'YYYY-MM-hh-mm'
            */
           public formatDate(date: Date): string {
               return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
           }
           /**
            *
            * @param date vraca string datum 'YYYY/MM/DD '
            */
           public formatDateFull(date: Date): string {
               return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDay() + " ";
           }
           /**
            *
            * @param date vraca string datum 'hh:mm'
            */
           public formatDateShort(date: Date): string {
               return date.getHours() + ":" + date.getMinutes();
           }
           /**
            * @Opis postavlja default raspon api poziva za prikaz kalendara
            */
           private setupDefaultDateTime() {
               this.DatumOd = this.getDateTimeCurrent(-1 * this.DefaultRasponDatuma);
               this.DatumDo = this.getDateTimeCurrent(this.DefaultRasponDatuma);
           }

           /**
            * @returns string: "1" ili "0.5" ovisno o realizaciji jeli true ili false.
            * @Namjena kartica Agenda i Kalendar, mjenja opacity pozadine
            * @param realziranoDaNe boolean
            */
           public checkRealizacijaDaNe(realziranoDaNe) {
               return realziranoDaNe
                   ? this.RealizacijaOpacity.fUll
                   : this.RealizacijaOpacity.reduced;
           }

           /**
            * @Opis prima api podatke za kalendar koje triba formatirati za title prikaz
            * @param data
            */
           public prepareCalendarEventsProfesor(data) {
               var events = [];
               var filtered = Object.values(
                   Array.from(data).reduce((r: any, e: any) => {
                       var key =
                           e.Datum +
                           "|" +
                           e.PkSatnica +
                           "|" +
                           e.PkPredavaonica +
                           "|" +
                           e.PkNastavnikSuradnik;
                       if (!r[key]) {
                           r[key] = e;
                       } else {
                           r[key].StudijNazivKratica += !r[key].StudijNazivKratica.includes(
                               e.StudijNazivKratica
                           )
                               ? ", " + e.StudijNazivKratica
                               : "";
                           r[key].PredmetNaziv += !r[key].PredmetNaziv.includes(e.PredmetNaziv)
                               ? ", " + e.PredmetNaziv
                               : "";
                           r[key].PredmetKratica += !r[key].PredmetKratica.includes(
                               e.PredmetKratica
                           )
                               ? ", " + e.PredmetKratica
                               : "";
                           r[key].StudijNaziv += !r[key].StudijNaziv.includes(e.StudijNaziv)
                               ? ", " + e.StudijNaziv
                               : "";
                       }
                       return r;
                   }, {})
               );

               filtered.forEach((e: any) => {
                   let event: CalendarEvent = {
                       id: e.PkNastavaPlan,
                       groupId: e.BrojSkupine,
                       title: e.SifraPredavaonice,
                       start: e.DatumVrijemeOd,
                       end: e.DatumVrijemeDo,
                       allDay: false,
                       color: this.chooseColor(e.PodTipPredavanjaNaziv),
                       extendedProps: {
                           PredmetNaziv: e.PredmetNaziv || null,
                           PodTipPredavanjaNaziv: e.PodTipPredavanjaNaziv || null,
                           PodTipPredavanjaSifra: e.PodTipPredavanjaSifra || null,
                           PredmetKratica: e.PredmetKratica || null,
                           SifraPredavaonice: e.SifraPredavaonice || null,
                           Realizirano: e.Realizirano || null,
                           PkPredmet: e.PkPredmet || null,
                           PkStudij: e.PkStudij || null,
                           StudijNaziv: e.StudijNaziv || null,
                           StudijNazivKratica: e.StudijNazivKratica || null,
                           Prisutan: e.Prisutan || 0
                       }
                   };
                   events.push(event);
               });

               return events;
           }

           /**
            * @returns string: 'Studij' ili 'Studiji'
            * @description ovisno kolko ih je za predmet u satnici
            * @param studiji string
            */
           parseStudijLabel(studiji?: string): string {
               return studiji.split(",").length == 1 ? "Studij &bull; " : "Studiji &bull; ";
           }
           
           listBoxStudiji(studiji: string) {
               return studiji.split(",");
           }
       }

