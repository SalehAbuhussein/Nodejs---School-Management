import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';

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
   * @param { FormData } formData user data
   * @returns
   */
  addUser = (formData: FormData) => {
    return this.httpClient.post( environment.baseApi + '/user/create', formData)
  };

  /**
   * 
   * @param { FormData } formData user data
   */
  editUser = (formData: FormData) => {
    console.log(formData);
    return of({});
  }

  save(formData: FormData): Observable<Object> {
    if (this.mode === 'add') {
      return this.addUser(formData);
    } else {
      return this.editUser(formData);
    }
  }
}
