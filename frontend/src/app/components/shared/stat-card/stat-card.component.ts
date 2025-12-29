import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="stat-card glass-panel">
      <div class="icon-container" [style.color]="iconColor">
        <span class="icon">{{ icon }}</span>
      </div>
      <div class="content">
        <h3 class="label">{{ label }}</h3>
        <div class="value">{{ value }}</div>
        <div class="trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
          <span class="trend-icon">{{ trend > 0 ? '↑' : '↓' }}</span>
          {{ Math.abs(trend) }}%
        </div>
      </div>
    </div>
  `,
    styles: [`
    .stat-card {
      padding: var(--spacing-lg);
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }

    .icon-container {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
    }

    .content {
      flex: 1;
    }

    .label {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0 0 4px 0;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .trend {
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 4px;
      
      &.positive { color: var(--color-success); }
      &.negative { color: var(--color-danger); }
    }
  `]
})
export class StatCardComponent {
    @Input() label: string = '';
    @Input() value: string = '';
    @Input() icon: string = '';
    @Input() trend: number = 0;
    @Input() iconColor: string = 'var(--color-primary)';

    Math = Math;
}
