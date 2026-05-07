import { Component, Input } from '@angular/core';
import { Button } from "../button/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-movie',
  imports: [Button, RouterLink],
  templateUrl: './featured-movie.html',
  styleUrl: './featured-movie.css',
})
export class FeaturedMovie {
  @Input() title!: string;
  @Input() description!: string;
  @Input() poster!: string;
  @Input() id!: string;
}
