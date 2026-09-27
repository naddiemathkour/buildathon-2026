import { Injectable, signal } from '@angular/core';

export interface SimulationItem {
  id: string;
  scenario: string;
  modality: 'text' | 'audio';
  category: string;
  date: string;
  score: number;
  repetitionsCount: number;
  status: 'Completed' | 'In Progress';
}

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  scenarioText = signal<string>('');
  detectedDomain = signal<string>('generic');
  groundingContext = signal<{ [key: string]: string }>({});
  modality = signal<'text' | 'audio'>('text');
  testingActive = signal<boolean>(false);

  simulations = signal<SimulationItem[]>([
    {
      id: 'sim-1',
      scenario: 'High-Stakes Salary Negotiation with VP of Engineering for Principal Architect Offer',
      modality: 'text',
      category: 'Negotiation',
      date: 'Today, 2:15 PM',
      score: 92,
      repetitionsCount: 3,
      status: 'Completed'
    },
    {
      id: 'sim-2',
      scenario: 'First Date at a Quiet Lounge - Balancing Active Listening with Engaging Personal Stories',
      modality: 'audio',
      category: 'Interpersonal',
      date: 'Yesterday, 8:40 PM',
      score: 84,
      repetitionsCount: 2,
      status: 'Completed'
    },
    {
      id: 'sim-3',
      scenario: 'Cross-functional Conflict Resolution with Lead Product Manager over Q3 Roadmap Cuts',
      modality: 'text',
      category: 'Workplace',
      date: 'Sep 25, 11:30 AM',
      score: 79,
      repetitionsCount: 4,
      status: 'Completed'
    },
    {
      id: 'sim-4',
      scenario: 'Delivering Tough Feedback on Code Quality to Senior Peer Developer',
      modality: 'audio',
      category: 'Feedback',
      date: 'Sep 24, 4:10 PM',
      score: 88,
      repetitionsCount: 2,
      status: 'Completed'
    },
    {
      id: 'sim-5',
      scenario: 'Explaining Technical Debt vs Feature Velocity Tradeoffs to Non-Technical Founders',
      modality: 'text',
      category: 'Executive Comms',
      date: 'Sep 23, 10:15 AM',
      score: 91,
      repetitionsCount: 5,
      status: 'Completed'
    },
    {
      id: 'sim-6',
      scenario: 'Negotiating Co-Founder Equity Split and Vesting Acceleration Clause',
      modality: 'text',
      category: 'Negotiation',
      date: 'Sep 22, 3:00 PM',
      score: 74,
      repetitionsCount: 3,
      status: 'Completed'
    },
    {
      id: 'sim-7',
      scenario: 'Setting Boundaries with an Overreaching Roommate Regarding Shared Space Cleanliness',
      modality: 'audio',
      category: 'Interpersonal',
      date: 'Sep 21, 6:45 PM',
      score: 82,
      repetitionsCount: 1,
      status: 'Completed'
    },
    {
      id: 'sim-8',
      scenario: 'System Design Interview Screen with Staff Infrastructure Architect at Scale-Up',
      modality: 'text',
      category: 'Interview',
      date: 'Sep 20, 1:00 PM',
      score: 89,
      repetitionsCount: 3,
      status: 'Completed'
    },
    {
      id: 'sim-9',
      scenario: 'De-escalating an Irritable Enterprise Customer Experiencing Cloud Downtime',
      modality: 'audio',
      category: 'Customer Success',
      date: 'Sep 19, 9:20 AM',
      score: 95,
      repetitionsCount: 2,
      status: 'Completed'
    },
    {
      id: 'sim-10',
      scenario: 'Declining a High-Paying Job Offer Gracefully to Retain Professional Bridges',
      modality: 'text',
      category: 'Career',
      date: 'Sep 18, 5:15 PM',
      score: 87,
      repetitionsCount: 2,
      status: 'Completed'
    }
  ]);

  startTesting(scenario: string, modality: 'text' | 'audio', context: { [key: string]: string }) {
    this.scenarioText.set(scenario);
    this.modality.set(modality);
    this.groundingContext.set(context);
    this.testingActive.set(true);
  }

  cancelTesting() {
    this.testingActive.set(false);
  }
}
