import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.constants';
import { Hall } from '../models/cinema.models';

export interface HallListResponse {
  success: boolean;
  data: Hall[];
}

@Injectable({ providedIn: 'root' })
export class HallService {
  private readonly http = inject(HttpClient);
  private readonly base = API_BASE_URL;

  getAll(): Observable<HallListResponse> {
    return this.http.get<HallListResponse>(`${this.base}/halls`);
  }
}
