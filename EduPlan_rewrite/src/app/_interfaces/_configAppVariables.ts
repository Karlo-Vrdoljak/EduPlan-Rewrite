export class AppVariables {
    PkStudent: number = 1312;
    PkSkolskaGodina: number = 8;
    PkNastavnikSuradnik: number = 5;
    DatumOd: string = "2017-10-10";
    DatumDo: string = "2019-10-30";
    PkUsera: 3675;
    PkNastavnik: 1;

    constructor() {}

    public getDateTimeCurrent(): string {
        let date = new Date();
        return (
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate()
        );
    }
}
