import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  constructor(public dashboardService: DashboardService) {}
}
