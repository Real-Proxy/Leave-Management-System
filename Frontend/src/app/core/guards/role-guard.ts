import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requiredRole = route.data['role'];
  const userRole = Number(localStorage.getItem('role'));

  if (userRole !== requiredRole) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
