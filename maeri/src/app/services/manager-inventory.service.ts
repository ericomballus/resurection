import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment, uri } from '../../environments/environment';
import { OfflineManagerService } from './offline-manager.service';
import { UrlService } from './url.service';
import { SaverandomService } from './saverandom.service';
//import { CacheService } from "ionic-cache";
const API_STORAGE_KEY = 'specialkey';

@Injectable({
  providedIn: 'root',
})
export class ManagerInventoryService {
  url = 'http://localhost:3000/';
  // url = "http://ec2-52-59-243-171.eu-central-1.compute.amazonaws.com:3000/";

  database: any;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private randomStorage: SaverandomService,
    private urlService: UrlService //private cache: CacheService
  ) {
    this.takeUrl();
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      console.log('url', this.url);
    });
    if (environment.production) {
      this.url = this.url;
    } else {
      this.url = uri;
    }
  }

  postInvetory(inventaire, closingCash?) {
    let adminId = localStorage.getItem('adminId');
    let user = JSON.parse(localStorage.getItem('user'));
    let storeId = this.randomStorage.getStoreId();
    let cashClose = 0;
    if (closingCash) {
      cashClose = closingCash;
    }
    let data = {
      Inventory: inventaire,
      adminId: adminId,
      employeId: user._id,
      storeId: storeId,
      cashClose: cashClose,
    };
    return this.http.post(this.url + `managerinventory/`, data);
  }

  getInventory() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `managerinventory/admin?adminId=${adminId}`
    );
  }

  getLastInventory() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `managerinventory/admin/last_inventaire?adminId=${adminId}`
    );
  }

  getLastPurchases(oldDate, newDate) {
    let adminId = localStorage.getItem('adminId');
    let storeId = this.randomStorage.getStoreId();
    return this.http.get(
      this.url +
        `purchase/${adminId}/all/for_inventory?db=${adminId}&olDate=${oldDate}&newDate=${newDate}&storeId=${storeId}`
    );
  }

  getLastBills(oldDate, newDate) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `bill/for_inventory?db=${adminId}&olDate=${oldDate}&newDate=${newDate}`
    );
  }

  getLastCashOpen() {
    let adminId = localStorage.getItem('adminId');
    let storeId = this.randomStorage.getStoreId();
    return this.http.get(
      this.url +
        `cashOpen/${adminId}/all/cashOpen?db=${adminId}&storeId=${storeId}`
    );
  }

  getLastInventorie(id) {
    //les produits lors de la derniére ouverture de caisse
    let adminId = localStorage.getItem('adminId');
    let storeId = this.randomStorage.getStoreId();
    return this.http.get(
      this.url +
        `inventory/${adminId}/last/close/oropen?db=${adminId}&cashOpeningId=${id}&storeId=${storeId}`
    );
  }
}
