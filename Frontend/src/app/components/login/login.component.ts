import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
      <div class="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 class="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4 rounded-md shadow-sm">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input id="email" type="email" formControlName="email" required 
                class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
                placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" type="password" formControlName="password" required 
                class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
                placeholder="Password">
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || isLoading"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
              <span *ngIf="isLoading">Signing in...</span>
              <span *ngIf="!isLoading">Sign in</span>
            </button>
          </div>
          
          <div class="text-center text-sm">
            <a routerLink="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    isLoading = false;
    errorMessage = '';

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.login(this.loginForm.value as any).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    // Redirect based on role
                    if (res.role === 'Admin') {
                        // this.router.navigate(['/admin']); // TODO: Implement Admin Dashboard
                        this.router.navigate(['/dashboard']); // Fallback
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = 'Invalid email or password';
                    console.error(err);
                }
            });
        }
    }
}
