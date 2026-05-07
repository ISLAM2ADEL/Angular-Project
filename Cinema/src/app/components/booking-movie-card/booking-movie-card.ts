import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-booking-movie-card',
  imports: [],
  templateUrl: './booking-movie-card.html',
  styleUrl: './booking-movie-card.css',
})
export class BookingMovieCard {
  @Input() poster!: string;
  @Input() rating!: string;
  @Input() title!: string;
  @Input() genre!: string[];
  @Input() duration!: number;
}
