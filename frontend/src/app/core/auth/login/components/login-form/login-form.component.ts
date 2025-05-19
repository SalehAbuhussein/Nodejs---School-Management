import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
}
