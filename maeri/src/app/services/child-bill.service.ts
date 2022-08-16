import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from, of, throwError } from 'rxjs';
import { tap, map, catchError, switchAll, switchMap } from 'rxjs/operators';
import { environment, uri } from '../../environments/environment';
import { OfflineManagerService } from './offline-manager.service';
import { UrlService } from './url.service';
import { CachingService } from './caching.service';
import { SaverandomService } from './saverandom.service';
import { Platform } from '@ionic/angular';
import { BonDeRemboursement } from '../models/refundVoucher.model';
@Injectable({
  providedIn: 'root',
})
export class ChildBillService {
  url = 'http://localhost:3000/';
  database: any;
  userName: String = 'unknown';
  items: any;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private urlService: UrlService,
    private cache: CachingService,
    private saveRandom: SaverandomService,
    private platform: Platform,
    private networkService: NetworkService
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
  getOneChild(childId) {
    let adminId = localStorage.getItem('adminId');

    return this.http.get(this.url + `childbill/${childId}?db=${adminId}`);
  }
  buyChildOrder(items) {
    let confirm = false;
    let Posconfirm = false;
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let openCashDate = localStorage.getItem('openCashDate');
    let isRetailer = false;
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let idL =
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5) + JSON.parse(localStorage.getItem('user'))['_id'];
    let voucher: BonDeRemboursement = this.saveRandom.getVoucher();
    let repaymentWithOtherProducts = voucher.repaymentWithOtherProducts;
    if (this.saveRandom.checkIfIsRetailer()) {
      isRetailer = true;
    }
    if (tabRoles.includes(4)) {
      (confirm = true), (Posconfirm = true);
    }
    if (tabRoles.includes(2)) {
      (confirm = true), (Posconfirm = true);
    }

    if (tabRoles.includes(5)) {
      (confirm = true), (Posconfirm = false);
    }
    this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
    let adminId = localStorage.getItem('adminId');

    let numFacture;
    if (parseInt(localStorage.getItem('numFacture'))) {
      numFacture = parseInt(localStorage.getItem('numFacture')) + 1;
      localStorage.setItem('numFacture', numFacture);
    } else {
      numFacture = 1;
      localStorage.setItem('numFacture', '1');
    }
    let data = {
      cart: items,
      adminId: adminId,
      confirm: confirm,
      Posconfirm: Posconfirm,
      openCashDate: openCashDate,
      openCashDateId: openCashDateId,
      userName: this.userName,
      numFacture: numFacture,
      localId: idL,
      senderId: senderId,
      storeId: storeId,
      isRetailer: isRetailer,
      confirmPaie: items.confirmPaie,
      delivery: items.delivery,
      billId: items.billId,
      repaymentWithOtherProducts,
    };
    if (items.consigneTab && items.consigneTab.length) {
      data['consigne'] = items.consigneTab;
    }
    let obj = data;
    //  console.log(obj);
    if (localStorage.getItem('noOfflinemode') || tabRoles.includes(4)) {
      // this.events.publish("commande", obj);
    }

    let url =
      this.url +
      'childbill/' +
      this.userName +
      '/' +
      adminId +
      '?db=' +
      adminId;

    if (this.platform.is('android')) {
      let obj = JSON.stringify(data);
      if (
        this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
      ) {
      } else {
        return this.http.post(url, obj, {}).pipe(
          catchError((err) => {
            /*provisoire code */
            let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
            let table = [];
            table.push(items);
            let commande = data;
            commande['commandes'] = table;
            commande['Posconfirm'] = true;
            commande['commande'] = items;
            let tab = [];
            if (JSON.parse(localStorage.getItem(`lesCommandes`))) {
              tab = JSON.parse(localStorage.getItem(`lesCommandes`));
            }

            if (tab && tab.length) {
              setTimeout(() => {
                tab.push(commande);
                localStorage.setItem(`lesCommandes`, JSON.stringify(tab));
              }, 500);
            } else {
              setTimeout(() => {
                let store = [];
                store.push(commande);
                localStorage.setItem(`lesCommandes`, JSON.stringify(store));
              }, 500);
            }

            let url =
              this.url +
              'childbill/' +
              this.userName +
              '/' +
              adminId +
              '?db=' +
              adminId;
            // return "hello";
            return this.offlineManager.storeCommande(
              url,
              'POST',
              {
                cart: items,
                adminId: adminId,

                confirm: confirm,
                Posconfirm: Posconfirm,
                openCashDate: openCashDate,
                userName: this.userName,
                products: items['products'],
                commande: items,
                sale: false,
                created: Date.now(),

                openCashDateId: openCashDateId,
                localId: idL,
                isRetailer: isRetailer,
                invoiceCancel: false,
                storeId: storeId,
                repaymentWithOtherProducts,
              }
              // throw new Error(err)
            );
          })
        );
      }
    } else {
      return this.http.post(url, obj, {}).pipe(
        catchError((err) => {
          /*provisoire code */
          let table = [];
          table.push(items);
          let commande = data;
          commande['commandes'] = table;
          commande['Posconfirm'] = true;
          commande['commande'] = items;
          if (items.consigneTab) {
            commande['consigne'] = items.consigneTab;
          }
          let tab = [];
          if (JSON.parse(localStorage.getItem(`allCommande`))) {
            tab = JSON.parse(localStorage.getItem(`allCommande`));
          }

          if (tab && tab.length) {
            setTimeout(() => {
              tab.push(commande);
              localStorage.setItem(`allCommande`, JSON.stringify(tab));
            }, 500);
          } else {
            setTimeout(() => {
              let store = [];
              store.push(commande);
              localStorage.setItem(`allCommande`, JSON.stringify(store));
            }, 500);
          }

          /*fin provisoire */
          console.log('ici error', err);
          // alert("error");
          // alert(JSON.stringify(err));
          let url =
            this.url +
            'childbill/' +
            this.userName +
            '/' +
            adminId +
            '?db=' +
            adminId;
          // return "hello";
          // table.push(items);

          return this.offlineManager.storeCommande(
            url,
            'POST',
            {
              commandes: table,
              cart: items,
              adminId: adminId,
              confirm: confirm,
              Posconfirm: Posconfirm,
              openCashDate: openCashDate,
              userName: this.userName,
              products: items['products'],
              commande: items,
              sale: false,
              created: Date.now(),

              openCashDateId: openCashDateId,
              localId: idL,
              isRetailer: isRetailer,
              invoiceCancel: false,
              storeId: storeId,
              repaymentWithOtherProducts,
            }
            // throw new Error(err);
          );
        })
      );
    }
  }
}
