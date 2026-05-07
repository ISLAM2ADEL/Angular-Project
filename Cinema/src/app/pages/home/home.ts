import { Component, inject, OnInit, signal } from '@angular/core';
import { FeatureCard } from '../../components/feature-card/feature-card';
import { UpcomingCard } from "../../components/upcoming-card/upcoming-card";
import { MovieCard } from "../../components/movie-card/movie-card";
import { FeaturedMovie } from "../../components/featured-movie/featured-movie";
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/cinema.models';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FeatureCard, UpcomingCard, MovieCard, FeaturedMovie, DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  featuredMovie = signal<Movie | null>(null);
  nowShowingMovies = signal<Movie[]>([]);
  upcomingMovies = signal<Movie[]>([]);

  ngOnInit(): void {
    this.movieService.getAll().subscribe(res => {
      this.movies.set(res.data);
      this.featuredMovie.set(res.data[0] || null);
      this.nowShowingMovies.set(res.data.slice(1, 5));
      this.upcomingMovies.set(res.data.slice(5, 8));
    })
  }

}
