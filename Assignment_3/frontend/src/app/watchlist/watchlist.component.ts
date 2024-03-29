import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { forkJoin, Observable, timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';


interface Stock {
  ticker: string;
  watchlist: boolean;
  // Add other properties of the stock as needed
}

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatProgressSpinnerModule],
  providers: [BackendService],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  watchlist: any[] = [];
  stocksDetails: any[] = []; // This array will hold the combined details
  loading: boolean = false;

  constructor(private backendService: BackendService,
    private router: Router) {}

    ngOnInit(): void {
    this.loading = true
    
    this.loadWatchlist();
    
  }

  loadWatchlist(): void {
    
    this.backendService.getFavorites().subscribe((stocks: Stock[]) => {
      // Filter stocks to include only those with watchlist = true
      this.watchlist = stocks.filter(stock => stock.watchlist === true);
      console.log(this.watchlist);
      this.fetchStockDetails(); // Fetch additional details for each stock
      
    });
  }

  fetchStockDetails(): void {
    // Map over the watchlist and create an array of Observables
    const requests: Observable<any>[] = this.watchlist.map(stock => {
      return forkJoin({
        stockData: this.backendService.searchStock(stock.ticker),
        priceData: this.backendService.stockPrice(stock.ticker)
      });
    });

    // Use forkJoin to execute all requests simultaneously
    forkJoin(requests).subscribe(results => {
      // results will be an array of responses
      this.stocksDetails = results.map(result => {
        return {
          ...result.stockData, // Spread stock data
          ...result.priceData  // Spread price data
        };
      });
      console.log('Stock Details:', this.stocksDetails);
      this.loading = false
    });
    
  }

  onRemoveStock(ticker: string): void {
    this.backendService.removeStock(ticker).subscribe(() => {
      // Remove the stock from the local watchlist
      this.watchlist = this.watchlist.filter(stock => stock.ticker !== ticker);
      // Also remove the stock from the stocksDetails
      this.stocksDetails = this.stocksDetails.filter(stock => stock.ticker !== ticker);
    });
  }

  route(ticker: string): void {
    this.router.navigate(['/search', ticker])

  }
}
