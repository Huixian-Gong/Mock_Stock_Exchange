import { Component, OnInit, ViewChild } from '@angular/core';
// import { InputComponent } from './input/input.component';
import { ResultComponent } from './result/result.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs/operators';
import { InputComponent } from './input/input.component';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';

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
  peers: string[]
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [InputComponent, ResultComponent, CommonModule, MatProgressSpinnerModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent implements OnInit {
  ticker: string = '';
  loading: boolean = false;
  exist: boolean = false;
  private subscription: Subscription = new Subscription();
  combinedData: CombinedData | null = null; // The property type is now the corrected CombinedData

  // @ViewChild(InputComponent) InputComponent!: InputComponent; // ViewChild to access TopSectionComponent

  constructor(private route: ActivatedRoute,
    private sharedService: SharedService,) {}

  ngOnInit(): void {
    console.log(this.combinedData)
    this.loading = true
    this.route.paramMap.subscribe(params => {
      const tickerValue = params.get('ticker');
      if (tickerValue) {
        this.ticker = tickerValue.toUpperCase(); // Update input box
        this.submitSearch(); // Auto-submit
      }
    });
    this.subscription.add(
      this.sharedService.currentData$.subscribe((newData: CombinedData) => {
        this.combinedData = newData;
        this.exist = this.combinedData.peers.length != 0
        this.loading = !(this.combinedData.peers.length == 0 || this.combinedData.peers.length != 0 )
      })
      
    );
    
      // console.log(this.combinedData)
  }

  
  submitSearch(): void {
    // Your search logic here, using this.ticker
    console.log(`Searching for ${this.ticker}`);
    // this.ngAfterViewInit();
  }
}
