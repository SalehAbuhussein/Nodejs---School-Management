import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';

import { filter, Subject, takeUntil } from 'rxjs';

import { CommonService } from './core/services/common/common.service';
import { UserService } from './core/auth/shared/services/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  destory$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    public commonService: CommonService,
    public location: Location,
    public router: Router,
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
    // debugger
    if (!this.commonService.isAuthGuardedRoute(this.location.path())) {
      this.userService.getUserInfo().subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.status === 200 && response.data) {
            this.userService.user = response.data;
          }
        },
        error: () => {
          console.log('Error getting user info');
        },
      });
    }
  }
}
