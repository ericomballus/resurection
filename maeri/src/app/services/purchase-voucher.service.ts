import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from, of, throwError } from 'rxjs';
import { tap, map, catchError, switchAll, switchMap } from 'rxjs/operators';
import { environment, uri } from '../../environments/environment';
import { UrlService } from './url.service';
import { SaverandomService } from './saverandom.service';
import { BonDeRemboursement } from '../models/refundVoucher.model';
import { OfflineManagerService } from './offline-manager.service';
@Injectable({
  providedIn: 'root',
})
export class PurchaseVoucherService {
  url = 'http://localhost:3000/';
  // url = "http://ec2-52-59-243-171.eu-central-1.compute.amazonaws.com:3000/";

  database: any;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private urlService: UrlService,
    private saveRandogm: SaverandomService,
    private offlineManager: OfflineManagerService
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

  getPurchaseOrder() {
    let adminId = localStorage.getItem('adminId');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let URL =
      this.url +
      `purchaseorder/${adminId}/?db=${adminId}&storeId=${storeId}&db=${adminId}`;
    return this.http.get(URL);
  }

  /*adminGetPurchaseOrder() {
    let adminId = localStorage.getItem('adminId');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let URL =
      this.url +
      `purchaseorder/admin/${adminId}/?db=${adminId}&storeId=${storeId}&db=${adminId}`;
    return this.http.get(URL);
  } */

  getOnePurchase(billId) {
    let adminId = localStorage.getItem('adminId');
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let URL =
      this.url +
      `purchaseorder/${adminId}/${billId}?db=${adminId}&storeId=${storeId}&db=${adminId}`;
    return this.http.get(URL);
  }

  updatePurchaseOrder(voucher: BonDeRemboursement) {
    let adminId = localStorage.getItem('adminId');
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let openCashDateId = this.saveRandogm.getCashOpenId();
    voucher.managerSend = false;
    voucher['posConfirm'] = true;
    let URL =
      this.url +
      `purchaseorder/?db=${adminId}&storeId=${storeId}&db=${adminId}`;
    if (openCashDateId) {
      voucher.openCashDateId = openCashDateId;
      return this.http.patch(URL, voucher).pipe(
        catchError((err) => {
          // return "hello";
          return this.offlineManager.storeCommande(
            URL,
            'PATCH',
            voucher
            // throw new Error(err);
          );
        })
      );
    }
  }
}
