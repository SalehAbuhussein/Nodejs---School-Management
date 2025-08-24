import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((c) => c.DashboardComponent),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('../user/components/all-users/all-users.component').then((c) => c.AllUsersComponent),
      },
      {
        path: 'user/:userId',
        loadComponent: () => import('../user/components/view-user/view-user.component').then(c => c.ViewUserComponent),
      },
    ]
  },
];
