import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  constructor(public dashboardService: DashboardService) {

  }
}
