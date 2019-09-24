import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateSidebarComponent } from './translate-sidebar.component';

describe('TranslateSidebarComponent', () => {
  let component: TranslateSidebarComponent;
  let fixture: ComponentFixture<TranslateSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslateSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
