import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, take, map } from 'rxjs/operators';
import { User } from '@shared/models/User.model';

export interface IAuthResponseData {
  displayName?: string;
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  apiKey: string = "AIzaSyClV8ZL-Pd-tWEoM7dy7BZOUi-4lI1gO3w";

  private expirationTimer: any;

  user = new BehaviorSubject<User>(null);

  constructor(
      // private config: ConfigService,
      private http: HttpClient,
      private router: Router
  ) {}

  getAuthorizationToken() {
    return localStorage.getItem('uid') ? JSON.parse(localStorage.getItem('uid'))._token : 'iozo';
  }

  isAuthenticated() {
    return localStorage.getItem('uid') ? true : false;
  }

  login(username: string, password: string) {      
      return this.http
          .post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`, {
              email: username,
              password: password,
              returnSecureToken: true
          })
          .pipe(
              catchError(this.handleError),
              tap(res => {
                  const expiresIn = new Date(new Date().getTime() + (12 * 3600 * 1000) + (+res.expiresIn * 1000));
                  const user = new User(res.email, res.localId, res.idToken, expiresIn);
                  this.user.next(user);
                  this.autologout((+res.expiresIn * 1000) + (12 * 3600 * 1000));
                  if (localStorage.getItem('uid')) localStorage.removeItem('uid');
                  localStorage.setItem('uid', JSON.stringify(user));
              })
          );
  }

  autologin() {
      const storedUser: {username: string, id: string, _token: string, _tokenExpiresAt: string } = JSON.parse(localStorage.getItem('uid'));
      if (!storedUser) {
          return;
      }
      const loadeduser = new User(storedUser.username, storedUser.id, storedUser._token, new Date(storedUser._tokenExpiresAt));
      if (loadeduser.token) {
          const duration = new Date(storedUser._tokenExpiresAt).getTime() - new Date().getTime();
          this.user.next(loadeduser);
          this.autologout(duration);
      }
  }

  logout() {
      this.user.next(null);
      localStorage.removeItem('uid');
      localStorage.setItem('uid', JSON.stringify({error: 'User logged out.'}));
      this.router.navigate(['/auth']);
      
      if (this.expirationTimer) {
          clearTimeout(this.expirationTimer);
      }
      this.expirationTimer = null;
  }
  
  autologout(duration: number) {
      this.expirationTimer = setTimeout(() => {
          this.logout();
          localStorage.setItem('uid', JSON.stringify({error: 'Session expired.'}));
      }, duration);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log(errorResponse)
      let errorMessage = "Unknown error";
      if (!errorResponse.error || !errorResponse.error.error) {
          return throwError(errorMessage);
      }

      switch (errorResponse.error.error.message) {
          case 'EMAIL_NOT_FOUND':
              errorMessage = 'Username does not exist.';
              break;
          case 'INVALID_PASSWORD':
              errorMessage = 'Invalid password.';
              break;
      }

      return throwError(errorMessage);
  }
}