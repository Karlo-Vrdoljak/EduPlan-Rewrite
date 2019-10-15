import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorObavijestiComponent } from './profesor-obavijesti.component';

describe('ProfesorObavijestiComponent', () => {
  let component: ProfesorObavijestiComponent;
  let fixture: ComponentFixture<ProfesorObavijestiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfesorObavijestiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorObavijestiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
