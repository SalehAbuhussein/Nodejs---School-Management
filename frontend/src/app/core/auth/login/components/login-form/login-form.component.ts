import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { generalConstants } from 'constants/general-constants';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  constants = generalConstants;
}
