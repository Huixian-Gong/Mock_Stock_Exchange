import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { HttpClientModule } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  imports: [HttpClientModule, CommonModule],
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
        this.recommendation = data
        console.log(this.recommendation);
      },
      error: (error) => console.error('Failed to fetch news data', error)
    });
    this.backendService.insider(ticker).subscribe({
      next: (data) => {
        this.insider = data;
        console.log(this.insider);
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
    
        console.log('Aggregated data:', aggregated);
      },
      error: (error) => console.error('Failed to fetch news data', error)
    });
    this.backendService.earning(ticker).subscribe({
      next: (data) => {
        this.earning = data
        console.log(this.earning);
      },
      error: (error) => console.error('Failed to fetch news data', error)
    });
  }
}
