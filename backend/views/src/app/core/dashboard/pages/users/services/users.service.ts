import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AddUser, EditUser } from '../types/users.types';

import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  mode: 'add' | 'update' = 'add';

  constructor(
    public httpClient: HttpClient,
  ) { }

  /**
   * Add User to database
   * 
   * @param { AddUser } user 
   * @returns 
   */
  addUser = (user: AddUser) => {
    return this.httpClient.post( environment.baseApi + '/user/create', {
      name: user.name,
      username: user.username,
      email: user.email,
      profileImg: user.profileImg,
      password: user.password,
    })
  };

  editUser = (user: EditUser) => {
    
  }
}
