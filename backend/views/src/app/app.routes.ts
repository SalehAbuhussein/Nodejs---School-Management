import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardComponent } from './core/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () => import('./core/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
  }
];
