import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
    @Input() leaves: any[] = [];
    @Input() selectionMode: boolean = true;
    @Output() rangeSelected = new EventEmitter<{ from: Date, to: Date }>();

    currentDate = new Date();
    daysInMonth: Date[] = [];
    paddingDays: number[] = [];

    // Selection State
    selectionStart: Date | null = null;
    selectionEnd: Date | null = null;
    hoverDate: Date | null = null;

    weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    ngOnInit() {
        this.generateCalendar();
    }

    generateCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Calculate padding (days before the 1st)
        const startDayOfWeek = firstDay.getDay();
        this.paddingDays = Array(startDayOfWeek).fill(0);

        // Generate days
        this.daysInMonth = [];
        for (let d = 1; d <= lastDay.getDate(); d++) {
            this.daysInMonth.push(new Date(year, month, d));
        }
    }

    prevMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.generateCalendar();
    }

    nextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.generateCalendar();
    }

    onDateClick(date: Date) {
        if (!this.selectionMode || this.isPastDate(date)) return;

        if (!this.selectionStart || (this.selectionStart && this.selectionEnd)) {
            // Start new selection
            this.selectionStart = date;
            this.selectionEnd = null;
        } else {
            // Complete selection
            if (date < this.selectionStart) {
                this.selectionEnd = this.selectionStart;
                this.selectionStart = date;
            } else {
                this.selectionEnd = date;
            }
            this.rangeSelected.emit({ from: this.selectionStart, to: this.selectionEnd });
        }
    }

    onDateHover(date: Date) {
        if (this.selectionMode && this.selectionStart && !this.selectionEnd) {
            this.hoverDate = date;
        }
    }

    // --- Visual Helpers ---

    isPastDate(date: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    getLeaveStatusClasses(date: Date): string {
        // 1. Check Selection
        if (this.isSelected(date)) {
            return 'bg-indigo-600 text-white hover:bg-indigo-700';
        }

        if (this.isInSelectionRange(date)) {
            return 'bg-indigo-100 text-indigo-900';
        }

        // 2. Check Existing Leaves
        // Simple check: is this date within any leave range?
        const leave = this.leaves.find(l => {
            const from = new Date(l.fromDate);
            const to = new Date(l.toDate);
            const d = new Date(date);
            // Reset hours for accurate comparison
            from.setHours(0, 0, 0, 0);
            to.setHours(0, 0, 0, 0);
            d.setHours(0, 0, 0, 0);
            return d >= from && d <= to;
        });

        if (leave) {
            switch (leave.status) {
                case 'Approved': return 'bg-green-100 text-green-800';
                case 'Rejected': return 'bg-red-100 text-red-800';
                case 'Pending': return 'bg-yellow-100 text-yellow-800';
                default: return 'bg-gray-100';
            }
        }

        // 3. Default
        return 'hover:bg-gray-100 text-gray-900';
    }

    isSelected(date: Date): boolean {
        if (!this.selectionStart) return false;
        return date.getTime() === this.selectionStart.getTime() ||
            (this.selectionEnd !== null && date.getTime() === this.selectionEnd.getTime());
    }

    isInSelectionRange(date: Date): boolean {
        if (!this.selectionStart) return false;

        const end = this.selectionEnd || this.hoverDate;
        if (!end) return false;

        // Handle reverse selection for hover visual
        const start = this.selectionStart < end ? this.selectionStart : end;
        const finish = this.selectionStart < end ? end : this.selectionStart;

        return date > start && date < finish;
    }
}
