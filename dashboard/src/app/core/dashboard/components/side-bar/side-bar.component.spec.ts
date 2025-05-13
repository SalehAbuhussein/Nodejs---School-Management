import { mockDashboardService } from 'app/core/dashboard/services/dashboard.service.mocks';

import { SideBarComponent } from './side-bar.component';

describe('SideBarComponent', () => {
  let component: SideBarComponent;

  beforeEach(() => {
    component = new SideBarComponent(mockDashboardService());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
