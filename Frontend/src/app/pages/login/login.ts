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
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;

        this.authService.saveAuth(res.token, {
          id: res.id,
          name: res.name,
          email: res.email,
          role: res.role
        });

        if (res.role === 1) {
          this.router.navigate(['/employee/dashboard']);
        } else {
          this.router.navigate(['/manager/dashboard']);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid email or password';
      }
    });
  }
}
