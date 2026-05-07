import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/button/button';
import { UserService } from '../../services/user.service';
import { BookingService } from '../../services/booking.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

interface Booking {
  id: string;
  movieTitle: string;
  posterUrl: string;
  date: string;
  timeAndScreen: string;
  seats: string;
}

interface HistoryItem {
  id: string;
  movieTitle: string;
  date: string;
  venue: string;
  amount: number;
  status: 'Completed' | 'Refunded' | 'Cancelled' | 'Active';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private userService = inject(UserService);
  private bookingService = inject(BookingService);
  private cdr = inject(ChangeDetectorRef);

  // User Data
  userName = '';
  firstName = '';
  upcomingScreeningsCount = 0;
  points = '0';
  isVip = false;
  avatarUrl = 'user.svg'; 

  // Icons
  editIcon = 'edit.svg';
  starIcon = 'star.svg';
  calendarIcon = 'calendar.svg';
  clockIcon = 'clock.svg';
  seatIcon = 'bookbtn.svg'; 
  cancelIcon = 'delete.svg';

  // Bookings
  myBookings: Booking[] = [];
  bookingHistory: HistoryItem[] = [];

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const user = res.data;
          this.userName = user.name || 'James Miller';
          this.firstName = user.name ? user.name.split(' ')[0] : 'James';
          this.points = user.points || '0';
          this.isVip = user.isVip || false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load user profile', err)
    });

    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const now = new Date();
          const upcoming: Booking[] = [];
          const history: HistoryItem[] = [];

          res.data.forEach((b: any) => {
            const st = b.showtime;
            const m = st?.movie;
            const showDate = new Date(st?.startTime);
            const isUpcoming = showDate > now && b.status !== 'cancelled';

            const formattedDate = showDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            const formattedTime = showDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            if (isUpcoming) {
              upcoming.push({
                id: b._id,
                movieTitle: m?.title || 'Unknown Movie',
                posterUrl: m?.poster || 'spiderman.jpg',
                date: formattedDate,
                timeAndScreen: `${formattedTime}`,
                seats: `Seats: ${b.seats.join(', ')}`
              });
            } else {
              history.push({
                id: b._id,
                movieTitle: m?.title || 'Unknown Movie',
                date: formattedDate,
                venue: 'Cinema', // Usually hall info, fallback to Cinema
                amount: b.totalPrice,
                status: b.status === 'cancelled' ? 'Refunded' : 'Completed'
              });
            }
          });

          this.myBookings = upcoming;
          this.upcomingScreeningsCount = upcoming.length;
          this.bookingHistory = history;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Failed to load bookings', err)
    });
  }

  onViewTicket(id: string) {
    console.log('View ticket', id);
  }

  onCancelBooking(id: string) {
    Swal.fire({
      title: 'Cancel Booking?',
      text: "Are you sure you want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3b1e2a',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.bookingService.cancelBooking(id).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Cancelled!',
              text: 'Your booking has been cancelled.',
              icon: 'success',
              confirmButtonColor: '#3b1e2a'
            });
            this.ngOnInit(); // reload
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.error?.message || 'Failed to cancel booking',
              icon: 'error',
              confirmButtonColor: '#3b1e2a'
            });
          }
        });
      }
    });
  }

  onLoadMoreHistory() {
    console.log('Load more history requested');
    // Implement actual pagination or mock logic here if required
  }
}
