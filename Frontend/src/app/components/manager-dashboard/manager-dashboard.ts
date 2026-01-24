import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../services/leave';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.html',
  styleUrls: ['./manager-dashboard.css']
})
export class ManagerDashboardComponent {

  leaves: any[] = [];

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadPendingLeaves();
      }
    });
  }

  loadPendingLeaves() {
    this.leaveService.getPendingLeaves().subscribe((res: any) => {
      const data = res.$values ?? res;

      this.leaves = data.map((l: any) => ({
        ...l,
        fromDate: new Date(l.fromDate),
        toDate: new Date(l.toDate)
      }));
    });
  }

  approve(id: number) {
    this.leaveService.approveLeave(id).subscribe(() => {
      this.loadPendingLeaves();
    });
  }

  reject(id: number) {
    this.leaveService.rejectLeave(id).subscribe(() => {
      this.loadPendingLeaves();
    });
  }
}
