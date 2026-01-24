import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">
          {{ title }}
        </dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          {{ value }}
        </dd>
      </div>
      <div [class]="'bg-' + color + '-50 px-4 py-4 sm:px-6'" *ngIf="footerText">
        <div class="text-sm">
          <span [class]="'font-medium text-' + color + '-600'">{{ footerText }}</span>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
    @Input() title: string = '';
    @Input() value: string | number = 0;
    @Input() color: string = 'indigo'; // Configurable color class base (indigo, green, red)
    @Input() footerText: string = '';
}
