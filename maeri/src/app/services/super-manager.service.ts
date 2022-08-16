import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { CachingService } from './caching.service';
import { SaverandomService } from './saverandom.service';
import { environment, uri } from '../../environments/environment';
import { AdminService } from './admin.service';
@Injectable({
  providedIn: 'root',
})
export class SuperManagerService {
  database: any;
  userName: String = 'unknown';
  url: string = 'http://192.168.100.10:3000/';
  id: any;
  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private admin: AdminService
  ) {
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
      });
    } else {
      this.url = uri;
    }
  }

  getOpenCash(storeId) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `cashOpen/${adminId}?db=${adminId}&storeId=${storeId}`
    );
  }

  getProductionTransaction() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `production_transaction/${adminId}?db=${adminId}`
    );
  }
}
