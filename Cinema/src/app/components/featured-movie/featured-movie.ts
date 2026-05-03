import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-featured-movie',
  imports: [],
  templateUrl: './featured-movie.html',
  styleUrl: './featured-movie.css',
})
export class FeaturedMovie {
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageUrl!: string;
}
