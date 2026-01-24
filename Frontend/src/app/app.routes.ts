import { Routes } from '@angular/router';
import { ApplyLeaveComponent } from './components/apply-leave/apply-leave';
import { LeaveListComponent } from './components/leave-list/leave-list';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard';

export const routes: Routes = [
  { path: 'apply', component: ApplyLeaveComponent },
  { path: 'my-leaves', component: LeaveListComponent },
  { path: 'manager', component: ManagerDashboardComponent },
  { path: '', redirectTo: 'apply', pathMatch: 'full' }
];
