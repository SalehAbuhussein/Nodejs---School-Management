import { Component, EventEmitter, Input, Output } from '@angular/core';

import { UsersService } from 'app/core/dashboard/pages/users/services/users.service';

import { User } from 'app/core/dashboard/pages/users/types/users.types';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {
  @Input({ required: true }) user: User = {} as unknown as User;

  @Output() editUserModalOpened = new EventEmitter<string>();

  constructor(public userService: UsersService) {}

  /**
   * 
   */
  openEditUserModal(_id: string) {
    this.editUserModalOpened.emit(_id);
  }
}
