import { Component } from '@angular/core';

@Component({
  selector: 'app-filters-bar',
  imports: [],
  templateUrl: './filters-bar.html',
  styleUrl: './filters-bar.css',
})
export class FiltersBar {
  filters = [
    'Genre',
    'Language',
    'Rating',
    'Release Date',
  ];

  selected = '';

  selectFilter(filter: string) {
    this.selected = filter;
  }
}
