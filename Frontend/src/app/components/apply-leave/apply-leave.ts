import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveService } from '../../services/leave';
import { CalendarComponent } from '../shared/calendar/calendar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './apply-leave.html',
  styleUrls: ['./apply-leave.css']
})
export class ApplyLeaveComponent implements OnInit {
  leave = {
    leaveTypeId: 1, // Defaulting to first type for now
    fromDate: '',
    toDate: '',
    reason: ''
  };

  existingLeaves: any[] = [];
  leaveTypes: any[] = [];

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.leaveService.getLeaveTypes().subscribe((res: any) => {
      this.leaveTypes = res.$values ?? res;
      if (this.leaveTypes.length > 0) {
        this.leave.leaveTypeId = this.leaveTypes[0].id;
      }
    });

    this.leaveService.getUserLeaves().subscribe((res: any) => {
      this.existingLeaves = res.$values ?? res;
    });
  }

  onRangeSelected(range: { from: Date, to: Date }) {
    // Format YYYY-MM-DD for API
    this.leave.fromDate = this.formatDate(range.from);
    this.leave.toDate = this.formatDate(range.to);
  }

  submit() {
    if (!this.leave.fromDate || !this.leave.toDate) {
      alert('Please select a date range from the calendar.');
      return;
    }

    this.leaveService.applyLeave(this.leave).subscribe({
      next: () => {
        alert('Leave Applied Successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Error: ' + (err.error || 'Failed to apply'));
      }
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
