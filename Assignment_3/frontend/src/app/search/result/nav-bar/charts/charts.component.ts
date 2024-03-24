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
      data: [[0]]
    }, {
      type: 'column',
      name: 'Volume',
      data: [0],
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
    }]}; // Define the chart options type

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
          // data = {"ticker":"AAPL","queryCount":502,"resultsCount":502,"adjusted":true,"results":[{"v":71763761,"vw":169.3619,"o":169.15,"c":169,"h":170.73,"l":168.49,"t":1709787600000,"n":825405},{"v":76267041,"vw":171.5322,"o":169,"c":170.73,"h":173.7,"l":168.94,"t":1709874000000,"n":925213},{"v":60139473,"vw":172.9273,"o":172.94,"c":172.75,"h":174.38,"l":172.05,"t":1710129600000,"n":793618},{"v":59813522,"vw":172.8726,"o":173.15,"c":173.23,"h":174.03,"l":171.01,"t":1710216000000,"n":735065},{"v":52488692,"vw":171.3457,"o":172.77,"c":171.13,"h":173.185,"l":170.76,"t":1710302400000,"n":647120},{"v":72913507,"vw":173.0899,"o":172.91,"c":173,"h":174.3078,"l":172.05,"t":1710388800000,"n":806014},{"v":121752699,"vw":171.8002,"o":171.17,"c":172.62,"h":172.62,"l":170.285,"t":1710475200000,"n":771387},{"v":75606556,"vw":175.4587,"o":175.57,"c":173.72,"h":177.71,"l":173.52,"t":1710734400000,"n":866430},{"v":55215244,"vw":175.4779,"o":174.34,"c":176.08,"h":176.605,"l":173.03,"t":1710820800000,"n":636058},{"v":53423102,"vw":177.2239,"o":175.72,"c":178.67,"h":178.67,"l":175.09,"t":1710907200000,"n":641653}],"status":"DELAYED","request_id":"d8fe9246c8468da9d217206f2cf8cdfd","count":502}
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
  
      this.chartOptions = {
        rangeSelector: {
          selected: 2,
          inputEnabled: true,
          enabled: true

      },
        exporting: {
          enabled: false, // This will hide the context button
      },
      title: {
          text: 'AAPL Historical'
      },

      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
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

      series: [{
          type: 'candlestick',
          name: 'AAPL',
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

