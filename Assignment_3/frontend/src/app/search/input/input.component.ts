import { Component, OnInit, EventEmitter, Output , ViewChild, ChangeDetectorRef} from '@angular/core';
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
import { catchError, finalize, map, startWith } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { ResultComponent } from '../result/result.component';
import { TopSectionComponent } from '../result/top-section/top-section.component';
import { NavBarComponent } from '../result/nav-bar/nav-bar.component';



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
    MatProgressSpinnerModule,
    NgbAlertModule,
    ResultComponent,
    TopSectionComponent,
    NavBarComponent], // Removed HttpClientModule as it's provided by BackendService
  providers: [BackendService] // Added SharedService
})
export class InputComponent {
  stockSymbol: string = '';
  data : any;
  stockCtrl = new FormControl();
  loading: boolean = false;
  errorMessage : string = ''
  empty: boolean = false;
  filteredOptions ?: Observable<{ displaySymbol: string, description:string, combined:string }[]>;
  resultLoading = false;
  emptyInput = false;


 

  constructor(
    private backendService: BackendService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.stockCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(150),
      switchMap(value => {
        if (value) {
          this.loading = true
          return this.fetchStock(value).pipe(
            finalize(() => this.loading = false),
          );
        } else {
          this.loading = false;
          return of([]); 
        }
      }),
      catchError(error => {
        console.error('There was an error!', error);
        this.loading = false;
        return [];
      })
    );
    
    // Listen to route parameter changes
    this.route.paramMap.subscribe(params => {
      const ticker = params.get('ticker');
      Promise.resolve().then(() => {
        if (ticker && ticker !== 'home') {
          this.stockCtrl.setValue(ticker);
          this.onSubmit();
        } else {
          this.stockCtrl.setValue('');
        }
      });
    });
  }

  fetchStock(ticker: string): Observable<any[]>  {
    return this.backendService.stockTicker(ticker).pipe(
      // map(data => data.map((item: any) => item.displaySymbol)),
      map(data => data.map((item: any) => ({
        displaySymbol: item.displaySymbol,
        description: item.description,
      }))),
      catchError(error => {
        console.error('There was an error!', error);
        return [];
      })
    );
  }

  onSubmit(): void {
    
    if (this.stockCtrl.value == '') {
      this.emptyInput = true;
    } else {
      this.emptyInput = false;
    }
    console.log(this.emptyInput)
    if (this.stockCtrl.value) {
      this.router.navigate(['/search', this.stockCtrl.value.toUpperCase()]);
      this.resultLoading = true;
    } else {
      this.errorMessage = 'Please enter a valid ticker.';
    }
  }


  clearInput(): void {
    this.stockCtrl.setValue(''); // Clears the FormControl that's bound to the input immediately
    this.router.navigate(['/search/home'])
  }

}
