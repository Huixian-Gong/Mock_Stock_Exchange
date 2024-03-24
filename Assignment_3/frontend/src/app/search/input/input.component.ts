import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service'; // Ensure this path is correct
import { SharedService } from '../../services/shared.service'; // Ensure this path is correct
import { HttpClientModule } from '@angular/common/http'
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule], // Removed HttpClientModule as it's provided by BackendService
  providers: [BackendService] // Added SharedService
})
export class InputComponent {
  stockSymbol: string = '';

  constructor(
    private backendService: BackendService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Listen to route parameter changes
    this.route.paramMap.subscribe(params => {
      const ticker = params.get('ticker');
      if (ticker) {
        this.stockSymbol = ticker.toUpperCase();
        this.fetchData(this.stockSymbol); // Directly fetch data based on the ticker
      }
    });
  }

  onSubmit(): void {
    // Navigate only if it's a new search
    if (this.router.url !== `/search/${this.stockSymbol}`) {
      this.router.navigate(['/search', this.stockSymbol]);
    } else {
      this.fetchData(this.stockSymbol); // Otherwise, just fetch the data
    }
  }

  fetchData(ticker: string): void {
    forkJoin({
      stockData: this.backendService.searchStock(ticker),
      priceData: this.backendService.stockPrice(ticker),
      peersData: this.backendService.stockPeers(ticker)
    }).subscribe({
      next: (results) => {
        const combinedData = {
          stock: results.stockData,
          price: results.priceData,
          peers: results.peersData
        };
        this.sharedService.updateData(combinedData);
        // console.log('Combined Response from backend:', combinedData);
      },
      error: (error) => console.error('Error fetching data:', error)
    });
  }

  clearInput(): void {
    this.stockSymbol = '';
    this.sharedService.updateData(null);
  }
}


// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http'
// import { BackendService } from '../../services/backend.service'; // Update the path accordingly

// @Component({
//   selector: 'app-input',
//   templateUrl: './input.component.html',
//   styleUrls: ['./input.component.css'],
//   standalone: true,
//   imports: [FormsModule, HttpClientModule], // HttpClientModule is no longer needed here
//   providers: [BackendService] 
// })
// export class InputComponent {
//   stockSymbol: string = '';

//   // Inject BackendService into your component
//   constructor(private backendService: BackendService) {}

//   onSubmit(): void {
//     // Use the backend service to send the GET request
//     this.backendService.searchStock(this.stockSymbol).subscribe({
//       next: (response) => {
//         console.log('Response from backend:', response);
//         // Handle the response as needed
//       },
//       error: (error) => {
//         console.error('Error fetching data:', error);
//         // Handle any errors
//       }
//     });
//   }

//   clearInput(): void {
//     this.stockSymbol = '';
//   }
// }



// import { Component } from '@angular/core';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-input',
//   templateUrl: './input.component.html',
//   styleUrls: ['./input.component.css'],
//   standalone: true,
//   imports: [FormsModule, HttpClientModule] // Import HttpClientModule here
// })
// export class InputComponent {
//   stockSymbol: string = '';

//   // Inject HttpClient into your component
//   constructor(private http: HttpClient) {}

//   onSubmit(): void {
//     const apiUrl = `http://localhost:3000/search/${this.stockSymbol}`;
//     this.http.get(apiUrl).subscribe({
//       next: (response) => {
//         console.log('Response from backend:', response);
//         // Handle the response as needed
//       },
//       error: (error) => {
//         console.error('Error fetching data:', error);
//         // Handle any errors
//       }
//     });
//   }

//   clearInput(): void {
//     this.stockSymbol = '';
//   }
// }