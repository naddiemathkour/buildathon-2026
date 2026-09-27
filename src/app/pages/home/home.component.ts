import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SimulatorStepperComponent } from '../../components/simulator-stepper/simulator-stepper.component';
import { TestingRunnerComponent } from '../../components/testing-runner/testing-runner.component';
import { SimulationHistoryComponent } from '../../components/simulation-history/simulation-history.component';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SimulatorStepperComponent, 
    TestingRunnerComponent,
    SimulationHistoryComponent
  ],
  template: `
    <div class="page-container">
      <app-header></app-header>

      <main class="main-content">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="badge-pill">
            <span class="material-symbols-outlined badge-icon">neurology</span>
            High-Fidelity Behavioral Simulation
          </div>
          <h1 class="hero-title">Practice High-Stakes Social Scenarios Before They Happen</h1>
          <p class="hero-subtitle">
            Roleplay negotiations, high-pressure interviews, and delicate interpersonal conversations against adaptive AI personas. Get real-time behavioral insights and run unlimited repetitions.
          </p>
        </section>

        <!-- Stepper OR Active Testing Canvas -->
        <app-testing-runner *ngIf="simService.testingActive()"></app-testing-runner>
        <app-simulator-stepper *ngIf="!simService.testingActive()"></app-simulator-stepper>

        <!-- History is cleared / hidden when testing is active to make room for current simulation info -->
        <app-simulation-history *ngIf="!simService.testingActive()"></app-simulation-history>
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
      padding: 3rem 1.5rem 4rem 1.5rem;
      box-sizing: border-box;
    }
    .hero-section {
      text-align: center;
      margin-bottom: 2.75rem;
    }
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #4f46e5;
      padding: 0.3rem 0.875rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .badge-icon {
      font-size: 1.125rem;
    }
    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.03em;
      line-height: 1.2;
      margin: 0 0 1rem 0;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      color: #4b5563;
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.5;
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
    @media (max-width: 640px) {
      .hero-title {
        font-size: 1.875rem;
      }
      .hero-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class HomeComponent {
  simService = inject(SimulationService);
}
