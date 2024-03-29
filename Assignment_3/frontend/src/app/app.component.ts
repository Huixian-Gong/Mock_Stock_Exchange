import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BaseComponent } from './base/base.component'; // Assuming this is your Home component
import { SearchComponent } from './search/search.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './base/footer/footer.component';
import { HeaderComponent } from './base/header/header.component';
import { NavbarService } from './services/navbar.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BaseComponent, 
    SearchComponent, 
    PortfolioComponent, 
    WatchlistComponent,
    MatDialogModule,
    HttpClientModule,
    FooterComponent,
    HeaderComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Ensure this is an array, `styleUrls` instead of `styleUrl`
})
// export class AppComponent {
  
// }

export class AppComponent implements OnInit {
  navbarHeight = '56px'; // Default height, adjust as needed
  title = 'frontend';
  constructor(private navbarService: NavbarService) {}

  ngOnInit() {
    this.navbarService.navbarHeight$.subscribe((height) => {
      this.navbarHeight = height;
    });
  }
}