import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/payments';

  createIntent(data: { bookingId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/intent`, data);
  }

  confirmPayment(data: { paymentId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm`, data);
  }

  getUserPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-payments`);
  }
}
