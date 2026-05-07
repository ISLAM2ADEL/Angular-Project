import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ThemeService } from '../../services/ThemeService';
import { Button } from '../button/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Button],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  darkTheme = inject(ThemeService);

  protected readonly title = signal('Cinema');
  private router=inject(Router);
  get isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  get isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role?.toLowerCase() === 'admin';
  }

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
  changeTheme(){
    this.darkTheme.toggleDarkMode();
    console.log("hello ");
  }
 }
