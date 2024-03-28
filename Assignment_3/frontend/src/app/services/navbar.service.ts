import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' }) // Removed the duplicate @Injectable decorator
export class NavbarService {
  private navbarExpanded = new BehaviorSubject<boolean>(false);

  setNavbarState(isExpanded: boolean) {
    this.navbarExpanded.next(isExpanded);
  }

  getNavbarState(): Observable<boolean> {
    return this.navbarExpanded.asObservable();
  }
}
