import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SummaryComponent } from './summary/summary.component';
import { TopNewsComponent } from './top-news/top-news.component';
import { ChartsComponent } from './charts/charts.component';
import { InsightsComponent } from './insights/insights.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatTabsModule, SummaryComponent, TopNewsComponent, ChartsComponent, InsightsComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

}
