import { Injectable } from '@angular/core';
import { UserData } from './user.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: UserData | null = null;
  
  constructor() { }
}
