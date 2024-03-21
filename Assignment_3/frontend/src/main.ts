/// <reference types="@angular/localize" />

// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


// main.ts
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { SearchComponent } from './app/search/search.component'; // Update the path as needed
import { WatchlistComponent } from './app/watchlist/watchlist.component'; // Update the path as needed
import { PortfolioComponent } from './app/portfolio/portfolio.component'; // Update the path as needed
import { InputComponent } from './app/search/input/input.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

enableProdMode(); // This can be called directly if there's no need to conditionally check for the environment

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot([
      { path: '', redirectTo: '/search/home', pathMatch: 'full' },
      { path: 'search/home', component: InputComponent, title: 'Home' },
      { path: 'search/:ticker', component: SearchComponent, title: 'Search Details' },
      { path: 'watchlist', component: WatchlistComponent, title: 'Watchlist' },
      { path: 'portfolio', component: PortfolioComponent, title: 'Portfolio' },
      // If you have a specific "NotFound" component for unknown routes, add it here
      // { path: '**', component: NotFoundComponent }
    ])), provideAnimationsAsync(),
  ]
}).catch(err => console.error(err));

