import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, interval, of, zip } from 'rxjs';
import { Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { environment, uri } from '../../environments/environment';
import { OfflineManagerService } from './offline-manager.service';
import { Storage } from '@ionic/storage';
import { tap, map, catchError } from 'rxjs/operators';
import { NetworkService, ConnectionStatus } from './network.service';
import { UrlService } from './url.service';

import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { CachingService } from './caching.service';
import { SaverandomService } from './saverandom.service';
import { Gamme } from '../models/gamme.model';
import { Product } from '../models/product.model';
import { RestApiService } from './rest-api.service';
import { Setting } from '../models/setting.models';
const API_STORAGE_KEY = 'specialkey';
@Injectable({
  providedIn: 'root',
})
export class GammeService {
  database: any;
  userName: String = 'unknown';
  url: string = 'http://192.168.100.10:3000/';
  id: any;
  productList: any[] = [];
  product: Gamme;
  removeProductList: Product[] = [];
  addProductList: any[] = [];
  constructor(
    private http: HttpClient,
    private urlService: UrlService,
    private restApi: RestApiService,
    private httpN: HTTP,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService,
    private platform: Platform,
    private cacheService: CachingService,
    private saveRandom: SaverandomService,
    private cache: CachingService,
    private gammeService: GammeService
  ) {
    this.takeUrl();
    this.id = localStorage.getItem('adminId');
    //  this.database = localStorage.getItem("adminemail");
    this.database = localStorage.getItem('adminId');
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

  postGamme(test) {
    let adminId = localStorage.getItem('adminId');
    return this.http.post(`${this.url}gamme/?db=${adminId}`, test);
    //
  }

  transfertGamme(data) {
    let adminId = localStorage.getItem('adminId');
    return this.http.post(`${this.url}gamme/transfert?db=${adminId}`, data);
    //
  }

  getGammeList() {
    // return this.list$
    /* this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.get(`${this.url}gamme/?db=${this.id}`);*/
    // .pipe(shareReplay(1));
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminId');
    let user = JSON.parse(localStorage.getItem('user'));
    let tabRoles: any[] = JSON.parse(localStorage.getItem('roles'));
    if (!tabRoles) {
      tabRoles = [];
    }
    if (tabRoles.includes(4) || tabRoles.includes(5)) {
      let storeId = user['storeId'];
      return this.http.get(
        `${this.url}gamme/adminId/shop?db=${this.database}&storeId=${storeId}`
      );
    } else {
      return this.http.get(`${this.url}gamme/?db=${this.id}`);
    }
  }

  updateGamme(form) {
    let adminId = localStorage.getItem('adminId');
    return this.http.patch(`${this.url}gamme/?db=${adminId}`, form);
  }

  deleteOneGamme(gamme) {
    let adminId = localStorage.getItem('adminId');
    return this.http.delete(
      `${this.url}gamme/${gamme._id}?db=${adminId}`,
      gamme._id
    );
    //
  }

  setProducts(data: Product[]) {
    this.productList = data;
  }

  getProducts() {
    if (this.productList.length) {
      return this.productList;
    } else {
      return null;
    }
  }

  setGamme(data: Gamme) {
    this.product = data;
  }

  getGamme() {
    return this.product;
  }

  getProductService(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.getServiceList().subscribe(
        async (data) => {
          console.log('response list service', data);
          let setting: Setting = JSON.parse(localStorage.getItem('setting'));
          console.log('setting ===>', setting);
          if (setting.use_gamme) {
            this.setProducts(data['product']);
            resolve(data['product']);
          } else {
            resolve([]);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  saveToRemoveList(data: Product) {
    if (this.removeProductList.length) {
      let found = this.removeProductList.find((p) => p._id == data._id);
      if (found) {
      } else {
        this.removeProductList.push(data);
      }
    } else {
      this.removeProductList.push(data);
    }
  }

  getRemoveProductList() {
    return this.removeProductList;
  }

  saveToAddProductList(data: Product) {
    if (this.addProductList.length) {
      let found = this.removeProductList.find((p) => p._id == data._id);
      if (found) {
      } else {
        this.addProductList.push(data);
      }
    } else {
      this.addProductList.push(data);
    }
  }

  removeToProducList(data: Product) {
    if (this.addProductList.length) {
      let found = this.removeProductList.find((p) => p._id == data._id);
      this.addProductList = this.addProductList.filter(
        (p) => p._id !== data._id
      );
    }
  }

  getaddProductList() {
    return this.addProductList;
  }

  clearArray() {
    this.addProductList = [];
    this.removeProductList = [];
  }

  getServiceList() {
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
}
