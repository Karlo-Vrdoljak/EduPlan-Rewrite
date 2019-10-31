export interface CalendarEvent {
    id;
    groupId;
    title: string;
    start;
    end;
    // startTime;
    // endTime;
    allDay;
    // borderColor?;
    // backgroundColor?;
    // textColor?;
    color?;
    extendedProps?: {
        PkNastavaPlan;
        PredmetNaziv;
        PodTipPredavanjaNaziv;
        PodTipPredavanjaSifra;
        PredmetKratica;
        SifraPredavaonice;
        Realizirano;
        PkPredmet;
        PkStudij;
        StudijNaziv;
        StudijNazivKratica;
        Prisutan;
        NastavnikSuradnikNaziv;
        PkNastavnikSuradnik;
        NastavnikSuradnikInicijali;
    };
}
