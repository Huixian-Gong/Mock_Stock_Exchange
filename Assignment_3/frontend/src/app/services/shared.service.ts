import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private dataSource = new BehaviorSubject<any>(null); // Replace 'any' with your data type
  currentData$ = this.dataSource.asObservable();

  constructor() {}

  updateData(data: any): void { // Replace 'any' with your data type
    this.dataSource.next(data);
  }

  emitCurrentData(): void {
    this.dataSource.next(this.dataSource.value);
  }
}

