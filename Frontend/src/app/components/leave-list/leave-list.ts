import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../services/leave';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-list.html',
  styleUrls: ['./leave-list.css']
})
export class LeaveListComponent {

  leaves: any[] = [];

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadLeaves();
      }
    });
  }

  loadLeaves() {
    this.leaveService.getUserLeaves(1).subscribe((res: any) => {
      const data = res.$values ?? res;

      this.leaves = data.map((l: any) => ({
        ...l,
        fromDate: new Date(l.fromDate),
        toDate: new Date(l.toDate)
      }));
    });
  }
}
