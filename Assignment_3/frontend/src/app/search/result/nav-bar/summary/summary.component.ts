import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../../services/shared.service'; // Update the path accordingly
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { formatDate } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from '../../../../services/backend.service';

interface StockInfo {
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  name: string;
  ticker: string;
  weburl: string;
}

interface StockPrice {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

// CombinedData interface should match the structure of the combined data emitted
interface CombinedData {
  stock: StockInfo;   // Use lowercase 'stock', not 'StockInfo'
  price: StockPrice;  // Use lowercase 'price', not 'StockPrice'
  peers: string[];
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, HighchartsChartModule, HttpClientModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  providers: [BackendService]
})

export class SummaryComponent implements OnInit, OnDestroy {
  combinedData: CombinedData | null = null; // The property type is now the corrected CombinedData
  currentTime: Date = new Date();
  private subscription: Subscription = new Subscription();
  Highcharts: typeof Highcharts = Highcharts; // Add this line
  chartOptions: Highcharts.Options = {}; // Define the chart options type


  constructor(private backendService: BackendService,
    private sharedService: SharedService) {}
  
  fetchHourlyStockData(): void {
    if (!this.combinedData) return;
  
    const ticker = this.combinedData.stock.ticker;
    const to = new Date(this.combinedData.price.t * 1000);
    // Example: determine 'from' and 'to' based on whether market is open or closed
    // Adjust the logic based on market hours and time zones
    const from = new Date(this.combinedData.price.t * 1000);
    from.setDate(to.getDate() - 1);
    let fromFormatted = formatDate(from, 'yyyy-MM-dd', 'en-US');
    let toFormatted = formatDate(to, 'yyyy-MM-dd', 'en-US');
    // Call the service method to fetch data
    this.backendService.summaryChart(ticker, fromFormatted, toFormatted).subscribe({
      next: (data) => this.updateChart(data), // Data is processed and chart is updated
      error: (error) => console.error('Failed to fetch chart data', error)
    });
  }
  
  // updateChart(data: any): void {
  //   // Example: Update your Highcharts options based on the data
  //   this.chartOptions = {
  //     // Define chart options, series data extracted from the API response
  //   };
  // }

  updateChart(apiData: any): void {
    // Assuming 'apiData.results' contains your stock data
    const seriesData = apiData.results.map((dataPoint: { t: number; c: number }) => {
      return [dataPoint.t, dataPoint.c]; // x: time in milliseconds, y: close price
    });
  
    this.chartOptions = {
      chart: {
        type: 'line',
        backgroundColor: 'rgb(248,248,248)',
        
      },
      title: {
        text: apiData.ticker + ' Hourly Price Variation',
        style: {
          color: 'rgb(180, 180, 180)' // Set the title color
        }
      },
      xAxis: {
        type: 'datetime',
        endOnTick: true,
        startOnTick: true,
        showLastLabel: true,  // Ensure the last label is shown
        crosshair: {
          snap: true, // Optionally disable snapping to data points
          color: 'rgba(150, 150, 150, 0.8)', // Customize the crosshair color
          width: 1, // Customize the crosshair width,
          label: {
            enabled: true,
            backgroundColor: 'rgb(255,255,255)',
          }
        },
        scrollbar: {
          enabled: true
        },
      },
      yAxis: { 
        opposite: true,
        title: {
          text: '' ,
        },
        labels: {
          x: -20,
          y: -5
        },
        
      },
      series: [{
        type: 'line',
        name: apiData.ticker,
        data: seriesData,
        tooltip: {
          valueDecimals: 2,
          
        },
        marker: {
          enabled: false // Set enabled to false to remove the markers
      }
      }],
      time: {
        useUTC: false // Set to true or false depending on your data's timezone
      },
      legend: {
        enabled: false // Set legend to be hidden
    },
    tooltip: {
      formatter: function() {
          return '<hr style="border: 1px solid ' + this.series.color + '; width: 100%;">' +' <span style="color:' + this.series.color + '">&#9679;</span> '+apiData.ticker + ": " +this.point.y; // Customize the tooltip content here
      },
      positioner: function(labelWidth, labelHeight, point) {
        var tooltipX, tooltipY;

        tooltipX = point.plotX + this.chart.plotLeft + 20; // 10px to the right of the cursor
        tooltipY = point.plotY + this.chart.plotTop - labelHeight / 2;

        return { x: tooltipX, y: tooltipY };
        },
      },
    };
  }

  

  ngOnInit(): void {
    // Existing subscription to shared data...
    this.subscription.add(
      this.sharedService.currentData$.subscribe((newData: CombinedData) => {
        this.combinedData = newData;
        this.fetchHourlyStockData(); // Fetch hourly data when combinedData updates
      })
    );

    this.chartOptions = {
      series: [{
        data: [1, 2, 3, 4], // Example data
        type: 'line' // Specify the chart type
      }]
    };

    // Set up an interval to update the currentTime every 15 seconds
    const timeUpdateSubscription = interval(15000) // 15000 milliseconds
      .pipe(
        startWith(this.currentTime), // Emit the current time immediately
        map(() => new Date()) // Then emit a new Date object for each tick of the interval
      )
      .subscribe(time => {
        this.currentTime = time; // Update the currentTime property
      });

    // Add the timeUpdateSubscription to the subscriptions
    this.subscription.add(timeUpdateSubscription);
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component gets destroyed
    this.subscription.unsubscribe();
  }
}
