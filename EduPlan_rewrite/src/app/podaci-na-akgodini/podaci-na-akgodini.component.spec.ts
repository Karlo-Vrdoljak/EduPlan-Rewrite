import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodaciNaAkgodiniComponent } from './podaci-na-akgodini.component';

describe('PodaciNaAkgodiniComponent', () => {
  let component: PodaciNaAkgodiniComponent;
  let fixture: ComponentFixture<PodaciNaAkgodiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodaciNaAkgodiniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodaciNaAkgodiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
