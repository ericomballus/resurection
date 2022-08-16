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
import { GammeService } from './gamme.service';
import { Setting } from '../models/setting.models';

//import { Events } from "@ionic/angular";

const API_STORAGE_KEY = 'specialkey';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  provisonSubject = new BehaviorSubject<any[]>([]);
  cart: any;
  allCart: any;
  observable: Observable<any>;
  list$: Observable<any>;
  id: any;
  database: any;
  userName: String = 'unknown';
  url: string = 'http://192.168.100.10:3000/';
  items: any;
  //uri = "http://ec2-54-93-231-124.eu-central-1.compute.amazonaws.com:3000/";
  private cartProd = new BehaviorSubject({});
  private items$ = new BehaviorSubject([]);
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
    private cache: CachingService,
    private gammeService: GammeService
  ) {
    this.takeUrl();
    this.id = localStorage.getItem('adminId');
    //  this.database = localStorage.getItem("adminemail");
    this.database = localStorage.getItem('adminId');
    this.list$ = this.getProductList();

    setInterval(() => {
      this.list$ = this.getProductList();
    }, 1000);
  }
  setData(data) {
    this.items = data;
  }

  getData() {
    if (isNullOrUndefined(this.items)) {
      return 0;
    } else {
      return this.items;
    }
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

  private setLocalData(key, data) {
    localStorage.setItem(`${API_STORAGE_KEY}-${key}`, JSON.stringify(data));
  }

  // Get cached API result
  private getLocalData(key) {
    // return this.storage.get(`${API_STORAGE_KEY}-${key}`);
    return of(JSON.parse(localStorage.getItem(`${API_STORAGE_KEY}-${key}`)));
  }

  saveCart(cart) {
    console.log('je save le cart =====>', cart);

    let tab = [];
    this.cart = cart['cart'];
    this.allCart = cart;
    tab = this.allCart['products'];
    if (tab && tab.length) {
      tab.forEach((prod) => {
        if (prod['item']['randomPrice']) {
          prod['item']['sellingPrice'] = 0;
        }
      });
    }

    this.cartProd.next(this.allCart);
    // this.Getcart();
  }
  cleanCart() {
    this.cart = {};
    this.allCart = {};
    //  this.cartProd.next({})
  }
  resetCart() {
    this.cart = {};
    this.allCart = {};
    // this.cartProd.next({});
    // this.Getcart();
  }

  getCart(): Observable<any> {
    return this.cartProd;
  }
  getCart2() {
    return this.allCart;
  }

  addUser(user) {
    // return this.http.post(this.url, user);
    return this.http.post(this.url + 'users', user);
  }

  getUser(id): Observable<Object> {
    //return this.http.get(this.url + `/takeuser/${id}`);
    return this.http.get(`${this.url}users/takeuser/${id}`);
  }

  addEntreprise(entreprise) {
    return this.http.post(this.url + 'entreprise', entreprise);
  }
  removeUser(id) {
    // return this.http.delete(this.url + `/${id}`);
    return this.http.delete(`${this.url}users/${id}`);
  }

  addProduct(data, storeId?) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;
    data['storeId'] = storeId;

    if (storeId) {
      console.log(storeId);
    }

    return this.http.post(
      `${this.url}products/${this.id}?db=${this.database}`,
      data
    );
  }

  printInvoice(data) {
    //let URL = 'http://localhost:3030/print';
    let company = 'MAERI POS';
    let admin = JSON.parse(localStorage.getItem('adminUser'));
    if (admin && admin['company']) {
      company = admin['company'].toUpperCase();
    }
    let URL = 'http://localhost:3030/print/invoice';
    let reste = parseInt(data['montantR']) - parseInt(data['sum']);
    let recap = `   RECU: ${data['montantR']} FCFA \n`;
    // let recap = `RECU: ${montR} FCFA   RESTE: ${reste} FCFA \n`;
    // recap = recap + `Total achat: ${montR + reste} FCFA\n`;
    if (data['totalConsigne']) {
      recap = recap + `Montant consigne: ${data['totalConsigne']} FCFA\n`;
    } else {
      data['totalConsigne'] = 0;
    }
    if (reste < 0) {
      // reste = -reste;
    }
    let rp = data['totalConsigne'] + data['sum'] - data['montantR'];
    let msg = ` `;
    if (rp < 0) {
      msg = `Rembourser`;
    }
    if (rp == 0) {
      msg = `RESTE A PAYER`;
    }
    recap =
      recap + `Total Facture: ${data['totalConsigne'] + data['sum']} FCFA\n`;
    recap = recap + `${msg}: ${rp} FCFA\n`;
    if (data['totalImpaye']) {
      recap = recap + `DETTE: ${data['totalImpaye']} FCFA\n`;
    }
    let finalTest =
      data['texteEntete'] + data['texte'] + recap + data['textePiedPage'];

    return this.http.post(`${URL}`, { texte: finalTest, company: company });
  }

  addProductFromMaeri(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;
    console.log(id);
    // return this.http.post(this.url3 + "/" + id + "?db=" + this.database, data);
    return this.http.post(
      `${this.url}products/save/image/from/maeri/${this.id}?db=${this.database}`,
      data
    );
  }

  addMaeriProduct(data) {
    return this.http.post(`${this.url}maeriproducts/`, data);
  }

  momoCheck() {
    return this.http.get(`${this.url}momo/`);
  }

  getMaeriProduct() {
    return this.http.get(`${this.url}maeriproducts/`);
  }

  getMaeriProduct2() {
    return this.http.get(`${this.url}maeriproducts/getall/products`);
  }

  getMaeriProductAdmin() {
    return this.http.get(`${this.url}maeriproducts/adminmaeri/products`);
  }

  deleteMaeriProduct(id) {
    return this.http.delete(`${this.url}maeriproducts/${id}`);
  }
  updateMaeriProduct(data) {
    return this.http.patch(`${this.url}maeriproducts/`, data);
  }

  updateMaeriProductImage(data) {
    return this.http.patch(`${this.url}maeriproducts/changeimage`, data);
  }
  getProductList() {
    // return this.list$
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http
      .get(`${this.url}products/adminId/${this.id}?db=${this.id}`)
      .pipe(
        map((elt) => {
          elt['products'].filter(async (article) => {
            if (article.maeriId == 'nothing') {
            } else {
              article['url'] = this.url + `maeriproducts/${article['maeriId']}`;
            }
          });
          return elt;
        })
      );
    // .pipe(shareReplay(1));
  }

  getVendorProducts(vendor) {
    // return this.list$
    let id = vendor._id;
    let database = vendor.email;
    return this.http.get(`${this.url}products/adminId/${id}?db=${database}`);
    // .pipe(shareReplay(1));
  }

  vendorGetRetailerProductsItems(retailerId) {
    this.id = retailerId;
    this.database = retailerId;
    return this.http.get(
      `${this.url}productsitem/admin/${this.id}?retailer=${this.database}`
    );
  }

  getProduct(): Observable<any> {
    return this.list$;
    // return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    // .pipe(shareReplay(1));
  }

  getProduct2() {
    // return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.get(
      `${this.url}products/adminId/${this.id}?db=${this.database}`
    );

    // .pipe(shareReplay(1))
  }

  /*get items by name*/

  getProductByName(name) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.get(
      `${this.url}products/adminId/${name}/${this.id}?db=${this.id}`
    );
  }

  productUpdate(id, form) {
    let adminId = localStorage.getItem('adminId');

    return this.http.delete(
      `${this.url}products/${id}/${adminId}/?db=${adminId}`,
      form
    );
  }

  //updateMoreProductItem(){}

  updateProduct(id, form) {
    let adminId = localStorage.getItem('adminId');
    return this.http.post(
      `${this.url}products/product/update/admin/db?db=${adminId}`,
      form
    );
  }

  updateProductWithImage(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(`${this.url}products/image/db?db=${adminId}`, data);
  }

  producitemtUpdate(form) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.put(
      `${this.url}productsitem/${this.id}/update?db=${this.id}`,
      form
    );
  }

  getProducById(id) {
    //return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    return `${this.url}products/${id}?db=${this.database}`;
  }
  deleteProduct(idproduct) {
    // return this.http.delete(this.url3 + "/" + id + "?db=madou");
    return this.http.delete(
      `${this.url}products/${idproduct}/${this.id}?db=${this.database}`
    );
  }

  getProductAfterDelete() {
    //return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");

    return this.http.get(
      `${this.url}/products/adminId/${this.id}?db=${this.database}`
    );
  }

  getProductListAfterDelete(): Observable<any> {
    //this.list$ = this.Getproductafterdelete();
    console.log(this.list$);
    return this.list$;
  }

  postPack(test) {
    return this.http.post(
      `${this.url}pack/${this.id}?db=${this.database}`,
      test
    );
    //
  }
  deletePack(productId) {
    return this.http.delete(
      `${this.url}pack/${productId}?db=${this.database}`,
      productId
    );
    //
  }
  postPackItem(data) {
    return this.http.post(
      `${this.url}packitems/${this.id}/pack/packitems?db=${this.database}`,
      data
    );
  }

  getPack() {
    this.database = localStorage.getItem('adminemail');
    let newUrl = this.url;
    let pathDb = `?db=${this.database}`;

    return this.http
      .get(`${this.url}pack/admin/${this.id}?db=${this.database}`)
      .pipe(
        map((elt) =>
          elt['docs'].filter(
            (article) =>
              (article['url'] =
                this.url + `maeriproducts/${article['maeriId']}${pathDb}`)
          )
        )
      );
  }
  getVendorPack(vendor) {
    let database = vendor.email;
    let newUrl = this.url;
    let id = vendor._id;
    let pathDb = `?db=${this.database}`;

    return this.http
      .get(`${this.url}pack/admin/${id}?db=${database}`)
      .pipe(
        map((elt) =>
          elt['docs'].filter(
            (article) =>
              (article['url'] =
                this.url + `maeriproducts/${article['maeriId']}${pathDb}`)
          )
        )
      );
  }

  getOneProduct(id) {
    // console.log(test);
    return this.http.get(
      `${this.url}products/adminId/get/one/${id}?db=${this.database}`
    );
    //return
  }

  getPackItem() {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline
    ) {
      return from(this.getLocalData('packsItems'));
    } else {
      return this.http.get(`${this.url}packitems?db=${this.database}`).pipe(
        // map(res => res["data"]),
        tap((res) => {
          localStorage.setItem('packsItems', JSON.stringify(res));
          this.setLocalData('packsItems', res);
        })
      );
    }
  }
  updatePack(data) {
    return this.http.patch(`${this.url}pack/?db=${this.database}`, data);
  }

  deletePackItem(id) {
    return this.http.delete(`${this.url}pack/${id}/?db=${this.database}`, id);
  }
  deletePackItem2(id) {
    return this.http.delete(
      `${this.url}packitems/admin/${id}/?db=${this.id}`,
      id
    );
  }

  updatePackItem(data) {
    this.database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    data['adminId'] = this.id;
    return this.http.patch(`${this.url}packitems/?db=${this.id}`, data);
  }

  // updateMoreProductItem(){}

  updateMorePackItem(data) {
    this.database = localStorage.getItem('adminemail');
    this.id = localStorage.getItem('adminId');
    data['adminId'] = this.id;
    return this.http.patch(`${this.url}packitems/more?db=${this.id}`, data);
  }

  getPackitemByName(name) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.get(
      `${this.url}packitems/pack/${name}/${this.id}?db=${this.id}`
    );
  }

  productItemAdd(data) {
    console.log(data);
    this.id = localStorage.getItem('adminId');

    return this.http.post(
      `${this.url}products/${this.id}/productitems?db=${this.id}`,
      data
    );
  }

  takeItem() {
    return this.http.get(this.url + 'items/items/' + this.id);
    //
  }

  /* gestion du panier*/
  addToCart(id, itemprice) {
    if (this.cart) {
      return this.http.post(
        this.url + 'cart/ajouter/items?db=' + this.database,
        {
          cart: this.cart,
          id: id,
        }
      );
    }
    return this.http.post(this.url + 'cart/ajouter/items?db' + this.database, {
      id: id,
    });
    //
  }

  addToCart2(id) {
    // console.log(itemprice);
    // console.log(this.cart);
    if (this.cart) {
      return this.http.post(
        this.url + 'cart/ajouter/items?db=' + this.database,
        {
          cart: this.cart,
          id: id,
        }
      );
    }
    return this.http.post(this.url + 'cart/ajouter/items?db=' + this.database, {
      id: id,
    });
    //
  }

  addToCart3(idPack) {
    // console.log(itemprice);
    // console.log(this.cart);
    if (this.cart) {
      return this.http.post(
        this.url + 'cart/ajouter/items/pack?db=' + this.database,
        {
          cart: this.cart,
          id: idPack,
          //id: id
        }
      );
    }
    return this.http.post(
      this.url + 'cart/ajouter/items/pack?db=' + this.database,
      {
        id: idPack,
        // id: id
      }
    );
    //
  }

  removeOne(itemId, cartitems) {
    console.log(itemId);
    return this.http.post(this.url + 'cart/reduire/items/', {
      cart: cartitems,
      id: itemId,
    });
  }

  removeAll(itemId, cartitems) {
    return this.http.post(this.url + 'cart/deleteincart/item/', {
      cart: cartitems,
      id: itemId,
    });
  }

  commande(items, tableNumber, resource?, sa?) {
    let confirm = false;
    let Posconfirm = false;
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let openCashDate = localStorage.getItem('openCashDate');
    let isRetailer = false;
    let openCashDateId = '';
    let scConfirm = false;
    let swConfirm = false;
    let caisseConfirm = false;
    let SM = false;
    let sc = false;
    let valide = true;
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let sale = false;

    let idL = '';
    if (tabRoles.includes(8) || tabRoles.includes(9)) {
      openCashDateId = '1';
    } else {
      openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
        '_id'
      ];
    }
    if (tabRoles.includes(8)) {
      valide = false;
    }
    if (items['localId']) {
      idL = items['localId'];
    } else {
      idL =
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5) +
        JSON.parse(localStorage.getItem('user'))['_id'] +
        +Date.now().toString();
      items['localId'] = idL;
    }

    if (this.saveRandom.checkIfIsRetailer()) {
      isRetailer = true;
    }
    if (tabRoles.includes(4) || tabRoles.includes(8)) {
      (confirm = true), (Posconfirm = true);
    }
    if (tabRoles.includes(2)) {
      (confirm = true), (Posconfirm = true);
    }

    if (tabRoles.includes(5)) {
      (confirm = true), (Posconfirm = false);
    }
    if (tabRoles.includes(9)) {
      caisseConfirm = true;
      swConfirm = false;
      scConfirm = true;
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
    if (tabRoles.includes(8) || tabRoles.includes(9)) {
      sc = true;
      scConfirm = true;
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let heure = d.getHours();
      let minute = d.getMinutes();
      let sec = d.getSeconds();
      let mili = d.getMilliseconds();

      let openDate = `${year}-${month}-${day}`;
      let hours = `${heure}:${minute}:${sec}`;
      numFacture = year + heure + minute;
    }
    let montant = items['cartdetails']['totalPrice'];
    let recu = items['montantRecu'];
    let reste = items['reste'];
    let customer = null;
    if (items['customer']) {
      customer = items['customer'];
      if (customer && customer.customerType) {
        SM = true;
      }
    }
    let check = false;
    // let recu= items['montantRecu']
    if (reste >= 0 || tabRoles.includes(8)) {
      check = true;
      sale = true;
    }
    let data = {
      cart: items,
      recu: recu,
      reste: reste,
      check: check,
      montant: montant,
      adminId: this.id,
      tableNumber: tableNumber,
      confirm: confirm,
      Posconfirm: Posconfirm,
      openCashDate: openCashDate,
      openCashDateId: openCashDateId,
      resourceList: resource,
      userName: this.userName,
      numFacture: numFacture,
      localId: idL,
      senderId: senderId,
      storeId: storeId,
      isRetailer: isRetailer,
      confirmPaie: items.confirmPaie,
      delivery: items.delivery,
      trancheList: items.trancheList,
      montantReduction: items['montantReduction'],
      sale: sale,
      cash: check,
      scConfirm: scConfirm,
      sc: sc,
      swConfirm: swConfirm,
      caisseConfirm: caisseConfirm,
      useCustomerSolde: items.useCustomerSolde,
      customer: customer,
      SM: SM, //super marché
      valide: valide,
      removeProductList: this.gammeService.getRemoveProductList(),
      addProductList: this.gammeService.getaddProductList(),
    };
    if (items.consigneTab && items.consigneTab.length) {
      data['consigne'] = items.consigneTab;
    }
    let obj = data;

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
        // localStorage.setItem(`allCommande`, JSON.stringify(tab));
      }, 500);
    } else {
      setTimeout(() => {
        let store = [];
        store.push(commande);
        //  localStorage.setItem(`allCommande`, JSON.stringify(store));
      }, 500);
    }
    let url =
      this.url +
      'invoice/commande/items/' +
      this.userName +
      '/' +
      adminId +
      '?db=' +
      adminId;
    let order = {
      commandes: table,
      cart: items,
      adminId: this.id,
      tableNumber: tableNumber,
      confirm: confirm,
      Posconfirm: Posconfirm,
      openCashDate: openCashDate,
      userName: this.userName,
      products: items['products'],
      commande: items,
      sale: sale,
      created: Date.now(),
      resourceList: resource,
      openCashDateId: openCashDateId,
      localId: idL,
      isRetailer: isRetailer,
      invoiceCancel: false,
      storeId: storeId,
      confirmPaie: items.confirmPaie,
      delivery: items.delivery,
      trancheList: items.trancheList,
      numFacture: numFacture,
      montantReduction: items['montantReduction'],
      recu: recu,
      reste: reste,
      montant: montant,
      check: check,
      cash: check,
      scConfirm: scConfirm,
      sc: sc,
      swConfirm: swConfirm,
      caisseConfirm: caisseConfirm,
      useCustomerSolde: items.useCustomerSolde,
      customer: customer,
      SM: SM, //super marché
      removeProductList: this.gammeService.getRemoveProductList(),
      addProductList: this.gammeService.getaddProductList(),
      valide: valide,
    };
    console.log('order to send===>', order);
    if (check) {
      this.cache.getCachedRequest('invoicePaie').then((result) => {
        let facturePayées: any[] = result;
        if (facturePayées && facturePayées.length) {
          let found = facturePayées.find((elt) => {
            return elt.localId == order.localId;
          });
          if (found) {
            console.log('found hre', found);
          } else {
            facturePayées.push(order);
            this.cache
              .cacheRequest(`invoicePaie`, facturePayées)
              .then((res) => {});
          }
        }
      });
      return of({ invoice: order, url: url, check: true });
    } else {
      return this.offlineManager.storeCommande(url, 'POST', order);
    }
  }

  commandeFree(obj) {
    let adminId = localStorage.getItem('adminId');
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    let url =
      this.url +
      'invoice/commande/items/' +
      `${userName}` +
      '/' +
      adminId +
      '/' +
      '?db=' +
      adminId;
    if (this.platform.is('desktop') || this.platform.is('electron')) {
      // data = data;
    } else {
      // data = JSON.parse(data);
    }

    return this.http.post(url, obj, {});
  }

  commandeAdd(items, resource?) {
    let id = JSON.parse(localStorage.getItem('order'))['localId'];
    let oldOrder = JSON.parse(localStorage.getItem('order'));
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let tab = [];
    tab.push(items);
    let newOrder = oldOrder;
    newOrder['cart'] = items;
    newOrder['commande'] = items;
    newOrder['commandes'] = tab;
    let obj = JSON.stringify(newOrder);
    let tab2 = [];

    if (
      JSON.parse(localStorage.getItem(`allCommande`)) &&
      JSON.parse(localStorage.getItem(`allCommande`)).length
    ) {
      tab2 = JSON.parse(localStorage.getItem(`allCommande`));
      let index2 = tab2.findIndex((elt) => {
        return elt.localId === id;
      });
      if (index2 >= 0) {
        tab2.splice(index2, 1, newOrder);
        localStorage.setItem(`allCommande`, JSON.stringify(tab2));
      }
    }

    if (localStorage.getItem('noOfflinemode') || tabRoles.includes(4)) {
      obj = JSON.parse(obj);
    }
    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline
    ) {
    } else {
      return this.http
        .patch(
          this.url + 'invoice/add/newinvoice/to/old' + '?db=' + this.database,
          items
        )
        .pipe();
    }
  }

  test() {
    this.getProduct().subscribe((data) => {
      console.log("j'ai souscris ici");
    });
  }

  addProductManufactured(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;

    return this.http.post(
      `${this.url}products_resto/${this.id}?db=${this.id}`,
      data
    );
  }
  addProductMaeriManufactured(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;
    console.log(id);
    // return this.http.post(this.url3 + "/" + id + "?db=" + this.database, data);
    return this.http.post(
      `${this.url}products_resto/imagemaeri/${this.id}?db=${this.database}`,
      data
    );
  }

  getProductListResto() {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    if (
      this.platform.is('desktop') ||
      this.platform.is('mobileweb') ||
      this.platform.is('electron')
    ) {
      return this.http
        .get(`${this.url}products_resto/adminId/${this.id}?db=${this.id}`)
        .pipe(
          map((res) =>
            res['products'].filter((article) => {
              if (article['disablemanufactured']) {
                return article;
              }
            })
          ),
          tap((res) => {
            this.setLocalData('productsResto', res);
          })
        );
    } else {
      if (
        this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
      ) {
        // Return the cached data from Storage
        return from(this.getLocalData('productsResto'));
      } else {
        this.id = localStorage.getItem('adminId');
        this.database = localStorage.getItem('adminemail');

        return this.http
          .get(`${this.url}products_resto/adminId/${this.id}?db=${this.id}`)
          .pipe(
            map((res) =>
              res['products'].filter((article) => {
                if (article['disablemanufactured']) {
                  return article;
                }
              })
            ),
            tap((res) => {
              this.setLocalData('productsResto', res);
            })
          );
      }
    }
  }

  deleteProductResto(id) {
    // return this.http.delete(this.url3 + "/" + id + "?db=madou");
    let adminId = localStorage.getItem('adminId');
    return this.http.delete(`${this.url}products_resto/${id}?db=${adminId}`);
  }

  updateProductResto(id, data) {
    // return this.http.delete(this.url3 + "/" + id + "?db=madou");
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}products_resto/${id}?db=${adminId}`,
      data
    );
  }

  addProductManufacturedItem(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;
    console.log(id);
    // return this.http.post(this.url3 + "/" + id + "?db=" + this.database, data);
    return this.http.post(
      `${this.url}products_resto_item/${this.id}/manufactured/items?db=${id}`,
      data
    );
  }
  addProductItem(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;
    console.log(data);
    // return this.http.post(this.url3 + "/" + id + "?db=" + this.database, data);
    return this.http.post(
      `${this.url}productsitem/${this.id}/product/items?db=${id}`,
      data
    );
  }
  // getProduct
  getProductItem(data?) {
    let newUrl = this.url;
    //"http://ec2-54-93-231-124.eu-central-1.compute.amazonaws.com:3000/products/";

    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    let pathDb = `?db=${this.database}`;
    let storeId = null;
    if (
      JSON.parse(localStorage.getItem('user')) &&
      JSON.parse(localStorage.getItem('user'))['storeId']
    ) {
      storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    }
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    //return of(JSON.parse(localStorage.getItem("products")));

    if (
      this.platform.is('desktop') ||
      this.platform.is('mobileweb') ||
      this.platform.is('electron') ||
      tabRoles.includes(2)
    ) {
      if (data) {
        return this.http.get(
          `${this.url}productsitem/?db=${
            this.id
          }&storeId=${storeId}&aggregate=${1}`
        );
      } else {
        return this.http
          .get(`${this.url}productsitem/?db=${this.id}&storeId=${storeId}`)
          .pipe(
            map((elt) =>
              elt['items'].filter((article) => {
                if (article['maeriId'] == 'nothing') {
                } else {
                  article['url'] =
                    this.url + `maeriproducts/${article['maeriId']}`;
                }

                return article;
              })
            ),

            catchError((err) => {
              if (this.cacheService.getCachedRequest('productsItem')) {
                // return from(this.cache.getItem("productsItem"));
                return from(null);
              }
            })
          );
      }
    } else {
      if (
        this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
      ) {
        if (this.cacheService.getCachedRequest('productsItem')) {
          //return from(this.cache.getItem("productsItem"));
          return from(null);
        }
      } else {
        if (data) {
          return this.http.get(
            `${this.url}productsitem/?db=${
              this.id
            }&storeId=${storeId}&aggregate=${1}`
          );
        } else {
          return this.http
            .get(`${this.url}productsitem/?db=${this.id}&storeId=${storeId}`)
            .pipe(
              map((elt) =>
                elt['items'].filter((article) => {
                  if (article['maeriId'] == 'nothing') {
                  } else {
                    article['url'] =
                      this.url + `maeriproducts/${article['maeriId']}`;
                  }

                  return article;
                })
              ),

              catchError((err) => {
                if (this.cacheService.getCachedRequest('productsItemRandom')) {
                  return from(
                    this.cacheService.getCachedRequest('productsItemRandom')
                  );
                }
              })
            );
        }
      }
    }
  }
  getVendorProductItem(vendor) {
    let newUrl = this.url;
    //"http://ec2-54-93-231-124.eu-central-1.compute.amazonaws.com:3000/products/";

    let id = vendor._id;
    let database = vendor.email;
    let pathDb = `?db=${database}`;

    if (
      this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline
    ) {
      if (this.cacheService.getCachedRequest('productsItem')) {
        return from(this.cacheService.getCachedRequest('productsItem'));
      }
    } else {
      return this.http.get(`${this.url}productsitem/?db=${id}`).pipe(
        map((elt) =>
          elt['items'].filter(
            (article) =>
              (article['url'] =
                this.url + `maeriproducts/${article['maeriId']}`)
          )
        ),

        //  groupBy((elt) => elt.produceBy),
        /// mergeMap((group) => group.pipe(toArray())),
        catchError((err) => {
          if (this.cacheService.getCachedRequest('productsItem')) {
            return from(this.cacheService.getCachedRequest('productsItem'));
          }
        })
      );
    }
  }
  hello() {
    /* let pro = zip(from(this.productPick), interval(100)).pipe(
      map(([prod]) => prod)
    );*/
  }

  getProductItemGroup(items?) {
    if (items) {
      this.items$.next(items);
    }
    this.getProductItemData();
    return this.items$;
  }

  getProductItemData() {
    let user = JSON.parse(localStorage.getItem('user'));
    let storeId;
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    let pathDb = `?db=${this.database}`;
    if (user['storeId']) {
      storeId = user['storeId'];
    } else {
      let d = JSON.parse(localStorage.getItem('d'));
      storeId = d['storeId'];
    }

    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    if (tabRoles.includes(5)) {
      this.urlService.urlForEvent.subscribe((url) => {
        this.url = url;
      });
      return this.http
        .get(`${this.url}productsitem/?db=${this.id}&storeId=${storeId}`)
        .pipe(
          map((elt) => {
            elt['items'].filter(async (article) => {
              if (!article['productId']) {
              } else {
                if (article.maeriId == 'nothing') {
                } else {
                  article['url'] =
                    this.url + `maeriproducts/${article['maeriId']}`;
                }
                article['quantityStore'] = Math.trunc(article['quantityStore']);
                article['glace'] = Math.trunc(article['glace']);
              }
            });
            return elt['items'];
          })
        );
    } else {
      return this.http
        .get(`${this.url}productsitem/?db=${this.id}&storeId=${storeId}`)
        .pipe(
          map((elt) => {
            elt['items'].filter(async (article) => {
              if (article['url'].includes('/images/')) {
                //offline mode
              } else {
                if (!article['productId']) {
                } else {
                  console.log('article===>', article);
                  if (article.imageId) {
                    article['url'] = this.url + `images/${article.imageId}`;
                  } else if (article.maeriId == 'nothing') {
                  } else {
                    article['url'] =
                      this.url + `maeriproducts/${article['maeriId']}`;
                    console.log(
                      'url articles depuis maeri===>',
                      article['url']
                    );
                  }
                  article['quantityStore'] = Math.trunc(
                    article['quantityStore']
                  );
                  article['glace'] = Math.trunc(article['glace']);
                }
              }
            });
            return elt['items'];
          })
        );
    }

    // .subscribe((data) => {});
  }

  getProductItemGroup2() {
    let user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    let storeId;
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');

    if (user['storeId']) {
      storeId = user['storeId'];
    } else {
      let d = JSON.parse(localStorage.getItem('d'));
      storeId = d['storeId'];
    }
    if (
      this.platform.is('desktop') ||
      this.platform.is('pwa') ||
      this.platform.is('electron') ||
      this.platform.is('mobile')
    ) {
      return this.http.get(
        `${this.url}productsitem/?db=${this.id}&storeId=${storeId}`
      );
    } else {
      if (
        this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
      ) {
        // return from(this.cache.getItem("productsItem"));
      } else {
        return this.http.get(
          `${this.url}productsitem/?db=${this.id}&storeId=${storeId}`
        );
      }
    }
  }
  getOneProductItem(productId) {
    // return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    // .pipe(shareReplay(1));
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.get(
      `${this.url}productsitem/admin/product/to/update/pack/${productId}?db=${this.id}`
    );
  }

  getProductItemForInventory(d?) {
    if (d) {
      console.log(d);
    }
    9;
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    this.id = localStorage.getItem('adminId');
    let cashOpen = null;
    let cashClose = null;
    let storeId = null;
    this.database = localStorage.getItem('adminemail');
    if (d) {
      cashOpen = d.openDate;
      cashClose = d.closeDate;
    }
    if (d.storeId) {
      storeId = d.storeId;
    }
    return this.http.get(
      `${this.url}productsitem/admin/product/to/aggregation/manager/adminId/all/specificdate?db=${this.id}&month=${month}&year=${year}&cashOpen=${cashOpen}&cashClose=${cashClose}&storeId=${storeId}`
    );
  }

  updateProductItem(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}productsitem/${this.id}?db=${this.id}`,
      data
    );
  }

  resetProductItem(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}productsitem/${this.id}/products/store/confirm/reset/quantity?db=${this.id}`,
      data
    );
  }

  resetShopProductItem(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}billard/${this.id}/products/store/confirm/reset/quantity?db=${this.id}`,
      data
    );
  }

  resetConsigne(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.put(
      `${this.url}productsitem/${this.id}/products/store/consigne?db=${this.id}`,
      data
    );
  }

  updateMoreProductItem(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}productsitem/${this.id}/more?db=${this.id}`,
      data
    );
  }
  updateProductItem2(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.put(
      `${this.url}productsitem/${this.id}?db=${this.id}`,
      data
    );
  }
  deleteProductItem(id) {
    // return this.http.delete(this.url3 + "/" + id + "?db=madou");
    let adminId = localStorage.getItem('adminId');
    return this.http.delete(
      `${this.url}productsitem/${id}/${adminId}?db=${adminId}`
    );
  }

  getManufacturedProductItemResto() {
    this.database = localStorage.getItem('adminemail');
    let user = JSON.parse(localStorage.getItem('user'));
    let storeId = user['storeId'];
    let newUrl = this.url;
    let pathDb = `?db=${this.database}`;
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http
      .get(
        `${this.url}maeriproducts/admin/${this.id}?db=${this.id}&storeId=${storeId}`
      )
      .pipe(
        map((elt) =>
          elt['items'].filter(
            (article) =>
              (article['url'] =
                this.url + `products/${article['productId']}${pathDb}`)
          )
        )
      );
  }

  getManufacturedProductItemRestobbb() {
    // return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    // .pipe(shareReplay(1));
    this.database = localStorage.getItem('adminemail');
    let newUrl = this.url;
    //  "http://ec2-54-93-231-124.eu-central-1.compute.amazonaws.com:3000/products/";
    let pathDb = `?db=${this.database}`;

    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http
      .get(`${this.url}products_resto/admin/${this.id}?db=${this.id}`)
      .pipe(
        map((elt) =>
          elt['items'].filter(
            (article) =>
              (article['url'] =
                this.url + `products/${article['productId']}${pathDb}`)
          )
        )
      );
  }

  getManufacturedProductItemResto2() {
    let newUrl = this.url;
    // "http://ec2-54-93-231-124.eu-central-1.compute.amazonaws.com:3000/products_resto/";
    // let pathDb = "?db=infokamankecm";
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    let pathDb = `?db=${this.database}`;
    let user = JSON.parse(localStorage.getItem('user'));
    let storeId = user['storeId'];
    // return from(this.cache.getItem("productsResto"));
    return this.http
      .get(`${this.url}products_resto_item/?db=${this.id}&storeId=${storeId}`)
      .pipe(
        map((elt) =>
          elt['items'].filter((article) => {
            if (article['source'] == 'user' && article['disablemanufactured']) {
              // console.log("hello change", elt);
              article['url'] =
                this.url + `products_resto/${article['productId']}${pathDb}`;
              return article;
            } else if (
              article['disablemanufactured'] &&
              article['source'] !== 'user'
            ) {
              article['url'] =
                this.url + `maeriproducts/${article['maeriId']}${pathDb}`;
              return article;
            }
          })
        ),

        catchError((err) => {
          // console.error(err.message);
          //  console.log("Error is handled===================");
          return from(this.cacheService.getCachedRequest('productsResto'));
          // return from(err);
          console.log(err);
        })
      );
  }

  getManufacturedProductItemResto3(url) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    let pathDb = `?db=${this.database}`;
    let user = JSON.parse(localStorage.getItem('user'));
    let storeId = user['storeId'];
    return this.http
      .get(`${url}products_resto_item/?db=${this.id}&storeId=${storeId}`)
      .pipe(
        map((elt) =>
          elt['items'].filter((article) => {
            if (article['source'] == 'user' && article['disablemanufactured']) {
              // console.log("hello change", elt);
              article['url'] =
                url + `products_resto/${article['productId']}${pathDb}`;
              return article;
            } else if (
              article['disablemanufactured'] &&
              article['source'] !== 'user'
            ) {
              article['url'] =
                url + `maeriproducts/${article['maeriId']}${pathDb}`;
              return article;
            }
          })
        ),

        catchError((err) => {
          return from(this.cacheService.getCachedRequest('productsResto'));
        })
      );
  }

  getOneManufacturedProductItemResto(prodId) {
    // return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    // .pipe(shareReplay(1));
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.get(
      `${this.url}products_resto_item/admin/${prodId}?db=${this.id}`
    );
  }

  deleteManufacturedItem(id) {
    // return this.http.delete(this.url3 + "/" + id + "?db=madou");
    this.id = localStorage.getItem('adminId');
    return this.http.delete(
      `${this.url}products_resto_item/${id}?db=${this.id}`
    );
  }

  updateManufacturedItem(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}products_resto_item/${this.id}/?db=${this.id}`,
      data
    );
  }
  resetManufacturedItem(data) {
    this.id = localStorage.getItem('adminId');
    return this.http.patch(
      `${this.url}products_resto_item/${this.id}/products/store/confirm/reset/quantity?db=${this.id}`,
      data
    );
  }
  incommingProvision(data) {
    console.log('provi', data);

    this.provisonSubject.next(data);
  }

  getProvision() {
    return this.provisonSubject.asObservable();
  }

  clearProvision() {
    this.provisonSubject.next([]);
  }

  getShopList() {
    // return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    // .pipe(shareReplay(1));
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminId');
    let pathDb = `?db=${this.database}`;
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    if (
      this.platform.is('desktop') ||
      this.platform.is('pwa') ||
      this.platform.is('mobile') ||
      this.platform.is('electron') ||
      tabRoles.includes(2)
    ) {
      return this.http.get(
        `${this.url}productlist/adminId/all?db=${this.database}`
      );
    } else {
      if (
        this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
      ) {
        return from(this.getLocalData('shopList'));
      } else {
        return this.http.get(
          `${this.url}productlist/adminId/all?db=${this.database}`
        );
      }
    }
  }

  getShopList2() {
    // return this.http.get(this.url3 + "/adminId/" + this.id + "?db=madou");
    // .pipe(shareReplay(1));
    this.id = localStorage.getItem('adminId');
    this.database = this.id;
    let pathDb = `?db=${this.database}`;
    let user = JSON.parse(localStorage.getItem('user'));
    let storeId = user['storeId'];
    if (
      this.platform.is('desktop') ||
      this.platform.is('pwa') ||
      this.platform.is('electron') ||
      this.platform.is('mobile')
    ) {
      return this.http.get(
        `${this.url}productlist/adminId/for/shop?db=${this.database}&storeId=${storeId}`
      );
    } else {
      if (
        this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
      ) {
        // Return the cached data from Storage
        return from(this.getLocalData('shopList'));
      } else {
        return this.http.get(
          `${this.url}productlist/adminId/for/shop?db=${this.database}&storeId=${storeId}`
        );
      }
    }
  }

  addShopList(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;
    console.log(id);
    // return this.http.post(this.url3 + "/" + id + "?db=" + this.database, data);
    return this.http.post(
      `${this.url}productlist/${this.id}/?db=${this.id}`,
      data
    );
  }

  deleteShopList(id) {
    // return this.http.delete(this.url3 + "/" + id + "?db=madou");
    return this.http.delete(`${this.url}productlist/${id}?db=${this.id}`);
  }

  updateShopList(data) {
    // return this.http.delete(this.url3 + "/" + id + "?db=madou");
    return this.http.patch(`${this.url}productlist/?db=${data.adminId}`, data);
  }

  transferShopList(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;

    return this.http.post(
      `${this.url}productlist/${this.id}/transfert?db=${this.id}`,
      data
    );
  }

  getBillardList() {
    console.log('get list start ====>');
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminId');
    let pathDb = `?db=${this.database}`;
    let user = JSON.parse(localStorage.getItem('user'));
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    let setting: Setting = this.saveRandom.getSetting();
    console.log(' ====>', this.url);
    if (tabRoles.includes(4) || tabRoles.includes(5)) {
      let storeId = user['storeId'];
      return this.http
        .get(
          `${this.url}billard/adminId/for/shop?db=${this.database}&storeId=${storeId}`
        )
        .pipe(
          map((elt) =>
            elt['product'].filter((article) => {
              if (article.imageId) {
                article['url'] = this.url + `images/${article.imageId}`;
              } else {
                article['url'] =
                  this.url + `billard/${article['_id']}${pathDb}`;
              }
              return article;
            })
          )
        );
    } else if (setting && setting.manage_expenses) {
      return this.http.get(
        `${this.url}billard/adminId/all?db=${this.database}`
      );
    } else if (
      tabRoles.includes(2) ||
      tabRoles.includes(7) ||
      tabRoles.includes(8) ||
      tabRoles.includes(9) ||
      tabRoles.includes(10)
    ) {
      let storeId = user['storeId'];
      return this.http.get(
        `${this.url}billard/adminId/all?db=${this.database}&storeId=${storeId}`
      );
    } else {
      return this.http.get(
        `${this.url}billard/adminId/all?db=${this.database}`
      );
    }
  }

  getBillardList2(url): Observable<any> {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    let pathDb = `?db=${this.database}`;
    let user = JSON.parse(localStorage.getItem('user'));
    let storeId = user['storeId'];
    if (
      this.platform.is('desktop') ||
      this.platform.is('electron') ||
      this.platform.is('pwa') ||
      this.platform.is('mobile')
    ) {
      return this.http
        .get(`${url}billard/adminId/all?db=${this.id}&storeId=${storeId}`)
        .pipe(
          map((elt) =>
            elt['product'].filter((article) => {
              // article.forEach((elt) => {
              /* if (article.imageId) {
                article['url'] = this.url + `images/${article.imageId}`;
              } else {
                article['url'] = url + `billard/${elt['_id']}${pathDb}`;
              }*/
              // });
              article.forEach((elt) => {
                if (elt.imageId) {
                  article['url'] = this.url + `images/${elt.imageId}`;
                } else {
                  elt['url'] = this.url + `billard/${elt['_id']}${pathDb}`;
                }
              });

              return article;
            })
          ),

          catchError((err) => {
            // console.error(err.message);
            //  console.log("Error is handled===================");
            return from(this.cacheService.getCachedRequest('productsResto'));
          })
        );
    } else {
      if (
        this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
      ) {
        // Return the cached data from Storage
        return from(this.getLocalData('billardList'));
      } else {
        return this.http
          .get(`${url}billard/adminId/all?db=${this.id}&storeId=${storeId}`)
          .pipe(
            map((elt) =>
              elt['product'].filter((article) => {
                article.forEach((elt) => {
                  if (elt.imageId) {
                    article['url'] = this.url + `images/${elt.imageId}`;
                  } else {
                    elt['url'] = url + `billard/${elt['_id']}${pathDb}`;
                  }
                });

                return article;
              })
            ),

            catchError((err) => {
              // console.error(err.message);
              //  console.log("Error is handled===================");
              return from(this.cacheService.getCachedRequest('productsResto'));
            })
          );
      }
    }
  }

  addBillardGame(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;

    return this.http.post(`${this.url}billard/${this.id}/?db=${this.id}`, data);
  }

  transferBillardGame(data) {
    const id = localStorage.getItem('adminId');
    data['adminId'] = id;

    return this.http.post(
      `${this.url}billard/${this.id}/transfert?db=${this.id}`,
      data
    );
  }

  deleteBillardGame(data) {
    return this.http.delete(
      `${this.url}billard/${data._id}?db=${data.adminId}`
    );
  }
  updateBillardGame(data) {
    return this.http.patch(`${this.url}billard/?db=${data.adminId}`, data);
  }
}
