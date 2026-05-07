import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Output() searchChange = new EventEmitter<string>();

  onInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
