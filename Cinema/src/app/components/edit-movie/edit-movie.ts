import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormInput } from "../input/input";
import { ToasterService } from '../../services/toaster.service';
import { Movie } from '../../models/cinema.models';
import { MovieService, UpdateMoviePayload } from '../../services/movie.service';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput],
  templateUrl: './edit-movie.html',
  styleUrl: '../add-movie/add-movie.css' // Reuse add-movie styles
})
export class EditMovie {
  private movieService = inject(MovieService);
  private movieId: string | null = null;

  @Input() set movieData(data: Movie | null) {
    if (data) {
      this.movieId = data._id;
      this.movieForm.patchValue({
        title: data.title || '',
        description: data.description || '',
        duration: data.duration ?? null,
        genre: Array.isArray(data.genre) ? data.genre : [],
        rating: data.rating || '',
        language: data.language || '',
        poster: data.poster || '',
        releaseDate: this.formatDate(data.releaseDate) || '',
        isNowShowing: data.isNowShowing ? 'Showing' : 'Upcoming',
        showTimes: Array.isArray(data.showTimes) ? data.showTimes : [],
      });
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toISOString().split('T')[0];
  }

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

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.movieForm.invalid) return;

    if (!this.movieId) {
      this.toaster.error('Missing movie id.');
      return;
    }

    const v = this.movieForm.getRawValue();
    const payload: UpdateMoviePayload = {
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

    this.movieService.update(this.movieId, payload).subscribe({
      next: () => {
        this.toaster.success(`Movie "${payload.title}" updated successfully!`);
        this.saved.emit();
        this.onClose();
      },
      error: (err) => {
        this.toaster.error(err?.error?.message || 'Failed to update movie.');
      },
    });
  }
}
