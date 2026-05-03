import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/button/button';

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
  status: 'Completed' | 'Refunded';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  // User Data
  userName = 'James Miller';
  firstName = 'James';
  upcomingScreeningsCount = 2;
  points = '1,240';
  isVip = true;
  avatarUrl = 'user.svg'; // Or any avatar image from assets

  // Icons
  editIcon = 'edit.svg';
  starIcon = 'star.svg';
  calendarIcon = 'calendar.svg';
  clockIcon = 'clock.svg';
  seatIcon = 'bookbtn.svg'; // Using an available icon
  cancelIcon = 'delete.svg';

  // Bookings
  myBookings: Booking[] = [
    {
      id: '1',
      movieTitle: 'Dune: Part Two',
      posterUrl: 'spiderman.jpg', // Using existing image
      date: 'Tomorrow, May 24',
      timeAndScreen: '20:30 • Screen 4',
      seats: 'Seats G12, G13 (VIP)'
    },
    {
      id: '2',
      movieTitle: 'Interstellar: IMAX',
      posterUrl: 'spiderman.jpg',
      date: 'Sat, May 26',
      timeAndScreen: '18:00 • Screen 1',
      seats: 'Seat F09 (Standard)'
    },
    {
      id: '3',
      movieTitle: 'Interstellar: IMAX',
      posterUrl: 'spiderman.jpg',
      date: 'Sat, May 26',
      timeAndScreen: '18:00 • Screen 1',
      seats: 'Seat F09 (Standard)'
    },
    {
      id: '4',
      movieTitle: 'Interstellar: IMAX',
      posterUrl: 'spiderman.jpg',
      date: 'Sat, May 26',
      timeAndScreen: '18:00 • Screen 1',
      seats: 'Seat F09 (Standard)'
    }
  ];

  // History
  bookingHistory: HistoryItem[] = [
    {
      id: '101',
      movieTitle: 'Poor Things',
      date: 'Apr 12, 2024',
      venue: 'Main Hall, Hall A',
      amount: 18.50,
      status: 'Completed'
    },
    {
      id: '102',
      movieTitle: 'Oppenheimer',
      date: 'Mar 05, 2024',
      venue: 'IMAX Experience',
      amount: 24.00,
      status: 'Completed'
    },
    {
      id: '103',
      movieTitle: 'The Holdovers',
      date: 'Feb 14, 2024',
      venue: 'Screen 2',
      amount: 32.00,
      status: 'Refunded'
    }
  ];

  onViewTicket(id: string) {
    console.log('View ticket', id);
  }

  onCancelBooking(id: string) {
    console.log('Cancel booking', id);
  }

  onLoadMoreHistory() {
    console.log('Load more history');
  }
}

