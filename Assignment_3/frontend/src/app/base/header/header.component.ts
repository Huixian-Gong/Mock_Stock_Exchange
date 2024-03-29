import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, NgbModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // Ensure the path is correct
})
export class HeaderComponent implements OnInit {
  isSearchRoute: boolean = false;
  isNavbarCollapsed: boolean = true;
  lastSearchUrl: string | null = null;
  isSearchActive: boolean = false;
  pad: string = '56px';


  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      // This combines the logic for both isSearchRoute and isSearchActive
      const isSearchPage = event.urlAfterRedirects.startsWith('/search');
      this.isSearchRoute = isSearchPage;
      this.isSearchActive = isSearchPage;

      if (isSearchPage) {
        sessionStorage.setItem('lastSearchUrl', event.urlAfterRedirects);
        this.lastSearchUrl = event.urlAfterRedirects;
      }
    });

    // Initialize lastSearchUrl from sessionStorage on component initialization
    this.lastSearchUrl = sessionStorage.getItem('lastSearchUrl');
  }

  navigateToLastSearch(): void {
    // Navigate to the last search URL or to a default route
    this.router.navigateByUrl(this.lastSearchUrl || '/search/home');
  }

  toggleNavbarCollapse(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    if (this.isNavbarCollapsed) {
      this.pad = '55px'
    } else {
      this.pad = '180px'
    }
  }
}
