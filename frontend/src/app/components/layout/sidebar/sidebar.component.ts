import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <nav class="sidebar glass-panel">
      <div class="logo">
        <span class="text-gradient">Ranger</span>Dash
      </div>
      
      <ul class="nav-links">
        <li class="nav-item active">
          <span class="icon">📊</span>
          <span class="label">Dashboard</span>
        </li>
        <li class="nav-item">
          <span class="icon">🚀</span>
          <span class="label">Missions</span>
        </li>
        <li class="nav-item">
          <span class="icon">⚙️</span>
          <span class="label">Settings</span>
        </li>
      </ul>
    </nav>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar {
      height: 100%;
      width: 260px;
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
      border-left: none;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: var(--spacing-xl);
      letter-spacing: -0.03em;
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-main);
      }

      &.active {
        background: var(--color-primary);
        color: #fff;
        box-shadow: 0 4px 12px rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.3);
      }

      .icon {
        font-size: 1.2rem;
      }
    }
  `]
})
export class SidebarComponent { }
