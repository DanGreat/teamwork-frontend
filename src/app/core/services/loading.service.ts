import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loading.asObservable()

  constructor() { }

  showLoading() {
    this.loading.next(true)
  }

  hideLoading() {
    this.loading.next(false)
  }
}
