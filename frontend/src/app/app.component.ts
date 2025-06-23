import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { UserService } from './core/auth/shared/services/user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    public userService: UserService,
  ) {}

  /**
   * Angular onInit lifecycle method
   */
  ngOnInit(): void {
    this.initializeComponent();
  }

  /**
   * Initialize Component Data
   */
  initializeComponent = () => {
    if (isPlatformBrowser(this.platformId)) {
      this.userService.getUserInfo().subscribe();
    }
  }
}
