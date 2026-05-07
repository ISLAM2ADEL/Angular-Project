import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchBar } from "../../components/search-bar/search-bar";
import { FiltersBar } from "../../components/filters-bar/filters-bar";
import { BookingMovieCard } from "../../components/booking-movie-card/booking-movie-card";
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/cinema.models';

@Component({
  selector: 'app-movies',
  imports: [SearchBar, FiltersBar, BookingMovieCard, RouterLink],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies implements OnInit {
  movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  filteredMovies = signal<Movie[]>([]);
  filter = signal<string>("Title");
  search = signal<string>("");

  ngOnInit(): void {
    this.movieService.getAll().subscribe(res => {
      this.movies.set(res.data);
      this.filteredMovies.set(res.data);
    });
  }

  onSearchChange(searchValue: string) {
    this.search.set(searchValue);
    this.searching(searchValue, this.filter());
  }

  onFilterChange(filterValue: string) {
    this.filter.set(filterValue);
    this.searching(this.search(), filterValue);
  }

  searching(searchValue: string, filterValue: string) {
    if (searchValue === "") {
      return this.filteredMovies.set(this.movies());
    }

    let filtered: Movie[] = [];

    switch (filterValue) {
      case "Title": {
        filtered = this.movies().filter(m =>
          m.title.toLowerCase().includes(searchValue.toLowerCase()));
        break;
      }
      case "Genre": {
        filtered = this.movies().filter(m =>
          m.genre.some(g => g.toLowerCase().includes(searchValue.toLowerCase()))
        );
        break;
      }
      case "Rating": {
        filtered = this.movies().filter(m =>
          m.rating.includes(searchValue)
        );
        break;
      }
    }

    this.filteredMovies.set(filtered);
  }
}