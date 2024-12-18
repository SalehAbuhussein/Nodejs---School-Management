import { UserItemComponent } from './user-item.component';

import { mockUserService } from '../../services/users.service.mocks';

describe('UserItemComponent', () => {
  let component: UserItemComponent;

  beforeEach(() => {
    component = new UserItemComponent(mockUserService());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
