import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'https://hw3backend-dot-csci-571-huixian.wl.r.appspot.com'; 
  // private apiUrl = 'http://localhost:3000';

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
    // console.log(`${this.apiUrl}/news/${ticker}/${from}/${to}`)
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

  summaryChart(ticker: string, from: string, to: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock/hourly/${ticker}/${from}/${to}`);
  }

  chartTab(ticker: string, from: string, to: string): Observable<any> {
    // console.log(`${this.apiUrl}/chart/${ticker}/${from}/${to}`)
    return this.http.get(`${this.apiUrl}/chart/${ticker}/${from}/${to}`);
  }

  addStock(ticker: string): Observable <any> {
    return this.http.get(`${this.apiUrl}/favorites/add/${ticker}`);
  }

  removeStock(ticker: string): Observable <any> {
    return this.http.get(`${this.apiUrl}/favorites/remove/${ticker}`);
  }

  deleteStock(ticker: string): Observable <any> {
    return this.http.get(`${this.apiUrl}/favorites/delete/${ticker}`);
  }

  checkStock(ticker: string): Observable <any> {
    return this.http.get(`${this.apiUrl}/favorites/check/${ticker}`);
  }

  getFavorites(): Observable <any> {
    return this.http.get(`${this.apiUrl}/fav_list`);
  }
  // You can add more methods for POST, PUT, DELETE, etc.
  getBalance(): Observable <any> {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  buyStock(ticker: string, count: number, price: number): Observable <any> {
    console.log(`${this.apiUrl}/buy/${ticker}/${count}/${price}`)
    return this.http.get(`${this.apiUrl}/buy/${ticker}/${count}/${price}`);
  }

  sellStock(ticker: string, count: number, price: number, sellAll: number): Observable <any> {
    console.log(`${this.apiUrl}/sell/${ticker}/${count}/${price}/${sellAll}`)
    return this.http.get(`${this.apiUrl}/sell/${ticker}/${count}/${price}/${sellAll}`);
  }

  getPortfolio(): Observable <any> {
    return this.http.get(`${this.apiUrl}/portfolio`);
  }


}