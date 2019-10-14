import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorSviPredmetiComponent } from './profesor-svi-predmeti.component';

describe('ProfesorSviPredmetiComponent', () => {
  let component: ProfesorSviPredmetiComponent;
  let fixture: ComponentFixture<ProfesorSviPredmetiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorSviPredmetiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorSviPredmetiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
