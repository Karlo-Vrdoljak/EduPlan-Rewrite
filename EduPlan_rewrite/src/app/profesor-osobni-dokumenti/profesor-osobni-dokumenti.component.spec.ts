import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorOsobniDokumentiComponent } from './profesor-osobni-dokumenti.component';

describe('ProfesorOsobniDokumentiComponent', () => {
  let component: ProfesorOsobniDokumentiComponent;
  let fixture: ComponentFixture<ProfesorOsobniDokumentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorOsobniDokumentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorOsobniDokumentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
