import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment, uri } from '../../environments/environment';
import { UrlService } from './url.service';
import { SaverandomService } from './saverandom.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class RefuelingService {
  id: any;
  database: any;
  url: string = 'http://192.168.100.10:3000/';
  tabRoles = [];

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private saveRandom: SaverandomService
  ) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.tabRoles = JSON.parse(localStorage.getItem('roles'));
      if (this.tabRoles.includes(5)) {
        this.urlService.getUrlEvent().subscribe((data) => {
          this.url = data;
        });
      } else {
        this.urlService.getUrl().subscribe((data) => {
          this.url = data;
          console.log('url', this.url);
        });
      }
    } else {
      this.url = uri;
    }
  }

  managerGetRefueling() {
    this.database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();

    return this.http.get(
      `${this.url}refueling/${this.id}?db=${
        this.id
      }&storeId=${storeId}&confirm=${false}`
    );
  }
  getNotConfirmRefueling() {
    this.database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();
    return this.http.get(
      `${this.url}refueling/${this.id}/notConfirm?db=${
        this.id
      }&confirm=${false}&storeId=${storeId}`
    );
  }

  superManagerRefueling() {
    this.database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    return this.http.get(
      `${this.url}refueling/${this.id}/notConfirm?db=${
        this.id
      }&confirm=${false}`
    );
  }

  managerConfirmRefueling(data) {
    this.database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    data['confirm'] = true;
    /* return this.http.get(
      `${this.url}refueling/${this.id}?db=${this.id}&storeId=${storeId}&confirm=${false}`
    );*/

    return this.http.patch(
      `${this.url}billard/quantity?db=${this.id}&transaction=${true}`,
      data
    );
  }

  updateServiceItemQuantity(data) {
    this.database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    data['adminId'] = this.id;
    let supermanager = false;
    let senderId = '';
    let user: User = this.saveRandom.getUserCredentail();
    if (user) {
      senderId = user._id;
    }
    data['senderId'] = senderId;
    console.log(data);
    console.log(user);
    if (user && user.role[0]['numberId'] == 6) {
      supermanager = true;
      return this.http.post(
        `${this.url}refueling/?db=${this.id}&supermanager=${supermanager}`,
        data
      );
    } else {
      return this.http.patch(
        `${this.url}billard/quantity?db=${this.id}&supermanager=${supermanager}`,
        data
      );
    }
  }
}
