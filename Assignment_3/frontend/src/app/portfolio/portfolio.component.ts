import { Component, OnInit, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../services/backend.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- Import 'map' operator from RxJS
import { NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';    //need to import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';  //need to import
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs/operators';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { popperGenerator } from '@popperjs/core';


interface Stock {
  ticker: string;
  name: string;
  quantity: number;
  avgCost: number;
  totalCost: number;
  change: number;
  currentPrice: number;
  marketValue: number;
}

interface Stock {
  ticker: string;
  watchlist: boolean;
  // Add other properties of the stock as needed
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, 
    HttpClientModule, 
    FormsModule, 
    NgbModule, 
    MatProgressSpinnerModule,
    NgbAlertModule],
  providers: [BackendService], // Ensure BackendService is provided if not globally available
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  walletBalance: number = 0; // Replace with actual dynamic value
  portfolio: any[] = []; // Replace with actual dynamic data
  stocksDetails: any[] = []; // This array will hold the combined details
  result: any[] = [];
  modalContent!: any;
  data: any;
  quantity: number = 0;
  totalCost: number = 0;
  private modalRef!: NgbModalRef;
  loading: boolean = false;
  sufficientBalance: boolean = true;
  sufficientStock: boolean = true;
  empty: boolean = false;
  sellAll: number = 0;
  

  
  constructor(private backendService: BackendService,
    private modalWindow: NgbModal,
    private modalService: NgbModal,
    private router: Router
    ) {}
  
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert | undefined;
  private _success = new Subject<string>();
  successMessage = '';
  

  private _fail = new Subject<string>();
  failMessage = '';

  public showAlertFor(message: string): void {
    this._success.next(`${message}`);
  }

  public showFailAlertFor(message: string): void {
    this._fail.next(`${message}`);
  }

  ngOnInit(): void {
    console.log("runned")
    this.loading = true
    this.refreshPortfolio();
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
    
  }
  

  refreshPortfolio(): void {
    // Load both the portfolio and the balance simultaneously
    forkJoin({
      portfolio: this.backendService.getPortfolio(),
      balance: this.backendService.getBalance()
      
    }).pipe(delay(3000)).subscribe({
      
      next: ({ portfolio, balance }) => {
        this.portfolio = portfolio;
        this.walletBalance = balance;
        if (portfolio.length != 0) {
          this.fetchStockDetails();
        } else {
          this.loading = false;
          this.empty = true;
        }
      },
      error: (error) => console.error('Error refreshing portfolio', error)
    });
    console.log(this.walletBalance)
  }

  loadPortfolio(): void {
    this.backendService.getPortfolio().subscribe((stocks: Stock[]) => {
      // Filter stocks to include only those with watchlist = true
      this.portfolio = stocks;
      console.log(this.portfolio);
      if (this.portfolio.length != 0) {
        this.fetchStockDetails();
        console.log('stockdetails: ', this.stocksDetails)
      } else {
        this.loading = false;
        this.empty = true;
        this.stocksDetails = [];
      }
      // this.fetchStockDetails(); // Fetch additional details for each stock
    });
    this.backendService.getBalance().subscribe((response) => {
      // Filter stocks to include only those with watchlist = true
      this.walletBalance = response
      console.log(this.walletBalance)
    });
  }

  fetchStockDetails(): void {
    // Map over the portfolio and create an array of Observables for additional stock details
    const requests: Observable<any>[] = this.portfolio.map(stock => {
      return forkJoin({
        stockData: this.backendService.searchStock(stock.ticker),
        priceData: this.backendService.stockPrice(stock.ticker),
      }).pipe(
        map(result => {
          // result is the combined result of stockData and priceData for each stock
          return {
            ticker: stock.ticker, // ticker from portfolio
            watchlist: stock.watchlist, // watchlist status from portfolio
            quantity: stock.count, // quantity from portfolio
            name: result.stockData.name, // name from stockData
            avgCost: parseFloat((stock.price / stock.count).toFixed(2)), // avgCost needs to be provided by the backend or calculated
            totalCost: parseFloat((stock.price).toFixed(2)), // Calculate totalCost based on quantity and avgCost
            change: parseFloat((result.priceData.c - stock.price / stock.count).toFixed(2)),// change from priceData
            c: parseFloat((result.priceData.c).toFixed(2)), // current price from priceData
            marketValue: parseFloat((stock.count * result.priceData.c).toFixed(2)) // Calculate marketValue
          };
        })
      );
    });
  
    // Use forkJoin to execute all requests simultaneously
    forkJoin(requests).subscribe(results => {
      // results will be an array of combined data for each stock
      this.stocksDetails = results;
      console.log('Stock Details:', this.stocksDetails);
      this.loading = false
    });
  }

  calculateTotal(act : string, price: number, count: number) {
    this.totalCost = this.quantity * price;
    if (act == 'buy') {
      if (this.totalCost > this.walletBalance) {
        this.sufficientBalance = false;
      } else {
        this.sufficientBalance = true;
      }
    }
    if (act == 'sell') {
      if (count < this.quantity) {
        this.sufficientStock = false;
      } else {
        this.sufficientStock = true;
      }
      if (count == this.quantity) {
        this.sellAll = 0;
      } else {
        this.sellAll = 1;
      }
    }

  }
  openModal(content: TemplateRef<any>, stock: any) {
    this.data = stock;
    // Open the modal and save the reference
    this.quantity = 0;
    this.totalCost = 0;
    this.sufficientBalance = true;
    this.sufficientStock = true;
    this.modalRef = this.modalService.open(content);  
  }

  buyStock() {
    if (this.quantity > 0) {
      // ... your backend service call
      this.backendService.buyStock(this.data.ticker, this.quantity, this.data.c).subscribe({
        next: (response) => {
          console.log('Stock purchase successful:', response);
          this.loadPortfolio()
          // Check if modalRef is defined and then close the modal
          
          if (this.modalRef) {
            this.modalRef.close();
            // this.quantity = 0;
            this.showAlertFor(`${this.data.ticker} bought successfully.`);
          }
          
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
      this.backendService.sellStock(this.data.ticker, this.quantity, this.data.c, this.sellAll).subscribe({
        next: (response) => {
          console.log('Stock selling successful:', response);
          this.loadPortfolio()
          // Check if modalRef is defined and then close the modal
          if (this.modalRef) {
            this.modalRef.close();
            // this.quantity = 0;
          }
          this.showFailAlertFor(`${this.data.ticker} sold successfully.`);
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

  route(ticker: string): void {
    this.router.navigate(['/search', ticker])

  }
}
