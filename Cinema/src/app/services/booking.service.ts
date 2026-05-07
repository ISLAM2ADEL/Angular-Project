import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/bookings';

  createBooking(data: { showtimeId: string, seats: string[], method?: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMyBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-bookings`);
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
