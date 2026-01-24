import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveService } from '../../services/leave';
import { Router, NavigationEnd } from '@angular/router';
import { StatCardComponent } from '../shared/stat-card';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, DatePipe],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Manager Dashboard</h2>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <app-stat-card 
          title="Pending Approvals" 
          [value]="pendingLeaves.length" 
          color="yellow"
          footerText="Action required">
        </app-stat-card>
        
        <app-stat-card 
          title="Team Leaves (Approved)" 
          [value]="stats.teamApproved" 
          color="green"
          footerText="Total this year">
        </app-stat-card>

         <app-stat-card 
          title="Team Leaves (Rejected)" 
          [value]="stats.teamRejected" 
          color="red">
        </app-stat-card>
      </div>

      <!-- Pending List -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mt-6">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Pending Requests</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let leave of pendingLeaves" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ leave.user?.name || 'Unknown User' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ leave.leaveType?.name }}
                </td>
                 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ leave.fromDate | date:'mediumDate' }} - {{ leave.toDate | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title="{{ leave.reason }}">
                  {{ leave.reason }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                   <button (click)="approve(leave.id)" class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors">Approve</button>
                   <button (click)="reject(leave.id)" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors">Reject</button>
                </td>
              </tr>
              <tr *ngIf="pendingLeaves.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                  No pending requests to review.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ManagerDashboardComponent {
  pendingLeaves: any[] = [];
  allLeaves: any[] = [];

  stats = {
    teamApproved: 0,
    teamRejected: 0
  };

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
    this.loadData();
  }

  loadData() {
    this.loadPendingLeaves();
    this.loadAllLeaves();
  }

  loadPendingLeaves() {
    this.leaveService.getPendingLeaves().subscribe((res: any) => {
      const data = res.$values ?? res;
      this.pendingLeaves = data.map((l: any) => ({
        ...l,
        fromDate: new Date(l.fromDate),
        toDate: new Date(l.toDate)
      }));
    });
  }

  loadAllLeaves() {
    this.leaveService.getAllLeaves().subscribe((res: any) => {
      const data = res.$values ?? res;
      this.allLeaves = data;
      this.calculateStats();
    })
  }

  calculateStats() {
    this.stats.teamApproved = this.allLeaves.filter((l: any) => l.status === 'Approved').length;
    this.stats.teamRejected = this.allLeaves.filter((l: any) => l.status === 'Rejected').length;
  }

  approve(id: number) {
    this.leaveService.approveLeave(id).subscribe(() => {
      this.loadData();
    });
  }

  reject(id: number) {
    this.leaveService.rejectLeave(id).subscribe(() => {
      this.loadData();
    });
  }
}
