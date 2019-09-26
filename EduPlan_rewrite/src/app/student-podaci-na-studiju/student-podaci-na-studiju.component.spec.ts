import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPodaciNaStudijuComponent } from './student-podaci-na-studiju.component';

describe('StudentPodaciNaStudijuComponent', () => {
  let component: StudentPodaciNaStudijuComponent;
  let fixture: ComponentFixture<StudentPodaciNaStudijuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPodaciNaStudijuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPodaciNaStudijuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
