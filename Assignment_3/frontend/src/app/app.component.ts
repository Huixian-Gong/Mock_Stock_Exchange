import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BaseComponent } from './base/base.component'; // Assuming this is your Home component
import { SearchComponent } from './search/search.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BaseComponent, 
    SearchComponent, 
    PortfolioComponent, 
    WatchlistComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Ensure this is an array, `styleUrls` instead of `styleUrl`
})
export class AppComponent {
  title = 'frontend';
}



// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { BaseComponent } from './base/base.component';
// import { SearchComponent } from './search/search.component';
// import { PortfolioComponent } from './portfolio/portfolio.component';
// import { WatchlistComponent } from './watchlist/watchlist.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, BaseComponent, SearchComponent, PortfolioComponent, WatchlistComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'frontend';
// }
