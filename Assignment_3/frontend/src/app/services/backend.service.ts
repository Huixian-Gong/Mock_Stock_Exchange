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

  // Method to fetch hourly stock data
  summaryChart(ticker: string, from: string, to: string): Observable<any> {
    // Assuming your backend endpoint will handle the request to Polygon.io
    return this.http.get(`${this.apiUrl}/stock/hourly/${ticker}/${from}/${to}`);
  }
  // You can add more methods for POST, PUT, DELETE, etc.
}