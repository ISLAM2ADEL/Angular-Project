import { Component } from '@angular/core';
import { FeatureCard } from '../../components/feature-card/feature-card';
import { UpcomingCard } from "../../components/upcoming-card/upcoming-card";
import { MovieCard } from "../../components/movie-card/movie-card";
import { FeaturedMovie } from "../../components/featured-movie/featured-movie";

@Component({
  selector: 'app-home',
  imports: [FeatureCard, UpcomingCard, MovieCard, FeaturedMovie],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
