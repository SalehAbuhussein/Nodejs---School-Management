import { Routes } from '@angular/router';

import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: MainLayoutComponent,
    loadChildren: () => import('./core/auth/auth.routes').then(r => r.authRoutes)
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.dashboardRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
