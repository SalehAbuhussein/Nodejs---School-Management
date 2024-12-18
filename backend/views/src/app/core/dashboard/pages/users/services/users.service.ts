import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { GetUserResponse, GetUsersResponse, User } from '../types/users.types';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  mode: 'add' | 'update' = 'add';
  userId: string | null = null;
  userList: User[] = [];
  
  constructor(
    public httpClient: HttpClient,
  ) { }

  /**
   * Get All users
   * 
   * @returns { Observable<GetUsersResponse> }
   */
  getUsers(): Observable<GetUsersResponse> {
    return this.httpClient.get<GetUsersResponse>(`${environment.baseApi}/users`);
  }

  /**
   * Get Single User
   * 
   * @param userId user id
   * @returns 
   */
  getUser(userId: string): Observable<GetUserResponse> {
    return this.httpClient.get<GetUserResponse>(`${environment.baseApi}/users/${userId}`);
  }

  /**
   * Add User to database
   * 
   * @param { FormData } formData user data
   * @returns
   */
  addUser = (formData: FormData) => {
    return this.httpClient.post(`${environment.baseApi}/user/create`, formData);
  };

  /**
   * Update User
   * 
   * @param { FormData } formData user data
   */
  editUser = (formData: FormData) => {
    return this.httpClient.patch(`${environment.baseApi}/users/${this.userId}`, formData);
  }

  save(formData: FormData): Observable<Object> {
    if (this.mode === 'add') {
      return this.addUser(formData);
    } else {
      return this.editUser(formData);
    }
  }
}
