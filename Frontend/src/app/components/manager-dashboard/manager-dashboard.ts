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
      <div class="bg-white shadow overflow-hidden sm:rounded-md mt-6">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Pending Requests</h3>
        </div>
        <ul role="list" class="divide-y divide-gray-200">
          <li *ngFor="let leave of pendingLeaves" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div>
                 <p class="text-sm font-medium text-indigo-600 truncate">
                  {{ leave.user?.name || 'Unknown User' }} ({{ leave.leaveType?.name }})
                </p>
                <div class="mt-2 text-sm text-gray-500">
                  {{ leave.fromDate | date }} - {{ leave.toDate | date }}
                </div>
                <div class="text-sm text-gray-500 italic">
                  "{{ leave.reason }}"
                </div>
              </div>
              <div class="flex space-x-2">
                 <button (click)="approve(leave.id)" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">Approve</button>
                 <button (click)="reject(leave.id)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Reject</button>
              </div>
            </div>
          </li>
          <li *ngIf="pendingLeaves.length === 0" class="px-4 py-4 sm:px-6 text-gray-500 text-center">
            No pending requests. Good job!
          </li>
        </ul>
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
