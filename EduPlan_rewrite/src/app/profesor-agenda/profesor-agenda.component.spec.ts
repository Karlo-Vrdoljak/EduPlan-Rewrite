import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorAgendaComponent } from './profesor-agenda.component';

describe('ProfesorAgendaComponent', () => {
  let component: ProfesorAgendaComponent;
  let fixture: ComponentFixture<ProfesorAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
