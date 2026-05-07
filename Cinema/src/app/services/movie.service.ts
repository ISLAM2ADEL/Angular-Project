import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.constants';
import { Movie } from '../models/cinema.models';

export interface MovieByIdResponse {
  data: Movie;
}

export interface MoviesResponse {
  count?: number;
  data: Movie[];
}

export type CreateMoviePayload = Omit<Movie, '_id'>;
export type UpdateMoviePayload = Partial<Omit<Movie, '_id'>>;

@Injectable({ providedIn: 'root' })
export class MovieService {
  private  http = inject(HttpClient);
  private  base = API_BASE_URL;

  getById(movieId: string): Observable<MovieByIdResponse> {
    return this.http.get<MovieByIdResponse>(`${this.base}/movies/${movieId}`);
  }

  getAll(params?: { nowShowing?: boolean }): Observable<MoviesResponse> {
    const query = params?.nowShowing === undefined ? '' : `?nowShowing=${params.nowShowing}`;
    return this.http.get<MoviesResponse>(`${this.base}/movies${query}`);
  }

  create(payload: CreateMoviePayload): Observable<{ message: string; data: Movie }> {
    return this.http.post<{ message: string; data: Movie }>(`${this.base}/movies`, payload);
  }

  update(movieId: string, payload: UpdateMoviePayload): Observable<{ message: string; data: Movie }> {
    return this.http.put<{ message: string; data: Movie }>(`${this.base}/movies/${movieId}`, payload);
  }

  delete(movieId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/movies/${movieId}`);
  }
}
