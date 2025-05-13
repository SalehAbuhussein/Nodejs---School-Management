import { Routes } from "@angular/router";

import { DashboardStatisticsComponent } from "./components/dashboard-statistics/dashboard-statistics.component";

import { UsersComponent } from "./pages/users/users.component";

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardStatisticsComponent
  },
  {
    path: 'users',
    component: UsersComponent,
  },
];