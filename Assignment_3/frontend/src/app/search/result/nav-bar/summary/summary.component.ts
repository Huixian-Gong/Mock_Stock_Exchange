import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
// import * as Highcharts from 'highcharts';
import { formatDate } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BackendService } from '../../../../services/backend.service';
import * as Highcharts from 'highcharts/highstock';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
import { ActivatedRoute } from '@angular/router';




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
  imports: [CommonModule, RouterModule, HighchartsChartModule, HttpClientModule,],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  providers: [BackendService]
})

export class SummaryComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  private subscription: Subscription = new Subscription();
  Highcharts: typeof Highcharts = Highcharts; // Add this line
  chartOptions: Highcharts.Options = {}; // Define the chart options type
  change: number = 0
  stockSymbol: string = '';
  profile: any [] = [];
  peers: string [] = [];
  price: any [] = [];
  data: any = {profile: this.profile, peers: this.peers, price: this.price}

  constructor(private backendService: BackendService,
    private route: ActivatedRoute,) {}

    ngOnInit(): void {
      // Existing subscription to shared data...

      this.route.paramMap.subscribe(params => {
        const ticker = params.get('ticker');
        // console.log('news' + ticker)
        if (ticker) {
          this.stockSymbol = ticker.toUpperCase();
          this.fetchData(this.stockSymbol); // Directly fetch data based on the ticker
        }
      });
  
      this.chartOptions = {
        title: {
          text:''
        },navigator: {
          enabled: false
        },
        rangeSelector: {
          enabled: false
        },
        exporting: {
          enabled: false, // This will hide the context button
        },
          series: [{
            data: [], // Example data
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

    fetchData(ticker: string): void {
      this.backendService.searchStock(ticker).subscribe({
        next: (data) => {
          this.data.profile = data
          console.log(this.data)
        },
        error: (error) => console.error('Failed to fetch profile data', error)
      });
      this.backendService.stockPeers(ticker).subscribe({
        next: (data) => {
          this.data.peers = data;
          console.log(this.data)
        },
        error: (error) => console.error('Failed to fetch peers data', error)
      });
      this.backendService.stockPrice(ticker).subscribe({
        next: (data) => {
          this.data.price = data;
          console.log(this.data)
          this.fetchHourlyStockData();

        },
        error: (error) => console.error('Failed to fetch price data', error)
      });
    }
  
  
  fetchHourlyStockData(): void {
    if (!this.data) return;
  
    const ticker = this.stockSymbol;
    const to = new Date(this.data.price.t * 1000);
    // Example: determine 'from' and 'to' based on whether market is open or closed
    // Adjust the logic based on market hours and time zones
    const from = new Date(this.data.price.t * 1000);
    from.setDate(to.getDate() - 1);
    let fromFormatted = formatDate(from, 'yyyy-MM-dd', 'en-US');
    let toFormatted = formatDate(to, 'yyyy-MM-dd', 'en-US');
    // Call the service method to fetch data
    this.backendService.summaryChart(ticker, fromFormatted, toFormatted).subscribe({
      next: (data) => {
        this.updateChart(data)
        console.log(data)
      }, 
      error: (error) => console.error('Failed to fetch chart data', error)
    });
    this.change = this.data.price.d;
  }
  
  updateChart(apiData: any): void {
    // Assuming 'apiData.results' contains your stock data
    const seriesData = apiData.results.map((dataPoint: { t: number; c: number }) => {
      return [dataPoint.t, dataPoint.c]; // x: time in milliseconds, y: close price
    });
  
    this.chartOptions = {
      chart: {
        backgroundColor: 'rgb(248,248,248)',
      },
      rangeSelector: {
        selected: 1
      },
      title: {
        text: apiData.ticker + ' Hourly Price Variation',
        style: {
          color: 'rgb(180, 180, 180)' // Set the title color
        }
      },
      series: [{
        name: 'AAPL',
        data: seriesData,
        type: 'line',
        tooltip: {
          valueDecimals: 2
        },
        color: (this.change > 0) ? 'rgb(82,131,34)' : 'rgb(230,52,37)',
      }],
      xAxis: {
        type: 'datetime',
        startOnTick: true,
          endOnTick: true,
        
      },
      yAxis: {
        
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
    }
    };
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component gets destroyed
    this.subscription.unsubscribe();
  }
}
