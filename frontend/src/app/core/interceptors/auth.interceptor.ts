import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, mergeMap, Observable, throwError } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { TokenService } from 'app/core/auth/shared/services/token/token.service';
import { UserService } from '../auth/shared/services/user/user.service';

import { UserData } from '../auth/shared/services/user/user.types';

/**
 * HTTP interceptor that handles authentication by adding authorization headers
 * and managing authentication errors with token refresh logic.
 *
 * This interceptor automatically:
 * - Adds Bearer token authorization headers to all outgoing requests
 * - Handles 401 authentication errors on protected endpoints
 * - Attempts token refresh and retries failed requests
 * - Falls back to cookie-based tokens when access tokens are unavailable
 *
 * @param req - The outgoing HTTP request to be intercepted
 * @param next - The next handler in the interceptor chain
 * @returns Observable of HTTP events with authentication headers added and error handling applied
 *
 * @example
 * ```typescript
 * // Register in app.config.ts or main.ts
 * provideHttpClient(
 *   withInterceptors([authInterceptor])
 * )
 * ```
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = addAuthHeaders(req);
  const tokenService = inject(TokenService);
  const cookieService = inject(CookieService);
  const userService = inject(UserService);

  return next(clonedReq).pipe(
    catchError((error) =>
      handleAuthError(
        error,
        req,
        next,
        tokenService,
        cookieService,
        userService
      )
    )
  );
};

/**
 * Adds authorization headers to the HTTP request using access token from
 * TokenService or fallback to cookie token.
 *
 * The method follows this priority order for token selection:
 * 1. TokenService.accessToken (in-memory token)
 * 2. Cookie 'token' value (persistent storage)
 * 3. Empty string (no token available)
 *
 * @param req - The HTTP request to clone and modify
 * @param cookieService - Service for accessing browser cookies containing auth tokens
 * @param tokenService - Service for managing in-memory authentication tokens
 * @returns A new HTTP request instance with Authorization header containing Bearer token
 *
 * @example
 * ```typescript
 * const authorizedReq = addAuthHeaders(originalReq, cookieService, tokenService);
 * // Result: Request with header "Authorization: Bearer <token>"
 * ```
 */
const addAuthHeaders = (req: HttpRequest<any>): HttpRequest<any> => {
  const cookieService = inject(CookieService);
  const tokenService = inject(TokenService);

  return req.clone({
    headers: req.headers.set(
      'Authorization',
      `Bearer ${tokenService.accessToken || cookieService.get('token') || ''}`
    ),
  });
};

/**
 * Handles authentication errors by attempting token refresh for 401 errors
 * on protected endpoints, then retrying the original request.
 *
 * This function implements the following error handling strategy:
 * - Only processes 401 Unauthorized errors on authentication endpoints
 * - Attempts to refresh the access token using the refresh token
 * - Retries the original request with the new authorization headers
 * - Propagates non-401 errors or errors from non-auth endpoints unchanged
 *
 * @param error - The HTTP error response received from the server
 * @param originalReq - The original HTTP request that failed authentication
 * @param next - The next handler function to retry the request with new token
 * @param cookieService - Service for accessing browser cookies containing refresh tokens
 * @param tokenService - Service for managing tokens and performing refresh operations
 * @returns Observable of HTTP events for successful retry, or error observable for failures
 *
 * @throws {Error} Propagates the original error if token refresh is not applicable or fails
 *
 * @example
 * ```typescript
 * // Automatic handling within interceptor
 * catchError((error: HttpErrorResponse) =>
 *   handleAuthError(error, req, next, cookieService, tokenService)
 * )
 * ```
 */
const handleAuthError = (
  error: HttpErrorResponse,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  cookieService: CookieService,
  userService: UserService,
): Observable<any> => {
  if (
    error.status === 401 &&
    isProtectedEndpoint(error.url || '') &&
    cookieService.get('token')
  ) {
    return tokenService.getRefreshToken().pipe(
      mergeMap((response: any) =>
        handleRefreshToken(
          response,
          req,
          next,
          tokenService,
          cookieService,
          userService
        )
      ),
      catchError((err: HttpErrorResponse) =>
        throwError(() => new Error(err.message))
      )
    );
  }

  return throwError(() => {
    cookieService.delete('token');
    return new Error(error.message);
  });
};

/**
 * Determines if the given URL corresponds to an authentication-protected endpoint
 * that should trigger token refresh logic on 401 errors.
 *
 * This function maintains a whitelist of endpoints that are considered authentication-sensitive
 * and should trigger automatic token refresh attempts when they return 401 errors.
 * Non-auth endpoints that return 401 will not trigger refresh logic to avoid unnecessary
 * token refresh attempts on endpoints that may legitimately return 401 for other reasons.
 *
 * @param url - The URL string to check against known authentication endpoints
 * @returns True if the URL matches any authentication endpoint pattern, false otherwise
 *
 * @example
 * ```typescript
 * isAuthEndpoint('/api/user-info'); // returns true
 * isAuthEndpoint('/api/public-data'); // returns false
 * isAuthEndpoint('/user-info/profile'); // returns true (contains '/user-info')
 * ```
 *
 * @see {@link handleAuthError} - Uses this function to determine refresh eligibility
 */
const handleRefreshToken = (
  response: any,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  cookieService: CookieService,
  userService: UserService,
) => {
  if (response.status === 200) {
    tokenService.accessToken = response.token || '';
    cookieService.set('token', response.token || '');
    userService.user = response.user as UserData;

    const updatedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${tokenService.accessToken}`
      ),
    });
    return next(updatedReq);
  }

  return throwError(() => new Error(response.message));
};

/**
 * Determines if the given URL corresponds to a protected endpoint
 * that should trigger token refresh logic on 401 errors.
 */
const isProtectedEndpoint = (url: string): boolean => {
  // Endpoints that should NOT trigger refresh (to avoid infinite loops)
  const excludedEndpoints = ['/login', '/refresh-token'];

  // Don't refresh tokens for login or refresh endpoints
  if (excludedEndpoints.some((endpoint) => url.includes(endpoint))) {
    return false;
  }

  // Protected endpoints that should trigger refresh
  const protectedEndpoints = ['/user-info', '/users'];
  return protectedEndpoints.some((endpoint) => url.includes(endpoint));
};
