import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './shared/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { Page404Component } from './core/components/page-404/page-404.component';

import { authGuard } from './core/auth/shared/guards/auth.guard';
import { loginGuard } from './core/auth/login/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./core/auth/auth.routes').then((r) => r.authRoutes),
    canActivate: [loginGuard],
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((r) => r.dashboardRoutes),
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: Page404Component,
  },
];
