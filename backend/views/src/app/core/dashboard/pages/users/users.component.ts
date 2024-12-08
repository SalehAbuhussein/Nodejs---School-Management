import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';

import { UsersService } from './services/users.service';

import { UserItemComponent } from './components/user-item/user-item.component';

import { FilterArrayPipe } from '../../../../shared/pipes/filter-array.pipe';

import { User } from './types/users.types';
import { environment } from '../../../../../environments/environment.development';

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
      username: ['', Validators.required],
      email: ['', Validators.required],
      profileImg: ['', Validators.required],
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
   * 
   */
  onFormSubmit() {
    this.userService.addUser({
      name: this.userForm.get('name')?.value ?? '',
      username: this.userForm.get('username')?.value ?? '',
      email: this.userForm.get('email')?.value ?? '',
      profileImg: this.userForm.get('profileImg')?.value ?? '',
      password: this.userForm.get('password')?.value ?? '',
    }).subscribe(value => {
      console.log(value);
    })
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
