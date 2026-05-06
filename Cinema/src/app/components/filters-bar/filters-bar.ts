import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filters-bar',
  imports: [],
  templateUrl: './filters-bar.html',
  styleUrl: './filters-bar.css',
})
export class FiltersBar {
  @Output() filterChanged = new EventEmitter<string>();

  filters = [
    'Title',
    'Genre',
    'Rating',
  ];

  selected = 'Title';

  selectFilter(filter: string) {
    this.selected = filter;
    this.filterChanged.emit(filter);
  }
}
