import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing')
        .then(m => m.LandingComponent)
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
    loadComponent: () =>
      import('./employee/dashboard/employee-dashboard/employee-dashboard')
        .then(m => m.EmployeeDashboard)
  },
  {
    path: 'manager/dashboard',
    loadComponent: () =>
      import('./manager/dashboard/manager-dashboard/manager-dashboard')
        .then(m => m.ManagerDashboard)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
