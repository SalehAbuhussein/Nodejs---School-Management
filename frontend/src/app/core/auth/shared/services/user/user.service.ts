import { Injectable, makeStateKey } from '@angular/core';

import { map } from 'rxjs';

import { ApiService } from 'app/core/services/api.service';

import { UserData, UserInfoResponse } from './user.types';

import { generalConstants } from 'constants/general-constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly _userInfoUrl = `${generalConstants.v1ApiPrefix}/users/user-info`;

  user: UserData | null = null;

  constructor(public apiService: ApiService) {}

  /**
   * Get User Info
   *
   * @returns
   */
  getUserInfo = () => {
    return this.apiService
      .get<UserInfoResponse>(`${this._userInfoUrl}`)
      .pipe(map(this.apiService.extractTypeFromMessage));
  };
}
