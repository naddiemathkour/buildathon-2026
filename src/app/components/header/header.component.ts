import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header-container">
      <div class="header-content">
        <!-- Brand / Logo on the far left -->
        <a routerLink="/" class="brand-link">
          <div class="brand-icon">
            <span class="material-symbols-outlined">psychology</span>
          </div>
          <div class="brand-details">
            <span class="brand-name">SimuSocial</span>
            <span class="brand-badge">AI Sandbox</span>
          </div>
        </a>

        <!-- Centered Navigation -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <span class="material-symbols-outlined nav-icon">tune</span>
            Simulator
          </a>
          <a routerLink="/simulation-detail" routerLinkActive="active" class="nav-link">
            <span class="material-symbols-outlined nav-icon">analytics</span>
            Live Insights
          </a>
          <a href="#history" class="nav-link">
            <span class="material-symbols-outlined nav-icon">history</span>
            History
          </a>
        </nav>

        <!-- Right CTA Button -->
        <div class="header-cta">
          <button class="btn-new-sim" routerLink="/">
            <span class="material-symbols-outlined">add_circle</span>
            New Session
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      width: 100%;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .header-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.875rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }
    .brand-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
    }
    .brand-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .brand-name {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: #111827;
    }
    .brand-badge {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: #eef2ff;
      color: #4f46e5;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      border: 1px solid #c7d2fe;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.75rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
      transition: color 0.15s ease;
      padding: 0.375rem 0.5rem;
      border-radius: 6px;
    }
    .nav-link:hover, .nav-link.active {
      color: #4f46e5;
    }
    .nav-icon {
      font-size: 1.125rem;
    }
    .btn-new-sim {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #4f46e5;
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
      transition: all 0.15s ease;
    }
    .btn-new-sim:hover {
      background: #4338ca;
      box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
    }
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {}
