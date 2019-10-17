export class AppVariables {
    PkStudent: number;
    PkSkolskaGodina: number;
    PkNastavnikSuradnik: number;
    DatumOd: string; // = "2017-10-10";
    DatumDo: string; // = "2019-10-30";
    PkUsera: number = 1; //3675
    emailSend = {
        from: "kv45531@unist.hr",
        to: "referada@oss.unist.hr",
        subject: null,
        text: null
    };
    constructor() {
        this.setupDefaultDateTime();
    }

    /// changeDay => opcionalan, pozitivna vrijednost gura datum naprid
    ///                          negativna vrijednost gura datum nazad
    public getDateTimeCurrent(changeDay?: number): string {
        let date = new Date();
        if (changeDay) {
            date.setDate(date.getDate() + changeDay);
        }
        return (
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
        );
    }
    private setupDefaultDateTime() {
        this.DatumOd = this.getDateTimeCurrent(-400);
        this.DatumDo = this.getDateTimeCurrent(400);
    }
}
