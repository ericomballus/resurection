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
import { Bill } from '../models/bill.model';
//import { CacheService } from "ionic-cache";
const API_STORAGE_KEY = 'specialkey';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  url = 'http://localhost:3000/';
  // url = "http://ec2-52-59-243-171.eu-central-1.compute.amazonaws.com:3000/";

  database: any;
  dbName: any;
  collectionList: any;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private urlService: UrlService,
    private cache: CachingService,
    private saveRandom: SaverandomService
  ) {
    this.takeUrl();
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // console.log('url', this.url);
    });
    if (environment.production) {
      this.url = this.url;
    } else {
      this.url = uri;
    }
  }

  getUser() {
    console.log(localStorage.getItem('uri'));
    return this.http.get(this.url + `users`);
  }

  getVenders() {
    console.log(localStorage.getItem('uri'));
    return this.http.get(this.url + `users/takeuser/venderRole/:admindId`);
  }

  getUserById(id) {
    console.log(localStorage.getItem('uri'));
    // let res = { user: [JSON.parse(localStorage.getItem('user'))] };
    let user = JSON.parse(localStorage.getItem('adminUser'));
    if (user && user._id == id) {
      let res = { users: [JSON.parse(localStorage.getItem('adminUser'))] };
      return of(res);
    } else {
      return this.http.get(this.url + `users/takeuser/${id}`);
    }
  }

  updateCustomer(custumer) {
    console.log(localStorage.getItem('uri'));
    return this.http.patch(this.url + `users`, custumer);
  }

  deleteCustomer(custumer) {
    console.log(localStorage.getItem('uri'));
    return this.http.delete(this.url + `users/${custumer['_id']}`);
  }

  customersDB(adminId) {
    console.log(localStorage.getItem('uri'));
    return this.http.get(this.url + `database?adminId=${adminId}`);
  }

  customersDbCollectionsName(dbName) {
    console.log(localStorage.getItem('uri'));
    return this.http.get(this.url + `databaseCollections?dbName=${dbName}`);
  }

  customersDropDbCollection(dbName, collectionName) {
    return this.http.get(
      this.url +
        `databaseDropCollections?dbName=${dbName}&collectionName=${collectionName}`
    );
  }
  getDocsDbCollection(dbName, collectionName) {
    return this.http.get(
      this.url +
        `databaseCollectionsGetDocs?dbName=${dbName}&collectionName=${collectionName}&take=${true}`
    );
  }

  deleteDocsDbCollection(dbName, collectionName, data) {
    return this.http.post(
      this.url +
        `databaseCollectionsDeleteDocs?dbName=${dbName}&collectionName=${collectionName}&take=${true}`,
      data
    );
  }

  getUserRole() {
    let adminId = localStorage.getItem('adminId');
    // return this.http.patch(this.url + `invoice?db=${adminId}`, order);
    if (adminId) {
      return this.http.get(this.url + `Role?adminId=${adminId}`);
    } else {
      return this.http.get(this.url + `Role`);
    }
  }
  postUserRole(data) {
    return this.http.post(this.url + `Role`, data);
  }

  deleteUserRole(data) {
    return this.http.delete(this.url + `Role/${data._id}`, data);
  }

  deleteUserEmployee(data) {
    let dat = JSON.parse(localStorage.getItem('user'));

    // let user = dat[0]["employes"]; //this.user[0]._id
    let id = localStorage.getItem('adminId');
    return this.http.post(this.url + `users/delete/employe/${id}`, data);
  }

  getOrder() {
    let adminId = localStorage.getItem('adminId');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];

    console.log('depuis le cached!!!!');

    return this.http.get(
      this.url +
        `invoice/admin/${adminId}?db=${adminId}&openCashDateId=${openCashDateId}`
    );
  }
  getRetailer() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(this.url + `vendor/retailer/${adminId}`);
  }
  getVendors() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(this.url + `vendor/${adminId}`);
  }
  postVendor(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.post(this.url + `vendor/`, data);
  }
  unsubscribedVendor(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.put(this.url + `vendor/`, data);
  }
  subscribeRetailer(data) {
    return this.http.put(this.url + `vendor/confirmRetailer/`, data);
  }
  getOrder2(numPage?) {
    let adminId = localStorage.getItem('adminId');
    let openCashDate = localStorage.getItem('openCashDate');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    if (numPage) {
      numPage = parseInt(numPage);
    }
    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&openCashDateId=${openCashDateId}&numPage=${numPage}`
    );
  }

  getAllOrder() {
    let adminId = localStorage.getItem('adminId');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];

    return this.http.get(
      this.url + `invoice?db=${adminId}&openCashDateId=${openCashDateId}`
    );
    /* .pipe(
          // map(res => res["data"]),
          tap(res => {
            this.setLocalData("orders", res);
          })
        ); */
  }

  getAllOrderSudo(db) {
    //
    let adminId = localStorage.getItem('adminId');
    //let openCashDate = localStorage.getItem("openCashDate");
    console.log(this.url);

    return this.http.get(this.url + `invoice?db=${adminId}`);
    /* .pipe(
          // map(res => res["data"]),
          tap(res => {
            this.setLocalData("orders", res);
          })
        ); */
  }
  buyOrder(order) {
    let adminId = localStorage.getItem('adminId');

    let URL = this.url + `invoice?db=${adminId}`;
    console.log('voici le order ======>', order);

    return this.offlineManager.storeCommande(URL, 'PATCH', order);
    /* return this.http.patch(this.url + `invoice?db=${adminId}`, order).pipe(
      catchError((err) => {
        return this.offlineManager.storeCommande(URL, 'PATCH', order);
      })
    );*/
  }

  buyAndUpdateOrder(order) {
    let adminId = localStorage.getItem('adminId');

    let URL = this.url + `invoice?db=${adminId}`;
    // return this.offlineManager.storeCommande(URL, 'PATCH', order);
    return this.http.patch(this.url + `invoice?db=${adminId}`, order);
  }

  deleteOrder(order) {
    let adminId = localStorage.getItem('adminId');

    let URL = this.url + `invoice?db=${adminId}`;
    // return this.offlineManager.storeCommande(URL, 'PATCH', order);
    return this.http.delete(this.url + `invoice?db=${adminId}`, order);
  }

  makeAvanceOrder(order) {
    let adminId = localStorage.getItem('adminId');

    let URL = this.url + `invoice?db=${adminId}`;
    return this.offlineManager.storeCommande(
      URL,
      'PATCH',
      order
      // throw new Error(err);
    );
    return this.http
      .patch(this.url + `invoice?db=${adminId}&notComplete=${true}`, order)
      .pipe(
        catchError((err) => {
          return this.offlineManager.storeCommande(
            URL,
            'PATCH',
            order
            // throw new Error(err);
          );
        })
      );
  }

  createBill(order) {
    let adminId = localStorage.getItem('adminId');

    console.log('admin service ok');
    let URL = this.url + `bill?db=${adminId}`;
    return this.http.post(URL, order).pipe(
      catchError((err) => {
        return this.offlineManager.storeCommande(
          URL,
          'POST',
          order
          // throw new Error(err);
        );
      })
    );
  }

  createBillFree(order) {
    let adminId = localStorage.getItem('adminId');

    console.log('admin service ok');
    let URL = this.url + `bill?db=${adminId}`;
    return this.http.post(URL, order);
  }

  swUpdateBill(order) {
    let adminId = localStorage.getItem('adminId');

    console.log('admin service ok');
    order['swConfirm'] = true;
    let URL = this.url + `invoice?db=${adminId}`;
    return this.http.patch(URL, order);
  }
  getBill(whoIs?, all?) {
    let adminId = localStorage.getItem('adminId');
    let openCashDateId = 1;
    let storeId = this.saveRandom.getStoreId();
    let checkWhoIs = null;
    let cancel = false;
    if (all) {
      cancel = all;
    }
    if (whoIs) {
      checkWhoIs = true;
    }

    let sc = true;
    if (JSON.parse(localStorage.getItem('openCashDateObj'))) {
      openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
        '_id'
      ];
      sc = false;
    }

    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (
      tabRoles.includes(8) ||
      tabRoles.includes(7) ||
      tabRoles.includes(9) ||
      tabRoles.includes(10)
    ) {
      openCashDateId = 1;
      sc = true;
    }

    let URL =
      this.url +
      `bill/admin/${adminId}?db=${adminId}&openCashDateId=${openCashDateId}&storeId=${storeId}&whoIs=${checkWhoIs}&sc=${sc}&mballus=${sc}&cancel=${cancel}`;

    return this.http.get(URL);
  }
  getBillShop(urlEvent) {
    let adminId = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];

    let URL =
      urlEvent +
      `bill/admin/${adminId}?db=${adminId}&openCashDateId=${openCashDateId}&storeId=${storeId}`;
    return this.http.get(URL);
  }

  managerGetBillShop() {
    let adminId = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();
    let d = JSON.parse(localStorage.getItem('queryDate'));

    let URL =
      this.url +
      `bill/admin/${adminId}?db=${adminId}&openCashDateId=${d._id}&storeId=${d.storeId}`;
    return this.http.get(URL);
  }

  getBillAggregate(openCashDateId) {
    let adminId = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();
    let URL =
      this.url +
      `bill/admin/${adminId}/aggregate?db=${adminId}&openCashDateId=${openCashDateId}&storeId=${storeId}`;
    return this.http.get(URL);
  }

  getBillAggregate2(openCashDateId) {
    let adminId = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();
    let URL =
      this.url +
      `bill/admin/adminId=${adminId}&openCashDateId=${openCashDateId}&storeId=${storeId}`;
    return this.http.get(URL);
  }
  getBillDeleteAuth(data) {
    let adminId = localStorage.getItem('adminId');
    //  let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let storeId = this.saveRandom.getStoreId();
    let URL =
      this.url +
      `bill/admin/${adminId}/aggregate?db=${adminId}&onlyByDate=${true}&start=${
        data.start
      }&end=${data.end}&storeId=${storeId}`;
    return this.http.get(URL);
  }
  updateBill(id) {
    let adminId = localStorage.getItem('adminId');

    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];

    let URL = this.url + `bill?db=${adminId}`;
    return this.http
      .patch(URL, {
        _id: id,
      })
      .pipe(
        catchError((err) => {
          return this.offlineManager.storeCommande(URL, 'PATCH', {
            _id: id,
          });
        })
      );
  }
  postInventory(order) {
    let adminId = localStorage.getItem('adminId');
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    order['cashOpening'] = openCashDateId;
    order['adminId'] = adminId;
    order['storeId'] = storeId;
    let URL = this.url + `admininventory?db=${adminId}`;
    return this.http.post(URL, order).pipe(
      catchError((err) => {
        console.log(err);

        return 'error';
      })
    );
  }

  postInventory2(order, d) {
    console.log(d);

    let adminId = localStorage.getItem('adminId');
    let openCashDateId = d['_id'];
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    order['cashOpening'] = openCashDateId;
    order['adminId'] = adminId;
    order['storeId'] = storeId;

    let URL = this.url + `admininventory?db=${adminId}`;
    return this.http.post(URL, order).pipe(
      catchError((err) => {
        console.log(err);

        return 'error';
      })
    );
  }

  getAdminInventory() {
    let adminId = localStorage.getItem('adminId');
    //  console.log(JSON.parse(localStorage.getItem("openCashDateObj")));
    let openCashDateId = '';
    if (JSON.parse(localStorage.getItem('queryDate'))) {
      openCashDateId = JSON.parse(localStorage.getItem('queryDate'))['_id'];
    } else {
      openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
        '_id'
      ];
      console.log('voici la date', openCashDateId);
    }

    let URL =
      this.url +
      `admininventory/admin/${adminId}?adminId=${adminId}&cashOpening=${openCashDateId}&db=${adminId}`;
    return this.http.get(URL);
  }

  getAdminInventory2(d) {
    let adminId = localStorage.getItem('adminId');
    console.log(JSON.parse(localStorage.getItem('openCashDateObj')));
    let openCashDateId = JSON.parse(localStorage.getItem('orherIdDay'))['_id'];

    if (d.open) {
      console.log('hello');
    }

    let URL =
      this.url +
      `admininventory/admin/${adminId}?adminId=${adminId}&cashOpening=${openCashDateId}&db=${adminId}`;
    return this.http.get(URL);
  }

  getAdminInventoryRandom(d) {
    let adminId = localStorage.getItem('adminId');
    let openCashDateId = d._id;

    let URL =
      this.url +
      `admininventory/admin/${adminId}?adminId=${adminId}&cashOpening=${openCashDateId}&db=${adminId}&open=${true}`;
    return this.http.get(URL);
  }

  getInventory() {
    let adminId = localStorage.getItem('adminId');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];

    let URL =
      this.url +
      `inventory/admin/${adminId}/last/close?adminId=${adminId}&cashOpening=${openCashDateId}&db=${adminId}`;
    return this.http.get(URL);
  }

  get3LastResumeAdminInventory() {
    let adminId = localStorage.getItem('adminId');
    // let openCashDateId = JSON.parse(localStorage.getItem("orherIdDay"))["_id"];

    let URL =
      this.url +
      `admininventory/admin/${adminId}/aggregate?adminId=${adminId}&db=${adminId}`;
    return this.http.get(URL);
  }

  cancelOrder(id, tabProducts, order?: Bill, Remove?, prix?, resteProduits?) {
    let adminId = localStorage.getItem('adminId');
    let purchaseOrder = null;
    let refundVoucher = null; //reste des produits
    let bill = false;
    let toRemove = [];
    let price = 0;
    let reste = 0;
    let partiallyCancel = false;
    let totalCancel = false;
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    if (price) {
      price = prix;
    }
    if (order) {
      bill = true;
      if (Remove) {
        order['toRemove'] = Remove;
        toRemove = Remove;
      }

      if (price && Remove) {
        purchaseOrder = { price: price, toRemove: Remove };
      }
      if (resteProduits) {
        refundVoucher = resteProduits;
      }
      reste = order.montant - prix;
    }

    if (order.commandes[0].products.length == toRemove.length) {
      partiallyCancel = false;
      totalCancel = true;
    }

    let customerId = null;
    if (order.customer) {
      customerId = order.customerId;
    }

    let data = {
      localId: id,
      adminId: adminId,
      order: { _id: order._id, invoicesId: order.invoicesId },
      bill: bill,
      toRemove: Remove,
      purchaseOrder: purchaseOrder,
      refundVoucher: refundVoucher,
      managerSend: true,
      customerId: customerId,
      storeId,
      billId: order._id,
      price: price,
    };

    return this.http
      .patch(
        this.url + `invoice/confirmOders/invoice/cancel?db=${adminId}`,
        data
      )
      .pipe(
        catchError((err) => {
          console.log(err);

          let urli =
            this.url + `invoice/confirmOders/invoice/cancel?db=${adminId}`;

          return this.offlineManager.storeCommande(urli, 'PATCH', data);
        })
      );
  }

  cancelOrder2(localId, products, order, scMagasin?) {
    let adminId = localStorage.getItem('adminId');
    let data = {};
    let sc = false;
    if (scMagasin) {
      sc = true;
    }
    return this.http
      .patch(this.url + `invoice/confirmOders/invoice/cancel?db=${adminId}`, {
        localId,
        products,
        bill: true,
        order: order,
        createdPurchase: false,
        sc: sc,
      })
      .pipe(
        catchError((err) => {
          let urli =
            this.url + `invoice/confirmOders/invoice/cancel?db=${adminId}`;

          return this.offlineManager.storeCommande(urli, 'PATCH', {
            localId,
            products,
            bill: true,
            order: order,
            createdPurchase: false,
            adminId: adminId,
            sc: sc,
          });
        })
      );
  }

  cancelBill(order) {
    let adminId = localStorage.getItem('adminId');

    return this.http
      .patch(this.url + `invoice/?db=${adminId}&deleteAuth=${true}`, order)
      .pipe(
        catchError((err) => {
          let urli = this.url + `invoice/?db=${adminId}&deleteAuth=${true}`;
          order['deleteAuth'] = true;

          return this.offlineManager.storeCommande(urli, 'PATCH', order);
        })
      );
  }

  cancelAndUpdate(id, oldCommande, newCommande) {
    let adminId = localStorage.getItem('adminId');
    return this.http
      .patch(
        this.url +
          `invoice/confirmOders/invoice/cancel/and/update/changes/values?db=${adminId}`,
        {
          localId: id,
          adminId: adminId,
          oldCommande: oldCommande,
          newCommande: newCommande,

          //  reste: reste,
        }
      )
      .pipe(
        catchError((err) => {
          // this.offlineManager.storeRequest(url, "POST", data);
          // console.log("ici error", err);
          // alert("error");
          // alert(JSON.stringify(err));
          let urli =
            this.url +
            `invoice/confirmOders/invoice/cancel/and/updatedb=${adminId}`;
          // return "hello";
          return this.offlineManager.storeCommande(
            urli,
            'PATCH',
            {
              localId: id,
              adminId: adminId,
              oldCommande: oldCommande,
              newCommande: newCommande,
            }
            // throw new Error(err);
          );
        })
      );
  }
  buyConfirmOder(id, order?) {
    let adminId = localStorage.getItem('adminId');

    console.log('admin service ok');
    return this.http
      .patch(this.url + `invoice/confirmOders?db=${adminId}`, {
        localId: id,
        id: order['_id'],
        adminId: adminId,
        order: order,
      })
      .pipe(
        catchError((err) => {
          // this.offlineManager.storeRequest(url, "POST", data);
          // console.log("ici error", err);
          // alert("error");
          // alert(JSON.stringify(err));
          let urli = this.url + `invoice/confirmOders?db=${adminId}`;
          // return "hello";
          return this.offlineManager.storeCommande(
            urli,
            'PATCH',
            {
              localId: id,
              adminId: adminId,
              order: order,
              id: order['_id'],
            }
            // throw new Error(err);
          );
        })
      );
  }
  serviceConfirmOder(id) {
    let adminId = localStorage.getItem('adminId');

    console.log('admin service ok');
    return this.http.patch(
      this.url + `invoice/confirmOders/service?db=${adminId}`,
      {
        _id: id,
        adminId: adminId,
      }
    );
  }
  getInvoiceCustomer(customerId) {
    // let adminId = localStorage.getItem("adminId");

    /*  return this.http.patch(
      this.url +
        `invoice/admin/paieinvoice/${customerId}/${adminId}/${1}/invoice/get/all?db=${adminId}&customerId=${customerId}`,
      {
        adminId: adminId,
      }
    );*/
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}?db=${adminId}&customerId=${customerId}`
    );
  }
  getInvoicePaie() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `invoice/admin/paieinvoice/${adminId}?db=${adminId}`
    );
  }
  getInvoicePaieSudo(database, adminId) {
    //
    //  let adminId = localStorage.getItem("adminId");
    return this.http.get(
      this.url + `invoice/admin/paieinvoice/${adminId}?db=${database}`
    );
  }

  getInvoiceNotPaie() {
    let tab = [];
    let adminId = localStorage.getItem('adminId');
    let URL =
      this.url +
      `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}`;

    return this.http.get(
      this.url + `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}`
    );
  }

  getInvoiceHalfPaid() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/true/nonpaye?db=${adminId}`
    );
  }

  getInvoiceNotPaieAdmin() {
    let adminId = localStorage.getItem('adminId');
    let openCashDate = localStorage.getItem('openCashDate');
    let cashDate = JSON.parse(localStorage.getItem('openCashDateObj'));
    if (cashDate && cashDate['_id']) {
      let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
        '_id'
      ];
      return this.http.get(
        this.url +
          `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&openCashDate=${openCashDate}&openCashDateId=${openCashDateId}`
      );
    }
  }

  getInvoiceNotPaieAdmin2(openCashDateId) {
    let adminId = localStorage.getItem('adminId');
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let fc = false;
    let sw = false;
    let sa = false;
    let cashier = false;
    let validate = false;
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    if (tabRoles.includes(9)) {
    }
    if (openCashDateId == 1 && tabRoles.includes(7)) {
      fc = false;
      sw = true;
    } else if (openCashDateId == 1 && tabRoles.includes(8)) {
      fc = true;
      sw = false;
      validate = true;
    } else if (openCashDateId == 1 && tabRoles.includes(10)) {
      fc = true;
      sa = true;
    } else if (openCashDateId == 1 && tabRoles.includes(9)) {
      cashier = true;
      fc = false;
      sw = false;
    }
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&check=${true}&openCashDateId=${openCashDateId}&sale=${false}&storeId=${storeId}&fc=${fc}&sw=${sw}&ch=${cashier}&sa=${sa}&userId=${senderId}&validate=${validate}`
    );
  }

  getInvoiceFromSuperAdmin(openCashDateId) {
    let adminId = localStorage.getItem('adminId');
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let fc = false;
    let sw = false;
    let sa = false;
    let cashier = false;
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    cashier = true;
    fc = false;
    sw = false;
    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&check=${true}&openCashDateId=${openCashDateId}&sale=${false}&storeId=${storeId}&fc=${fc}&sw=${sw}&ch=${cashier}&sa=${sa}`
    );
  }

  getInvoiceCancel(openCashDateId) {
    let adminId = localStorage.getItem('adminId');

    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&openCashDateId=${openCashDateId}&cancel=${true}`
    );
  }

  getInvoicePaieAdmin2(openCashDateId) {
    let adminId = localStorage.getItem('adminId');

    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&check=${true}&openCashDateId=${openCashDateId}&sale=${true}`
    );
  }

  getInvoicePaie2(numPage) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `invoice/admin/paieinvoice/${adminId}/${numPage}?db=${adminId}`
    );
  }
  getInvoiceByEmployee(numPage) {
    // let openCashDate = localStorage.getItem("openCashDate");
    let adminId = localStorage.getItem('adminId');
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];

    return this.http.get(
      this.url +
        `invoice/admin/findByUser/${senderId}/${adminId}/${numPage}/invoice/get/all?db=${adminId}&openCashDateId=${openCashDateId}`
    );
  }

  getInvoiceByDate(data) {
    let openCashDate = data;
    let adminId = localStorage.getItem('adminId');
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    return this.http.get(
      this.url +
        `invoice/admin/findByUser/${userName}/${adminId}?db=${adminId}&openCashDate=${openCashDate}`
    );
  }

  getInvoiceByDate2(data, openCashDateId?) {
    let onlyByDate = data;
    let adminId = localStorage.getItem('adminId');
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    if (openCashDateId) {
      return this.http.get(
        this.url +
          `invoice/admin/${adminId}?db=${adminId}&onlyByDate=${onlyByDate}&openCashDateId=${openCashDateId}`
      );
    } else {
      return this.http.get(
        this.url +
          `invoice/admin/${adminId}?db=${adminId}&onlyByDate=${onlyByDate}`
      );
    }
  }

  getInvoiceBonus(data, openCashDateId?) {
    let onlyByDate = data;
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `invoice/admin/${adminId}?db=${adminId}&onlyByDate=${onlyByDate}&bonus=${true}&start=${
          onlyByDate.start
        }&end=${onlyByDate.end}`
    );
  }

  getInvoiceByCustomer(customerId) {
    let all = true;
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `invoice/admin/${adminId}?db=${adminId}&all=${all}&customerId=${customerId}`
    );
  }

  getInvoiceByDate3() {
    let adminId = localStorage.getItem('adminId');
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    return this.http.get(this.url + `invoice?db=${adminId}`);
  }

  getTransaction() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(this.url + `transaction/${adminId}?db=${adminId}`);
  }
  getTransactionNotconfirm() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `transaction/admin/${adminId}?db=${adminId}`
    );
  }
  getStoreTrasaction(storeId, role?: number) {
    let adminId = localStorage.getItem('adminId');
    let r = false;
    if (role > 0) {
      r = true;
    }
    console.log('voici store id=========>', storeId);
    console.log(
      'voici url',
      this.url +
        `transaction/admin/${adminId}?db=${adminId}&storeId=${storeId}&role=${r}`
    );

    /* return this.http.get(
      this.url +
        `transaction/admin/${adminId}?db=${adminId}&storeId=${storeId}&role=${r}`
    );*/
  }

  getStoreMballusTransaction(storeId, role?: number) {
    let adminId = localStorage.getItem('adminId');
    let r = false;
    if (role > 0) {
      r = true;
    }

    return this.http.get(
      this.url +
        `transaction/admin/${adminId}?db=${adminId}&storeId=${storeId}&adminId=${adminId}&role=` +
        r
    );
  }

  getTrasactionBySender(id) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `transaction/admin/${adminId}?db=${adminId}&senderId=${id}`
    );
  }
  confirmTransaction(prodId, receiver) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(this.url + `transaction/${adminId}?db=${adminId}`, {
      id: prodId,
      receiver: receiver,
    });
  }

  cashierConfirmTransaction(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(
      this.url + `transaction/${adminId}?db=${adminId}`,
      data
    );
  }

  deleteTransaction(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(
      this.url + `transaction/${adminId}?db=${adminId}`,
      data
    );
  }

  getOpenCash() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(this.url + `cashOpen/${adminId}?db=${adminId}`);
  }
  getOpenCashFromPointOfSale(storeId) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `cashOpen/${adminId}?db=${adminId}&storeId=${storeId}`
    );
  }

  getOpenCashBeforeInventaire() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `cashOpen/${adminId}?db=${adminId}&before=${1}`
    );
  }

  getOpenCashAll() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(this.url + `cashOpen/${adminId}/all?db=${adminId}`);
  }

  postCashOpen(data) {
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    return this.http.post(this.url + `cashOpen/${adminId}?db=${adminId}`, data);
  }

  closeCashOpen(data) {
    let adminId = localStorage.getItem('adminId');
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let cashId = data._id;
    data['adminId'] = adminId;
    return this.http.patch(
      this.url +
        `cashOpen/${adminId}?db=${adminId}&storeId=${storeId}&cashId=${cashId}`,
      data
    );
  }

  closeCashOpenPos(data) {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    return this.http.patch(
      this.url + `cashOpen/${adminId}?db=${adminId}&storeId=${storeId}`,
      data
    );
  }

  deleteCashOpen(data) {
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    return this.http.delete(
      this.url + `cashOpen/${adminId}?Id=${data._id}&db=${adminId}`
    );
  }
  cashMakeInventory(data) {
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    return this.http.patch(
      this.url + `cashOpen/${adminId}/makeInventory?db=${adminId}`,
      data
    );
  }
  getOpenCashSudo(database, adminId) {
    return this.http.get(this.url + `cashOpen/${adminId}?db=${database}`);
  }
  getOrderSudo(database, adminId) {
    let openCashDate = localStorage.getItem('openCashDate');

    return this.http.get(
      this.url +
        `invoice/admin/${adminId}?db=${adminId}&openCashDate=${openCashDate}`
    );
  }
  getInvoiceNotPaieSudo(database, adminId) {
    let openCashDate = localStorage.getItem('openCashDate');
    return this.http.get(
      this.url +
        `invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&openCashDate=${openCashDate}`
    );
  }

  postCompanySetting(data) {
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    return this.http.post(this.url + `company/${adminId}?db=${adminId}`, data);
  }

  adminMaeriPostCompanySetting(data) {
    let adminId = data.adminId;
    // data["adminId"] = adminId;
    return this.http.post(this.url + `company/${adminId}?db=${adminId}`, data);
  }
  getCompanySetting() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(this.url + `company/${adminId}?db=${adminId}`);
  }
  adminMaeriCustumerCompanySetting(custumerId) {
    //  let adminId = localStorage.getItem("adminId");
    return this.http.get(this.url + `company/${custumerId}?db=${custumerId}`);
  }
  adminMaeriCustumerUpdateCompanySetting(data, custumerId) {
    // let adminId = localStorage.getItem("adminId");
    return this.http.patch(this.url + `company/?db=${custumerId}`, data);
  }
  updateCompanySetting(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(this.url + `company/?db=${adminId}`, data);
  }
  takeRistourne(id) {
    let adminId = localStorage.getItem('adminId');

    console.log('admin service ok');
    return this.http.get(
      this.url +
        `maeriproducts/:maeriadmin/products/ristourne/${id}/?db=${adminId}`
    );
  }

  sendPurchase(data) {
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    return this.http.post(this.url + `purchase/${adminId}?db=${adminId}`, data);
  }

  deletePurchase(data) {
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    console.log('we delete purchase');

    return this.http.patch(
      this.url + `purchase/${adminId}/delete?db=${adminId}`,
      data
    );
  }

  updatePurchase(data) {
    let adminId = localStorage.getItem('adminId');
    data['adminId'] = adminId;
    return this.http.patch(
      this.url + `purchase?db=${adminId}&nomatch=${true}`,
      data
    );
  }

  getPurchase() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `purchase/${adminId}?db=${adminId}&sc=${true}`
    );
  }

  createdCustumer(custumer) {
    let adminId = localStorage.getItem('adminId');
    custumer['adminId'] = adminId;
    return this.http
      .post(this.url + `custumer/${adminId}?db=${adminId}`, custumer)
      .pipe(
        catchError((err) => {
          let urli = this.url + `custumer/${adminId}?db=${adminId}`;
          // return "hello";
          return this.offlineManager.storeCommande(urli, 'POST', custumer);
        })
      );
  }

  updateUserCustumer(customer) {
    let adminId = localStorage.getItem('adminId');

    return this.http
      .patch(this.url + `custumer/${customer._id}?db=${adminId}`, customer)
      .pipe(
        catchError((err) => {
          let urli = this.url + `custumer/${adminId}?db=${adminId}`;
          // return "hello";
          return this.offlineManager.storeCommande(urli, 'PACH', customer);
        })
      );
  }

  getUserCustumer() {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(this.url + `custumer/${adminId}?db=${adminId}`);
  }

  getOneCustumer(customerId) {
    let adminId = localStorage.getItem('adminId');
    return this.http.get(
      this.url +
        `custumer/${adminId}/customer?db=${adminId}&customerId=${customerId}`
    );
  }

  deleteUserCustumer(customerId) {
    let adminId = localStorage.getItem('adminId');
    return this.http.delete(this.url + `custumer/${customerId}?db=${adminId}`);
  }

  postLogo(data) {
    let adminId = localStorage.getItem('adminId');

    let URL = this.url + `custumerlogo/${adminId}?db=${adminId}`;
    console.log(URL);

    return this.http.post(URL, data).pipe(
      catchError((err) => {
        console.log(err);

        return 'error';
      })
    );
  }

  postLogoPromise(data, path) {
    let adminId = localStorage.getItem('adminId');

    let URL = this.url + path;
    console.log(URL);
    return this.http.post(URL, data).toPromise();
  }
}
