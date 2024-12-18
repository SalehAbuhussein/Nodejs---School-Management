
import { of, throwError } from 'rxjs';

import { UsersComponent } from './users.component';

import { GetUsersResponse } from './types/users.types';

import { mockFormBuilder } from 'app/shared/mocks/form-builder.mocks';
import { mockHttpClient } from 'app/shared/mocks/http-client.mocks';
import { mockModalService } from 'app/shared/mocks/modal.service.mocks';
import { mockUserService } from './services/users.service.mocks';

describe('UsersComponent', () => {
  let component: UsersComponent;

  beforeEach(() => {
    component = new UsersComponent(
      mockModalService(), 
      mockFormBuilder(), 
      mockUserService(), 
      mockHttpClient()
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'initializeComponentData');
    });

    it('should call initializeComponentData', () => {
      component.ngOnInit();

      expect(component.initializeComponentData).toHaveBeenCalled();
    });
  });

  describe('initializeComponentData', () => {
    beforeEach(() => {
      (component.userService.getUsers as jasmine.Spy).and.returnValue(of(
        {
          data: [
            {
              _id: '8486as4d56',
              email: 'test@gmail.com',
              name: 'test',
              username: 'testito',
              profileImg: 'avatar.img'
            }
          ],
          status: 200
        } as GetUsersResponse
      ))
    });

    it('should fetch users data', () => {
      component.initializeComponentData();

      expect(component.userService.getUsers).toHaveBeenCalled();
      expect(component.userService.userList.length > 0).toBeTrue();
    });

    it('should assign empty usersList when API fails', () => {
      (component.userService.getUsers as jasmine.Spy).and.returnValue(throwError(() => 'api failure'));
      
      component.initializeComponentData();

      expect(component.userService.getUsers).toHaveBeenCalled();
      expect(component.userService.userList.length).toBe(0);
    });
  });

  describe('openModal', () => {
    it('should open modal using template reference', () => {
      const templateRefMock = jasmine.createSpyObj('TemplateRef', ['']);
      component.openModal(templateRefMock);

      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
});
