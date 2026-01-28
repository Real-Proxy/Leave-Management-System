import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      this.authService.saveAuth(res.token, res.role);

      if (res.role === 1) {
        // Employee
        this.router.navigate(['/employee/dashboard']);
      } else if (res.role === 2) {
        // Manager
        this.router.navigate(['/manager/dashboard']);
      }
      },
      error: () => {
        this.error = 'Invalid email or password';
      }
    });
  }
}

