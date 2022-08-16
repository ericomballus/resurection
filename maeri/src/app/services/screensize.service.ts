import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreensizeService {
  public isDesktop = new BehaviorSubject<boolean>(false);
  public screenValue = new BehaviorSubject<number>(0);

  constructor() {}

  onResize(size) {
    if (size < 568) {
      this.isDesktop.next(false);
    } else {
      this.isDesktop.next(true);
    }
    this.screenValue.next(size);
  }

  isDesktopView(): Observable<boolean> {
    return this.isDesktop.asObservable().pipe(distinctUntilChanged());
  }

  getScreenSize(): Observable<number> {
    return this.screenValue.asObservable().pipe(distinctUntilChanged());
  }
}
