import { ElementRef } from '@angular/core';

import { AutoFillDirective } from './auto-fill.directive';

describe('AutoFillDirective', () => {
  it('should create an instance', () => {
    const directive = new AutoFillDirective(new ElementRef(document.createElement('input')));
    expect(directive).toBeTruthy();
  });
});
