import { Routes } from '@angular/router';

import { AppComponent } from './app.component';

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
    loadChildren: () => import('./core/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
  }
];
