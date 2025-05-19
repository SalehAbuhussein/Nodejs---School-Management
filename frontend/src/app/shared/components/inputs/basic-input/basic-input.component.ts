import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

import { InputAttributes } from '../types/input.types';

import { generalConstants } from 'constants/general-constants';

@Component({
  selector: 'app-basic-input',
  standalone: true,
  imports: [NgClass],
  templateUrl: './basic-input.component.html',
  styleUrl: './basic-input.component.scss'
})
export class BasicInputComponent {
  @Input() hasError = false;
  @Input() value = "";
  @Input({ required: true }) inputAttributes!: InputAttributes;
  @Input({ required: true }) placeholder = '';
  @Input() inputChangeFn: (event: Event) => void = generalConstants.noop;
  @Input() inputPasteFn: (event: ClipboardEvent) => void = generalConstants.noop;
  @Input() isValidationRequired?: boolean = true;
  @Input() errorMessage: string = '';
}
