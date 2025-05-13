import { Injectable } from '@angular/core';

import { Breadcrumb } from '../types/breadcrumb.types';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  breadcrumbList: Breadcrumb[] = [
    {
      link: '',
      text: '',
    }
  ];

  constructor() {}
}
