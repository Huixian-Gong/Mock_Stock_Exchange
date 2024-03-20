import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatTabsModule, SummaryComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

}
