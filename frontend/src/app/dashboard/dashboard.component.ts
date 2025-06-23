import { Component } from '@angular/core';

import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardMenuComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
