import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { switchMap, catchError, map, take, tap } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { LoginResponse } from './login-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) { }

  get<T>(path: string, params?: Object): Observable<T> {
    return this.isValidAuth().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return throwError('Not authenticated');
        }
        return this.http.get<T>(`${this.getBaseUrl()}/${path}`, params);
      }),
      catchError(error => {
        console.error('Authentication error:', error);
        return throwError(error);
      })
    );
  }

  private isValidAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(
      take(1),
      switchMap((loginResponse: LoginResponse) => {
        if (loginResponse.isAuthenticated) {
          return of(true);
        } else {
          return this.loginAndRetry();
        }
      })
    );
  }

  private loginAndRetry(): Observable<boolean> {
    this.login(); // Trigger login
    return this.oidcSecurityService.checkAuth().pipe(
      take(1),
      map((loginResponse: LoginResponse) => loginResponse.isAuthenticated)
    );
  }

  private login() {
    this.oidcSecurityService.authorize();
  }

  private getBaseUrl(): string {
    return 'YOUR_API_BASE_URL';
  }
}
