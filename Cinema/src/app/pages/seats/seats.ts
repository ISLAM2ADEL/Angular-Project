import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { Seat } from "../../components/seat/seat";
import { Button } from "../../components/button/button";

@Component({
  selector: 'app-seats',
  imports: [Seat, Button],
  templateUrl: './seats.html',
  styleUrl: './seats.css',
})
export class Seats {
  seats = signal(
    Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      isTaken: Math.random() > 0.7,
    }))
  );
}
