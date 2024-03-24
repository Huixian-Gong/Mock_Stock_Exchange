import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isSearchRoute: boolean = false;

  constructor(private router: Router, private location: Location) {
    this.checkRoute();
    this.router.events.subscribe((event) => {
      this.checkRoute();
    });
  }

  private checkRoute() {
    // Use startsWith to check if the path starts with /search/
    this.isSearchRoute = this.location.path().startsWith('/search/');
  }
}

