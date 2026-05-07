import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { FormInput } from '../input/input';
import { ToasterService } from '../../services/toaster.service';
import { MovieService, CreateMoviePayload } from '../../services/movie.service';
import { ShowtimeService } from '../../services/showtime.service';
import { HallService } from '../../services/hall.service';
import { forkJoin } from 'rxjs';

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
  private showtimeService = inject(ShowtimeService);
  private hallService = inject(HallService);
  private defaultHallId: string | null = null;

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
  showTimesOptions = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];

  constructor(private toaster: ToasterService) {
    this.hallService.getAll().subscribe(res => {
      if (res.data?.length) this.defaultHallId = res.data[0]._id;
    });
  }

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
      next: (res: any) => {
        const newMovieId = res.data?._id;
        
        if (newMovieId && v.showTimes?.length && this.defaultHallId) {
          const showtimeRequests = v.showTimes.map((timeStr: string) => {
            const startTime = this.combineDateAndTime(v.releaseDate!, timeStr);
            return this.showtimeService.create({
              movie: newMovieId,
              hallId: this.defaultHallId,
              startTime: startTime.toISOString(),
              price: 15.0 // Default price
            });
          });

          forkJoin(showtimeRequests).subscribe({
            next: () => {
              this.toaster.success(`Movie "${payload.title}" and its showtimes added!`);
              this.saved.emit();
              this.onClose();
            },
            error: () => {
              this.toaster.warning(`Movie added, but failed to create some showtimes.`);
              this.saved.emit();
              this.onClose();
            }
          });
        } else {
          this.toaster.success(`Movie "${payload.title}" added successfully!`);
          this.saved.emit();
          this.onClose();
        }
      },
      error: (err) => {
        this.toaster.error(err?.error?.message || 'Failed to add movie.');
      },
    });
  }

  combineDateAndTime(dateStr: string, timeStr: string): Date {
    const date = new Date(dateStr);
    const [time, ampm] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  onPosterChanged() {
    this.posterPreview = String(this.movieForm.controls.poster.value || '');
  }
}
