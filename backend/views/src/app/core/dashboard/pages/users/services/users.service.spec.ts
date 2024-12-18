

import { mockHttpClient } from 'app/shared/mocks/http-client.mocks';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(mockHttpClient());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
