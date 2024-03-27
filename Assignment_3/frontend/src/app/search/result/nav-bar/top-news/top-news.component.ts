import { Component, OnInit, OnDestroy, TemplateRef} from '@angular/core';
import { BackendService } from '../../../../services/backend.service';
import { HttpClientModule } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewsDialogComponent } from './news-dialog/news-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';    //need to import
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';  //need to import

@Component({
  selector: 'app-top-news',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatDialogModule, MatCardModule, NgbModule], // Removed HttpClientModule as it's provided by BackendService
  providers: [BackendService, DatePipe], // Added SharedService
  templateUrl: './top-news.component.html',
  styleUrl: './top-news.component.css'
})
export class TopNewsComponent implements OnInit {
  stockSymbol: string = '';
  currentTime: Date = new Date();
  newsEntries: any[] = []; // Array to store filtered news entries
  data: any;


  constructor(
    private backendService: BackendService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private modalWindow: NgbModal
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


  openModal(content: TemplateRef<any>, news: any) {
    this.data= news
    console.log("PORTFOLIO ONPEN MODEL CONTENT", this.data)
    this.modalWindow.open(content, { ariaLabelledBy: 'modal-basic-title' }).result
    .then(
      (result) => {
        console.log(`Closed with: ${result}`);
      }
    );
  }
}

