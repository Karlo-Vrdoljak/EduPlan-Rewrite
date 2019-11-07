import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorPregledKalendaraComponent } from './profesor-pregled-kalendara.component';

describe('ProfesorPregledKalendaraComponent', () => {
  let component: ProfesorPregledKalendaraComponent;
  let fixture: ComponentFixture<ProfesorPregledKalendaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorPregledKalendaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorPregledKalendaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
