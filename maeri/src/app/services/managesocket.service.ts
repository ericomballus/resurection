import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { UrlService } from './url.service';
@Injectable({
  providedIn: 'root',
})
export class ManagesocketService {
  public sockets;
  public url;
  mysocket = new BehaviorSubject(null);
  adminId: any;
  sock: boolean = false;
  constructor(public urlService: UrlService) {
    this.takeUrl();
  }

  takeUrl() {
    console.log('je demmare ici url');

    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      this.adminId = localStorage.getItem('adminId');
      this.sockets = io(this.url);
      this.mysocket.next(this.sockets);
    });
  }

  getSocket() {
    return this.mysocket;
  }

  disconnectSocket() {
    this.sockets.disconnect();
  }
  getMySocket() {
    return this.sockets;
  }
}
