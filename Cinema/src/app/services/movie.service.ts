import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.constants';
import { Movie } from '../models/cinema.models';

export interface MovieByIdResponse {
  data: Movie;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private  http = inject(HttpClient);
  private  base = API_BASE_URL;

  getById(movieId: string): Observable<MovieByIdResponse> {
    return this.http.get<MovieByIdResponse>(`${this.base}/movies/${movieId}`);
  }
}
