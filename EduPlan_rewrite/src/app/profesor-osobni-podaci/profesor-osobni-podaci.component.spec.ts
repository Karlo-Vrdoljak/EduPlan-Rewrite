import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorOsobniPodaciComponent } from './profesor-osobni-podaci.component';

describe('ProfesorOsobniPodaciComponent', () => {
  let component: ProfesorOsobniPodaciComponent;
  let fixture: ComponentFixture<ProfesorOsobniPodaciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorOsobniPodaciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorOsobniPodaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
