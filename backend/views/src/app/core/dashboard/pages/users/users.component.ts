import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { SweetAlert2Module, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { UsersService } from './services/users.service';

import { UserItemComponent } from './components/user-item/user-item.component';

import { FilterArrayPipe } from 'app/shared/pipes/filter-array.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FilterArrayPipe,
    FormsModule,
    ReactiveFormsModule,  
    SweetAlert2Module,
    UserItemComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('addSuccessModal') public readonly addSuccessSwal!: SwalComponent;
  @ViewChild('editSuccessModal') public readonly editSuccessSwal!: SwalComponent;
  @ViewChild('errorModal') public readonly errorModal!: SwalComponent;

  userForm;
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
    this.userService.getUsers().subscribe(value => {
      this.userService.userList = value.data;
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
   * Open User Edit Moda1:
   * 
   * (1) Fetch User Data.
   * (2) Update form inputs with fetched data.
   * 
   * @param userId user id
   * @param template template ref
   * @returns { void }
   */
  openUserEditModal = (userId: string, template: TemplateRef<void>): void => {
    this.userService.mode = 'update';
    this.userService.userId = userId;
    this.userService.getUser(userId).subscribe(({ data }) => {
      this.userForm.patchValue({
        name: data.name,
        username: data.username,
        email: data.email,
      });

      // if (data.profileImg) {
      //   this.profileImg = data.profileImg ?? '';
      // }
    });

    this.openModal(template);
  }

  /**
   * Open Add User Modal
   * 
   * @param template 
   */
  openAddUserModal = (template: TemplateRef<void>): void => {
    this.userService.mode = 'add';
    this.userService.userId = null;

    this.userForm.reset();
    this.openModal(template);
  };

  /**
   * Submit User Form to handle submit cases:
   * (1) Add User.
   * (2) Update User.
   * (3) Error handling.
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
  
    this.userService.save(formData).subscribe({
      next: value => {
        if (this.userService.mode === 'add') {
          this.modalRef?.hide()
          this.addSuccessSwal.fire();
          this.userForm.reset();
        }
      },
      error: error => {
        this.errorModal.fire();
        this.userForm.reset();
      }
    })
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
