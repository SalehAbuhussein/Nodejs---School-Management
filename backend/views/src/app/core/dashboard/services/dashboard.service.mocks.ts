import { DashboardService } from "./dashboard.service";

export function mockDashboardService(): DashboardService {
  return {
    isDashboardOpened: false,

    toggleDashboard: jasmine.createSpy('templateRefMock'),
  }
}