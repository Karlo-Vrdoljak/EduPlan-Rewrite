import { EventColor } from "./ColorEventEnum";

export class CalendarConfig {
    constructor() {}

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

    public parseTitleLargeDevice(event?, data?:string[]) {
        return data.join("\n").trim();
    }
    public parseTitleSmallDevice(predmet:string, data?:string[]) {
        return (
            predmet
                .split(" ")
                .map(s => (s.length > 3 ? (s += "\n") : s))
                .join(" ") +
            data.join("\n").trim()
        );
    }
}
