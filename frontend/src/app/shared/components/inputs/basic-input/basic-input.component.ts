import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

import { InputAttributes } from '../types/input.types';

import { AutoFillDirective } from 'app/shared/directives/auto-fill/auto-fill.directive';

@Component({
  selector: 'app-basic-input',
  standalone: true,
  imports: [NgClass, AutoFillDirective],
  templateUrl: './basic-input.component.html',
  styleUrl: './basic-input.component.scss'
})
export class BasicInputComponent {
  @Input() hasError = false;
  @Input() value = "";
  @Input({ required: true }) inputAttributes!: InputAttributes;
  @Input({ required: true }) placeholder = '';
  @Input() isValidationRequired?: boolean = true;
  @Input() errorMessage: string = '';

  @Output() inputChanged = new EventEmitter<Event>();
  @Output() inputPasted = new EventEmitter<ClipboardEvent>();
}
