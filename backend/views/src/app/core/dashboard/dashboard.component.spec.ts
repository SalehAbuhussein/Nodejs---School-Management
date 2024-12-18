import { mockBreadcrumbService } from './components/breadcrumb/services/breadcrumb.service.mocks';
import { DashboardComponent } from './dashboard.component';
import { mockDashboardService } from './services/dashboard.service.mocks';

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    component = new DashboardComponent(mockDashboardService(), mockBreadcrumbService(), )
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
