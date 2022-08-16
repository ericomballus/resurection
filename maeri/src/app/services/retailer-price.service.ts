import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RetailerPriceService {
  constructor() {}

  converToRetailerPrice(retailerProd, productItem): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let products = [];
      retailerProd.forEach((child) => {
        productItem.forEach((parent) => {
          if (child.productId && parent.productId) {
            if (parent.productId == child.productId) {
              console.log('valid');
              parent['retailerPrice'] = child['retailerPrice'];
              parent['sellingPrice'] = child['retailerPrice'];
              parent['purchasingPrice'] = child['retailerPrice'];
              parent['sellingPackPrice'] =
                child['retailerPrice'] * parent['packSize'];
              parent['packPrice'] = child['retailerPrice'] * parent['packSize'];
              products.push(parent);
            } else {
            }
          } else {
            if (parent._id == child._id) {
              console.log('valid');
              parent['retailerPrice'] = child['retailerPrice'];
              parent['sellingPrice'] = child['retailerPrice'];
              parent['purchasingPrice'] = child['retailerPrice'];
              parent['sellingPackPrice'] =
                child['retailerPrice'] * parent['packSize'];
              parent['packPrice'] = child['retailerPrice'] * parent['packSize'];
              products.push(parent);
            } else {
            }
          }
        });
      });

      /* retailerProd.forEach((child) => {
        let tab = productItem.filter((parent) => {
          return parent.productId == child.productId;
        });

        if (tab.length) {
          productItem = [];
          //  tab[0]['retailerPrice'] = child['retailerPrice'];

          productItem = tab;
        }
      });*/
      resolve(products);
    });
  }
}
