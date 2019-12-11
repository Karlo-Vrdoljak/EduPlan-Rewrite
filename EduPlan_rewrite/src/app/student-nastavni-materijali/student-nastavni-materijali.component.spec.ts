import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentNastavniMaterijaliComponent } from './student-nastavni-materijali.component';

describe('StudentNastavniMaterijaliComponent', () => {
  let component: StudentNastavniMaterijaliComponent;
  let fixture: ComponentFixture<StudentNastavniMaterijaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentNastavniMaterijaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentNastavniMaterijaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
