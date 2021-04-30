import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  authenticate(username: string): void {
    localStorage.setItem('username', username);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('username') != null;
  }


}
