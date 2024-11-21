import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputAttributes } from '../types/inputs.types';

@Component({
  selector: 'app-basic-input',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './basic-input.component.html',
  styleUrl: './basic-input.component.scss'
})
export class BasicInputComponent {
  @Input({ required: true }) inputAttrs: InputAttributes = {} as unknown as InputAttributes;
}
