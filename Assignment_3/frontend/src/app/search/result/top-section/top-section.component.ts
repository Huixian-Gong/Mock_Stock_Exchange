import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { SharedService } from '../../../services/shared.service'; // Update the path accordingly
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http'
import { BackendService } from '../../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';    //need to import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';  //need to import
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';


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
  imports: [
    CommonModule, 
    HttpClientModule, 
    NgbModule,
    FormsModule,
    NgbAlertModule],
  providers: [BackendService],
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.css'] // Changed 'styleUrl' to 'styleUrls'
})

export class TopSectionComponent implements OnInit, OnDestroy {
  combinedData: CombinedData | null = null; // The property type is now the corrected CombinedData
  currentTime: Date = new Date();
  private subscription: Subscription = new Subscription();
  private updateInfoPriceSubscription: Subscription = new Subscription();
  isStarred: boolean = false; // Initial state of the star
  marketStatus: string = '';
  stockSymbol: string = '';
  balance: number = 0;
  marketOpen :boolean = false;
  increasing: boolean = false
  stockCount: number = 0;
  data: any;
  quantity: number = 0;
  totalCost: number = 0;
  private modalRef!: NgbModalRef;
  info: any;
  price: any;
  infoPrice: any;
  sufficientBalance: boolean = true;
  sufficientStock: boolean = true;




  constructor(
    private sharedService: SharedService,
    private backendService: BackendService,
    private route: ActivatedRoute,
    private modalWindow: NgbModal,
    private modalService: NgbModal
    ) {}

    @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert | undefined;
    private _success = new Subject<string>();
    successMessage = '';

    private _buy = new Subject<string>();
    buyMessage = '';

    private _fail = new Subject<string>();
    failMessage = '';

    private _watch = new Subject<string>();
    notWatch = '';

    toggleStar(): void {
      if (this.info && this.info.ticker) {
        const ticker = this.info.ticker;
        // Check the stock's presence in the database
        this.backendService.checkStock(this.stockSymbol).subscribe({
          next: (stockExists) => {
            if (stockExists==null || !(stockExists.watchlist) ) {
              this.backendService.addStock(this.stockSymbol).subscribe({
                next: (response) => {
                  console.log('Stock added to watchlist:', response);
                  this.isStarred = true; // Update local state to reflect the addition
                  this.showAlertFor(`${this.info.ticker} added to watchlist.`);
                },
                error: (error) => console.error('Error adding stock to watchlist', error)
              });
            } else {
              // If the stock exists, remove it
              this.backendService.removeStock(this.stockSymbol).subscribe({
                next: (response) => {
                  console.log('Stock removed from watchlist:', response);
                  this.isStarred = false; // Update local state to reflect the removal
                  this.notWatchAlertFor(`${this.info.ticker} removed from watchlist.`);
                },
                error: (error) => console.error('Error removing stock from watchlist', error)
              });
            }
          },
          error: (error) => console.error('Error checking stock in watchlist', error)
        });
      }
    }
  
    startAutoUpdateInfoPrice(ticker: string): void {
      // Clear any existing interval subscription to prevent multiple intervals
      this.updateInfoPriceSubscription.unsubscribe();
  
      // Immediately update info and price, then set up an interval to continue updating
      this.updateInfoPrice(ticker);
      this.updateInfoPriceSubscription = interval(15000).subscribe(() => {
        this.updateInfoPrice(ticker);
      });
    }
  
  
    calculateMarketStatus(): void {
      if (this.price && this.price.t) {
          const lastUpdateTimestamp = this.price.t * 1000; // Convert to milliseconds
          const currentTime = Date.now(); // Current time in milliseconds
          
          // Calculate the difference in minutes between the current time and the last update
          const differenceInMinutes = (currentTime - lastUpdateTimestamp) / (1000 * 60);
          
          // Assume the market is open if the difference is 5 minutes or less
          if (differenceInMinutes <= 5) {
              this.marketStatus = 'Market Open';
              this.marketOpen = true;
          } else {
            let fromFormatted = formatDate(this.price.t * 1000, 'yyyy-MM-dd HH:mm:ss', 'en-US');
              // Market is considered closed if more than 5 minutes have elapsed
              this.marketStatus = 'Market Closed ' + fromFormatted ;
              this.marketOpen = false;
          }

          if (this.price.d > 0 ) {
            this.increasing = true;
          } else {
            this.increasing = false;
          }
      } else {
          this.marketStatus = 'Market Status Unknown';
      }
  }

  public showAlertFor(message: string): void {
    this._success.next(`${message}`);
  }

  public showFailAlertFor(message: string): void {
    this._fail.next(`${message}`);
  }

  public BuySuccessAlertFor(message: string): void {
    this._buy.next(`${message}`);
  }

  public notWatchAlertFor(message: string): void {
    this._watch.next(`${message}`);
  }

  ngOnInit(): void {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
    this._fail.subscribe(message => this.failMessage = message);
    this._fail.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
    this._buy.subscribe(message => this.buyMessage = message);
    this._buy.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
    this._watch.subscribe(message => this.notWatch = message);
    this._watch.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });

    // this.route.paramMap.subscribe(params => {
    //   const ticker = params.get('ticker');
    //   if (ticker) {
    //     this.stockSymbol = ticker.toUpperCase();
    //     this.checkInitialStarState(this.stockSymbol);
    //   }
    // });
    
    this.route.paramMap.subscribe(params => {
      const ticker = params.get('ticker');
      if (ticker) {
        this.stockSymbol = ticker.toUpperCase();
        this.checkInitialStarState(this.stockSymbol);
        // Start or restart the auto-update process for the new ticker
        this.startAutoUpdateInfoPrice(this.stockSymbol);
      }
    });

    this.updateInfoPrice(this.stockSymbol)
    // Existing subscription to shared data...
    // this.subscription.add(
    //   this.sharedService.currentData$.subscribe((newData: CombinedData) => {
    //     this.combinedData = newData;
    //     console.log(this.combinedData)
    //     this.calculateMarketStatus(); // Call this method here
    //   })
    // );



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

  updateInfoPrice(ticker: string): void {
    if (!ticker) return;
    this.backendService.searchStock(this.stockSymbol).subscribe({
      next: (data:StockInfo) => {
        this.info = data;
        console.log(this.info)
      },
      error: (error) => console.error('Error fetching updated stock info', error)
    });
    this.backendService.stockPrice(this.stockSymbol).subscribe({
      next: (data:StockPrice) => {
        console.log(data)
        this.price = data;
        this.calculateMarketStatus();
      },
      error: (error) => console.error('Error fetching updated stock info', error)
    });
  }
  
  // New method to update stock count
  updateStockCountAfterTransaction(ticker: string): void {
    // Fetch or calculate the new stock count
    this.backendService.checkStock(ticker).subscribe({
      next: (stockInfo) => {
        this.stockCount = stockInfo.count || 0; // Update stockCount with the latest info
        this.isStarred = stockInfo.watchlist; // Update isStarred if needed
      },
      error: (error) => console.error('Error fetching updated stock info', error)
    });
  }

  checkInitialStarState(ticker: string): void {
    this.backendService.getBalance().subscribe({
      next: (response) => {
        this.balance = response; // Update local state to reflect the removal
      },
      error: (error) => console.error('Error removing stock from watchlist', error)
    });

    this.backendService.checkStock(ticker).subscribe({
      next: (stockInfo) => {
        this.stockCount = (stockInfo.count)
        // console.log(this.stockCount)
        this.isStarred = (stockInfo.watchlist);
      },
      error: (error) => console.error('Error checking initial stock state', error)
    });
  }

  openModal(content: TemplateRef<any>, stock: any) {
    this.data = stock;
    this.quantity = 0;
    this.totalCost = 0;
    this.sufficientBalance = true;
    this.sufficientStock = true;
    // Open the modal and save the reference
    this.modalRef = this.modalService.open(content);  
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component gets destroyed
    this.subscription.unsubscribe();
    this.updateInfoPriceSubscription.unsubscribe(); 
  }

  calculateTotal(act : string) {
    this.totalCost = this.quantity * this.price.c;
    if (act == 'buy') {
      if (this.totalCost > this.balance) {
        this.sufficientBalance = false;
      } else {
        this.sufficientBalance = true;
      }
    }
    if (act == 'sell') {
      if (this.stockCount < this.quantity) {
        this.sufficientStock = false;
      } else {
        this.sufficientStock = true;
      }
    }
    console.log('quantity  = ', this.quantity )
    
  }


  buyStock() {
    if (this.quantity > 0) {
      // ... your backend service call
      this.backendService.buyStock(this.info.ticker, this.quantity, this.price.c).subscribe({
        next: (response) => {
          console.log('Stock purchase successful:', response);
          
          this.updateStockCountAfterTransaction(this.info.ticker)
          // Check if modalRef is defined and then close the modal
          if (this.modalRef) {
            this.modalRef.close();
            // this.quantity = 0;
          }
          this.BuySuccessAlertFor(`${this.info.ticker} bought successfully.`);
          // this.quantity = 0;
        },
        error: (error) => {
          console.error('Error buying stock:', error);
          // Handle error (e.g., show an error message)
        }
      });
    } else {
      console.error('Quantity must be greater than 0');
      // Handle the error case
    }
  }

  sellStock() {
    if (this.quantity > 0) {
      // ... your backend service call
      this.backendService.sellStock(this.info.ticker, this.quantity, this.price.c).subscribe({
        next: (response) => {
          console.log('Stock selling successful:', response);
          this.updateStockCountAfterTransaction(this.info.ticker)
          // Check if modalRef is defined and then close the modal
          if (this.modalRef) {
            this.modalRef.close();
            // this.quantity = 0;
          }
          this.showFailAlertFor(`${this.info.ticker} sold successfully.`);
          // this.quantity = 0;
        },
        error: (error) => {
          console.error('Error selling stock:', error);
          // Handle error (e.g., show an error message)
        }
      });
    } else {
      console.error('Quantity must be greater than 0');
      // Handle the error case
    }
  }

}