import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../services/backend.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- Import 'map' operator from RxJS
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { BuyStockDialogComponent } from '../search/result/top-section/buy-stock-dialog/buy-stock-dialog.component';
import { SellStockDialogComponent } from '../search/result/top-section/sell-stock-dialog/sell-stock-dialog.component';


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
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [BackendService], // Ensure BackendService is provided if not globally available
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  walletBalance: number = 0; // Replace with actual dynamic value
  portfolio: any[] = []; // Replace with actual dynamic data
  stocksDetails: any[] = []; // This array will hold the combined details
  result: any[] = [];

  constructor(private backendService: BackendService,
    public dialog: MatDialog // Inject MatDialog service
    ) {}

  ngOnInit(): void {
    this.refreshPortfolio();
  }

  refreshPortfolio(): void {
    // Load both the portfolio and the balance simultaneously
    forkJoin({
      portfolio: this.backendService.getPortfolio(),
      balance: this.backendService.getBalance()
      
    }).subscribe({
      
      next: ({ portfolio, balance }) => {
        this.portfolio = portfolio;
        this.walletBalance = balance;
        this.fetchStockDetails();
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
      this.fetchStockDetails(); // Fetch additional details for each stock
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
        priceData: this.backendService.stockPrice(stock.ticker)
      }).pipe(
        map(result => {
          // result is the combined result of stockData and priceData for each stock
          return {
            ticker: stock.ticker, // ticker from portfolio
            watchlist: stock.watchlist, // watchlist status from portfolio
            quantity: stock.count, // quantity from portfolio
            name: result.stockData.name, // name from stockData
            avgCost: stock.price / stock.count, // avgCost needs to be provided by the backend or calculated
            totalCost: stock.price, // Calculate totalCost based on quantity and avgCost
            change: stock.count * result.priceData.c - stock.price, // change from priceData
            c: result.priceData.c, // current price from priceData
            marketValue: stock.count * result.priceData.c // Calculate marketValue
          };
        })
      );
    });
  
    // Use forkJoin to execute all requests simultaneously
    forkJoin(requests).subscribe(results => {
      // results will be an array of combined data for each stock
      this.stocksDetails = results;
      console.log('Stock Details:', this.stocksDetails);
    });
  }

  buy(stockItem: string): void {
    // First fetch the details for the current stock item
    forkJoin({
      stockData: this.backendService.searchStock(stockItem),
      priceData: this.backendService.stockPrice(stockItem),
    }).subscribe({
      next: ({ stockData, priceData }) => {
        // Open the buy stock dialog with the fetched data
        const dialogRef = this.dialog.open(BuyStockDialogComponent, {
          width: '250px',
          data: {
            stock: stockData,
            price: priceData, // Assuming priceData.c is the current price of the stock
            walletBalance: this.walletBalance
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
        // Call refreshPortfolio to update the component's state with the latest data
          this.refreshPortfolio();
        });
      },
      error: (error) => {
        console.error('Error fetching stock details:', error);
      }
    });
  }
  

  
  sell(stockItem: string): void {
    // First fetch the details for the current stock item
    forkJoin({
      stockData: this.backendService.searchStock(stockItem),
      priceData: this.backendService.stockPrice(stockItem),
    }).subscribe({
      next: ({ stockData, priceData }) => {
        // Open the sell stock dialog with the fetched data
        const dialogRef = this.dialog.open(SellStockDialogComponent, {
          width: '250px',
          data: {
            stock: stockData,
            price: priceData, // Assuming priceData.c is the current price of the stock
            walletBalance: this.walletBalance
          }
        });
  
        dialogRef.afterClosed().subscribe(result => {
        // Call refreshPortfolio to update the component's state with the latest data
          this.refreshPortfolio();
        });
      },
      error: (error) => {
        console.error('Error fetching stock details:', error);
      }
    });

  }
}
