import { Component } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MenuItemComponent
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {

}
