import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  getAuthorizationToken() {
    return 'some-auth-token';
  }

  isAuthenticated():boolean {
    // Check to see if user is authenticated
    // Based on your application apply a logic to check if user is authenticated
    return true;
  }
}
