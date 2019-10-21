import { EventColor } from "./ColorEventEnum";
import { CalendarEvent } from './CalendarEvent';

export class CalendarConfig {
    passedDate: Date = null;
    DatumOd: string; // = "2017-10-10";
    DatumDo: string; // = "2019-10-30";

    constructor() {
        this.setupDefaultDateTime();
    }
    public getColors() {
        return EventColor;
    }

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
        return ( predmet
            .split(" ")
            .map(s => (s.length > 3 ? (s += "</br>") : s))
            .join(" ").trim()
        );
    }

    /// changeDay => opcionalan, pozitivna vrijednost gura datum naprid
    ///                          negativna vrijednost gura datum nazad

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

    public formatDate(date: Date): string {
        return (
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
        );
    }
    public formatDateShort(date: Date):string {
        return (
            date.getHours() +
            ":" +
            date.getMinutes()
        );
    }

    private setupDefaultDateTime() {
        this.DatumOd = this.getDateTimeCurrent(-365);
        this.DatumDo = this.getDateTimeCurrent(365);
    }

 
    // prima api podatke za kalendar koje triba formatirati za title prikaz
    // Ubrzo postaje DEPRECATED... 18.10.2019.
    public prepareCalendarEventsProfesor(data) {
        var events = [];
        var filtered = Object.values(Array.from(data).reduce( 
            (r:any,e:any) => {
                var key = e.Datum + '|' + e.PkSatnica + '|' + e.PkPredavaonica + '|' + e.PkNastavnikSuradnik;
                if(!r[key]) {
                    r[key] = e;
                } else {
                    r[key].StudijNaziv += ', ' + e.StudijNaziv;
                    r[key].PredmetNaziv += ', ' + e.PredmetNaziv;
                    r[key].PredmetKratica += ", " + e.PredmetKratica;
                }
                return r;
            }, {}));
        
        
        // filter(
            // (e: any) => {
                // return (
                    // (!this[e.Datum] && (this[e.Datum] == true)) && 
                    // (!this[e.PkSatnica] && (this[e.PkSatnica] == true)) && 
                    // (!this[e.PkPredavaonica] && (this[e.PkPredavaonica])) &&
                    // (!this[e.PkNastavnikSuradnik] && (this[e.PkNastavnikSuradnik]))
                // )
            // }, Object.create(null));
        console.log("FILTER",filtered);
            filtered.forEach(e => {
            // let predmetRefactured = ;
            let event: CalendarEvent = {
                id: e.PkNastavaPlan,
                groupId: e.BrojSkupine,
                title: e.SifraPredavaonice,
                start: e.DatumVrijemeOd,
                end: e.DatumVrijemeDo,
                allDay: false,
                color: this.chooseColor(e.PodTipPredavanjaNaziv),
                extendedProps: {
                    PredmetNaziv: e.PredmetNaziv,
                    PodTipPredavanjaNaziv: e.PodTipPredavanjaNaziv,
                    PodTipPredavanjaSifra: e.PodTipPredavanjaSifra,
                    PredmetKratica: e.PredmetKratica,
                    SifraPredavaonice: e.SifraPredavaonice,
                    Realizirano: e.Realizirano,
                    PkPredmet: e.PkPredmet,
                    PkStudij: e.PkStudij,
                    StudijNaziv: e.StudijNaziv
                }
                
            };
            events.push(event);
        });

        return events;
    }
}


// title: 
// this.checkDeviceWidth(screen.width)
//                     ? this.parseTitleLargeDevice(e, [
//                           e.PredmetNaziv,
//                           e.PodTipPredavanjaNaziv,
//                           e.PredmetKratica,
//                           e.SifraPredavaonice
//                       ])
//                     : this.parseTitleSmallDevice(
//                           e.PredmetNaziv,
//                           [
//                               e.PodTipPredavanjaNaziv,
//                               e.PredmetKratica,
//                               e.SifraPredavaonice
//                           ]
//                       )
