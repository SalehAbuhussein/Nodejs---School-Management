import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserItemComponent } from './components/user-item/user-item.component';

import { FilterArrayPipe } from '../../../../shared/pipes/filter-array.pipe';

import { User } from './types/users.types';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FilterArrayPipe,
    FormsModule,
    UserItemComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  userList: User[] = [
    {
      id: '200',
      name: 'saleh',
      email: 'saleh@gmail.com',
      username: 'honkillerman',
      profileImg: 'https://placehold.co/50x50',
    },
    {
      id: '300',
      name: 'honkillerman',
      email: 'honkill@gmail.com',
      username: 'honkillerman',
      profileImg: 'https://placehold.co/50x50',
    }
  ];
  searchText = '';
}
