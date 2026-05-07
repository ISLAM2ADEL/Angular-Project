import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ThemeService } from '../../services/ThemeService';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
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

  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']);
  }
  changeTheme(){
    this.darkTheme.toggleDarkMode();
    console.log("hello ");
  }
 }
