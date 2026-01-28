import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing')
        .then(m => m.Landing)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register')
        .then(m => m.Register)
  },
  {
    path: 'employee/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 1 },
    loadComponent: () =>
      import('./employee/dashboard/employee-dashboard/employee-dashboard')
        .then(m => m.EmployeeDashboard)
  },
  {
    path: 'manager/dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 2 },
    loadComponent: () =>
      import('./manager/dashboard/manager-dashboard/manager-dashboard')
        .then(m => m.ManagerDashboard)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
