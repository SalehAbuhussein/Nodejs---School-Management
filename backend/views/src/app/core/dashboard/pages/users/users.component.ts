import { Component } from '@angular/core';

import { BasicInputComponent } from "../../../../shared/inputs/basic-input/basic-input.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    BasicInputComponent
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
