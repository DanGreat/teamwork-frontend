import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/pages/auth/services/authentication.service';
import { Role } from '../models/users.model';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const router = Inject(Router)
  const authService = Inject(AuthenticationService)

  if (authService.isAuthenticated() && authService.getUserRole === Role.ADMIN) return true

  router.navigate(["auth"], { queryParams: { returnUrl: state.url } });
  alert('You do not have admin access')
  return false;
};
