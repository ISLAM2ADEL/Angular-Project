import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/button/button';
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, Button, Header],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  // Navigation Icons
  homeIcon = 'home icon.svg';
  clockIcon = 'clock.svg';
  moviesIcon = 'movies icon.svg';
  themeIcon = 'theme icon.svg';
  profileIcon = 'sign up icon.svg';
  logoutIcon = 'log in icon.svg';

  // Checkout Data
  movieTitle = 'Interstellar Echoes';
  movieDate = 'Friday, Oct 24, 2024';
  movieTimeAndDuration = '08:30 PM • 2h 45m';
  hallInfo = 'Hall 04 • Premium IMAX';
  seatsInfo = 'o12, o13, o14 (VIP Row)';
  
  // Price Summary
  ticketsPrice = 54.00;
  vipLoungePrice = 15.00;
  serviceFee = 4.50;
  totalAmount = 73.50;

  posterUrl = 'spiderman.jpg'; // Using an existing image

  onConfirmPayment() {
    console.log('Payment confirmed');
  }
}
