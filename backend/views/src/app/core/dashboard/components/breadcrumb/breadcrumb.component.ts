import { Component } from '@angular/core';

import { BreadcrumbService } from './services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  constructor(public breadcrumbService: BreadcrumbService) {}
}
