import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Import CommonModule for the date pipe


@Component({
  selector: 'app-news-dialog',
  templateUrl: './news-dialog.component.html',
  styleUrls: ['./news-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, CommonModule] // Import Angular Material Dialog Data token if needed
})
export class NewsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

