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
  isMenuOpen = false;

  get isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role?.toLowerCase() === 'admin';
  }

  logOut(){
    localStorage.removeItem('token');
    this.isMenuOpen = false;
    this.router.navigate(['/sign-in']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  navigateTo(path: string) {
    this.closeMenu();
    this.router.navigate([path]);
  }

  openCinebot() {
    this.closeMenu();
    window.dispatchEvent(new CustomEvent('open-cinebot'));
  }

  changeTheme(){
    this.darkTheme.toggleDarkMode();
    
    this.closeMenu();
  }
 }
