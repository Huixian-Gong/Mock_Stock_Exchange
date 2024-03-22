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

  stockTicker(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ticker/${ticker}`);
  }

  searchStock(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search/${ticker}`);
  }

  stockPrice(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/quote/${ticker}`);
  }

  stockNews(ticker: string, from: string, to: string): Observable<any> {
    console.log(`${this.apiUrl}/news/${ticker}/${from}/${to}`)
    return this.http.get(`${this.apiUrl}/news/${ticker}/${from}/${to}`);
  }

  stockPeers(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/peers/${ticker}`);
  }

  recommend(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendation/${ticker}`);
  }

  earning(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/earning/${ticker}`);
  }

  insider(ticker: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/insider/${ticker}`);
  }

  // Method to fetch hourly stock data
  summaryChart(ticker: string, from: string, to: string): Observable<any> {
    // Assuming your backend endpoint will handle the request to Polygon.io
    return this.http.get(`${this.apiUrl}/stock/hourly/${ticker}/${from}/${to}`);
  }

  chartTab(ticker: string, from: string, to: string): Observable<any> {
    console.log(`${this.apiUrl}/chart/${ticker}/${from}/${to}`)
    // Assuming your backend endpoint will handle the request to Polygon.io
    return this.http.get(`${this.apiUrl}/chart/${ticker}/${from}/${to}`);
  }
  // You can add more methods for POST, PUT, DELETE, etc.
}