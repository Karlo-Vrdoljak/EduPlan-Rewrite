import { EventColor } from "./ColorEventEnum";
import { CalendarEvent } from "./CalendarEvent";
import { TranslateService } from '@ngx-translate/core';
import { ProfesorService } from '../_services/profesori.service';
import { Satnice } from './Satnice';



export class CalendarConfig {
           passedDate: Date[] = null;
           pregledNastavnikaPassedDate: Date[] = null;
           DatumOd: string; // = "2017-10-10";
           DatumDo: string; // = "2019-10-30";
           DefaultRasponDatuma: number = 365;
           selectedView:string = null;
           selectedDate:string = null;

           constructor() {
               if(this.passedDate) {
                   this.DatumOd = this.passedDate[0].toISOString();
                   this.DatumDo = this.passedDate[1].toISOString();
               }
               this.setupDefaultDateTime();
           }

           /**
            * @Opis vraca enum EventColor sa svim definiranim bojama
            */
           public getColors() {
               return EventColor;
           }
           /**
            * @Opis vraca css value string za font-size ovisno o sirini ekrana uredaja
            */
           public chooseFontSize(screenSize:number) {
                if( screenSize >= 1650) {
                        return "1em";
                } else {
                    return "0.85em";
                }

           }
           /**
            * @Opis Boja kalendarove eventove ovisno o podtipu predavanja
            * @param tipPredavanja
            */
           public chooseColor(tipPredavanja:string): string {
               switch (true) {
                   case tipPredavanja.toLowerCase().includes("predav"): {
                       return EventColor.Predavanja;
                   }
                   case tipPredavanja.toLowerCase().includes("seminar"): {
                       return EventColor.Seminar;
                   }
                   case tipPredavanja.toLowerCase().includes("vje"): {
                       return EventColor.Vjezbe;
                   }
                   case tipPredavanja.toLowerCase().includes("ispit"): {
                       return EventColor.Ispiti;
                   }
                   case tipPredavanja.toLowerCase().includes("background"): {
                       return EventColor.Background;
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
                   date = this.passedDate[0];
               }
               return this.formatDate(date);
           }
           /**
            *
            * @param date vraca string datum 'YYYY-MM-hh-mm'
            */
           public formatDate(date: Date): string {
               return  date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
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
               return date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
           }
           /**
            * @Opis postavlja default raspon api poziva za prikaz kalendara
            */
           private setupDefaultDateTime() {
               this.DatumOd = this.getDateTimeCurrent(-1 * this.DefaultRasponDatuma);
               this.DatumDo = this.getDateTimeCurrent(this.DefaultRasponDatuma);
           }
           /**
            * 
            * @param apiData Native api data for events
            * @param events return array of formatted events
            */
           formatCalendarEventsProfesor(apiData,events = []) {
            apiData.forEach((e: any) => {
                let event: CalendarEvent = {
                    id: e.PkNastavaPlan,
                    groupId: e.BrojSkupine,
                    title: e.SifraPredavaonice,
                    start: e.DatumVrijemeOd,
                    end: e.DatumVrijemeDo,
                    allDay: false,
                 //    backgroundColor: EventColor.Background,
                 //    borderColor: this.chooseColor(e.PodTipPredavanjaNaziv),
                 //    textColor: EventColor.Dark,
                    color: this.chooseColor(e.PodTipPredavanjaNaziv),
                    extendedProps: {
                        Datum: e.Datum || null,
                        DatumVrijemeOd: e.DatumVrijemeOd || null,
                        DatumVrijemeDo: e.DatumVrijemeDo || null,
                        PkNastavaRealizacija: e.PkNastavaRealizacija || null,
                        NastavnikSuradnikNaziv: e.NastavnikSuradnikNaziv || null,
                        PkNastavnikSuradnik: e.PkNastavnikSuradnik || null,
                        NastavnikSuradnikInicijali: e.NastavnikSuradnikInicijali || null,
                        PkNastavaPlan: e.PkNastavaPlan || null,
                        PredmetNaziv: e.PredmetNaziv || null,
                        PodTipPredavanjaNaziv: e.PodTipPredavanjaNaziv || null,
                        PodTipPredavanjaSifra: e.PodTipPredavanjaSifra || null,
                        PkTipPredavanje: e.PkTipPredavanje || null, //TRIBA SVE ZAMINIT CA SA DONJIN
                        PkPodTipPredavanja: e.PkPodTipPredavanja ||null,
                        PredmetKratica: e.PredmetKratica || null,
                        SifraPredavaonice: e.SifraPredavaonice || null,
                        Realizirano: e.Realizirano || null,
                        PkPredmet: e.PkPredmet || null,
                        PkStudij: e.PkStudij || null,
                        StudijNaziv: e.StudijNaziv || null,
                        StudijNazivKratica: e.StudijNazivKratica || null,
                        Prisutan: e.Prisutan || 0,
                        ProfesorIskljucioDaNe: e.ProfesorIskljucioDaNe || 0,
                        PkPredavaonica: e.PkPredavaonica || 0,
                        PkSatnica: e.PkSatnica || 0,
                        PkGrupaZaNastavu: e.PkGrupaZaNastavu || 0,
                    }
                };
                events.push(event);
            });
            return events;
           }

           formatCalendarEditTerminNewEvent(apiData) {
                let event: CalendarEvent = {
                    title: null,
                    allDay: false,
                    start: apiData.start,
                    end: apiData.end,
                    color: apiData.color,
                    rendering: 'background'

                }
                return event;
            }

           formatCalendarEditTermin(apiData,events = []) {
               
            apiData.forEach((e: any) => {
                let event: CalendarEvent = {
                    id: e.PkNastavaPlan || null,
                    groupId: e.BrojSkupine || null,
                    title: e.SifraPredavaonice || null,
                    start: e.DatumVrijemeOd,
                    end: e.DatumVrijemeDo,
                    allDay: false,
                    rendering: 'background',
                    color: e.color ? e.color : '#ff3112',
                 //    backgroundColor: EventColor.Background,
                 //    borderColor: this.chooseColor(e.PodTipPredavanjaNaziv),
                 //    textColor: EventColor.Dark,
                    extendedProps: {
                        Datum: e.Datum || null,
                        DatumVrijemeOd: e.DatumVrijemeOd || null,
                        DatumVrijemeDo: e.DatumVrijemeDo || null,
                        PkNastavaRealizacija: e.PkNastavaRealizacija || null,
                        NastavnikSuradnikNaziv: e.NastavnikSuradnikNaziv || null,
                        PkNastavnikSuradnik: e.PkNastavnikSuradnik || null,
                        NastavnikSuradnikInicijali: e.NastavnikSuradnikInicijali || null,
                        PkNastavaPlan: e.PkNastavaPlan || null,
                        PredmetNaziv: e.PredmetNaziv || null,
                        PodTipPredavanjaNaziv: e.PodTipPredavanjaNaziv || null,
                        PodTipPredavanjaSifra: e.PodTipPredavanjaSifra || null,
                        PkTipPredavanje: e.PkTipPredavanje || null, //TRIBA SVE ZAMINIT CA SA DONJIN
                        PkPodTipPredavanja: e.PkPodTipPredavanja ||null,
                        PredmetKratica: e.PredmetKratica || null,
                        SifraPredavaonice: e.SifraPredavaonice || null,
                        Realizirano: e.Realizirano || null,
                        PkPredmet: e.PkPredmet || null,
                        PkStudij: e.PkStudij || null,
                        StudijNaziv: e.StudijNaziv || null,
                        StudijNazivKratica: e.StudijNazivKratica || null,
                        Prisutan: e.Prisutan || 0,
                        ProfesorIskljucioDaNe: e.ProfesorIskljucioDaNe || 0,
                        PkPredavaonica: e.PkPredavaonica || 0,
                        PkSatnica: e.PkSatnica || 0,
                        PkGrupaZaNastavu: e.PkGrupaZaNastavu || 0,
                    }
                };
                events.push(event);
            });
            return events;
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
                        //    r[key].StudijNazivKratica += !r[key].StudijNazivKratica.includes(e.StudijNazivKratica)
                        //        ? ", " + e.StudijNazivKratica
                        //        : "";
                           r[key].StudijNazivKratica += (", " + e.StudijNazivKratica)
                              
                           r[key].PredmetNaziv += !r[key].PredmetNaziv.includes(e.PredmetNaziv)
                               ? ", " + e.PredmetNaziv
                               : "";
                              
                           r[key].PredmetKratica += !r[key].PredmetKratica.includes(e.PredmetKratica)
                               ? ", " + e.PredmetKratica
                               : "";
                           r[key].StudijNaziv += (", " + e.StudijNaziv);
                       }
                       return r;
                   }, {})
               );

               this.formatCalendarEventsProfesor(filtered,events)

               return events;
           }

           /**
            * @returns string: 'Studij' ili 'Studiji'
            * @description ovisno kolko ih je za predmet u satnici
            * @param studiji string
            */
           parseStudijLabel(studiji?: string,prijevod?): string {
               return studiji.split(",").length == 1
                   ? prijevod.NASTAVA_SKOLSKAGODINASTUDIJPREDMETKATEDRATIPPREDAVANJA_STUDIJ + "&bull; "
                   : prijevod.GRUPEZANASTAVU_GRUPAZANASTAVUSTUDENTSTUDIJ_STUDIJI + "&bull; ";
           }
           /**
            * @Opis Concata studije za prikaz u textarea u dialogu eventDetalja
            */
           listBoxStudiji(studijiConcat: string) {
               let studiji = studijiConcat.split(",").map((e: string) => {
                   return e.trim().concat("\n");
               });
               studiji[studiji.length - 1] = studiji[studiji.length - 1].slice(0, -1);

               return studiji.join("");
           }

           setupColsPrisutnostStudenata(prijevod) {
               return [
                   {
                       field: "JMBAG",
                       header: prijevod.KATALOZI_NASTAVNIKSURADNIKPREDMETI_JMBAG
                   },
                   {
                       field: "Ime",
                       header: prijevod.PREDMET_BDPREDMETSTUDENTI_IME
                   },
                   {
                       field: "Prezime",
                       header: prijevod.PREDMET_BDPREDMETSTUDENTI_PREZIME
                   },
                   {
                       field: "StudijNazivKratica",
                       header: prijevod.PREDMET_BDPREDMETSTUDENTI_KRATICA_STUDIJA
                   },
                //    {
                //        field: "Prisutan",
                //        header: prijevod.PREDMET_BDPREDMETSTUDENTI_PRISUTAN
                //    },
                   {
                        field: "ProfesorIskljucioDaNe",
                        header: prijevod.PREDMET_BDPREDMETSTUDENTI_PRISUTAN
                   }
               ];
           }
           
           setupColsComboBoxStudenti(prijevod) {
            return [
                {
                    field: "JMBAG",
                    header: prijevod.KATALOZI_NASTAVNIKSURADNIKPREDMETI_JMBAG
                },
                {
                    field: "Ime",
                    header: prijevod.PREDMET_BDPREDMETSTUDENTI_IME
                },
                {
                    field: "Prezime",
                    header: prijevod.PREDMET_BDPREDMETSTUDENTI_PREZIME
                },
                {
                    field: "StudijNazivKratica",
                    header: prijevod.PREDMET_BDPREDMETSTUDENTI_KRATICA_STUDIJA
                }
            ];
           }
           setupKalendarAgendaLegenda(prijevod) {
               return [
                   {
                       label: prijevod.STUDENTCALENDAR_PREDAVANJA,
                       icon: "fa fa-circle"
                   },
                   {
                       label: prijevod.STUDENTCALENDAR_SEMINAR,
                       icon: "fa fa-circle"
                   },
                   {
                       label: prijevod.STUDENTCALENDAR_VJEZBE,
                       icon: "fa fa-circle"
                   },
                   {
                       label: prijevod.STUDENTCALENDAR_ISPITI,
                       icon: "fa fa-circle"
                   },
                   {
                       label: prijevod.STUDENTCALENDAR_REALIZIRANO,
                       icon: "fa fa-circle"
                   },
                   {
                       label: prijevod.STUDENTCALENDAR_PRISUTAN,
                       icon: "fa fa-circle"
                   }
               ];
           }

           generateBloksatEvents(data, clickedEvent, maxRbrSatnice) {
            data.forEach(e => {
                if (!("PkGrupaZaNastavu" in e)) {
                    e.PkGrupaZaNastavu = 0;
                }
            });
            let kandidatiBloksat = data.filter(e => {
                    return (
                        e.PkPredmet == clickedEvent.PkPredmet &&
                        e.PkNastavnikSuradnik == clickedEvent.PkNastavnikSuradnik &&
                        e.PkPodTipPredavanja == clickedEvent.PkPodTipPredavanja && 
                        e.PkGrupaZaNastavu == clickedEvent.PkGrupaZaNastavu && 
                        Date.parse( e.DatumVrijemeOd ) < Date.parse( clickedEvent.DatumVrijemeOd ) 
                    );
                }).reverse();

            // console.log(kandidatiBloksat);
            let satnice = kandidatiBloksat.map( e => e.RbrSatnice );
            let indexBloksat: number[] = [];
            let size = -1;

            if(satnice.length == 1) { // ako je 1 onda neovisno o svemu sta se moze iskombinirat je 100% bloksat
                indexBloksat.push(satnice[0]);
            } else {
                for ( let index = 0; index < satnice.length - 1; index++ ) {
                    if ( (satnice[index] == satnice[index + 1] + 1 ) || (satnice[index] == satnice[index + 1]) ) {
                        if (indexBloksat.length == 0) {
                            indexBloksat[++size] = satnice[0]; 
                            indexBloksat[++size] = satnice[1]; 
                        } else {
                            indexBloksat[++size] = satnice[index + 1];
                        }
                    } else if ( satnice[index] == 1 && satnice[index + 1] ==  maxRbrSatnice) {
                        if (indexBloksat.length == 0) {
                            indexBloksat[++size] = satnice[0];
                            indexBloksat[++size] = satnice[1];
                        } else {
                            indexBloksat[++size] = satnice[index + 1];
                        }
                    } else {
                        break;
                    }
                }
            }

            return kandidatiBloksat.filter(e => {
                return satnice.includes(e.RbrSatnice)
            });
           }

           mergeBloksatStudente(currentData, newData) {
                let tempData = currentData.concat(newData);
                const uniqueList = tempData.reduce((array,item) => {
                    if(!array.includes(item)) {
                        array.push(item);
                    }
                    return array;
                }, []);
                return uniqueList;
           }
           /**
            * 
            * @param array Array of objects that needs to be grouped by one key
            * @param group string name of the prop within the object 
            */
           groupByOneKey(array:any[], group:string) {
            return Object.values(Array.from(array).reduce((r: any, e: any) => {
                        var key = e[group];
                        if (!r[key]) {
                            r[key] = e;
                        }
                        return r;
                    }, {})
                );
           }

           generateEventDetails(arg,start:string,end:string,prisutniStudentiLength = 0) {
            
            return {
                PkSatnica:
                    arg.event.extendedProps.PkSatnica,
                DatumVrijemeOd:
                    arg.event.extendedProps.DatumVrijemeOd,
                DatumVrijemeDo:
                    arg.event.extendedProps.DatumVrijemeDo,
                PkPredmet:
                    arg.event.extendedProps.PkPredmet,
                PkPredavaonica:
                    arg.event.extendedProps.PkPredavaonica,
                PkPodTipPredavanja:
                    arg.event.extendedProps.PkPodTipPredavanja,
                PkGrupaZaNastavu:
                    arg.event.extendedProps.PkGrupaZaNastavu,
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
                StudijNaziv: this.listBoxStudiji( arg.event.extendedProps.StudijNaziv ),
                KraticaStudija: this.listBoxStudiji(  arg.event.extendedProps.StudijNazivKratica ),
                KraticaStudijaProvjera: arg.event.extendedProps.StudijNazivKratica.split(',').map((e: string) => {
                    return e.trim();
                }),
                start: start,
                end: end,
                termin: start + '-' + end,
                DatumString: arg.event.extendedProps.Datum,
                Datum: new Date(arg.event.extendedProps.Datum),
                Satnica: null,
                Predavaonica: null,
                Prisutan:
                    arg.event.extendedProps.Prisutan,
                Prisutnost:
                    prisutniStudentiLength > 0 ? prisutniStudentiLength : null
            };
        }
       }
