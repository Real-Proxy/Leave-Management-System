import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../services/leave';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-leave.html',
  styleUrls: ['./apply-leave.css']
})
export class ApplyLeaveComponent {
  leave = {
    leaveTypeId: 1, // Defaulting to first type for now
    fromDate: '',
    toDate: '',
    reason: ''
  };

  constructor(private leaveService: LeaveService) { }

  submit() {
    this.leaveService.applyLeave(this.leave).subscribe(() => {
      alert('Leave Applied');
    });
  }
}
