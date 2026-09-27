import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimulationService, SimulationItem } from '../../services/simulation.service';

@Component({
  selector: 'app-simulation-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section id="history" class="history-section">
      <div class="history-header">
        <div class="header-titles">
          <h2 class="section-title">Previous Simulations & Repetitions</h2>
          <p class="section-subtitle">Browse your past conversation trials, review repetition depth, and track behavioral progress.</p>
        </div>
        <div class="filter-pills">
          <button class="pill" [class.active]="activeCategory() === 'all'" (click)="setCategory('all')">All (10)</button>
          <button class="pill" [class.active]="activeCategory() === 'Negotiation'" (click)="setCategory('Negotiation')">Negotiation</button>
          <button class="pill" [class.active]="activeCategory() === 'Interpersonal'" (click)="setCategory('Interpersonal')">Interpersonal</button>
          <button class="pill" [class.active]="activeCategory() === 'Interview'" (click)="setCategory('Interview')">Interview</button>
        </div>
      </div>

      <div class="simulations-list">
        <div *ngFor="let item of paginatedItems()" class="sim-row">
          <div class="sim-main">
            <div class="sim-meta">
              <span class="modality-tag" [class.audio]="item.modality === 'audio'">
                <span class="material-symbols-outlined tag-icon">
                  {{ item.modality === 'audio' ? 'mic' : 'keyboard' }}
                </span>
                {{ item.modality === 'audio' ? 'Audio' : 'Text' }}
              </span>
              <span class="category-tag">{{ item.category }}</span>
              <span class="date-tag">{{ item.date }}</span>
            </div>
            <h3 class="scenario-title">{{ item.scenario }}</h3>
            <div class="reps-meta">
              <span class="material-symbols-outlined reps-icon">sync</span>
              <span><strong>{{ item.repetitionsCount }}</strong> {{ item.repetitionsCount === 1 ? 'repetition completed' : 'repetitions completed' }}</span>
            </div>
          </div>

          <div class="sim-stats">
            <div class="score-badge" [class.high]="item.score >= 85" [class.medium]="item.score < 85">
              <span class="score-num">{{ item.score }}%</span>
              <span class="score-lbl">Mastery</span>
            </div>
            <a routerLink="/simulation-detail" class="btn-insights">
              <span>View Insights</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Pagination Footer -->
      <div class="pagination-footer">
        <span class="page-info">
          Showing {{ (currentPage() - 1) * pageSize + 1 }} to {{ Math.min(currentPage() * pageSize, filteredItems().length) }} of {{ filteredItems().length }} simulations
        </span>
        <div class="pagination-controls">
          <button 
            type="button" 
            class="page-btn" 
            [disabled]="currentPage() === 1" 
            (click)="setPage(currentPage() - 1)">
            <span class="material-symbols-outlined">chevron_left</span>
            Previous
          </button>
          <span class="page-indicator">Page {{ currentPage() }} of {{ totalPages() }}</span>
          <button 
            type="button" 
            class="page-btn" 
            [disabled]="currentPage() === totalPages()" 
            (click)="setPage(currentPage() + 1)">
            Next
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .history-section {
      margin-top: 2rem;
    }
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.375rem 0;
      letter-spacing: -0.02em;
    }
    .section-subtitle {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0;
    }
    .filter-pills {
      display: flex;
      gap: 0.5rem;
    }
    .pill {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 9999px;
      padding: 0.375rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .pill:hover, .pill.active {
      background: #4f46e5;
      border-color: #4f46e5;
      color: #ffffff;
    }
    .simulations-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .sim-row {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .sim-row:hover {
      border-color: #c7d2fe;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
    }
    .sim-meta {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 0.5rem;
    }
    .modality-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: #eef2ff;
      color: #4f46e5;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .modality-tag.audio {
      background: #fef2f2;
      color: #dc2626;
    }
    .tag-icon {
      font-size: 0.875rem;
    }
    .category-tag {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .date-tag {
      font-size: 0.75rem;
      color: #9ca3af;
    }
    .scenario-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }
    .reps-meta {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: #4b5563;
    }
    .reps-icon {
      font-size: 1rem;
      color: #10b981;
    }
    .sim-stats {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .score-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 10px;
      font-weight: 700;
    }
    .score-badge.high {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .score-badge.medium {
      background: #fffbeb;
      color: #d97706;
      border: 1px solid #fde68a;
    }
    .score-num {
      font-size: 1.125rem;
      line-height: 1;
    }
    .score-lbl {
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.2rem;
    }
    .btn-insights {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: #ffffff;
      border: 1px solid #d1d5db;
      color: #374151;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      transition: all 0.15s ease;
    }
    .btn-insights:hover {
      background: #4f46e5;
      border-color: #4f46e5;
      color: #ffffff;
    }
    .pagination-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }
    .page-info {
      font-size: 0.875rem;
      color: #6b7280;
    }
    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .page-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
    }
    .page-btn:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .page-indicator {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #374151;
    }
    @media (max-width: 640px) {
      .sim-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .sim-stats {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class SimulationHistoryComponent {
  private simService = inject(SimulationService);
  Math = Math;

  activeCategory = signal<string>('all');
  currentPage = signal<number>(1);
  pageSize = 5;

  filteredItems = computed(() => {
    const list = this.simService.simulations();
    const cat = this.activeCategory();
    if (cat === 'all') return list;
    return list.filter(item => item.category === cat);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredItems().length / this.pageSize) || 1;
  });

  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredItems().slice(start, start + this.pageSize);
  });

  setCategory(cat: string) {
    this.activeCategory.set(cat);
    this.currentPage.set(1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
