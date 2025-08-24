import { Component } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatIconModule, MenuItemComponent, MatExpansionModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {}
