import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOsobniPodaciComponent } from './student-osobni-podaci.component';

describe('StudentOsobniPodaciComponent', () => {
  let component: StudentOsobniPodaciComponent;
  let fixture: ComponentFixture<StudentOsobniPodaciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentOsobniPodaciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentOsobniPodaciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
