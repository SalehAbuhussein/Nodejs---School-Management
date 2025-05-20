import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InputService } from 'app/shared/components/inputs/services/input.service';
import { StringService } from 'app/shared/services/string/string.service';

import { BasicInputComponent } from 'app/shared/components/inputs/basic-input/basic-input.component';

import { LoginForm } from './types/login-form.types';

import { generalConstants } from 'constants/general-constants';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    BasicInputComponent,
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  loginForm: LoginForm = {
    email: {
      value: '',
      error: '',
      isValid: false
    },
    password: {
      value: '',
      error: '',
      isValid: false
    }
  };

  constants = generalConstants;

  constructor(
    public inputService: InputService,
    public stringService: StringService,
  ) {}

  /**
   * Email field change event handler
   * 
   * 1- Check if email is required and assign error if not valid.
   * 2- Check if email is valid email if it is written and assign error if not valid.
   * 
   * @param { Event } event email change event object
   * @returns { void }
   */
  onEmailChange = (event: Event): void => {
    let value = (event.target as HTMLInputElement).value;
    const isValidEmail = this.stringService.isValidEmail(value);

    if (!value) {
      this.loginForm.email = {
        value: '',
        isValid: false,
        error: 'Email can not be empty!'
      };
      return;
    }

    if (!isValidEmail) {
      this.loginForm.email = {
        value,
        isValid: false,
        error: 'Email is not valid!'
      };
      return;
    }

    this.loginForm.email = {
      value,
      isValid: true,
      error: ''
    };
  }

  /**
   * Password field change event handler
   * 
   * 1- Check if Password is required and assign error if not valid.
   * 2- Check if Password is valid password if it is written and assign error if not valid.
   * 
   * @param { Event } event email change event object
   * @returns { void }
   */
  onPasswordChange = (event: Event): void => {
    let value = (event.target as HTMLInputElement).value;

    if (!value) {
      this.loginForm.password = {
        value: '',
        isValid: false,
        error: 'Password can not be empty!'
      };
      return;
    }

    if (value.length > 0 && value.length < 6) {
      this.loginForm.password = {
        value,
        isValid: false,
        error: 'Password must be at least 6 characters long!'
      };
      return;
    }

    this.loginForm.password = {
      value,
      isValid: true,
      error: ''
    };
  }
}
