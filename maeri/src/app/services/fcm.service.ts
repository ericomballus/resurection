import { Injectable } from '@angular/core';
import { environment, uri } from '../../environments/environment';
//import 'firebase/database';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  token: any;
  private unsubscribe$ = new Subject();
  constructor(private plt: Platform) {}

  async getToken() {}

  destroyObservable(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private saveToken(token) {}
}
/*





*/
//com.maeriapp.pos
