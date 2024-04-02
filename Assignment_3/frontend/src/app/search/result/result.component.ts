import { Component } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TopSectionComponent } from './top-section/top-section.component';
import { BaseComponent } from '../../base/base.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [NavBarComponent, TopSectionComponent, BaseComponent,MatProgressSpinnerModule, CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {

}
