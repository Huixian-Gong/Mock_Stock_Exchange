import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BackendService } from '../../services/backend.service'; // Ensure this path is correct
import { SharedService } from '../../services/shared.service'; // Ensure this path is correct
import { HttpClientModule } from '@angular/common/http'
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';


interface Stock {
  description: string;
  displaySymbol: string;
}

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  standalone: true,
  imports: [FormsModule, 
    HttpClientModule, 
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule], // Removed HttpClientModule as it's provided by BackendService
  providers: [BackendService] // Added SharedService
})
export class InputComponent {
  stockSymbol: string = '';
  data : any;
  filteredStocks$: Observable<any[]> = of([]);
  private searchTerms = new Subject<string>();
  stockCtrl = new FormControl();
  loading: boolean = false;
  // selection: boolean = false;
  private intervalSubscription: Subscription = new Subscription();


  constructor(
    private backendService: BackendService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filteredStocks$ = this.stockCtrl.valueChanges.pipe(
      // debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        // If the term is not empty, initiate the search
        if (term) {
          this.loading = true; // Indicate loading
          // this.selection = false;
          return this.backendService.stockTicker(term);
        } else {
          // If the term is empty, clear the results and loading state
          this.loading = false; // No longer loading
          // this.selection = true;
          return of([]);
        }}),
      map((results: any) => {
        this.loading = false; // Data received, stop loading
        return results.result.filter((stock: any) =>
          stock.type === 'Common Stock' && !stock.displaySymbol.includes('.'));
      })
    );
    // Listen to route parameter changes
    this.route.paramMap.subscribe(params => {
      const ticker = params.get('ticker');
      if (ticker) {
        this.stockSymbol = ticker.toUpperCase();
        this.stockCtrl.setValue(this.stockSymbol); // Set the value in FormControl as well
        this.fetchData(this.stockSymbol);
      }
    });
  }
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement; // Safely cast the event target to HTMLInputElement
    this.onSearch(input.value); // Now you can safely access input.value
  }

  onSubmit(): void {
    const searchTerm = this.stockCtrl.value.toUpperCase(); // Use the value from the form control
    if (this.router.url !== `/search/${searchTerm}`) {
      this.router.navigate(['/search', searchTerm]);
    } else {
      this.fetchData(searchTerm); // Otherwise, just fetch the data
    }
  }
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
  selectStock(stock: any): void {
    this.loading = false;
    this.stockSymbol = stock.displaySymbol;
    this.stockCtrl.setValue(this.stockSymbol); // This will set the selected stock symbol in the input field
    this.onSubmit(); // Trigger search immediately
    this.filteredStocks$ = of([]); // Clear suggestions
  }

  // Use this method in your template's (input) event
  onSearch(term: string): void {
    this.stockSymbol = term.toUpperCase();
    this.search(term);
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
        this.data = combinedData
        console.log(this.data)
      },
      error: (error) => console.error('Error fetching data:', error)
    });
  }

  clearInput(): void {
    this.stockCtrl.setValue(''); // Clears the FormControl that's bound to the input
    this.sharedService.updateData(null);
    this.router.navigate(['/search/home']);
  }
  
}
