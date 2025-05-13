import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-no-header-footer',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './no-header-footer.component.html',
  styleUrl: './no-header-footer.component.scss'
})
export class NoHeaderFooterComponent {

}
