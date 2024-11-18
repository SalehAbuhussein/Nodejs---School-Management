import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { DashboardService } from './services/dashboard.service';

import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    DashboardHeaderComponent,
    NgClass,
    RouterOutlet,
    SideBarComponent,
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(public dashboardService: DashboardService) {

  }
}
