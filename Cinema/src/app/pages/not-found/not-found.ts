import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-not-found',
  imports: [Button],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}
