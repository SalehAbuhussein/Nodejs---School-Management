import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { ApiService } from 'app/core/services/api/api.service';

import { LoginResponse } from '../types/login.types';

import { generalConstants } from 'constants/general-constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly _loginUrl = `${generalConstants.v1ApiPrefix}/users/login`

  constnats = generalConstants;

  constructor(public apiService: ApiService) { }

  /**
   * Sends login credentials to the authentication endpoint
   *
   * @param email The user's email for authentication
   * @param password The user's password for authentication
   * @returns An Observable containing the login response after extraction
   */
  login = (email: string, password: string) => {
    return this.apiService.post<LoginResponse>(this._loginUrl, { email, password }).pipe(map(this.apiService.extractTypeFromMessage));
  }
}
