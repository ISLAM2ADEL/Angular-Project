import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router =inject(Router);
  const userRole = (localStorage.getItem('role') || '').toLowerCase();
  const expectedRole = String(route.data['role'] || '').toLowerCase();

  if (userRole && userRole === expectedRole) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
