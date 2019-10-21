import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorPredmetComponent } from './profesor-predmet.component';

describe('ProfesorPredmetComponent', () => {
  let component: ProfesorPredmetComponent;
  let fixture: ComponentFixture<ProfesorPredmetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorPredmetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorPredmetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
