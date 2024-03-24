import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../services/shared.service'; // Update the path accordingly
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http'
import { BackendService } from '../../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BuyStockDialogComponent } from './buy-stock-dialog/buy-stock-dialog.component';
import { SellStockDialogComponent } from './sell-stock-dialog/sell-stock-dialog.component';


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
  imports: [CommonModule, HttpClientModule, MatDialogModule, BuyStockDialogComponent,SellStockDialogComponent],
  providers: [BackendService],
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.css'] // Changed 'styleUrl' to 'styleUrls'
})

export class TopSectionComponent implements OnInit, OnDestroy {
  combinedData: CombinedData | null = null; // The property type is now the corrected CombinedData
  currentTime: Date = new Date();
  private subscription: Subscription = new Subscription();
  isStarred: boolean = false; // Initial state of the star
  marketStatus: string = '';
  stockSymbol: string = '';
  balance: number = 0;

  constructor(
    private sharedService: SharedService,
    private backendService: BackendService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    ) {}

    toggleStar(): void {
      if (this.combinedData && this.combinedData.stock.ticker) {
        const ticker = this.combinedData.stock.ticker;
        // Check the stock's presence in the database
        this.backendService.checkStock(this.stockSymbol).subscribe({
          next: (stockExists) => {
            if (stockExists==null || !(stockExists.watchlist) ) {
              this.backendService.addStock(this.stockSymbol).subscribe({
                next: (response) => {
                  console.log('Stock added to watchlist:', response);
                  this.isStarred = true; // Update local state to reflect the addition
                },
                error: (error) => console.error('Error adding stock to watchlist', error)
              });
            } else {
              // If the stock exists, remove it
              this.backendService.removeStock(this.stockSymbol).subscribe({
                next: (response) => {
                  console.log('Stock removed from watchlist:', response);
                  this.isStarred = false; // Update local state to reflect the removal
                },
                error: (error) => console.error('Error removing stock from watchlist', error)
              });
            }
          },
          error: (error) => console.error('Error checking stock in watchlist', error)
        });
      }
    }
  

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
    
    this.route.paramMap.subscribe(params => {
      const ticker = params.get('ticker');
      if (ticker) {
        this.stockSymbol = ticker.toUpperCase();
        this.checkInitialStarState(this.stockSymbol);
      }
    });
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

  openBuyDialog(): void {
    if (this.combinedData) {
      this.backendService.getBalance().subscribe({
        next: (response) => {
          // Assuming response contains the balance directly
          // Make sure this aligns with your backend response structure
          this.balance = response; // Update the balance state with the fetched balance
  
          // Open the dialog with the updated balance
          const dialogRef = this.dialog.open(BuyStockDialogComponent, {
            width: '250px',
            data: {
              stock: this.combinedData?.stock, // Assuming combinedData is not null here
              price: this.combinedData?.price,
              walletBalance: this.balance // Here you pass the updated balance
            }
          });
  
          dialogRef.afterClosed().subscribe(result => {
            // Actions after the dialog is closed, if necessary
          });
        },
        error: (error) => {
          console.error('Error fetching balance', error);
          // Handle error
        }
      });
    }
  }

  openSellDialog(): void {
    if (this.combinedData) {
      this.backendService.getBalance().subscribe({
        next: (response) => {
          // Assuming response contains the balance directly
          // Make sure this aligns with your backend response structure
          this.balance = response; // Update the balance state with the fetched balance
  
          // Open the dialog with the updated balance
          const dialogRef = this.dialog.open(SellStockDialogComponent, {
            width: '250px',
            data: {
              stock: this.combinedData?.stock, // Assuming combinedData is not null here
              price: this.combinedData?.price,
              walletBalance: this.balance // Here you pass the updated balance
            }
          });
  
          dialogRef.afterClosed().subscribe(result => {
            // Actions after the dialog is closed, if necessary
          });
        },
        error: (error) => {
          console.error('Error fetching balance', error);
          // Handle error
        }
      });
    }
  }

  checkInitialStarState(ticker: string): void {
    this.backendService.getBalance().subscribe({
      next: (response) => {
        this.balance = response; // Update local state to reflect the removal
        console.log(this.balance)
      },
      error: (error) => console.error('Error removing stock from watchlist', error)
    });
  console.log(this.balance)
    this.backendService.checkStock(ticker).subscribe({
      next: (stockInfo) => {
        this.isStarred = (stockInfo.watchlist);
      },
      error: (error) => console.error('Error checking initial stock state', error)
    });
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

