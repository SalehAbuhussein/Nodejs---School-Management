import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  isDashboardOpened = true;

  constructor() { }

  /**
   * 
   * @returns { void }
   */
  toggleDashboard(): void {
    this.isDashboardOpened = !this.isDashboardOpened;
  }
}
