import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPodaciNaAkgodiniComponent } from './student-podaci-na-akgodini.component';

describe('StudentPodaciNaAkgodiniComponent', () => {
  let component: StudentPodaciNaAkgodiniComponent;
  let fixture: ComponentFixture<StudentPodaciNaAkgodiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPodaciNaAkgodiniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPodaciNaAkgodiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
