import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveService } from '../../services/leave';
import { Router, NavigationEnd } from '@angular/router';
import { StatCardComponent } from '../shared/stat-card';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, StatCardComponent, DatePipe],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">My Dashboard</h2>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <app-stat-card 
          title="Leaves Left (Total)" 
          [value]="leavesLeft" 
          color="blue"
          footerText="across all types">
        </app-stat-card>
        
        <app-stat-card 
          title="Approved" 
          [value]="stats.approved" 
          color="green">
        </app-stat-card>

        <app-stat-card 
          title="Pending" 
          [value]="stats.pending" 
          color="yellow">
        </app-stat-card>

        <app-stat-card 
          title="Rejected" 
          [value]="stats.rejected" 
          color="red">
        </app-stat-card>
      </div>

      <!-- Filters & List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Leave History</h3>
        </div>
        <ul role="list" class="divide-y divide-gray-200">
          <li *ngFor="let leave of leaves" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-indigo-600 truncate">
                {{ leave.leaveType?.name || 'Leave' }}
              </p>
              <div class="ml-2 flex-shrink-0 flex">
                <span [class]="getStatusClass(leave.status) + ' px-2 inline-flex text-xs leading-5 font-semibold rounded-full'">
                  {{ leave.status }}
                </span>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  {{ leave.fromDate | date }} - {{ leave.toDate | date }}
                </p>
                <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  {{ leave.reason }}
                </p>
              </div>
            </div>
          </li>
          <li *ngIf="leaves.length === 0" class="px-4 py-4 sm:px-6 text-gray-500 text-center">
            No leaves found.
          </li>
        </ul>
      </div>
    </div>
  `
})
export class LeaveListComponent {
  leaves: any[] = [];
  leaveTypes: any[] = [];

  stats = {
    approved: 0,
    pending: 0,
    rejected: 0
  };

  leavesLeft = 0;

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
    this.loadData(); // Initial load
  }

  loadData() {
    this.leaveService.getLeaveTypes().subscribe((res: any) => {
      this.leaveTypes = res.$values ?? res;
      this.loadLeaves();
    });
  }

  loadLeaves() {
    this.leaveService.getUserLeaves().subscribe((res: any) => {
      const data = res.$values ?? res;

      this.leaves = data.map((l: any) => ({
        ...l,
        fromDate: new Date(l.fromDate),
        toDate: new Date(l.toDate)
      })).sort((a: any, b: any) => b.fromDate - a.fromDate);

      this.calculateStats();
    });
  }

  calculateStats() {
    this.stats = {
      approved: 0,
      pending: 0,
      rejected: 0
    };

    let totalUsedDays = 0;

    this.leaves.forEach(l => {
      const days = this.getDays(l.fromDate, l.toDate);

      if (l.status === 'Approved') {
        this.stats.approved++;
        totalUsedDays += days;
      } else if (l.status === 'Pending') {
        this.stats.pending++;
        // Pending doesn't strictly count against used yet usually, but quota check logic might vary
      } else if (l.status === 'Rejected') {
        this.stats.rejected++;
      }
    });

    // Calculate total quota (simple sum of all default quotas for now)
    // A better approach would be per-type calculation, but requirement asks for "Leaves left" generally
    const totalQuota = this.leaveTypes.reduce((acc, type) => acc + type.defaultQuota, 0);
    this.leavesLeft = Math.max(0, totalQuota - totalUsedDays);
  }

  getDays(from: Date, to: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((to.getTime() - from.getTime()) / oneDay)) + 1;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }
}
