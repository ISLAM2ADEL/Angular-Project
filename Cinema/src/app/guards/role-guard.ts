import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router =inject(Router);
  const userRole= localStorage.getItem('role');
  const expectedRole = route.data['role'] ;
  if(userRole===expectedRole||userRole==='Admin'){
    return true;
  }
  else
  {
    router.navigate(["/home"]);
    return false;
  }
};
