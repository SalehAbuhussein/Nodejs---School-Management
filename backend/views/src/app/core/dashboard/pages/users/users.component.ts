import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';

import { UsersService } from './services/users.service';

import { UserItemComponent } from './components/user-item/user-item.component';

import { FilterArrayPipe } from 'app/shared/pipes/filter-array.pipe';

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
export class UsersComponent implements OnInit, OnDestroy {
  userForm;
  userList: User[] = [];
  searchText = '';
  isLoading = false;
  profileImg?: File;

  modalRef?: BsModalRef;
  destory$ = new Subject<void>;

  constructor(
    public modalService: BsModalService, 
    public formBuilder: FormBuilder,
    public userService: UsersService,
    public httpClient: HttpClient,
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      profileImg: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * Angular onInit lifecycle method
   * 
   * @returns { void }
   */
  ngOnInit(): void {
    this.userForm.valueChanges.pipe(takeUntil(this.destory$)).subscribe(value => {
      console.log(value);
    });
  }

  /**
   * Open modal using ngx-bootstrap 5
   * 
   * @param { TemplateRef<void> } template 
   * @returns { void }
   */
  openModal(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered'
    });
  }

  /**
   * Add User
   * 
   * @returns { void }
   */
  onFormSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.userForm.get('name')?.value ?? '');
    formData.append('username', this.userForm.get('username')?.value ?? '');
    formData.append('email', this.userForm.get('email')?.value ?? '');
    formData.append('password', this.userForm.get('password')?.value ?? '');
    if (this.profileImg) {
      formData.append('profileImg', this.profileImg, this.profileImg.name);
    }
  
    this.userService.addUser(formData).subscribe(value => {
      console.log(value);
    });
  }

  /**
   * Upload profile image event handler
   * 
   * @param { Event } event
   * @returns { void }
   */
  onProfileImgUpload(event: Event): void {
    if ((event.target as HTMLInputElement).files?.[0]) {
      this.profileImg = (event.target as HTMLInputElement).files?.[0];
    }
  }

  /**
   * Angular onDestory lifecycle method
   * 
   * @returns { void }
   */
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
