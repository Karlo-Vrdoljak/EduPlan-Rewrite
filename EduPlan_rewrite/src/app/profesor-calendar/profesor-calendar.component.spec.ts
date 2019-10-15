import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorCalendarComponent } from './profesor-calendar.component';

describe('ProfesorCalendarComponent', () => {
  let component: ProfesorCalendarComponent;
  let fixture: ComponentFixture<ProfesorCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
