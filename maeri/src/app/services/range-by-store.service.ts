import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { GetStoreNameService } from './get-store-name.service';

@Injectable({
  providedIn: 'root',
})
export class RangeByStoreService {
  constructor(public getStoreName: GetStoreNameService) {}

  rangeProductByStore(products) {
    return new Promise((resolve, reject) => {
      let group = products.reduce((r, a) => {
        r[a.storeId] = [...(r[a.storeId] || []), a];
        return r;
      }, {});
      let multiStoreProductitem = [];

      for (const property in group) {
        multiStoreProductitem.push(group[property]);
      }

      multiStoreProductitem.forEach(async (arr) => {
        let name = await this.getStoreName.takeName(arr);
        arr['storeName'] = name;
      });

      resolve(multiStoreProductitem);
    });
  }
}
