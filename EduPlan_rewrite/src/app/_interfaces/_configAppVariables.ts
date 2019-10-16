export class AppVariables {
    PkStudent: number = 1312;
    PkSkolskaGodina: number = 8;
    PkNastavnikSuradnik: number = 5;
    DatumOd: string; // = "2017-10-10";
    DatumDo: string; // = "2019-10-30";
    PkUsera: 3675;

    constructor() {
        this.setupDefaultDateTime();
    }

    /// changeDay => opcionalan, pozitivna vrijednost gura datum naprid
    ///                          negativna vrijednost gura datum nazad
    public getDateTimeCurrent(changeDay?:number): string {
        let date = new Date();
        if(changeDay) {
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
