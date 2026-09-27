import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

interface TurnDialogue {
  speaker: string;
  role: 'user' | 'counterpart';
  text: string;
  feedback?: string;
  score?: number;
}

interface RepetitionRun {
  runId: string;
  label: string;
  badge: string;
  date: string;
  overallScore: number;
  rapportScore: number;
  persuasionScore: number;
  leverageScore: number;
  frictionScore: number;
  strategyNotes: string;
  turns: TurnDialogue[];
}

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <div class="page-container">
      <app-header></app-header>

      <main class="main-content">
        <!-- Back Navigation & Breadcrumb -->
        <div class="nav-breadcrumbs">
          <a routerLink="/" class="back-link">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Simulator
          </a>
          <span class="breadcrumb-separator">/</span>
          <span class="current-crumb">Simulation Detail & Behavioral Insights</span>
        </div>

        <!-- Scenario Banner -->
        <section class="scenario-summary-card">
          <div class="summary-top">
            <div class="tags-group">
              <span class="badge-negotiation">Negotiation Strategy</span>
              <span class="badge-modality">
                <span class="material-symbols-outlined tag-icon">keyboard</span>
                Text Simulation
              </span>
            </div>
            <span class="timestamp">Completed Today at 2:15 PM</span>
          </div>
          <h1 class="scenario-heading">High-Stakes Salary Negotiation with VP of Engineering for Principal Architect Offer</h1>
          <p class="scenario-target">
            <strong>Target Goal:</strong> Negotiate base salary from $220k to $245k with early equity acceleration, while maintaining high rapport and leadership alignment.
          </p>
        </section>

        <!-- Interactive Repetition Switcher & Retry Console -->
        <section class="retry-console-card">
          <div class="console-header">
            <div class="console-title-group">
              <div class="icon-circle">
                <span class="material-symbols-outlined">model_training</span>
              </div>
              <div>
                <h2 class="console-title">Practice Repetitions & Strategy Tweaks</h2>
                <p class="console-subtitle">Compare performance metrics across distinct conversation attempts or launch a targeted new run.</p>
              </div>
            </div>
            <button class="btn-retry-action" (click)="launchNewRepetition()">
              <span class="material-symbols-outlined">restart_alt</span>
              Launch New Repetition
            </button>
          </div>

          <div class="runs-selector-bar">
            <button 
              *ngFor="let run of repetitionRuns"
              type="button"
              class="run-tab"
              [class.active]="selectedRun().runId === run.runId"
              (click)="selectRun(run)">
              <div class="tab-label-row">
                <span class="run-name">{{ run.label }}</span>
                <span class="run-score">{{ run.overallScore }}%</span>
              </div>
              <div class="tab-badge">{{ run.badge }}</div>
            </button>
          </div>

          <!-- Strategy Delta Callout -->
          <div class="strategy-callout">
            <span class="material-symbols-outlined callout-icon">lightbulb</span>
            <div class="callout-body">
              <strong>Repetition Strategy & Hypothesis:</strong>
              <p>{{ selectedRun().strategyNotes }}</p>
            </div>
          </div>
        </section>

        <!-- 4 Core Performance Metric Scorecards -->
        <section class="scorecards-grid">
          <div class="scorecard">
            <div class="scorecard-header">
              <span class="metric-title">Rapport & Social Trust</span>
              <span class="material-symbols-outlined metric-icon trust">handshake</span>
            </div>
            <div class="metric-value">{{ selectedRun().rapportScore }}%</div>
            <div class="progress-track">
              <div class="progress-bar trust" [style.width.%]="selectedRun().rapportScore"></div>
            </div>
            <p class="metric-desc">Acknowledged VP's budget constraints early without becoming defensive.</p>
          </div>

          <div class="scorecard">
            <div class="scorecard-header">
              <span class="metric-title">Persuasion Precision</span>
              <span class="material-symbols-outlined metric-icon persuasion">target</span>
            </div>
            <div class="metric-value">{{ selectedRun().persuasionScore }}%</div>
            <div class="progress-track">
              <div class="progress-bar persuasion" [style.width.%]="selectedRun().persuasionScore"></div>
            </div>
            <p class="metric-desc">Anchored on business revenue impact from your previous distributed systems architecture.</p>
          </div>

          <div class="scorecard">
            <div class="scorecard-header">
              <span class="metric-title">Negotiation Leverage</span>
              <span class="material-symbols-outlined metric-icon leverage">trending_up</span>
            </div>
            <div class="metric-value">{{ selectedRun().leverageScore }}%</div>
            <div class="progress-track">
              <div class="progress-bar leverage" [style.width.%]="selectedRun().leverageScore"></div>
            </div>
            <p class="metric-desc">Effectively presented alternative competing offers as market valuation proof.</p>
          </div>

          <div class="scorecard">
            <div class="scorecard-header">
              <span class="metric-title">Interpersonal Friction</span>
              <span class="material-symbols-outlined metric-icon friction">warning</span>
            </div>
            <div class="metric-value">{{ selectedRun().frictionScore }}%</div>
            <div class="progress-track">
              <div class="progress-bar friction" [style.width.%]="selectedRun().frictionScore"></div>
            </div>
            <p class="metric-desc">Low resistance encountered; phrasing maintained collaborative tone.</p>
          </div>
        </section>

        <!-- Turn-by-Turn Dialogue Analysis -->
        <section class="dialogue-review-card">
          <div class="review-header">
            <h2 class="section-heading">Turn-by-Turn Transcript & Behavioral Breakdown</h2>
            <span class="turns-count">{{ selectedRun().turns.length }} Exchanged Turns</span>
          </div>

          <div class="turns-list">
            <div *ngFor="let turn of selectedRun().turns; let idx = index" class="turn-item" [class.user-turn]="turn.role === 'user'">
              <div class="turn-avatar">
                <span class="material-symbols-outlined">
                  {{ turn.role === 'user' ? 'person' : 'support_agent' }}
                </span>
              </div>
              <div class="turn-content">
                <div class="turn-meta">
                  <span class="turn-speaker">{{ turn.speaker }}</span>
                  <span class="turn-role-tag" [class.user]="turn.role === 'user'">{{ turn.role === 'user' ? 'You (Practitioner)' : 'VP of Engineering (Counterpart)' }}</span>
                </div>
                <div class="turn-bubble">
                  <p class="turn-text">"{{ turn.text }}"</p>
                </div>
                <div *ngIf="turn.feedback" class="turn-coaching">
                  <div class="coaching-header">
                    <span class="material-symbols-outlined coaching-icon">psychology</span>
                    <span>AI Behavioral Coach Insight:</span>
                  </div>
                  <p class="coaching-body">{{ turn.feedback }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="footer-container">
        <div class="footer-content">
          <p class="footer-text">SimuSocial &copy; 2026. Built with Angular Standalone Architecture & Generative Behavioral Analytics.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #fafafa;
    }
    .main-content {
      flex: 1;
      max-width: 1080px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem 1.5rem;
      box-sizing: border-box;
    }
    .nav-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: #4f46e5;
      text-decoration: none;
      font-weight: 600;
    }
    .back-link:hover {
      text-decoration: underline;
    }
    .breadcrumb-separator {
      color: #9ca3af;
    }
    .current-crumb {
      color: #6b7280;
    }
    .scenario-summary-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 1.75rem 2rem;
      margin-bottom: 1.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .summary-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .tags-group {
      display: flex;
      gap: 0.5rem;
    }
    .badge-negotiation {
      background: #eef2ff;
      color: #4f46e5;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 4px;
    }
    .badge-modality {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: #f3f4f6;
      color: #374151;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 4px;
    }
    .tag-icon {
      font-size: 0.875rem;
    }
    .timestamp {
      font-size: 0.8125rem;
      color: #9ca3af;
    }
    .scenario-heading {
      font-size: 1.5rem;
      font-weight: 800;
      color: #111827;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
    }
    .scenario-target {
      margin: 0;
      font-size: 0.9375rem;
      color: #4b5563;
      line-height: 1.5;
    }
    .retry-console-card {
      background: #ffffff;
      border: 2px solid #e0e7ff;
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .console-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .console-title-group {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }
    .icon-circle {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #4f46e5;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .console-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }
    .console-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    .btn-retry-action {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: #4f46e5;
      color: #ffffff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-retry-action:hover {
      background: #4338ca;
    }
    .runs-selector-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .run-tab {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      padding: 0.875rem 1rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
    }
    .run-tab:hover {
      border-color: #c7d2fe;
    }
    .run-tab.active {
      border-color: #4f46e5;
      background: #eef2ff;
    }
    .tab-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.375rem;
    }
    .run-name {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #111827;
    }
    .run-score {
      font-size: 0.875rem;
      font-weight: 700;
      color: #4f46e5;
    }
    .tab-badge {
      font-size: 0.75rem;
      color: #6b7280;
    }
    .strategy-callout {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.875rem 1rem;
    }
    .callout-icon {
      color: #f59e0b;
      font-size: 1.25rem;
      margin-top: 0.125rem;
    }
    .callout-body {
      font-size: 0.875rem;
      color: #334155;
    }
    .callout-body p {
      margin: 0.25rem 0 0 0;
    }
    .scorecards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .scorecard {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .scorecard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.625rem;
    }
    .metric-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #6b7280;
    }
    .metric-icon {
      font-size: 1.25rem;
    }
    .metric-icon.trust { color: #3b82f6; }
    .metric-icon.persuasion { color: #10b981; }
    .metric-icon.leverage { color: #8b5cf6; }
    .metric-icon.friction { color: #f59e0b; }
    .metric-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: #111827;
      margin-bottom: 0.625rem;
    }
    .progress-track {
      width: 100%;
      height: 6px;
      background: #f3f4f6;
      border-radius: 9999px;
      margin-bottom: 0.75rem;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      border-radius: 9999px;
    }
    .progress-bar.trust { background: #3b82f6; }
    .progress-bar.persuasion { background: #10b981; }
    .progress-bar.leverage { background: #8b5cf6; }
    .progress-bar.friction { background: #f59e0b; }
    .metric-desc {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.4;
    }
    .dialogue-review-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.75rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .section-heading {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .turns-count {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #4f46e5;
      background: #eef2ff;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
    }
    .turns-list {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .turn-item {
      display: flex;
      gap: 1rem;
    }
    .turn-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #e5e7eb;
      color: #374151;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .turn-item.user-turn .turn-avatar {
      background: #4f46e5;
      color: #ffffff;
    }
    .turn-content {
      flex: 1;
    }
    .turn-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.375rem;
    }
    .turn-speaker {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111827;
    }
    .turn-role-tag {
      font-size: 0.6875rem;
      background: #f3f4f6;
      color: #6b7280;
      padding: 0.15rem 0.375rem;
      border-radius: 4px;
      font-weight: 500;
    }
    .turn-role-tag.user {
      background: #eef2ff;
      color: #4f46e5;
    }
    .turn-bubble {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }
    .turn-text {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.5;
      color: #1f2937;
    }
    .turn-coaching {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }
    .coaching-header {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #166534;
      margin-bottom: 0.25rem;
    }
    .coaching-icon {
      font-size: 1rem;
    }
    .coaching-body {
      margin: 0;
      font-size: 0.84375rem;
      color: #15803d;
      line-height: 1.4;
    }
    .footer-container {
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
      padding: 2rem 1.5rem;
      margin-top: auto;
    }
    .footer-content {
      max-width: 1080px;
      margin: 0 auto;
      text-align: center;
    }
    .footer-text {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
    @media (max-width: 768px) {
      .scorecards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .runs-selector-bar {
        grid-template-columns: 1fr;
      }
      .console-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class InsightsComponent {
  repetitionRuns: RepetitionRun[] = [
    {
      runId: 'run-1',
      label: 'Run #1 (Baseline)',
      badge: 'Defensive Anchor',
      date: 'Today, 1:45 PM',
      overallScore: 78,
      rapportScore: 74,
      persuasionScore: 76,
      leverageScore: 68,
      frictionScore: 28,
      strategyNotes: 'Directly stated market rate demand ($245k) without prefacing the architectural leadership impact on multi-region reliability.',
      turns: [
        {
          speaker: 'VP of Engineering',
          role: 'counterpart',
          text: 'We are very excited about your interview rounds. We made an initial offer of $220k base. That sits at the 75th percentile of our existing staff band.'
        },
        {
          speaker: 'Candidate (You)',
          role: 'user',
          text: 'Thanks for the offer, but looking at my competing offers and market data, I was expecting closer to $245k to make this move.',
          feedback: 'Too blunt on the initial counter. Mentioning a competing offer immediately without validating alignment creates defensive friction.',
          score: 72
        },
        {
          speaker: 'VP of Engineering',
          role: 'counterpart',
          text: 'I understand market rates fluctuate, but stretching to $245k creates internal parity challenges with our existing staff engineers.'
        }
      ]
    },
    {
      runId: 'run-2',
      label: 'Run #2 (Pivot)',
      badge: 'High Rapport',
      date: 'Today, 2:05 PM',
      overallScore: 88,
      rapportScore: 88,
      persuasionScore: 92,
      leverageScore: 76,
      frictionScore: 14,
      strategyNotes: 'Framed compensation through executive ROI: connecting system migration latency reductions directly to cloud infrastructure cost savings.',
      turns: [
        {
          speaker: 'VP of Engineering',
          role: 'counterpart',
          text: 'We are very excited about your interview rounds. We made an initial offer of $220k base. That sits at the 75th percentile of our existing staff band.'
        },
        {
          speaker: 'Candidate (You)',
          role: 'user',
          text: 'I really appreciate the offer and I am genuinely excited about the cloud migration challenges. Given the responsibility of driving our multi-region architecture and the $1.2M annual latency savings I delivered previously, is there flexibility to reach $245k?',
          feedback: 'Masterful anchor. Quantified business value before asking for flexibility, which neutralizes the internal parity pushback.',
          score: 94
        },
        {
          speaker: 'VP of Engineering',
          role: 'counterpart',
          text: 'That makes total sense when framed around cloud savings. If we cannot reach $245k strictly on base, would a performance milestone bonus bridge the difference?'
        }
      ]
    },
    {
      runId: 'run-3',
      label: 'Run #3 (Experimental)',
      badge: 'Equity Tradeoff',
      date: 'Today, 2:15 PM',
      overallScore: 92,
      rapportScore: 90,
      persuasionScore: 94,
      leverageScore: 84,
      frictionScore: 10,
      strategyNotes: 'Balanced base salary ask with aggressive equity acceleration and milestone bonuses to de-risk employer budget constraints.',
      turns: [
        {
          speaker: 'VP of Engineering',
          role: 'counterpart',
          text: 'We made an initial offer of $220k base. Would that work for you to sign today?'
        },
        {
          speaker: 'Candidate (You)',
          role: 'user',
          text: 'I want to partner with you long term. If base is capped at $235k, let us structure a milestone bonus around the Q3 database cutover and accelerate year-one equity vesting.',
          feedback: 'Outstanding creative tradeoff. Demonstrates conviction in delivery while resolving the budget barrier.',
          score: 96
        },
        {
          speaker: 'VP of Engineering',
          role: 'counterpart',
          text: 'I love that framing. I will run the equity acceleration clause by our CEO and compensation committee this afternoon.'
        }
      ]
    }
  ];

  selectedRun = signal<RepetitionRun>(this.repetitionRuns[1]);

  selectRun(run: RepetitionRun) {
    this.selectedRun.set(run);
  }

  launchNewRepetition() {
    alert('Spinning up repetition sandbox with current strategy parameters...');
  }
}
