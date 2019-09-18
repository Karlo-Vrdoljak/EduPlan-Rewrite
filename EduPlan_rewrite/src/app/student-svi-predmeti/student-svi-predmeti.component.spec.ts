import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSviPredmetiComponent } from './student-svi-predmeti.component';

describe('StudentSviPredmetiComponent', () => {
  let component: StudentSviPredmetiComponent;
  let fixture: ComponentFixture<StudentSviPredmetiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSviPredmetiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSviPredmetiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
