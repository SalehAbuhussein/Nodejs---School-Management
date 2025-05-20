import { Directive, ElementRef, Output } from '@angular/core';

import { fromEvent, filter } from 'rxjs';

@Directive({
  selector: '[appAutoFill]',
  standalone: true
})
export class AutoFillDirective {
  constructor(public elRef: ElementRef<HTMLInputElement>) {}

  @Output()
  public nativeAutofill = fromEvent(this.elRef.nativeElement, 'change').pipe(
    filter(() =>
      [':autofill', ':-webkit-autofill'].some((s) => this.elRef.nativeElement.matches(s))
    )
  );
}
