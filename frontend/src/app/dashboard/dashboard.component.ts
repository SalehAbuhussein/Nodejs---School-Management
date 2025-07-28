import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { HeaderService } from 'app/shared/layout/components/header/services/header.service';

import { SideMenuComponent } from "./components/side-menu/side-menu.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet,
    SideMenuComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(public headerService: HeaderService) {}
}
