import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../../services/shared.service'; // Update the path accordingly
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
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit, OnDestroy {
  combinedData: CombinedData | null = null; // The property type is now the corrected CombinedData
  currentTime: Date = new Date();
  private subscription: Subscription = new Subscription();

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    // Existing subscription to shared data...
    this.subscription.add(
      this.sharedService.currentData$.subscribe((newData: CombinedData) => {
        this.combinedData = newData;
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