import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../../../services/backend.service';

interface StockInfo {
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  name: string;
  ticker: string;
  weburl: string;
}

export interface StockPrice {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}


@Component({
  selector: 'app-buy-stock-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buy-stock-dialog.component.html',
  styleUrl: './buy-stock-dialog.component.css',
  providers: [BackendService]
})
export class BuyStockDialogComponent {
  quantity: number = 0;
  totalCost: number = 0;
  walletBalance: number = 0;

  constructor(
    private backendService: BackendService,
    public dialogRef: MatDialogRef<BuyStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stock: StockInfo, price: StockPrice, walletBalance: number }
  ) {}

  ngOnInit() {
    this.walletBalance = this.data.walletBalance; // Assign the passed walletBalance to component property
    this.calculateTotal(); // Calculate initial total cost based on initial quantity
    console.log(this.data)
  }
  
  calculateTotal() {
    this.totalCost = this.quantity * this.data.price.c;
  }

  // buyStock() {
  //   // Logic to buy stock, you might want to call a method on your service here
  //   console.log(`Buying ${this.quantity} shares of ${this.data.stock.ticker}`);
  //   this.dialogRef.close();
  // }
  buyStock() {
    
    if (this.quantity > 0) {
      this.backendService.buyStock(this.data.stock.ticker, this.quantity, this.data.price.c).subscribe({
        next: (response) => {
          console.log('Stock purchase successful:', response);
          this.dialogRef.close(true); // Optionally, close the dialog with true to indicate a successful purchase
        },
        error: (error) => {
          console.error('Error buying stock:', error);
          // Handle error (e.g., show an error message)
        }
      });
    } else {
      console.error('Quantity must be greater than 0');
      // Optionally, indicate to the user that the quantity must be greater than 0
    }
  }
}

