import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-simulator-stepper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stepper-card">
      <!-- Stepper Progress Tracker -->
      <div class="step-tracker">
        <div class="step-item" [class.active]="currentStep() >= 1" [class.current]="currentStep() === 1">
          <div class="step-circle">1</div>
          <span class="step-label">Scenario Prompt</span>
        </div>
        <div class="step-line" [class.filled]="currentStep() >= 2"></div>
        <div class="step-item" [class.active]="currentStep() >= 2" [class.current]="currentStep() === 2">
          <div class="step-circle">2</div>
          <span class="step-label">Adaptive Context</span>
        </div>
        <div class="step-line" [class.filled]="currentStep() >= 3"></div>
        <div class="step-item" [class.active]="currentStep() >= 3" [class.current]="currentStep() === 3">
          <div class="step-circle">3</div>
          <span class="step-label">Modality & Launch</span>
        </div>
      </div>

      <!-- STEP 1: Scenario Definition -->
      <div *ngIf="currentStep() === 1" class="step-content">
        <div class="step-header">
          <h2 class="step-title">Describe the Social Scenario or Conversation You Want to Practice</h2>
          <p class="step-subtitle">Type your scenario or pick a preset to simulate challenging interpersonal dynamics.</p>
        </div>

        <div class="input-group">
          <textarea 
            [(ngModel)]="scenarioText" 
            placeholder="e.g., Practicing my salary negotiation with my hiring manager after receiving an offer..."
            rows="4"
            class="scenario-textarea">
          </textarea>
        </div>

        <!-- Presets -->
        <div class="presets-section">
          <span class="presets-title">Quick Presets:</span>
          <div class="presets-grid">
            <button type="button" class="preset-chip" (click)="applyPreset('Salary negotiation for a Senior Engineer role with a counter-offer in hand')">
              <span class="material-symbols-outlined chip-icon">payments</span>
              Salary Negotiation
            </button>
            <button type="button" class="preset-chip" (click)="applyPreset('First date at a quiet lounge: balancing genuine questions, listening, and sharing personal stories')">
              <span class="material-symbols-outlined chip-icon">favorite</span>
              First Date
            </button>
            <button type="button" class="preset-chip" (click)="applyPreset('Job interview for an Engineering Manager position focusing on leadership and conflict resolution')">
              <span class="material-symbols-outlined chip-icon">work</span>
              Behavioral Interview
            </button>
            <button type="button" class="preset-chip" (click)="applyPreset('Setting healthy interpersonal boundaries with a roommate about shared space and cleanliness')">
              <span class="material-symbols-outlined chip-icon">home</span>
              Roommate Boundaries
            </button>
            <button type="button" class="preset-chip" (click)="applyPreset('Delivering constructive critical feedback on missed deliverables to a sensitive peer teammate')">
              <span class="material-symbols-outlined chip-icon">diversity_3</span>
              Peer Feedback
            </button>
            <button type="button" class="preset-chip" (click)="applyPreset('Networking at a major tech conference with an influential startup founder during an after-party')">
              <span class="material-symbols-outlined chip-icon">celebration</span>
              Conference Networking
            </button>
          </div>
        </div>

        <div class="step-actions right">
          <button 
            type="button" 
            class="btn-primary" 
            [disabled]="!scenarioText.trim()" 
            (click)="goToStep2()">
            Continue to Context
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- STEP 2: Adaptive Context -->
      <div *ngIf="currentStep() === 2" class="step-content">
        <div class="step-header">
          <div class="domain-tag">
            <span class="material-symbols-outlined domain-icon">psychology_alt</span>
            <span>Detected Context: <strong>{{ domainLabel() }}</strong></span>
          </div>
          <h2 class="step-title">Ground the AI with Real Context</h2>
          <p class="step-subtitle">Provide details so your simulation counterpart acts and responds with realistic precision.</p>
        </div>

        <!-- Conditional Domain 1: Interview -->
        <div *ngIf="detectedDomain() === 'interview'" class="domain-fields">
          <div class="form-field">
            <label class="field-label">Target Role & Company / Job Description</label>
            <textarea [(ngModel)]="contextFields.jobDescription" rows="3" class="context-textarea" placeholder="Paste the job description, key responsibilities, or company name..."></textarea>
          </div>
          <div class="form-field">
            <label class="field-label">Your Resume Summary / Key Qualifications</label>
            <textarea [(ngModel)]="contextFields.resume" rows="3" class="context-textarea" placeholder="Paste relevant experience highlights or accomplishments..."></textarea>
          </div>
        </div>

        <!-- Conditional Domain 2: First Date -->
        <div *ngIf="detectedDomain() === 'date'" class="domain-fields">
          <div class="form-field">
            <label class="field-label">Date Profile & Interests</label>
            <textarea [(ngModel)]="contextFields.dateProfile" rows="3" class="context-textarea" placeholder="How you met, their interests, hobbies, vibe of the venue..."></textarea>
          </div>
          <div class="form-field">
            <label class="field-label">Your Boundary / Topics to Avoid or Highlight</label>
            <textarea [(ngModel)]="contextFields.dateBoundaries" rows="3" class="context-textarea" placeholder="e.g., Avoid past relationships, want to talk about travel and art..."></textarea>
          </div>
        </div>

        <!-- Conditional Domain 3: Generic / Interpersonal -->
        <div *ngIf="detectedDomain() === 'interpersonal' || detectedDomain() === 'generic'" class="domain-fields">
          <div class="form-field">
            <label class="field-label">Counterpart Background & Relationship Dynamics</label>
            <textarea [(ngModel)]="contextFields.relationship" rows="3" class="context-textarea" placeholder="Who are they, what is your history, what are their potential defense mechanisms?"></textarea>
          </div>
          <div class="form-field">
            <label class="field-label">Your Core Objective & Non-Negotiables</label>
            <textarea [(ngModel)]="contextFields.objective" rows="3" class="context-textarea" placeholder="What is your desired outcome, and what lines will you not cross?"></textarea>
          </div>
        </div>

        <div class="step-actions split">
          <button type="button" class="btn-secondary" (click)="currentStep.set(1)">
            <span class="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <button type="button" class="btn-primary" (click)="goToStep3()">
            Select Simulation Mode
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- STEP 3: Modality Selection -->
      <div *ngIf="currentStep() === 3" class="step-content">
        <div class="step-header">
          <h2 class="step-title">Choose Your Simulation Modality</h2>
          <p class="step-subtitle">Select how you want to conduct your interactive roleplay.</p>
        </div>

        <div class="modality-grid">
          <!-- Text Modality Card -->
          <div 
            class="modality-card" 
            [class.selected]="selectedModality() === 'text'"
            (click)="selectedModality.set('text')">
            <div class="modality-icon-wrapper">
              <span class="material-symbols-outlined modality-icon">keyboard</span>
            </div>
            <div class="modality-info">
              <h3 class="modality-title">Text-Based Dialogue</h3>
              <p class="modality-desc">Interactive back-and-forth chat. Perfect for drafting phrasing, reviewing nuances, and paced thinking.</p>
              <div class="modality-badge">Recommended for Deep Strategy</div>
            </div>
            <div class="selection-indicator">
              <span class="material-symbols-outlined indicator-icon">
                {{ selectedModality() === 'text' ? 'radio_button_checked' : 'radio_button_unchecked' }}
              </span>
            </div>
          </div>

          <!-- Audio Modality Card -->
          <div 
            class="modality-card" 
            [class.selected]="selectedModality() === 'audio'"
            (click)="selectedModality.set('audio')">
            <div class="modality-icon-wrapper audio">
              <span class="material-symbols-outlined modality-icon">mic</span>
            </div>
            <div class="modality-info">
              <h3 class="modality-title">Voice & Audio Recording</h3>
              <p class="modality-desc">Real-time spoken conversation. Analyzes vocal tone, pacing, filler words, and high-pressure spontaneous replies.</p>
              <div class="modality-badge audio">Real-World Immersion</div>
            </div>
            <div class="selection-indicator">
              <span class="material-symbols-outlined indicator-icon">
                {{ selectedModality() === 'audio' ? 'radio_button_checked' : 'radio_button_unchecked' }}
              </span>
            </div>
          </div>
        </div>

        <div class="step-actions split">
          <button type="button" class="btn-secondary" (click)="currentStep.set(2)">
            <span class="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <button type="button" class="btn-launch" (click)="launchSimulation()">
            <span class="material-symbols-outlined">play_circle</span>
            Begin Simulation Session
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stepper-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      padding: 2.25rem;
      margin-bottom: 2.5rem;
    }
    .step-tracker {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
      gap: 0.75rem;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.45;
      transition: all 0.2s ease;
    }
    .step-item.active {
      opacity: 1;
    }
    .step-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e5e7eb;
      color: #374151;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
    }
    .step-item.active .step-circle {
      background: #4f46e5;
      color: #ffffff;
    }
    .step-item.current .step-circle {
      box-shadow: 0 0 0 4px #e0e7ff;
    }
    .step-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
    }
    .step-line {
      flex: 0 1 60px;
      height: 2px;
      background: #e5e7eb;
      border-radius: 9999px;
      transition: background 0.2s ease;
    }
    .step-line.filled {
      background: #4f46e5;
    }
    .step-header {
      margin-bottom: 1.5rem;
    }
    .step-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    .step-subtitle {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0;
    }
    .scenario-textarea, .context-textarea {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      padding: 1rem;
      font-family: inherit;
      font-size: 0.9375rem;
      color: #111827;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .scenario-textarea:focus, .context-textarea:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }
    .presets-section {
      margin-top: 1.25rem;
    }
    .presets-title {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #4b5563;
      margin-bottom: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .presets-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .preset-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 9999px;
      padding: 0.4rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .preset-chip:hover {
      background: #eef2ff;
      border-color: #c7d2fe;
      color: #4f46e5;
    }
    .chip-icon {
      font-size: 1rem;
      color: #4f46e5;
    }
    .domain-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      margin-bottom: 0.75rem;
    }
    .domain-icon {
      font-size: 1.125rem;
    }
    .domain-fields {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .field-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.375rem;
    }
    .modality-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .modality-card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      cursor: pointer;
      position: relative;
      background: #ffffff;
      transition: all 0.2s ease;
    }
    .modality-card:hover {
      border-color: #c7d2fe;
      background: #fafafa;
    }
    .modality-card.selected {
      border-color: #4f46e5;
      background: #f5f7ff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
    }
    .modality-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #eef2ff;
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .modality-icon-wrapper.audio {
      background: #fef2f2;
      color: #ef4444;
    }
    .modality-icon {
      font-size: 1.5rem;
    }
    .modality-info {
      flex: 1;
    }
    .modality-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.375rem 0;
    }
    .modality-desc {
      font-size: 0.84375rem;
      color: #4b5563;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
    }
    .modality-badge {
      display: inline-block;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: #e0e7ff;
      color: #4338ca;
    }
    .modality-badge.audio {
      background: #fee2e2;
      color: #b91c1c;
    }
    .indicator-icon {
      color: #4f46e5;
      font-size: 1.375rem;
    }
    .step-actions {
      display: flex;
      align-items: center;
      margin-top: 1.75rem;
    }
    .step-actions.right {
      justify-content: flex-end;
    }
    .step-actions.split {
      justify-content: space-between;
    }
    .btn-primary, .btn-secondary, .btn-launch {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-primary {
      background: #4f46e5;
      color: #ffffff;
      border: none;
    }
    .btn-primary:hover:not(:disabled) {
      background: #4338ca;
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: #ffffff;
      border: 1px solid #d1d5db;
      color: #374151;
    }
    .btn-secondary:hover {
      background: #f9fafb;
    }
    .btn-launch {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    }
    .btn-launch:hover {
      background: #047857;
      box-shadow: 0 6px 10px rgba(16, 185, 129, 0.3);
    }
    @media (max-width: 640px) {
      .modality-grid {
        grid-template-columns: 1fr;
      }
      .step-tracker {
        display: none;
      }
    }
  `]
})
export class SimulatorStepperComponent {
  private simService = inject(SimulationService);

  currentStep = signal<number>(1);
  scenarioText = '';
  selectedModality = signal<'text' | 'audio'>('text');
  detectedDomain = signal<string>('generic');

  contextFields = {
    jobDescription: '',
    resume: '',
    dateProfile: '',
    dateBoundaries: '',
    relationship: '',
    objective: ''
  };

  applyPreset(text: string) {
    this.scenarioText = text;
  }

  goToStep2() {
    if (!this.scenarioText.trim()) return;
    const lower = this.scenarioText.toLowerCase();
    if (lower.includes('interview') || lower.includes('job') || lower.includes('offer') || lower.includes('salary') || lower.includes('hire') || lower.includes('role')) {
      this.detectedDomain.set('interview');
    } else if (lower.includes('date') || lower.includes('lounge') || lower.includes('relationship') || lower.includes('romance') || lower.includes('partner')) {
      this.detectedDomain.set('date');
    } else {
      this.detectedDomain.set('interpersonal');
    }
    this.currentStep.set(2);
  }

  goToStep3() {
    this.currentStep.set(3);
  }

  domainLabel(): string {
    const d = this.detectedDomain();
    if (d === 'interview') return 'Professional & Career Interview';
    if (d === 'date') return 'Interpersonal & Romantic Date';
    return 'Interpersonal Dynamics & Negotiation';
  }

  launchSimulation() {
    this.simService.startTesting(
      this.scenarioText,
      this.selectedModality(),
      this.contextFields
    );
  }
}
