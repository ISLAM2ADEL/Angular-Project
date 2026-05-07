import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { Seat } from '../../components/seat/seat';
import { Button } from '../../components/button/button';
import { ShowtimeService } from '../../services/showtime.service';
import { Movie, ShowtimeDetail, SeatUi } from '../../models/cinema.models';

@Component({
  selector: 'app-seats',
  imports: [Seat, Button],
  templateUrl: './seats.html',
  styleUrl: './seats.css',
})
export class Seats {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly showtimeService = inject(ShowtimeService);

  readonly movieId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('movieId'))),
    { initialValue: null },
  );
  readonly showTimeId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('showTimeId'))),
    { initialValue: null },
  );

  readonly showtime = signal<ShowtimeDetail | null>(null);
  readonly loadError = signal(false);
  readonly seats = signal<SeatUi[]>([]);
  readonly selectedIds = signal<Set<string>>(new Set());

  readonly movieTitle = computed(() => {
    const m = this.showtime()?.movie;
    if (m && typeof m === 'object' && 'title' in m) return (m as Movie).title;
    return '';
  });

  readonly posterSrc = computed(() => {
    const m = this.showtime()?.movie;
    let p = '';
    if (m && typeof m === 'object' && 'poster' in m) p = (m as Movie).poster;
    if (!p) return '';
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    return p.startsWith('/') ? p : `/${p}`;
  });

  readonly ratingLabel = computed(() => {
    const m = this.showtime()?.movie;
    if (m && typeof m === 'object' && 'rating' in m) return (m as Movie).rating;
    return '';
  });

  readonly languageLabel = computed(() => {
    const m = this.showtime()?.movie;
    if (m && typeof m === 'object' && 'language' in m) return (m as Movie).language;
    return '';
  });

  readonly hallAndTimeLine = computed(() => {
    const st = this.showtime();
    if (!st) return '';
    const h = st.hallId;
    const hallName = typeof h === 'string' ? '' : (h?.name ?? '');
    const hallType = typeof h === 'string' ? '' : (h?.type ?? '');
    const t = new Date(st.startTime).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return [hallName, t, hallType].filter(Boolean).join(' • ');
  });

  readonly totalFormatted = computed(() => {
    const price = this.showtime()?.price ?? 0;
    const total = this.selectedIds().size * price;
    return `$${total.toFixed(2)}`;
  });

  readonly selectedList = computed(() =>
    Array.from(this.selectedIds()).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    ),
  );

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const sid = params.get('showTimeId');
      if (!sid) {
        this.showtime.set(null);
        this.seats.set([]);
        this.selectedIds.set(new Set());
        this.loadError.set(false);
        return;
      }

      this.selectedIds.set(new Set());
      
      this.showtimeService
        .getById(sid)
        .pipe(
          catchError(() => {
            this.loadError.set(true);
            this.showtime.set(null);
            this.seats.set([]);
            return of(null);
          })
        )
        .subscribe((res) => {
          if (!res) return;
          this.loadError.set(false);
          const data = res.data;
          this.showtime.set(data);
          this.seats.set(
            data.seats.map((s) => ({ id: s.id, isTaken: s.isReserved }))
          );
        });
    });
  }

  onSeatSelected(seatId: string, selected: boolean) {
    this.selectedIds.update((set) => {
      const next = new Set(set);
      if (selected) next.add(seatId);
      else next.delete(seatId);
      return next;
    });
  }

  confirmBooking() {
    const mid = this.movieId();
    const sid = this.showTimeId();
    if (!mid || !sid) return;
    
    const seatIds = Array.from(this.selectedIds()).join(',');
    if (!seatIds) return;

    void this.router.navigate(['/checkout', mid, sid, seatIds]);
  }

  cancelBooking() {
    const mid = this.movieId();
    if (mid) void this.router.navigate(['/movie', mid]);
    else void this.router.navigate(['/home']);
  }
}
