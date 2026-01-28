import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})

export class Register {
  name = '';
  email = '';
  password = '';
  role = 1;

  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.error = '';
    this.loading = true;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || 'Registration failed';
      }
    });
  }
}
