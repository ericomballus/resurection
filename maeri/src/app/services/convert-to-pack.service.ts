import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConvertToPackService {
  constructor() {}

  convertToPack(tabItems: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      tabItems.forEach(async (elt) => {
        if (elt['quantityToConfirm'] > 0) {
          let divi = Math.trunc(elt.quantityItems / elt.packSize);
          let store = elt.quantityStore + elt.quantityToConfirm;
          let divi2 = Math.trunc(store / elt.packSize);
          elt['cassier'] = divi; //cassier en stcok
          elt['btls'] = elt.quantityItems % elt.packSize; //btl en stock
          //  elt["btls"] = Number(elt["btls"]);

          elt['cassierStore'] = divi2; //cassier en vente
          elt['btlsStore'] = store % elt.packSize; //btl en vente
          elt['btlsTotal'] = elt['btlsStore'] + elt['btls'];
          elt['cassierTotal'] = elt['cassierStore'] + elt['cassier'];
          if (!isNaN(parseFloat(elt['btls'])) && isFinite(elt['btls'])) {
            elt['btls'] = elt['btls'].toFixed(2);
          }
          if (!Number.isInteger(elt['btlsTotal'])) {
            elt['btlsTotal'] = elt['btlsTotal'].toFixed(2);
          }
          if (!Number.isInteger(elt['btlsStore'])) {
            elt['btlsStore'] = elt['btlsStore'].toFixed(2);
          }
        } else {
          let divi = Math.trunc(elt.quantityItems / elt.packSize);
          let divi2 = Math.trunc(elt.quantityStore / elt.packSize);
          elt['cassier'] = divi;
          elt['btls'] = elt.quantityItems % elt.packSize;
          //  elt["btls"] = Number(elt["btls"]);

          elt['cassierStore'] = divi2;
          elt['btlsStore'] = elt.quantityStore % elt.packSize;
          elt['btlsTotal'] = elt['btlsStore'] + elt['btls'];
          elt['cassierTotal'] = elt['cassier'] + elt['cassierStore'];
        }
      });

      resolve(tabItems);
    });
  }

  convertBeforeSending(tabItems: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      tabItems.forEach((prod) => {
        if (prod.item.BTL && prod.item.CA) {
          prod.qty = prod.item.CA * prod.item.packSize + prod.item.BTL;
          prod.item.qty = prod.qty;
        } else if (!prod.item.BTL && prod.item.CA) {
          prod.qty = prod.item.CA * prod.item.packSize;
          prod.item.qty = prod.qty;
        } else if (prod.item.BTL && !prod.item.CA) {
          prod.qty = prod.item.BTL;
          prod.item.qty = prod.qty;
        } else {
          // prod.qty = prod.item.nbr;
          prod.item.qty = prod.qty;
        }
      });
      resolve(tabItems);
    });
  }

  convertSingleProduct(elt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (elt['quantityToConfirm'] > 0) {
        let divi = Math.trunc(elt.quantityItems / elt.packSize);
        let store = elt.quantityStore + elt.quantityToConfirm;
        let divi2 = Math.trunc(store / elt.packSize);
        elt['cassier'] = divi; //cassier en stcok
        elt['btls'] = elt.quantityItems % elt.packSize; //btl en stock
        //  elt["btls"] = Number(elt["btls"]);

        elt['cassierStore'] = divi2; //cassier en vente
        elt['btlsStore'] = store % elt.packSize; //btl en vente
        elt['btlsTotal'] = elt['btlsStore'] + elt['btls'];
        elt['cassierTotal'] = elt['cassierStore'] + elt['cassier'];
        if (!isNaN(parseFloat(elt['btls'])) && isFinite(elt['btls'])) {
          elt['btls'] = elt['btls'].toFixed(2);
        }
        if (!Number.isInteger(elt['btlsTotal'])) {
          elt['btlsTotal'] = elt['btlsTotal'].toFixed(2);
        }
        if (!Number.isInteger(elt['btlsStore'])) {
          elt['btlsStore'] = elt['btlsStore'].toFixed(2);
        }
      } else {
        let divi = Math.trunc(elt.quantityItems / elt.packSize);
        let divi2 = Math.trunc(elt.quantityStore / elt.packSize);
        elt['cassier'] = divi;
        elt['btls'] = elt.quantityItems % elt.packSize;
        //  elt["btls"] = Number(elt["btls"]);

        elt['cassierStore'] = divi2;
        elt['btlsStore'] = elt.quantityStore % elt.packSize;
        elt['btlsTotal'] = elt['btlsStore'] + elt['btls'];
        elt['cassierTotal'] = elt['cassier'] + elt['cassierStore'];
      }
      resolve(elt);
    });
  }
}
