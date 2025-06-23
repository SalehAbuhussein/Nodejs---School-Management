import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
