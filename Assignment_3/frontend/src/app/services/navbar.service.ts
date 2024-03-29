import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private navbarHeight = new BehaviorSubject<string>('56px'); // Default height, adjust as needed
  navbarHeight$ = this.navbarHeight.asObservable();

  updateNavbarHeight(height: string) {
    this.navbarHeight.next(height);
  }
}
