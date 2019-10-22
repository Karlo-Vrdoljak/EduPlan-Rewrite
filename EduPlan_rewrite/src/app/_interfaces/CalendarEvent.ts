export interface CalendarEvent {
    id;
    groupId;
    title: string;
    start;
    end;
    // startTime;
    // endTime;
    allDay;
    color;
    extendedProps?: {
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
    };
}
