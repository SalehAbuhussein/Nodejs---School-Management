import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExamTypeComponent } from './edit-exam-type.component';

describe('EditExamTypeComponent', () => {
  let component: EditExamTypeComponent;
  let fixture: ComponentFixture<EditExamTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExamTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
