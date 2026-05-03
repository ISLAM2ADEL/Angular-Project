import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  protected readonly title = signal('Cinema');
  private router=inject(Router);
  get isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
 }
