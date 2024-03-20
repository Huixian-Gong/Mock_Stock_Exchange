import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../services/shared.service'; // Update the path accordingly
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
}

@Component({
  selector: 'app-top-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.css'] // Changed 'styleUrl' to 'styleUrls'
})
export class TopSectionComponent implements OnInit, OnDestroy {
  combinedData: CombinedData | null = null; // The property type is now the corrected CombinedData
  currentTime: Date = new Date();
  private subscription: Subscription = new Subscription();

  constructor(private sharedService: SharedService) {}
  marketStatus: string = '';

  calculateMarketStatus(): void {
    if (this.combinedData && this.combinedData.price.t) {
        const lastUpdateTimestamp = this.combinedData.price.t * 1000; // Convert to milliseconds
        const currentTime = Date.now(); // Current time in milliseconds
        
        // Calculate the difference in minutes between the current time and the last update
        const differenceInMinutes = (currentTime - lastUpdateTimestamp) / (1000 * 60);
        
        // Assume the market is open if the difference is 5 minutes or less
        if (differenceInMinutes <= 5) {
            this.marketStatus = 'Market Open';
        } else {
            // Market is considered closed if more than 5 minutes have elapsed
            this.marketStatus = 'Market Closed';
        }
    } else {
        this.marketStatus = 'Market Status Unknown';
    }
}

  ngOnInit(): void {
    // Existing subscription to shared data...
    this.subscription.add(
      this.sharedService.currentData$.subscribe((newData: CombinedData) => {
        this.combinedData = newData;
        this.calculateMarketStatus(); // Call this method here
      })
    );

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


// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-top-section',
//   standalone: true,
//   imports: [],
//   templateUrl: './top-section.component.html',
//   styleUrl: './top-section.component.css'
// })
// export class TopSectionComponent {

// }

