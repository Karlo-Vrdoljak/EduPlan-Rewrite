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
        PkNastavaRealizacija;
        PredmetNaziv;
        PodTipPredavanjaNaziv;
        PodTipPredavanjaSifra;
        PkTipPredavanje;
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
        PkPredavaonica;
        PkSatnica;
        PkGrupaZaNastavu;

    };
}
