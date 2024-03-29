// app.route.ts example
import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { InputComponent } from './search/input/input.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search/home',
    pathMatch: 'full',
  },
  {
    path: 'search/home',
    component: InputComponent,
    title: 'Home',
  },
  { path: 'search/:ticker', component: SearchComponent, title: 'Search Details' },
  { path: 'watchlist', component: WatchlistComponent, title: 'Watchlist' },
  { path: 'portfolio', component: PortfolioComponent, title: 'Portfolio' },
  // other routes...
];
