import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, StatCardComponent],
    template: `
    <div class="dashboard-grid">
      <app-stat-card
        label="Total Missions"
        value="124"
        icon="🚀"
        [trend]="12.5"
        iconColor="var(--color-primary)"
      ></app-stat-card>
      
      <app-stat-card
        label="Active Drones"
        value="8"
        icon="🛸"
        [trend]="-2.4"
        iconColor="var(--color-accent)"
      ></app-stat-card>
      
      <app-stat-card
        label="System Status"
        value="98%"
        icon="⚡"
        [trend]="0.8"
        iconColor="#ffd700"
      ></app-stat-card>

      <div class="main-panel glass-panel">
        <h2>Mission Activity</h2>
        <p style="color: var(--text-muted)">Real-time map visualization placeholder...</p>
      </div>

      <div class="side-panel glass-panel">
        <h2>Recent Alerts</h2>
        <ul style="list-style: none; padding: 0; color: var(--text-muted)">
          <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color)">Drone #4 Battery Low</li>
          <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color)">Sector 7 Scan Complete</li>
        </ul>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto 1fr;
      gap: var(--spacing-lg);
      height: 100%;
    }

    .main-panel {
      grid-column: 1 / 3;
      padding: var(--spacing-lg);
    }

    .side-panel {
      grid-column: 3 / 4;
      padding: var(--spacing-lg);
    }
  `]
})
export class DashboardComponent { }
