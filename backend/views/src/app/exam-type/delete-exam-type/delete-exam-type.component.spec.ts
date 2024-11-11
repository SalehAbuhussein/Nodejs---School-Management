import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExamTypeComponent } from './delete-exam-type.component';

describe('DeleteExamTypeComponent', () => {
  let component: DeleteExamTypeComponent;
  let fixture: ComponentFixture<DeleteExamTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteExamTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteExamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
