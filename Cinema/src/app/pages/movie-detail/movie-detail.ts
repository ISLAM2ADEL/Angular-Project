import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Button } from '../../components/button/button';
import { MovieService } from '../../services/movie.service';
import { ShowtimeService } from '../../services/showtime.service';
import { Movie, ShowtimeListItem } from '../../models/cinema.models';

@Component({
  selector: 'app-movie-detail',
  imports: [Button],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail {
  private  route = inject(ActivatedRoute);
  private  router = inject(Router);
  private  movieService = inject(MovieService);
  private  showtimeService = inject(ShowtimeService);

   movieId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('movieId'))),
    { initialValue: null },
  );

   movie = signal<Movie | null>(null);
   showtimes = signal<ShowtimeListItem[]>([]);
   loadError = signal(false);
   selectedShowtimeId = signal<string | null>(null);
   selectedDayKey = signal<string | null>(null);

posterSrc = computed(() => this.movie()?.poster || '');

   genreLabel = computed(() => this.movie()?.genre?.join(' / ') ?? '');

   durationLabel = computed(() => {
    const m = this.movie()?.duration;
    if (m == null) return '';
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${h}h ${min}m`;
  });
  
   statusTag = computed(() =>
    this.movie()?.isNowShowing ? 'NOW SHOWING' : 'COMING SOON',
  );

   showDates = computed(() => {
    const dates = new Map<string, Date>();
    for (const st of this.showtimes()) {
      const d = new Date(st.startTime);
      const key = d.toDateString();
      if (!dates.has(key)) dates.set(key, d);
    }
    return Array.from(dates.values()).sort((a, b) => a.getTime() - b.getTime());
  });

   timesForSelectedDay = computed(() => {
    const key = this.selectedDayKey();
    if (!key) return [];
    return this.showtimes().filter(
      (st) => new Date(st.startTime).toDateString() === key,
    );
  });

   confirmLabel = computed(() => {
    const sid = this.selectedShowtimeId();
    if (!sid) return 'Confirm Seats';
    const st = this.showtimes().find((s) => s._id === sid);
    if (!st) return 'Confirm Seats';
    return `Confirm Seats for ${this.formatClock(st.startTime)} →`;
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('movieId');
      if (!id) {
        this.movie.set(null);
        this.showtimes.set([]);
        this.selectedShowtimeId.set(null);
        this.selectedDayKey.set(null);
        this.loadError.set(false);
        return;
      }

      this.selectedShowtimeId.set(null);
      this.selectedDayKey.set(null);

      forkJoin({
        movie: this.movieService.getById(id),
        showtimes: this.showtimeService.getAll(),
      })
        .pipe(
          catchError(() => {
            this.loadError.set(true);
            this.movie.set(null);
            this.showtimes.set([]);
            this.selectedDayKey.set(null);
            return of(null);
          }),
        )
        .subscribe((res) => {
          if (!res) return;
          this.loadError.set(false);
          this.movie.set(res.movie.data);
          const all = res.showtimes.data ?? [];
          const filtered = all.filter((st) => {
            const m = st.movie;
            const mid = typeof m === 'string' ? m : (m as Movie)?._id;
            return mid === id;
          });
          this.showtimes.set(filtered);
          if (filtered.length) {
            const firstKey = new Date(filtered[0].startTime).toDateString();
            this.selectedDayKey.set(firstKey);
          } else {
            this.selectedDayKey.set(null);
          }
        });
    });
  }

  pickDay(d: Date) {
    this.selectedDayKey.set(d.toDateString());
    this.selectedShowtimeId.set(null);
  }

  isDayActive(d: Date) {
    return this.selectedDayKey() === d.toDateString();
  }

  pickShowtime(showtimeId: string) {
    this.selectedShowtimeId.set(showtimeId);
  }

  isShowtimeActive(showtimeId: string) {
    return this.selectedShowtimeId() === showtimeId;
  }

  formatDayShort(d: Date) {
    return d
      .toLocaleDateString(undefined, { weekday: 'short' })
      .toUpperCase();
  }

  formatDayNum(d: Date) {
    return d.getDate().toString();
  }

  formatMonthShort(d: Date) {
    return d
      .toLocaleDateString(undefined, { month: 'short' })
      .toUpperCase();
  }

  formatClock(iso: string) {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  hallTypeLabel(st: ShowtimeListItem) {
    const h = st.hallId;
    if (typeof h === 'string') return '';
    return h?.type ?? '';
  }

  confirmSeats() {
    const mid = this.movieId();
    const sid = this.selectedShowtimeId();
    if (mid && sid) {
      void this.router.navigate(['/seats', mid, sid]);
    }
  }
}
