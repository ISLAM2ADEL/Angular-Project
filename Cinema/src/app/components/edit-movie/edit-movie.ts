import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormInput } from "../input/input";
import { ToasterService } from '../../services/toaster.service';
import { Movie } from '../../models/cinema.models';
import { MovieService, UpdateMoviePayload } from '../../services/movie.service';
import { ShowtimeService } from '../../services/showtime.service';
import { HallService } from '../../services/hall.service';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput],
  templateUrl: './edit-movie.html',
  styleUrl: '../add-movie/add-movie.css' // Reuse add-movie styles
})
export class EditMovie {
  private movieService = inject(MovieService);
  private showtimeService = inject(ShowtimeService);
  private hallService = inject(HallService);
  private cdr = inject(ChangeDetectorRef);
  private movieId: string | null = null;
  private defaultHallId: string | null = null;

  @Input() set movieData(data: any | null) {
    if (data) {
      this.movieId = data._id;

      // Load default hall if not loaded
      if (!this.defaultHallId) {
        this.hallService.getAll().subscribe(res => {
          if (res.data?.length) this.defaultHallId = res.data[0]._id;
        });
      }

      // Robust duration parsing: extract number from strings like "140 mins" or "140"
      let durationVal: number | null = null;
      if (data.duration) {
        const match = String(data.duration).match(/\d+/);
        if (match) durationVal = Number(match[0]);
      }

      this.movieForm.patchValue({
        title: data.title || '',
        description: data.description || '',
        duration: durationVal,
        genre: Array.isArray(data.genre) ? data.genre : [],
        rating: data.rating || '',
        language: data.language || '',
        poster: data.poster || '',
        releaseDate: this.formatDate(data.releaseDate) || '',
        isNowShowing: data.isNowShowing ? 'Showing' : 'Upcoming',
        showTimes: [],
      });

      // Fetch showtimes from the service since they aren't in the Movie model
      this.showtimeService.getAll().subscribe({
        next: (res) => {
          const all = res.data || [];
          const filtered = all.filter(st => {
            const mid = typeof st.movie === 'string' ? st.movie : st.movie?._id;
            return mid === this.movieId;
          });

          console.log(res.data);
          // Map to the format used in the form: "HH:mm AM/PM"
          const times = filtered.map(st => this.formatTimeToAMPM(new Date(st.startTime)));

          console.log(times);

          this.movieForm.patchValue({ showTimes: times });
          this.cdr.detectChanges();
        }
      });

      this.cdr.detectChanges();
    }
  }

  formatTimeToAMPM(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    // No leading zero for hours to match "1:00 PM"
    return `${hours}:${minutesStr} ${ampm}`;
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
  showTimesOptions = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'];

  constructor(private toaster: ToasterService) { }

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
        // After updating movie, handle showtimes creation
        if (v.showTimes?.length && this.defaultHallId) {
          const showtimeRequests = v.showTimes.map((timeStr: string) => {
            const startTime = this.combineDateAndTime(v.releaseDate!, timeStr);
            return this.showtimeService.create({
              movie: this.movieId,
              hallId: this.defaultHallId,
              startTime: startTime.toISOString(),
              price: 15.0 // Default price
            });
          });

          forkJoin(showtimeRequests).subscribe({
            next: () => {
              this.toaster.success(`Movie "${payload.title}" and its showtimes updated!`);
              this.saved.emit();
              this.onClose();
            },
            error: () => {
              this.toaster.warning(`Movie updated, but failed to create some showtimes.`);
              this.saved.emit();
              this.onClose();
            }
          });
        } else {
          this.toaster.success(`Movie "${payload.title}" updated successfully!`);
          this.saved.emit();
          this.onClose();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        this.toaster.error(err?.error?.message || 'Failed to update movie.');
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
}
