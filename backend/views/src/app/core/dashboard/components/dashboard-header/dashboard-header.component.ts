import { Component } from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent {
  constructor(public dashboardService: DashboardService) { }
}
