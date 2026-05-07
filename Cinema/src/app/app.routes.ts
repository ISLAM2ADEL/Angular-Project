import { Routes } from '@angular/router';
import { roleGuard } from './guards/role-guard';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies').then(m => m.Movies),
  },
  {
    path: 'movie/:movieId',
    loadComponent: () => import('./pages/movie-detail/movie-detail').then(m => m.MovieDetail),
  },
  {
    path: 'seats/:movieId/:showTimeId',
    loadComponent: () => import('./pages/seats/seats').then(m => m.Seats),
    canActivate:[authGuard]
  },
  {
    path: 'checkout/:movieId/:showTimeId/:seatId',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout),
    canActivate:[authGuard]
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/signin/signin').then(m => m.Signin),
    canActivate: [guestGuard]
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/signup/signup').then(m => m.Signup),
    canActivate: [guestGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile').then(m => m.UserProfile),
    canActivate: [authGuard]
  },
  {
    path: 'admin-panel',
    loadComponent: () => import('./pages/admin-panel/admin-panel').then(m => m.AdminPanel),
    canActivate: [roleGuard],
    data: { role: 'admin' }
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
  },
];
