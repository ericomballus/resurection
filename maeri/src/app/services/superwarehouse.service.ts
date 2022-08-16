import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, interval, of, zip } from 'rxjs';
import { Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import {
  shareReplay,
  filter,
  groupBy,
  mergeMap,
  toArray,
  concatMap,
  mergeAll,
  concatAll,
} from 'rxjs/operators';
import { environment, uri } from '../../environments/environment';
import { OfflineManagerService } from './offline-manager.service';
import { Storage } from '@ionic/storage';
import { tap, map, catchError } from 'rxjs/operators';
import { NetworkService, ConnectionStatus } from './network.service';
import { UrlService } from './url.service';

import { BehaviorSubject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Platform } from '@ionic/angular';
import { CachingService } from './caching.service';
import { SaverandomService } from './saverandom.service';
import { PrinterService } from './printer.service';

//import { Events } from "@ionic/angular";

const API_STORAGE_KEY = 'specialkey';

@Injectable({
  providedIn: 'root',
})
export class SuperwarehouseService {
  id: any;
  database: any;
  userName: String = 'unknown';
  url: string = 'http://192.168.100.10:3000/';
  constructor(
    private http: HttpClient,
    private httpN: HTTP,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private urlService: UrlService,
    private platform: Platform,
    private cacheService: CachingService,
    private saveRandom: SaverandomService,
    private printerService: PrinterService,
    private cache: CachingService
  ) {
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        // console.log("url", this.url);
      });
    } else {
      this.url = uri;
    }
  }

  updateBillardGame(data) {
    return this.http.patch(
      `${this.url}billard/${data.adminId}?db=${data.adminId}`,
      data
    );
  }
}
