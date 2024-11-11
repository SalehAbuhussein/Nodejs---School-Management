import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExamTypeComponent } from './create-exam-type.component';

describe('CreateExamTypeComponent', () => {
  let component: CreateExamTypeComponent;
  let fixture: ComponentFixture<CreateExamTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExamTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
