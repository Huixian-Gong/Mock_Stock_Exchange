import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://localhost:3000'; // Base URL for your API

  constructor(private http: HttpClient) {}

  // Example for a GET request
  searchStock(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/${ticker}`);
  }

  stockPrice(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/quote/${ticker}`);
  }

  stockPeers(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/peers/${ticker}`);
  }
  // You can add more methods for POST, PUT, DELETE, etc.
}