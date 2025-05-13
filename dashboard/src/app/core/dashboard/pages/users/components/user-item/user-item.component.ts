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
  @Output() userDeleteClicked = new EventEmitter<string>();

  constructor(public userService: UsersService) {}

  /**
   * Emit editUserModalOpened event
   * 
   * @param { string } _id
   * @returns { void }
   */
  openEditUserModal(_id: string): void {
    this.editUserModalOpened.emit(_id);
  }

  /**
   * Emit editUserModalOpened event
   * 
   * @param { string } _id
   * @returns { void }
   */
  openDeleteUserPrompt(_id: string): void {
    this.userDeleteClicked.emit(_id);
  }
}
