export interface CalendarEvent {
    id;
    groupId;
    title:string;
    start;
    end;
    // startTime;
    // endTime;
    allDay;
    color;
    extendedProps?;
}
