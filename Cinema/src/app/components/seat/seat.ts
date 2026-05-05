import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-seat',
  standalone: true,
  templateUrl: './seat.html',
  styleUrl: './seat.css',
})
export class Seat {
  isTaken = input(false);
  isSelected = input(false);
  selectionChange = output<boolean>();

  toggleSeat() {
    if (this.isTaken()) return;
    this.selectionChange.emit(!this.isSelected());
  }
}
