import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-testing-runner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="runner-card">
      <div class="runner-header">
        <div class="status-indicator">
          <span class="pulse-dot"></span>
          <span class="status-text">Active Simulation Session In Progress</span>
        </div>
        <div class="modality-tag" [class.audio]="simService.modality() === 'audio'">
          <span class="material-symbols-outlined">
            {{ simService.modality() === 'audio' ? 'mic' : 'keyboard' }}
          </span>
          {{ simService.modality() === 'audio' ? 'Live Audio Stream' : 'Text Dialogue Terminal' }}
        </div>
      </div>

      <div class="scenario-banner">
        <span class="scenario-label">Current Scenario:</span>
        <p class="scenario-text">"{{ simService.scenarioText() }}"</p>
      </div>

      <!-- Dialogue Mock Canvas -->
      <div class="dialogue-canvas">
        <div class="ai-turn">
          <div class="avatar ai-avatar">
            <span class="material-symbols-outlined">smart_toy</span>
          </div>
          <div class="bubble ai-bubble">
            <div class="speaker-meta">AI Counterpart (Persona Loaded)</div>
            <p *ngIf="simService.modality() === 'text'">
              "Thanks for meeting today. I reviewed the numbers you sent over regarding the Principal Architect expectations. Walk me through how you arrived at this baseline."
            </p>
            <p *ngIf="simService.modality() === 'audio'">
              [Audio channel initialized. Speaking counterpart is listening for your opening statement. Press and speak into your microphone...]
            </p>
          </div>
        </div>

        <div class="user-turn">
          <div class="bubble user-bubble">
            <div class="speaker-meta">Your Response (Awaiting Input)</div>
            <div class="typing-indicator" *ngIf="simService.modality() === 'text'">
              <span></span><span></span><span></span>
            </div>
            <div class="audio-waveform" *ngIf="simService.modality() === 'audio'">
              <span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>
            </div>
          </div>
          <div class="avatar user-avatar">
            <span class="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>

      <div class="runner-footer">
        <button type="button" class="btn-cancel" (click)="simService.cancelTesting()">
          <span class="material-symbols-outlined">stop_circle</span>
          End & Discard Session
        </button>
        <button type="button" class="btn-complete" routerLink="/simulation-detail">
          <span class="material-symbols-outlined">insights</span>
          Finish & View Analytics
        </button>
      </div>
    </div>
  `,
  styles: [`
    .runner-card {
      background: #ffffff;
      border: 2px solid #4f46e5;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.12);
      margin-bottom: 2.5rem;
    }
    .runner-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 1.6s infinite;
    }
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }
    .status-text {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #111827;
    }
    .modality-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: #eef2ff;
      color: #4f46e5;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 600;
    }
    .modality-tag.audio {
      background: #fef2f2;
      color: #dc2626;
    }
    .scenario-banner {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.875rem 1.25rem;
      margin-bottom: 1.5rem;
    }
    .scenario-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }
    .scenario-text {
      margin: 0.25rem 0 0 0;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1f2937;
    }
    .dialogue-canvas {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: #fafafa;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.75rem;
    }
    .ai-turn, .user-turn {
      display: flex;
      gap: 0.875rem;
      align-items: flex-start;
    }
    .user-turn {
      justify-content: flex-end;
    }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ai-avatar {
      background: #4f46e5;
      color: #ffffff;
    }
    .user-avatar {
      background: #e5e7eb;
      color: #4b5563;
    }
    .bubble {
      max-width: 75%;
      padding: 0.875rem 1.125rem;
      border-radius: 12px;
      font-size: 0.9375rem;
      line-height: 1.45;
    }
    .ai-bubble {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      color: #1f2937;
    }
    .user-bubble {
      background: #4f46e5;
      color: #ffffff;
    }
    .speaker-meta {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.375rem;
      opacity: 0.7;
    }
    .bubble p {
      margin: 0;
    }
    .typing-indicator span {
      display: inline-block;
      width: 6px;
      height: 6px;
      background-color: #ffffff;
      border-radius: 50%;
      margin: 0 2px;
      opacity: 0.6;
      animation: blink 1.2s infinite ease-in-out both;
    }
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes blink {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    .audio-waveform {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 18px;
    }
    .wave-bar {
      width: 3px;
      height: 100%;
      background: #ffffff;
      border-radius: 2px;
      animation: wave 1s infinite ease-in-out alternate;
    }
    .wave-bar:nth-child(2) { animation-delay: 0.2s; }
    .wave-bar:nth-child(3) { animation-delay: 0.4s; }
    .wave-bar:nth-child(4) { animation-delay: 0.6s; }
    @keyframes wave {
      0% { height: 4px; }
      100% { height: 18px; }
    }
    .runner-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .btn-cancel {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: #ffffff;
      border: 1px solid #d1d5db;
      color: #ef4444;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
    }
    .btn-cancel:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }
    .btn-complete {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
    }
    .btn-complete:hover {
      background: #4338ca;
    }
  `]
})
export class TestingRunnerComponent {
  simService = inject(SimulationService);
}
