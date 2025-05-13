import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

import { InputAttributes } from '../types/inputs.types';

@Component({
  selector: 'app-basic-input',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './basic-input.component.html',
  styleUrl: './basic-input.component.scss'
})
export class BasicInputComponent {
  @Input({ required: true }) inputAttrs: InputAttributes = {} as unknown as InputAttributes;
  @Input({ required: true }) value: string = '';
  @Output() valueChange: EventEmitter<Event> = new EventEmitter<Event>;

  /**
   * Emit input value
   * 
   * @param { Event } $event
   * @returns { void }
   */
  changeInput($event: Event): void {
    this.valueChange.emit($event);
  }
}
