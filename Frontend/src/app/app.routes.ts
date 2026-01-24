import { Routes } from '@angular/router';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave';
import { LeaveListComponent } from './components/leave-list/leave-list';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'apply',
    component: ApplyLeaveComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: LeaveListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-leaves',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: ManagerDashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
