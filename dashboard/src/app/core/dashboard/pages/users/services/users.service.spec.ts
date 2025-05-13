

import { of } from 'rxjs';

import { UsersService } from './users.service';

import { AddUserResponse, DeleteUserResponse, EditUserResponse, GetUserResponse, GetUsersResponse } from '../types/users.types';

import { mockHttpClient } from 'app/shared/mocks/http-client.mocks';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(mockHttpClient());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    beforeEach(() => {
      (service.httpClient.get as jasmine.Spy).and.returnValue(of({
        data: [
          {
            _id: 'test12314',
            email: 'test@gmail.com',
            name: 'test',
            username: 'test',
            profileImg: 'testImg.png',
          },
          {
            _id: 'test465465',
            email: 'test2@gmail.com',
            name: 'test2',
            username: 'test2',
            profileImg: 'test2Img.png',
          }
        ],
        status: 200,
      } as GetUsersResponse))
    })

    it('should get all users data', () => {
      service.getUsers().subscribe(value => {
        expect(service.httpClient.get).toHaveBeenCalled();
        expect(value.data.length > 0).toBeTrue();
      });
    });
  });

  describe('getUser', () => {
    beforeEach(() => {
      (service.httpClient.get as jasmine.Spy).and.returnValue(of({
        data: {
          _id: 'test12314',
          email: 'test@gmail.com',
          name: 'test',
          username: 'test',
          profileImg: 'testImg.png',
        },
        status: 200,
      } as GetUserResponse));
    });

    it('should get user data (users/:userId)', () => {
      service.getUser('test12314').subscribe(value => {
        expect(service.httpClient.get).toHaveBeenCalled();
        expect(value.data._id).toBe('test12314');
        expect(value.data).toBeTruthy();
      });
    });
  });

  describe('addUser', () => {
    beforeEach(() => {
      (service.httpClient.post as jasmine.Spy).and.returnValue(of({
        data: {
          _id: 'test12345',
          email: 'test@gmail.com',
          name: 'test',
          username: 'testUsername',
          profileImg: 'profileImg.png',
        }
      } as AddUserResponse));
    });

    it('should call post request to add new user (/user/create)', () => {
      const formData: FormData = new FormData();
      formData.append('name', 'test');
      formData.append('username', 'testUsername');
      formData.append('email', 'test@gmail.com');
      formData.append('password', '1234');

      service.addUser(formData).subscribe(value => {
        expect(service.httpClient.post).toHaveBeenCalled();
      });
    });
  });

  describe('editUser', () => {
    beforeEach(() => {
      (service.httpClient.patch as jasmine.Spy).and.returnValue(of({
        data: {
          _id: 'test1234',
          email: 'test@gmail.com',
          name: 'test',
          username: 'testUsername',
          profileImg: 'profileImg.png',
        },
      } as EditUserResponse))
    });

    it('should call patch request to update user data', () => {
      service.userId = 'test1234';

      const formData: FormData = new FormData();
      formData.append('name', 'test');
      formData.append('username', 'testUsername');
      formData.append('email', 'test@gmail.com');
      formData.append('password', '1234');

      service.editUser(formData).subscribe(value => {
        expect(service.httpClient.patch).toHaveBeenCalled();
      });
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      (service.httpClient.delete as jasmine.Spy).and.returnValue(of({
        message: 'User deleted successfully!',
        error: null,
      } as DeleteUserResponse));
    })

    it('should call delete user request to delete user from database', () => {
      service.userId = 'test1234';

      service.deleteUser().subscribe(value => {
        expect(service.httpClient.delete).toHaveBeenCalled();
      });
    });
  });

  describe('save', () => {
    beforeEach(() => {
      spyOn(service, 'addUser');
      spyOn(service, 'editUser');
    });

    it('should add user when mode is new', () => {
      const formData: FormData = new FormData();
      formData.append('name', 'test');
      formData.append('username', 'testUsername');
      formData.append('email', 'test@gmail.com');
      formData.append('password', '1234');

      service.mode = 'add';

      service.save(formData);

      expect(service.addUser).toHaveBeenCalled();
    });

    it('should update user when mode is update', () => {
      const formData: FormData = new FormData();
      formData.append('name', 'test');
      formData.append('username', 'testUsername');
      formData.append('email', 'test@gmail.com');
      formData.append('password', '1234');

      service.mode = 'update';
      service.userId = 'test1234';

      service.save(formData);

      expect(service.editUser).toHaveBeenCalled();
    })
  })
});
