import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProsjeciComponent } from './student-prosjeci.component';

describe('StudentProsjeciComponent', () => {
  let component: StudentProsjeciComponent;
  let fixture: ComponentFixture<StudentProsjeciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentProsjeciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProsjeciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
