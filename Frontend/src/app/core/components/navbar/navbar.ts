import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  logout() {
    this.auth.logout();
  }
}
