import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    // Define your Highcharts configuration here
    // This should be similar to or the same as your summary component, depending on your needs
    series: [{
      data: [1, 2, 3, 4, 5],
      type: 'line'
    }]
  };
}