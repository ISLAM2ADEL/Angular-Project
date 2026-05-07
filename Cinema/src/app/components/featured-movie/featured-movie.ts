import { Component, Input } from '@angular/core';
import { Button } from "../button/button";

@Component({
  selector: 'app-featured-movie',
  imports: [Button],
  templateUrl: './featured-movie.html',
  styleUrl: './featured-movie.css',
})
export class FeaturedMovie {
  @Input() title!: string;
  @Input() description!: string;
  @Input() poster!: string;
}
