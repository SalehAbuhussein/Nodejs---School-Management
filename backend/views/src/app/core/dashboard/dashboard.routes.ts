import { Routes } from "@angular/router";

import { DashboardStatisticsComponent } from "./components/dashboard-statistics/dashboard-statistics.component";
import { UserEditComponent } from "./pages/users/components/user-edit/user-edit.component";
import { UserViewComponent } from "./pages/users/components/user-view/user-view.component";
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
  {
    path: 'users/view',
    component: UserViewComponent,
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent,
  }
];