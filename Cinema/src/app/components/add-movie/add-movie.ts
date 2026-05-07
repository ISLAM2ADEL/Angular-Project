import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { FormInput } from '../input/input';
import { ToasterService } from '../../services/toaster.service';
import { MovieService } from '../../services/movie.service';
import { CreateMoviePayload } from '../../services/movie.service';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.css'
})
export class AddMovie {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private movieService = inject(MovieService);

  posterPreview = '';

  movieForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    duration: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    genre: new FormControl<string[]>([], Validators.required),
    rating: new FormControl('', Validators.required),
    language: new FormControl('', Validators.required),
    poster: new FormControl('', [Validators.required]),
    releaseDate: new FormControl('', Validators.required),
    isNowShowing: new FormControl<'Showing' | 'Upcoming'>('Upcoming', Validators.required),
    showTimes: new FormControl<string[]>([], Validators.required),
  });

  genresOptions = [
    'Action',
    'Drama',
    'Comedy',
    'Horror',
    'Thriller',
    'Sci-Fi',
    'Romance',
    'Animation',
    'Documentary',
    'Adventure',
    'Fantasy',
    'Mystery',
    'Crime',
  ];

  ratingOptions = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  statusOptions: Array<'Showing' | 'Upcoming'> = ['Showing', 'Upcoming'];
  showTimesOptions = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM'];

  constructor(private toaster: ToasterService) {}

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.movieForm.invalid) return;

    const v = this.movieForm.getRawValue();
    const payload: CreateMoviePayload = {
      title: v.title!,
      description: v.description!,
      duration: Number(v.duration),
      genre: v.genre || [],
      rating: v.rating!,
      language: v.language!,
      poster: v.poster!,
      releaseDate: v.releaseDate!,
      isNowShowing: v.isNowShowing === 'Showing',
      showTimes: v.showTimes || [],
    };

    this.movieService.create(payload).subscribe({
      next: () => {
        this.toaster.success(`Movie "${payload.title}" added successfully!`);
        this.saved.emit();
        this.onClose();
      },
      error: (err) => {
        this.toaster.error(err?.error?.message || 'Failed to add movie.');
      },
    });
  }

  onPosterChanged() {
    this.posterPreview = String(this.movieForm.controls.poster.value || '');
  }
}
