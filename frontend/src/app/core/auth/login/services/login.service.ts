import { Injectable } from '@angular/core';

import { ApiService } from 'app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public apiService: ApiService) { }

  /**
   * 
   * @param username username form field 
   * @param password password form field
   */
  login = (username: string, password: string) => {
    this.apiService
  }
}
