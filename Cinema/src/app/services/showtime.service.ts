import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.constants';
import { ShowtimeDetail, ShowtimeListItem } from '../models/cinema.models';

export interface ShowtimesListResponse {
  success: boolean;
  data: ShowtimeListItem[];
}

export interface ShowtimeByIdResponse {
  success: boolean;
  data: ShowtimeDetail;
  availableSeats: number;
}

@Injectable({ providedIn: 'root' })
export class ShowtimeService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  getAll(): Observable<ShowtimesListResponse> {
    return this.http.get<ShowtimesListResponse>(`${this.base}/showtimes`);
  }

  getById(showtimeId: string): Observable<ShowtimeByIdResponse> {
    return this.http.get<ShowtimeByIdResponse>(`${this.base}/showtimes/${showtimeId}`);
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/showtimes`, payload);
  }
}
