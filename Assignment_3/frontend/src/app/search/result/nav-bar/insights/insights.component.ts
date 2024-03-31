
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { HttpClientModule } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import { HighchartsChartModule } from 'highcharts-angular';

HC_stock(Highcharts);

interface EarningData {
  actual: number;
  estimate: number;
  period: string;
  surprise: number;
}

interface EarningsResponse {
  earnings: EarningData[];
}

interface StockDetailsResponse {
  name: string;
  // other fields...
}

interface Recommendation {
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
  period: string; // assuming period is a string like "2024-03-01"
}

interface RecommendationResponse {
  recommendations: Recommendation[];
}

interface InsiderData {
  mspr: number;
  change: number;
}

interface AggregatedData {
  totalMSPR: number;
  positiveMSPR: number;
  negativeMSPR: number;
  totalChange: number;
  positiveChange: number;
  negativeChange: number;
}

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [HttpClientModule, CommonModule, HighchartsChartModule],
  providers: [BackendService],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})

export class InsightsComponent {
  stockSymbol: string = '';
  recommendation: any;
  insider: any;
  earning: any;
  totalMSPR: any;
  positiveMSPR: any;
  negativeMSPR: any;
  totalChange: any;
  positiveChange: any;
  negativeChange: any;
  companyName: any;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions1: Highcharts.Options = {series: [{
    data: [1, 2, 3, 4], // Example data
    type: 'line' // Specify the chart type
  },{
    data: [1, 2, 3, 4], // Example data
    type: 'line' // Specify the chart type
  },{
    data: [1, 2, 3, 4], // Example data
    type: 'line' // Specify the chart type
  },{
    data: [1, 2, 3, 4], // Example data
    type: 'line' // Specify the chart type
  },{data: [1, 2, 3, 4], // Example data
    type: 'line' // Specify the chart type
  }]}; // Define the chart options type

  chartOptions2: Highcharts.Options = {series: [{
    data: [1, 2, 3, 4], // Example data
    type: 'line' // Specify the chart type
  },{
    data: [1, 2, 3, 4], // Example data
    type: 'line' // Specify the chart type
  }]}; // Define the chart options type

  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
  ) {}

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

    this.backendService.recommend(ticker).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.createRecommendationChart(data);
          // console.log(data)
        } else {
          console.error('Data is not an array:', data);
        }
      },
      error: (error) => console.error('Failed to fetch recommendation data', error)
    });
    this.backendService.insider(ticker).subscribe({
      next: (data) => {
        this.insider = data;
        // console.log(this.insider);
        // New aggregation logic starts here
        const initialAggregate: AggregatedData = {
          totalMSPR: 0,
          positiveMSPR: 0,
          negativeMSPR: 0,
          totalChange: 0,
          positiveChange: 0,
          negativeChange: 0
        };
    
        const aggregated = this.insider.data.reduce((acc: AggregatedData, curr: InsiderData) => {
          acc.totalMSPR += curr.mspr;
          acc.totalChange += curr.change;
          if (curr.mspr > 0) {
            acc.positiveMSPR += curr.mspr;
          } else if (curr.mspr < 0) {
            acc.negativeMSPR += curr.mspr;
          }
          if (curr.change > 0) {
            acc.positiveChange += curr.change;
          } else if (curr.change < 0) {
            acc.negativeChange += curr.change;
          }
          return acc;
        }, initialAggregate);
    
        // Assuming you have properties to hold these aggregated values
        this.totalMSPR = aggregated.totalMSPR;
        this.positiveMSPR = aggregated.positiveMSPR;
        this.negativeMSPR = aggregated.negativeMSPR;
        this.totalChange = aggregated.totalChange;
        this.positiveChange = aggregated.positiveChange;
        this.negativeChange = aggregated.negativeChange;
    
        // console.log('Aggregated data:', aggregated);
      },
      error: (error) => console.error('Failed to fetch news data', error)
    });

    this.backendService.searchStock(ticker).subscribe({
      next: (response: StockDetailsResponse) => {
        this.companyName = response.name;
        // Handle other data...
      },
      error: (error) => console.error('Failed to fetch stock details', error)
    });

    this.backendService.earning(ticker).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.createEarningsChart(data);
        } else {
          console.error('Data is not an array:', data);
        }
      },
      error: (error) => console.error('Failed to fetch earnings data', error)
    });
  }
  updateFlag = false;

  createRecommendationChart(recommendations: Recommendation[]): void {
    const categories = recommendations.map(item => item.period.substring(0,7));
    const buy = recommendations.map(item => item.buy);
    const sell = recommendations.map(item => item.sell);
    const hold = recommendations.map(item => item.hold);
    const strongBuy = recommendations.map(item => item.strongBuy);
    const strongSell = recommendations.map(item => item.strongSell);
    this.chartOptions1 = {
      chart: {
        type: 'column',
        backgroundColor: 'rgb(248,248,248)',
      },
      title: {
        text: 'Recommendation Trends'
      },
      colors: ['rgb(49,98,57)', 'rgb(92, 190, 105)', 'rgb(187, 152, 59)', 'rgb(229,111,108)', 'rgb(130, 62,59)'],
      xAxis: {
        categories: categories
      },
      yAxis: {
        min: 0,
        title: {
          text: '# Analysis'
        },
        stackLabels: {
          enabled: false,
          style: {
            fontWeight: 'bold'
          }
        }
      },
      legend: {
        align: 'center', // Center the legend
        verticalAlign: 'bottom', // Move it to the bottom
        floating: false, // Disable floating
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Strong Buy',
        data: strongBuy,
        type: 'column',
        showInLegend: true
      }, {
        name: 'Buy',
        data: buy,
        type: 'column',
        showInLegend: true
      }, {
        name: 'Hold',
        data: hold,
        type: 'column',
        showInLegend: true
      }, {
        name: 'Sell',
        data: sell,
        type: 'column',
        showInLegend: true
      }, {
        name: 'Strong Sell',
        data: [strongSell],
        type: 'column',
        showInLegend: true
      }]

    };
    this.updateFlag = true;
  }

  
  createEarningsChart(earningsData: EarningData[]): void {
    console.log(earningsData)
    if (Array.isArray(earningsData)) {
      const actualData = earningsData.map(data => ({
        y: data.actual !== null ? data.actual : 0,
        x: Date.parse(data.period),
        surprise: data.surprise !== null ? data.surprise : 0
      }));
      
      const estimateData = earningsData.map(data => ({
        y : data.estimate !== null ? data.estimate : 0, // Replace null with 0
        x: Date.parse(data.period)
      }));
      const categories = actualData.map(data => Highcharts.dateFormat('%Y-%m-%d', data.x) + '<br>Surprise: ' + data.surprise.toFixed(4));
      // console.log(categories)
      
      const dataObject = earningsData.map(data => ({
        estimate : data.estimate !== null ? data.estimate : 0, // Replace null with 0
        actual: data.actual !== null ? data.actual : 0,
        surprise: data.surprise !== null ? data.surprise : 0,
        x: Date.parse(data.period)
      }));

      const dataMerge = {
        actual: earningsData.map(item => item["actual"]),
        estimate: earningsData.map(item => item["estimate"]),
        period: earningsData.map(item => String(item["period"])),
        surprise: earningsData.map(item => item["surprise"]),
      };




      console.log(dataMerge)
      
    this.chartOptions2 = {
      chart: {
        type: 'spline',
        backgroundColor: 'rgb(248,248,248)',
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      xAxis: {
        type: 'category',
        categories: dataMerge.period,
        labels: {
          formatter: function () {
            return `<p style="text-align: center;">${this.value}<br>Surprise: ${dataMerge.surprise[this.pos]}</p>`;
          },
          useHTML: true
        }
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.key}</small><table>',
        pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
          '<td style="text-align: right"><b>{point.y}</b></td></tr>' +
          '<tr><td style="color: {series.color}">Surprise: </td>' +
          '<td style="text-align: right"><b>{point.surprise}</b></td></tr>',
        footerFormat: '</table>',
        valueDecimals: 2
      },
      series: [{
        name: 'Actual',
        data: dataMerge.actual,
        type: 'spline',
        showInLegend: true,
        zIndex: 1
      }, {
        name: 'Estimate',
        data: dataMerge.estimate,
        type: 'spline' ,
        showInLegend: true,
        zIndex: 0
      }]
    }
} else {
  console.error('Earnings data is not an array:', earningsData);
}
}
}

