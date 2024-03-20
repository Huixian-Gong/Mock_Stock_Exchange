import { Component, OnInit } from '@angular/core';
import { InputComponent } from './input/input.component';
import { ResultComponent } from './result/result.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [InputComponent, ResultComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent implements OnInit {
  ticker: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tickerValue = params.get('ticker');
      if (tickerValue) {
        this.ticker = tickerValue.toUpperCase(); // Update input box
        this.submitSearch(); // Auto-submit
      }
    });
  }

  submitSearch(): void {
    // Your search logic here, using this.ticker
    console.log(`Searching for ${this.ticker}`);
  }
}
