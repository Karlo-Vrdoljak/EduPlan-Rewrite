import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorPregledAgendiComponent } from './profesor-pregled-agendi.component';

describe('ProfesorPregledAgendiComponent', () => {
  let component: ProfesorPregledAgendiComponent;
  let fixture: ComponentFixture<ProfesorPregledAgendiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorPregledAgendiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorPregledAgendiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
