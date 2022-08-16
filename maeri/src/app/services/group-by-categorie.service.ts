import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class GroupByCategorieService {
  constructor(private notifi: NotificationService) {}

  groupArticles(Articles, loading?): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (loading) {
        this.notifi.presentLoading();
      }
      let arr = [];
      //  this.productResto2 = await data;

      let tab = Articles.reduce((r, a) => {
        r[a.categoryName] = [...(r[a.categoryName] || []), a];
        return r;
      }, {});
      // this.arr = [];

      for (const property in tab) {
        arr.push(tab[property]);
      }
      if (loading) {
        this.notifi.dismissLoading();
      }
      resolve(arr);
    });
  }

  groupByCustomerId(Invoices): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let arr = [];
      //  this.productResto2 = await data;

      let tab = Invoices.reduce((r, a) => {
        r[a.customerId] = [...(r[a.customerId] || []), a];
        return r;
      }, {});
      // this.arr = [];

      for (const property in tab) {
        arr.push(tab[property]);
      }

      resolve(arr);
    });
  }
}
