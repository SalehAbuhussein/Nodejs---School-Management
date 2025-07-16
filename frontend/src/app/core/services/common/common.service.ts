import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  AUTH_GUARDED_ROUTES: string[] = ['', '/dashboard'];

  constructor() { }

  /**
   * return true if the route is guarded with Auth Guard
   *
   * @param url
   * @returns {boolean}
   */
  isAuthGuardedRoute = (url: string): boolean => {
    return this.AUTH_GUARDED_ROUTES.includes(url);
  }
}
