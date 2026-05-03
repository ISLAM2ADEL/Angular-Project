import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-upcoming-card',
  imports: [],
  templateUrl: './upcoming-card.html',
  styleUrl: './upcoming-card.css',
})
export class UpcomingCard {
  @Input() imageUrl!: string;
  @Input() releaseDate!: string;
  @Input() title!: string;
  @Input() description!: string;
}
