import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InputService } from 'app/shared/components/inputs/services/input.service';
import { LoginService } from 'app/core/auth/login/services/login.service';
import { StringService } from 'app/shared/services/string/string.service';
import { TokenService } from 'app/core/auth/shared/services/token/token.service';
import { UserService } from 'app/core/auth/shared/services/user/user.service';

import { BasicInputComponent } from 'app/shared/components/inputs/basic-input/basic-input.component';

import { LoginForm } from './types/login-form.types';

import { generalConstants } from 'constants/general-constants';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [BasicInputComponent, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  constants = generalConstants;
  loginForm: LoginForm = {
    email: {
      value: '',
      error: '',
      isValid: false,
    },
    password: {
      value: '',
      error: '',
      isValid: false,
    },
  };
  isFormBeingSubmitted = false;

  constructor(
    public inputService: InputService,
    public loginService: LoginService,
    public stringService: StringService,
    public tokenService: TokenService,
    public userService: UserService
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
        error: 'Email can not be empty!',
      };
      return;
    }

    if (!isValidEmail) {
      this.loginForm.email = {
        value,
        isValid: false,
        error: 'Email is not valid!',
      };
      return;
    }

    this.loginForm.email = {
      value,
      isValid: true,
      error: '',
    };
  };

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
        error: 'Password can not be empty!',
      };
      return;
    }

    if (value.length > 0 && value.length < 3) {
      this.loginForm.password = {
        value,
        isValid: false,
        error: 'Password must be at least 3 characters long!',
      };
      return;
    }

    this.loginForm.password = {
      value,
      isValid: true,
      error: '',
    };
  };

  /**
   * Handles user login process
   *
   * Extracts email and password values from the login form, sends login request
   * to the authentication service, and handles the response by storing user data
   * and token, then logging the response.
   *
   */
  logUserin = () => {
    const {
      email: { value: emailValue },
      password: { value: passwordValue },
    } = this.loginForm;
    this.isFormBeingSubmitted = true;

    this.loginService.login(emailValue, passwordValue).subscribe({
      next: (value) => {
        this.isFormBeingSubmitted = false;
        this.tokenService.token = value?.token ?? '';
        this.userService.user = value?.user ?? null;
        console.log(value);
      },
      error: (error) => {
        this.isFormBeingSubmitted = false;
        console.log(error);
      },
    });
  };
}
