import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { UserItemComponent } from './components/user-item/user-item.component';

import { FilterArrayPipe } from '../../../../shared/pipes/filter-array.pipe';

import { User } from './types/users.types';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FilterArrayPipe,
    FormsModule,
    ReactiveFormsModule,
    UserItemComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  userForm;
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
  modalRef?: BsModalRef;

  constructor(public modalService: BsModalService, public formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      profileImg: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Open modal using ngx-bootstrap 5
   * 
   * @param { TemplateRef<void> } template 
   */
  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered'
    });
  }
}
