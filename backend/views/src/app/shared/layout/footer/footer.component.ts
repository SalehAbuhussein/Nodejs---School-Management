import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  currentYear: number | null = null;

  /**
   * Angular onInit lifecycle method
   * 
   * @returns { void }
   */
  ngOnInit(): void {
    this.currentYear = (new Date().getFullYear());
  }
}
