import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7141/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password
    });
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  saveAuth(token: string, role: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role.toString());
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole():number {
    return Number(localStorage.getItem('role'));
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
