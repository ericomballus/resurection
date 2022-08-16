import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, uri } from '../../environments/environment';
import { UrlService } from './url.service';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  id: any;
  database: any;
  url: string = 'http://192.168.100.10:3000/';
  product: any;
  constructor(private http: HttpClient, private urlService: UrlService) {
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        console.log('url', this.url);
      });
    } else {
      this.url = uri;
    }
  }

  updateProductItemStore(data) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.patch(
      `${this.url}productsitem/${this.id}/products/store?db=${this.id}`,
      data
    );
  }

  updateProductItemStore1(data) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.put(
      `${this.url}productsitem/${this.id}/products/store?db=${this.id}`,
      data
    );
  }

  confirmProductItemStore(data) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    let openCashDate = '';
    if (localStorage.getItem('openCashDateId')) {
      openCashDate = localStorage.getItem('openCashDateId');
    } else if (JSON.parse(localStorage.getItem('openCashDateObj'))) {
      openCashDate = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
    }
    if (openCashDate) {
      return this.http.patch(
        `${this.url}productsitem/${this.id}/products/store/confirm?db=${this.id}&openCashDate=${openCashDate}`,
        data
      );
    }
  }

  updateManufacturedItemStore(data) {
    this.id = localStorage.getItem('adminId');
    let openCashDate = localStorage.getItem('openCashDateId');
    this.database = localStorage.getItem('adminemail');
    return this.http
      .patch(
        `${this.url}products_resto_item/${this.id}/manufacturedItems/store?db=${this.id}&openCashDate=${openCashDate}`,
        data
      )
      .pipe
      // catchError
      ();
  }

  updateManufacturedItemStoreConfirm(data) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    let openCashDate = localStorage.getItem('openCashDateId');
    return this.http
      .patch(
        `${this.url}products_resto_item/${this.id}/manufacturedItems/store/confirm?db=${this.id}&openCashDate=${openCashDate}`,
        data
      )
      .pipe
      // catchError
      ();
  }
  updateIce(data) {
    this.id = localStorage.getItem('adminId');
    this.database = localStorage.getItem('adminemail');
    return this.http.patch(
      `${this.url}productsitem/${this.id}/products/store/confirm/glacer?db=${this.id}`,
      data
    );
  }
  setProductItem(data) {
    console.log(data);

    this.product = data;
  }

  getProductItem() {
    if (isNullOrUndefined(this.product)) {
      return 0;
    } else {
      return this.product;
    }
  }
}

/*

updateManufacturedItem(data) {
    return this.http.patch(
      `${uri}products_resto_item/?db=${this.database}`,
      data
    );
  }
*/
