import { Component, OnInit,OnDestroy } from '@angular/core';
// import * as Highcharts from 'highcharts/highstock';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
IndicatorsCore(Highcharts);
import VBP from 'highcharts/indicators/volume-by-price';
VBP(Highcharts);
import StockModule from 'highcharts/modules/stock';
StockModule(Highcharts)


interface OHLCPoint {
  x: number; // date in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumePoint {
  x: number; 
  y: number;
}
interface HistoricalData {
  results: [];
}
interface StockData {
  v:number,
  vw:number
  o:number,
  c:number,
  h:number,
  l:number,
  t:number,
  n:number
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  standalone: true,
  imports: [HighchartsChartModule]
})
export class ChartsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  isDataLoaded: boolean = false;
  ticker: string | null = " ";
  todayDate!: Date;
  formattedTodayDate!: string;
  startDate!: Date;
  formattedStartDate!: string;
  private paramMapSubscription?: Subscription;
  constructor(private route:ActivatedRoute, private http:HttpClient) {}

  // ngOnDestroy() {
  //   if (this.paramMapSubscription) {
  //     this.paramMapSubscription.unsubscribe();
  //   }
  // }

  ngOnInit() {
    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      const timezone = 'America/Los_Angeles';
      this.todayDate = moment().toDate();
      this.formattedTodayDate = moment(this.todayDate).format('YYYY-MM-DD');
      this.startDate = moment(this.todayDate).subtract(2, 'years').toDate();
      this.formattedStartDate = moment(this.startDate).format('YYYY-MM-DD');
      this.ticker = params.get('ticker');
    if (this.ticker?.toUpperCase() === "HOME") {
      return; 
    }
    this.http.get<HistoricalData>(`http://localhost:3000/chart/${this.ticker?.toUpperCase()}/${this.formattedStartDate}/${this.formattedTodayDate}`).subscribe(data => {
      const ohlc: OHLCPoint[] = [];
      const volume: VolumePoint[] = [];
      if (!this.ticker) {
        console.error('Ticker is required');
        return; 
      }
      data.results.forEach((result:StockData) => {
        ohlc.push({
          x: result.t, 
          open: result.o,
          high: result.h,
          low: result.l,
          close: result.c
        });

        volume.push({
          x: result.t,
          y: result.v
        });
      });
      this.updateChartData(this.ticker, ohlc, volume);
    }, error => {
      console.error('Error fetching data:', error);
    });
  });

  }
  updateChartData(ticker: string, ohlc: OHLCPoint[], volume: VolumePoint[]) {
    this.chartOptions = this.chartOptions = {
      rangeSelector: {
        selected: 5
      },
      chart: {
        backgroundColor: '#f2f2f2',
      },
      title: {
        text: `${ticker.toUpperCase()} Historical`
      },
      subtitle: {
        text: `${ticker.toUpperCase()} With SMA and Volume by Price technical indicators`
      },
      yAxis: [{
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      xAxis: {
        type: 'datetime',
      },
      time: {
        timezone: 'America/Los_Angeles'
      },
      series: [{
        type: 'candlestick',
          name: `${this.ticker?.toUpperCase()} Historical`,
          id: "p",
          zIndex: 2,
          data: ohlc
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      },{
        type: 'vbp',
        linkedTo: "p",
        params: {
            volumeSeriesID: 'volume'
        },
        dataLabels: {
            enabled: false
        },
        zoneLines: {
            enabled: false
        }
    }, {
        type: 'sma',
        linkedTo: "p",
        zIndex: 1,
        marker: {
            enabled: false
        }
    }],
    navigator: {
      enabled: true,
      series: {
        data: ohlc.map(point => [point.x, point.close]), 
      }
    }
    };
    this.isDataLoaded = true;
    
  }
}


