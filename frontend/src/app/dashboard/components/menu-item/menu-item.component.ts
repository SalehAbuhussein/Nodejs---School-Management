import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() text = 'Home';
  @Input() iconName = 'home';
  @Input() link = '';
}
