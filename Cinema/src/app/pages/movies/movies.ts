import { Component } from '@angular/core';
import { SearchBar } from "../../components/search-bar/search-bar";
import { FiltersBar } from "../../components/filters-bar/filters-bar";
import { BookingMovieCard } from "../../components/booking-movie-card/booking-movie-card";

@Component({
  selector: 'app-movies',
  imports: [SearchBar, FiltersBar, BookingMovieCard],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  movies = Array.from({ length: 9 });
}
