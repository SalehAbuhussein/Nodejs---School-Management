import { UsersService } from "./users.service";

import { mockHttpClient } from "app/shared/mocks/http-client.mocks";

export function mockUserService(): UsersService {
  return {
    mode: 'add',
    userId: null,
    userList: [],

    getUser: jasmine.createSpy('getUser'),
    getUsers: jasmine.createSpy('getUsers'),
    addUser: jasmine.createSpy('addUser'),
    deleteUser: jasmine.createSpy('deleteUser'),
    editUser: jasmine.createSpy('editUser'),
    save: jasmine.createSpy('save'),

    httpClient: mockHttpClient(),
  }
}