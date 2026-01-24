import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveService } from '../../services/leave';
import { Router, NavigationEnd } from '@angular/router';
import { StatCardComponent } from '../shared/stat-card';
import { Subscription, filter, forkJoin } from 'rxjs';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, StatCardComponent, DatePipe],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">My Dashboard</h2>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center py-10">
        <div class="text-indigo-600 font-medium animate-pulse">Loading dashboard data...</div>
      </div>

      <div *ngIf="!isLoading">
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
        <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 mt-6">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Leave History</h3>
            <!-- Button removed as requested -->
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let leave of leaves" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ leave.leaveType?.name || 'Leave' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ leave.fromDate | date:'mediumDate' }} - {{ leave.toDate | date:'mediumDate' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getDays(leave.fromDate, leave.toDate) }} days
                  </td>
                   <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title="{{ leave.reason }}">
                    {{ leave.reason }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span [class]="getStatusClass(leave.status) + ' px-2.5 py-0.5 rounded-full text-xs font-medium'">
                      {{ leave.status }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="leaves.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                    No leave history found. Start by applying for one!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
  `]
})
export class LeaveListComponent implements OnInit, OnDestroy {
  leaves: any[] = [];
  leaveTypes: any[] = [];
  isLoading = true;

  stats = {
    approved: 0,
    pending: 0,
    rejected: 0
  };

  leavesLeft = 0;
  private routerSubscription: Subscription | undefined;

  constructor(
    private leaveService: LeaveService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadData();
    });
    this.loadData();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadData() {
    this.isLoading = true;
    this.cdr.detectChanges();

    forkJoin({
      types: this.leaveService.getLeaveTypes(),
      leaves: this.leaveService.getUserLeaves()
    }).subscribe({
      next: (response: any) => {
        const typesRes = response.types;
        this.leaveTypes = typesRes.$values ?? typesRes;

        const leavesRes = response.leaves;
        const leavesData = leavesRes.$values ?? leavesRes;

        this.leaves = leavesData.map((l: any) => ({
          ...l,
          fromDate: new Date(l.fromDate),
          toDate: new Date(l.toDate)
        })).sort((a: any, b: any) => b.fromDate - a.fromDate);

        this.calculateStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.stats = { approved: 0, pending: 0, rejected: 0 };
    let totalUsedDays = 0;

    if (!this.leaves) return;

    this.leaves.forEach(l => {
      const days = this.getDays(l.fromDate, l.toDate);
      if (l.status === 'Approved') {
        this.stats.approved++;
        totalUsedDays += days;
      } else if (l.status === 'Pending') {
        this.stats.pending++;
      } else if (l.status === 'Rejected') {
        this.stats.rejected++;
      }
    });

    const totalQuota = this.leaveTypes ? this.leaveTypes.reduce((acc, type) => acc + type.defaultQuota, 0) : 0;
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
