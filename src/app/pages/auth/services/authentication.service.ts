import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRoles } from 'src/app/core/models/users.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private httpClient = Inject(HttpClient)
  private router = Inject(Router)
  
  private authUrl = `${environment.API_URL}/api/v1/auth`;
  private jwtHelper: JwtHelperService = new JwtHelperService();

  public get getToken(): string {
    return localStorage.getItem("token")!;
  }

  public setToken(token: string): void {
    localStorage.setItem("token", JSON.stringify(token));
  }

  private clearStorage(): void {
    localStorage.clear();
  }

  public isAuthenticated(): boolean {
    const token: string | null = this.getToken
    if (token && !this.jwtHelper.isTokenExpired(token)) return true
    return false
  }

  public get getUserRole(): UserRoles {
    const token: string = this.getToken
    const decodedToken = token && this.jwtHelper.decodeToken(token)
    console.log('Decoded Token: ', decodedToken);

    return 'ADMIN'
  }

  public signIn(payload: any): Observable<any> {
    return this.httpClient.post(`${this.authUrl}/login`, payload)
      .pipe(
        tap((result: any) => {
          this.clearStorage()
          const { status, data } = result

          this.setToken(data.token);
        }),
      )
  }



}
