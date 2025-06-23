import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { ApiService } from 'app/core/services/api.service';

import { GetRefreshToken } from './token.types';

import { generalConstants } from 'constants/general-constants';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  readonly _refreshTokenUrl = `${generalConstants.v1ApiPrefix}/users/refresh-token`;

  accessToken = '';
  refreshToken = '';

  constructor(public apiService: ApiService) {}

  /**
   * Get Refresh Token
   *
   * @returns
   */
  getRefreshToken = () => {
    return this.apiService.get<GetRefreshToken>(this._refreshTokenUrl, {}, {}, true).pipe(map(this.apiService.extractTypeFromMessage));
  };
}
