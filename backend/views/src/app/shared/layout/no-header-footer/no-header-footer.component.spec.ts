import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoHeaderFooterComponent } from './no-header-footer.component';

describe('NoHeaderFooterComponent', () => {
  let component: NoHeaderFooterComponent;
  let fixture: ComponentFixture<NoHeaderFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoHeaderFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoHeaderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
