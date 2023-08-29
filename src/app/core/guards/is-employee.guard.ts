import { CanActivateFn } from '@angular/router';

export const isEmployeeGuard: CanActivateFn = (route, state) => {
  return true;
};
