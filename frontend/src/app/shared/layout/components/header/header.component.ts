import { Component, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderService } from './services/header.service';
import { UserService } from 'app/core/auth/shared/services/user/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatSidenavModule, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    public headerService: HeaderService,
    public userService: UserService,
  ) {}
}
