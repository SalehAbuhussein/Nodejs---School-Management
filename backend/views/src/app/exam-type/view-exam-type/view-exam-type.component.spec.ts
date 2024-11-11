import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExamTypeComponent } from './view-exam-type.component';

describe('ViewExamTypeComponent', () => {
  let component: ViewExamTypeComponent;
  let fixture: ComponentFixture<ViewExamTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewExamTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
