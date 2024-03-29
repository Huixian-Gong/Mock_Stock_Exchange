import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../../services/backend.service';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import VBP from 'highcharts/indicators/volume-by-price';
import Exporting from 'highcharts/modules/exporting';
import { formatDate } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';



IndicatorsCore(Highcharts);
VBP(Highcharts);
Exporting(Highcharts);


@Component ({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css'],
    standalone: true,
    imports: [HighchartsChartModule],
    providers: [BackendService],
  })
  export class ChartsComponent implements OnInit{
    stockSymbol: string = '';
    currentTime: Date = new Date();

    constructor(
      private backendService: BackendService,
      private route: ActivatedRoute,
    ) {}

    Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    // Your chart options
    rangeSelector: {
      selected: 1,
      inputEnabled: true,
      buttons: []},
      series: [{
      type: 'candlestick',
      name: 'AAPL',
      data: [[0,0,0,0,0]]
    }, {
      type: 'column',
      name: 'Volume',
      data: [[0,0]],
      yAxis: 1
    }, {
      type: 'vbp',
      linkedTo: 'aapl',
      params: {
        volumeSeriesID: 'volume'
      },
      dataLabels: {
        enabled: false
      },
      zoneLines: {
          enabled: false
      }
    }]
  }; // Define the chart options type

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const ticker = params.get('ticker');
        if (ticker) {
          this.stockSymbol = ticker.toUpperCase();
          this.fetchData(this.stockSymbol); // Directly fetch data based on the ticker
        }
      });
    }
    
    fetchData(ticker: string): void {
      const to = new Date(this.currentTime.getTime());
      // Example: determine 'from' and 'to' based on whether market is open or closed
      // Adjust the logic based on market hours and time zones
      const from = new Date(this.currentTime.getTime());
      from.setFullYear(to.getFullYear() - 2);
      let fromFormatted = formatDate(from, 'yyyy-MM-dd', 'en-US');
      let toFormatted = formatDate(to, 'yyyy-MM-dd', 'en-US');

      this.backendService.chartTab(ticker, fromFormatted, toFormatted).subscribe({
        next: (data) => {
          data=data.results
          if (data && Array.isArray(data)) {
            this.createChart(data);
            // console.log(data)
          } else {
            console.error('Data is not an array:', data);
          }
        },
        error: (error) => console.error('Failed to fetch earnings data', error)
      });
    }
    createChart(data: any): void {

      const ohlc = data.map((item: any) => [
        item.t, // the date in milliseconds
        item.o, // open
        item.h, // high
        item.l, // low
        item.c  // close
      ]);
      const groupingUnits: [string, number[] | null][] = [
        ['week', [1]], 
        ['month', [1, 2, 3, 4, 6]],
      ];
      
      // console.log(ohlc)
  
      const volume = data.map((item: any) => [
        item.t, // the date
        item.v   // the volume
      ]);
      console.log(volume)
    
  
      this.chartOptions = {
        chart: {
          backgroundColor: 'rgb(248,248,248)',
          
        },

        rangeSelector: {
          selected: 2,
          inputEnabled: true,
          enabled: true,
      },
        exporting: {
          enabled: false, // This will hide the context button
      },
      title: {
          text: this.stockSymbol + ' Historical'
      },

      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        opposite: true,
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          }
      }, {
        opposite: true,
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
        ordinal: false,
        scrollbar: {
          enabled: true
        },
        dateTimeLabelFormats: {
          hour: '%H:%M'
        }
      }
      ,

      tooltip: {
          split: true
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: groupingUnits
          }
        }
      },
      legend: {
        enabled:false
      },
      series: [{
          type: 'candlestick',
          name: this.stockSymbol,
          id: 'aapl',
          zIndex: 2,
          data: ohlc,
          
      }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: 'aapl',
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
          linkedTo: 'aapl',
          zIndex: 1,
          marker: {
              enabled: false
          }
      }],
      navigator: {
        enabled: true,
        series: {
          data: ohlc.map((point: number[]) => [point[0], point[4]])
        }
      }
        // ... other chart configurations
      };
    }
    
  }


