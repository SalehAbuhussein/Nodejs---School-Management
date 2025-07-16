import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { catchError, mergeMap, of } from 'rxjs';

import { UserService } from '../services/user/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    return false;
  }

  if (userService.user) {
    return true;
  } else {
    return userService.getUserInfo().pipe(
      mergeMap(response => {
        if (response && response.status === 200) {
          userService.user = response?.data;
          return of(true);
        } else {
          router.navigate(['/auth/login']);
          return of(false);
        }
      }),
      catchError(() => {
        router.navigate(['/auth/login']);
        return of(false);
      }),
    );
  }
};
