import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InsightsComponent } from './pages/insights/insights.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'simulation-detail',
    component: InsightsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
