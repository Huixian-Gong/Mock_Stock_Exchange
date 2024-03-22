import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { HttpClientModule } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewsDialogComponent } from './news-dialog/news-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-top-news',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatDialogModule, MatCardModule], // Removed HttpClientModule as it's provided by BackendService
  providers: [BackendService, DatePipe], // Added SharedService
  templateUrl: './top-news.component.html',
  styleUrl: './top-news.component.css'
})
export class TopNewsComponent implements OnInit {
  stockSymbol: string = '';
  currentTime: Date = new Date();
  newsEntries: any[] = []; // Array to store filtered news entries


  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const ticker = params.get('ticker');
      // console.log('news' + ticker)
      if (ticker) {
        this.stockSymbol = ticker.toUpperCase();
        this.fetchData(this.stockSymbol); // Directly fetch data based on the ticker
      }
    });
  }

  fetchData(ticker: string): void {
    const to = new Date(this.currentTime.getTime());
    // Example: determine 'from' and 'to' based on whether market is open or closed
    // Adjust the logic based on market hours and time zones
    const from = new Date(this.currentTime.getTime());
    from.setDate(to.getDate() - 10);
    let fromFormatted = formatDate(from, 'yyyy-MM-dd', 'en-US');
    let toFormatted = formatDate(to, 'yyyy-MM-dd', 'en-US');


    this.backendService.stockNews(ticker, fromFormatted, toFormatted).subscribe({
      next: (data) => {
        // Filter out entries with non-empty required fields and limit to latest 20
        this.newsEntries = data.filter((entry: any) =>
          entry.source && entry.datetime && entry.url && entry.summary &&
          entry.headline && entry.image
        ).slice(0, 20); // Assuming 'data' is an array of news entries
        // console.log(this.newsEntries);
      },
      error: (error) => console.error('Failed to fetch news data', error)
    });
  }

  openDialog(news: any): void {
    this.dialog.open(NewsDialogComponent, {
      data: news,
      width: '600px'
    });
  }

}

