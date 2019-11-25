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
        Datum;
        PkNastavaPlan;
        PkNastavaRealizacija;
        PredmetNaziv;
        PodTipPredavanjaNaziv;
        PkPodTipPredavanja;
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
        ProfesorIskljucioDaNe;
        NastavnikSuradnikNaziv;
        PkNastavnikSuradnik;
        NastavnikSuradnikInicijali;
        PkPredavaonica;
        PkSatnica;
        PkGrupaZaNastavu;

    };
}
