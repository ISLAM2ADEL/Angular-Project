import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  @Input() poster!: string;
  @Input() title!: string;
  @Input() rating!: string;
  @Input() metadata!: string;
}
