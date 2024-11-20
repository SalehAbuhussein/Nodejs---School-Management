import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { BreadcrumbService } from './components/breadcrumb/services/breadcrumb.service';
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
export class DashboardComponent implements OnInit {
  constructor(
    public dashboardService: DashboardService,
    public breadcrumbService: BreadcrumbService,
  ) {}

  /**
   * Angular onInit lifecycle method
   * 
   * @returns { void }
   */
  ngOnInit(): void {
    this._intializeBreadcrumb();
  }

  /**
   * Initialize breadcrumb data
   * 
   * @returns { void }
   */
  _intializeBreadcrumb(): void {
    this.breadcrumbService.breadcrumbList = [
      {
        link: '#',
        text: 'Home',
      },
      {
        link: '',
        text: 'Dashboard'
      }
    ];
  }
}
