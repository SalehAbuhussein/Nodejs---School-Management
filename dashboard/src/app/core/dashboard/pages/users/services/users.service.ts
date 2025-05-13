import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AddUserResponse, DeleteUserResponse, EditUserResponse, GetUserResponse, GetUsersResponse, User } from '../types/users.types';

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
  getUsers = (): Observable<GetUsersResponse> => {
    return this.httpClient.get<GetUsersResponse>(`${environment.baseApi}/users`);
  }

  /**
   * Get Single User
   * 
   * @param userId user id
   * @returns { Observable<GetUserResponse> }
   */
  getUser = (userId: string): Observable<GetUserResponse> => {
    return this.httpClient.get<GetUserResponse>(`${environment.baseApi}/users/${userId}`);
  }

  /**
   * Add User to database through /user/create endpoint
   * 
   * @param { FormData } formData user data
   * @returns { Observable<AddUserResponse> }
   */
  addUser = (formData: FormData): Observable<AddUserResponse> => {
    return this.httpClient.post<AddUserResponse>(`${environment.baseApi}/users/create`, formData);
  };

  /**
   * Update User in database through (/users/:userId) endpoint
   * 
   * @param { FormData } formData user data
   * @returns { Observable<EditUserResponse> }
   */
  editUser = (formData: FormData): Observable<EditUserResponse> => {
    return this.httpClient.patch<EditUserResponse>(`${environment.baseApi}/users/${this.userId}`, formData);
  }

  /**
   * Delete User from database
   * 
   * @returns { Observable<DeleteUserResponse> }
   */
  deleteUser = (): Observable<DeleteUserResponse> => {
    return this.httpClient.delete<DeleteUserResponse>(`${environment.baseApi}/users/${this.userId}`);
  };

  save(formData: FormData): Observable<Object> {
    if (this.mode === 'add') {
      return this.addUser(formData);
    } else {
      return this.editUser(formData);
    }
  }
}
