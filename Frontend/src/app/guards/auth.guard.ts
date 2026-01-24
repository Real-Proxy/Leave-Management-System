import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        return router.createUrlTree(['/login']);
    }

    const expectedRoles = route.data['roles'] as Array<string>;
    if (expectedRoles) {
        const userRole = authService.getUserRole();
        if (!userRole || !expectedRoles.includes(userRole)) {
            // Role not authorized, maybe redirect to a specific 'forbidden' page or just dashboard
            // For now, redirect to dashboard if they are logged in but wrong role
            return router.createUrlTree(['/dashboard']);
        }
    }

    return true;
};
