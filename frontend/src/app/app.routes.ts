import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './shared/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { Page404Component } from './core/components/page-404/page-404.component';

import { loginGuardGuard } from './core/auth/login/guards/login-guard.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./core/auth/auth.routes').then(r => r.authRoutes),
    canActivate: [loginGuardGuard],
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    loadChildren: () => import('./dashboard/dashboard.routes').then(r => r.dashboardRoutes),
  },
  {
    path: '**',
    component: Page404Component
  },
];
