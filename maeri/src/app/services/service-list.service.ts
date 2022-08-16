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
export class ServiceListService {
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

  addUserResources(data) {
    return this.http.post(
      this.url + `resource/${this.id}?db=${this.database}`,
      data
    );
  }

  getResources(): Observable<Object> {
    this.id = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `resource/resource/${this.id}?db=${this.database}`
    );
  }

  deleteResource(catId) {
    return this.http.delete(
      this.url + `resource/${catId}/${this.id}?db=${this.database}`
    );
  }

  addUserResourcesItem(data) {
    return this.http.post(
      this.url + `resourceitem/${this.id}?db=${this.database}`,
      data
    );
  }
  getResourcesItem(): Observable<Object> {
    this.id = localStorage.getItem('adminId');
    return this.http.get(
      this.url + `resourceitem/resourceId/${this.id}?db=${this.id}`
    );
  }

  getStoreResourcesItem(): Observable<Object> {
    this.id = localStorage.getItem('adminId');
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    return this.http.get(
      this.url + `resourceitem?db=${this.id}&storeId=${storeId}`
    );
  }

  getProductItem(): Observable<Object> {
    this.id = localStorage.getItem('adminId');
    return this.http.get(`${this.url}productsitem/?db=${this.id}`);
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

  updateServiceStore(data) {
    this.id = localStorage.getItem('adminId');
    let openCashDate = localStorage.getItem('openCashDateId');
    this.database = localStorage.getItem('adminemail');
    return this.http
      .patch(`${this.url}billard/${this.id}/billard/store?db=${this.id}`, data)
      .pipe
      // catchError
      ();
  }
  checkAvaibleResources(resourceList): Promise<any> {
    return new Promise((resolve, reject) => {
      this.id = localStorage.getItem('adminId');
      let arrayOfId = [];
      let arrayOfIdProduct = [];
      console.log(resourceList);
      resourceList.forEach((resource) => {
        if (resource.product) {
          arrayOfIdProduct.push(resource.resourceId);
        } else {
          arrayOfId.push(resource.resourceId);
        }
      });
      let response = this.http
        .post(`${this.url}resourceitem/${this.id}/isAvaible?db=${this.id}`, {
          resourceListId: arrayOfId,
          productList: arrayOfIdProduct,
        })

        .toPromise();
      response
        .then((res) => {
          resolve(res);
        })
        .catch((err) => console.log(err));
    });
  }
}
