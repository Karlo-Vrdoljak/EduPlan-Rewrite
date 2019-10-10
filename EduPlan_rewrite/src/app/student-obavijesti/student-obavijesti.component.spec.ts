import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentObavijestiComponent } from './student-obavijesti.component';

describe('StudentObavijestiComponent', () => {
  let component: StudentObavijestiComponent;
  let fixture: ComponentFixture<StudentObavijestiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentObavijestiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentObavijestiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
