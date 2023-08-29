import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/pages/auth/services/authentication.service';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class RequestsInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notification: NotificationService,
    private loadingService: LoadingService,
    private authService: AuthenticationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showLoading();

    // Endpoints not to set bearer token to
    if (this.excludedEndpoints(request)) {
      return next.handle(request).pipe(
        catchError((error) => this.handleError(error, next, request)),
        finalize(() => this.loadingService.hideLoading())
      );
    }

    const token = this.authService.getToken;
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error) => this.handleError(error, next, modifiedRequest)),
      finalize(() => this.loadingService.hideLoading())
    );

  }

  private excludedEndpoints(req: HttpRequest<any>): boolean {
    const excludedEnpoints = [
      'login',
    ];
    const endpointParts = req.url.split('/');
    const endpoint = endpointParts[endpointParts.length - 1];
    return excludedEnpoints.includes(endpoint);
  }

  private handleError(
    err: HttpErrorResponse,
    next: HttpHandler,
    req: HttpRequest<any>
  ) {
    const statusCode = err.status;
    const errorMessage = err?.error?.message;

    switch (statusCode) {
      case 401:
        this.notification.error(errorMessage || 'You Are Unauthorized');
        return throwError(() => err);
      case 400:
        this.notification.error(errorMessage || 'No Resource Found');
        return throwError(() => err);
      case 403:
        this.notification.error(errorMessage || 'Forbidden To Access Resource');
        return throwError(() => err);
      case 404:
        this.notification.error(errorMessage || 'Resource Not Found');
        return throwError(() => err);
      case 415:
        this.notification.error(errorMessage || 'Unsupported Media Type');
        return throwError(() => err);
      case 0:
        this.notification.error(
          errorMessage || 'Please Check Your Network Connection'
        );
        return throwError(() => err);
      case 503:
        this.notification.error(
          errorMessage || 'Service Unavailable, Please Try Again Later'
        );
        return throwError(() => err);
      case 504:
        this.notification.error(errorMessage || 'Gateway Timeout');
        return throwError(() => err);
      case 500:
        this.notification.error(
          errorMessage || 'Internal Server Error, Please Try Again Later'
        );
        return throwError(() => err);
      default:
        return throwError(() => err);
    }
  }

}
