import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { ShowtimeService } from '../../services/showtime.service';
import { BookingService } from '../../services/booking.service';
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private showtimeService = inject(ShowtimeService);
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  private cdr = inject(ChangeDetectorRef);

  // Route Params
  movieId = '';
  showTimeId = '';
  seatIds: string[] = [];

  // Checkout Data
  movieTitle = 'Loading...';
  movieDate = '';
  movieTimeAndDuration = '';
  hallInfo = '';
  seatsInfo = '';
  posterUrl = '';
  
  // Price Summary
  ticketsPrice = 0;
  vipLoungePrice = 15.00; // static demo
  serviceFee = 4.50;      // static demo
  totalAmount = 0;

  // Payment State
  selectedPaymentMethod = 'card';
  isVisaModalOpen = false;

  // Visa Form
  visaCardNumber = '';
  visaMonth = '';
  visaYear = '';
  visaCvv = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.movieId = params.get('movieId') || '';
      this.showTimeId = params.get('showTimeId') || '';
      const seatsParam = params.get('seatId') || '';
      this.seatIds = seatsParam.split(',').filter(s => s);
      this.seatsInfo = this.seatIds.join(', ');

      if (this.showTimeId) {
        this.fetchShowtimeDetails();
      }
    });
  }

  fetchShowtimeDetails() {
    this.showtimeService.getById(this.showTimeId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const st = res.data;
          const m = st.movie as any;
          this.movieTitle = m?.title || 'Unknown';
          this.posterUrl = m?.poster || 'spiderman.jpg';
          
          const d = new Date(st.startTime);
          this.movieDate = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
          this.movieTimeAndDuration = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
          
          const h = st.hallId;
          const hallName = typeof h === 'string' ? '' : (h?.name ?? '');
          const hallType = typeof h === 'string' ? '' : (h?.type ?? '');
          this.hallInfo = `${hallName} • ${hallType}`;

          const pricePerSeat = st.price || 0;
          this.ticketsPrice = pricePerSeat * this.seatIds.length;
          this.totalAmount = this.ticketsPrice + this.vipLoungePrice + this.serviceFee;
          
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load showtime', err)
    });
  }

  onConfirmPayment() {
    if (this.selectedPaymentMethod === 'card') {
      this.isVisaModalOpen = true;
    } else {
      this.processBookingAndPayment();
    }
  }

  closeVisaModal() {
    this.isVisaModalOpen = false;
  }

  submitVisaPayment() {
    if (!this.visaCardNumber || !this.visaMonth || !this.visaYear || !this.visaCvv) {
      Swal.fire('Error', 'Please fill in all Visa details', 'error');
      return;
    }
    this.isVisaModalOpen = false;
    this.processBookingAndPayment();
  }

  onCardNumberChange(value: string) {
    let formatted = value.replace(/\D/g, ''); // remove non-digits
    if (formatted.length > 16) {
      formatted = formatted.substring(0, 16);
    }
    const parts = formatted.match(/.{1,4}/g);
    this.visaCardNumber = parts ? parts.join(' ') : '';
  }

  processBookingAndPayment() {
    // 1. Create Booking
    this.bookingService.createBooking({
      showtimeId: this.showTimeId,
      seats: this.seatIds,
      method: this.selectedPaymentMethod
    }).subscribe({
      next: (bookingRes) => {
        const paymentId = bookingRes.paymentId;
        if (!paymentId) {
          Swal.fire('Error', 'Booking created but no payment ID returned', 'error');
          return;
        }
        
        // 2. Confirm Payment
        this.paymentService.confirmPayment({ paymentId }).subscribe({
          next: (paymentRes) => {
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful',
              text: 'Your booking has been confirmed!',
              confirmButtonColor: '#3b1e2a',
            }).then(() => {
              this.router.navigate(['/profile']);
            });
          },
          error: (err) => {
            Swal.fire('Payment Failed', err.error?.message || 'An error occurred', 'error');
          }
        });
      },
      error: (err) => {
        Swal.fire('Booking Failed', err.error?.message || 'Failed to create booking. Seats might be taken.', 'error');
      }
    });
  }
}
