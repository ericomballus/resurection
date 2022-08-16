import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CachingService } from './caching.service';
import { SaverandomService } from './saverandom.service';
@Injectable({
  providedIn: 'root',
})
export class MyeventsService {
  private fooSubject = new BehaviorSubject({});

  private orderSubject = new BehaviorSubject(null);
  private addOrderSubject = new BehaviorSubject({});
  private confirmOrderSubject = new BehaviorSubject({});
  private saleInvoiceSubject = new BehaviorSubject({});
  private cancelInvoiceSubject = new BehaviorSubject({});
  private tabRoleSubject = new BehaviorSubject([]);
  private settingSubject = new BehaviorSubject({});
  private displayTypeSubject = new BehaviorSubject([]);
  private invoicesSubject = new BehaviorSubject({});
  private invoiceCancelUpdateSubject = new BehaviorSubject({});
  private languageSubject = new BehaviorSubject({});
  private addToCart = new BehaviorSubject({}); //
  private removeToCart = new BehaviorSubject({});
  constructor(
    private cache: CachingService,
    private saveRandom: SaverandomService
  ) {}
  addOne(item, nbr?, mode?) {
    let data = {
      item: item,
      store: nbr,
      mode: mode,
    };
    this.addToCart.next(data);
  }

  removeOne(item, mode?) {
    let data = {
      item: item,
      mode: mode,
    };
    this.removeToCart.next(data);
  }

  refresh() {
    this.addToCart.next({});
    this.removeToCart.next({});
  }

  addOneProduct() {
    return this.addToCart;
  }
  refrechCart() {
    //this.addToCart.unsubscribe();
  }
  removeOneProduct() {
    return this.removeToCart;
  }

  newOrder(data: any) {
    this.orderSubject.next(data);
  }

  newInvoices(data: any) {
    this.invoicesSubject.next(data);
  }

  getNewOrder() {
    return this.orderSubject;
  }
  getInvoices() {
    return this.invoicesSubject;
  }

  invoiceUpdateCancel(data: any) {
    this.invoiceCancelUpdateSubject.next(data);
  }
  getInvoiceCancelUpdate() {
    return this.invoiceCancelUpdateSubject;
  }

  publishOrder(data: any) {
    this.fooSubject.next(data);
  }

  getPublishOrder(): Subject<any> {
    return this.fooSubject;
  }

  serviceConfirmOrder(data: any) {
    this.confirmOrderSubject.next(data);
  }

  getConfirmOrder() {
    return this.confirmOrderSubject;
  }
  addToOrder(data: any) {
    this.addOrderSubject.next(data);
  }

  getAddOrder() {
    return this.addOrderSubject;
  }

  invoiceSale(data: any) {
    this.saleInvoiceSubject.next(data);
  }

  invoiceCancel(data: any) {
    this.cancelInvoiceSubject.next(data);
  }

  getInvoiceSale() {
    return this.saleInvoiceSubject;
  }

  getInvoiceCancel() {
    return this.cancelInvoiceSubject;
  }

  getRole() {
    return this.tabRoleSubject;
  }
  getDisplayType() {
    return this.displayTypeSubject;
  }

  publishDisplayType(data: any) {
    this.displayTypeSubject.next(data);
  }

  publishRole(data: any) {
    if (Array.isArray(data)) {
      this.tabRoleSubject.next(data);
    } else {
      let tab = [data];
      this.tabRoleSubject.next(tab);
    }
  }
  getSettin() {
    return this.settingSubject;
  }
  publishSetting(data: any) {
    this.settingSubject.next(data);
  }
  getLanguage() {
    return this.languageSubject;
  }

  setLanguage(data: any) {
    this.languageSubject.next(data);
  }

  storeOrders(orders, method, invoices) {
    return new Promise(async (resolve, reject) => {
      if (method == 'add') {
        let index = invoices.findIndex((elt) => {
          return elt.localId === orders['localId'];
        });

        if (index >= 0) {
          let tab = [];
          tab = invoices.filter((elt) => {
            return elt.localId !== orders['localId'];
          });
          resolve(tab);
          localStorage.setItem('allCommande', JSON.stringify(tab));
        } else {
          resolve(invoices);
        }
      }
      if (method == 'cancel') {
        let index = invoices.findIndex((elt) => {
          return elt.localId === orders['localId'];
        });

        if (index >= 0) {
          let tab = [];
          tab = invoices.filter((elt) => {
            return elt.localId !== orders['localId'];
          });
          localStorage.setItem('allCommande', JSON.stringify(tab));
          resolve(tab);
        } else {
          resolve(invoices);
        }
      }
      if (method == 'patch') {
        let index = invoices.findIndex((elt) => {
          return elt.localId == orders.localId;
        });
        if (index >= 0) {
          invoices.splice(index, 1, orders);
          resolve(invoices);
          localStorage.setItem(`allCommande`, JSON.stringify(invoices));
        }
      }
      if (method == 'get') {
        let allCommande = JSON.parse(localStorage.getItem(`allCommande`));
        let openCashDateId = JSON.parse(
          localStorage.getItem('openCashDateObj')
        )['_id'];
        let tab = [];
        // console.log(allCommande);
        tab = await allCommande.filter((elt) => {
          return elt['openCashDateId'] === openCashDateId;
        });
        if (tab && tab.length) {
          localStorage.setItem('allCommande', JSON.stringify(tab));
        }
        resolve(tab);
      }

      if (method == 'save') {
        /*  let tab = [];
        if (JSON.parse(localStorage.getItem(`allCommande`))) {
          tab = JSON.parse(localStorage.getItem(`allCommande`));
        }

        if (tab && tab.length) {
          setTimeout(() => {
            tab.push(orders);
            localStorage.setItem(`allCommande`, JSON.stringify(tab));
            // this.events.newOrder(commande);
          }, 500);
        } else {
          setTimeout(() => {
            let store = [];
            store.push(orders);
            localStorage.setItem(`allCommande`, JSON.stringify(store));
            //  this.events.newOrder(commande);
          }, 500);
        } */
        resolve('ok');
      }

      if (method == 'saveAll') {
        localStorage.setItem(`allCommande`, JSON.stringify(orders));

        resolve('ok');
      }

      if (method == 'addInOrder') {
        let tab = [];
        tab = JSON.parse(localStorage.getItem(`allCommande`));
        let index = tab.findIndex((elt) => {
          return elt.localId === invoices['localId'];
        });
        if (index >= 0) {
          tab.splice(index, 1, invoices);
          localStorage.setItem(`allCommande`, JSON.stringify(tab));
          resolve(tab);
        } else {
          reject(index);
        }
      }
    });
  }

  posStoreOrders(order, method) {
    return new Promise(async (resolve, reject) => {
      if (method == 'store') {
        let data = order;
        let tab: any[] = await this.cache.getCachedRequest('userCommande');

        if (tab && tab.length) {
          let index = tab.findIndex((elt) => {
            return elt.localId == data['localId'];
          });
          if (index >= 0) {
            tab.splice(index, 1, order);
            this.cache.cacheRequest(`userCommande`, tab);
            resolve(tab[index]);
          } else {
            tab.push(data);
            this.cache.cacheRequest(`userCommande`, tab);
            resolve(data);
          }
        } else {
          let store = [];
          store.push(data);
          await this.cache.cacheRequest(`userCommande`, store);
          resolve(data);
        }
      }
      if (method == 'storeAvance') {
        let data = JSON.parse(JSON.stringify(order));

        let tab = await this.cache.getCachedRequest('userCommande');

        if (tab && tab.length) {
          let index = tab.findIndex((elt) => {
            return elt.localId == data['localId'];
          });
          if (index >= 0) {
            // [].splice
            tab.splice(index, order, 1);
            this.cache.cacheRequest(`userCommande`, tab);
          } else {
            tab.push(data);
            this.cache.cacheRequest(`userCommande`, tab);
          }
        } else {
          let store = [];
          store.push(data);
          this.cache.cacheRequest(`userCommande`, store);
        }
      }
      if (method == 'incomming') {
        let data = JSON.parse(JSON.stringify(order));
        let tab = await this.cache.getCachedRequest('userCommande');

        if (tab && tab.length) {
          tab.forEach((elt) => {
            let index = order.findIndex((elt) => {
              return elt.localId == data['localId'];
            });
            if (index >= 0) {
            } else {
            }
          });
        } else {
          let store = [];
          store.push(data);
          this.cache.cacheRequest(`userCommande`, store);
        }
      }
      if (method == 'add') {
        let tab = await this.cache.getCachedRequest('userCommande');
        if (tab && tab.length) {
          let index = tab.findIndex((elt) => {
            return elt.localId == order['localId'];
          });

          if (index >= 0) {
            tab.splice(index, 1, order);
            this.cache.cacheRequest(`userCommande`, tab);
            resolve('ok');
          } else {
            reject('no order found!!!');
          }
        } else {
          reject('no users data');
        }
      }

      if (method == 'maericancelAndUpdate') {
        let tab = await this.cache.getCachedRequest('userCommande');

        if (tab && tab.length) {
          let index = tab.findIndex((elt) => {
            return elt.localId == order['localId'];
          });

          if (index >= 0) {
            let obj = tab[index];
            obj['commandes'] = order['newCommande'];
            let total = 0;
            obj['commandes'].forEach((com) => {
              total = total + parseInt(com['cartdetails']['totalPrice']);
            });
            obj['totalPrice'] = total;
            tab.splice(index, 1, obj);
            this.cache.cacheRequest('userCommande', tab);
            resolve(obj);
          } else {
            reject('no order found!!!');
          }
        } else {
          reject('no users data');
        }
      }

      if (method == 'patch') {
        let tab = await this.cache.getCachedRequest('userCommande');

        if (tab && tab.length) {
          let index = await tab.findIndex((elt) => {
            return elt.localId == order;
          });
          if (index >= 0) {
            let com = tab[index];
            //  alert(com);
            com['confirm'] = true;
            com['Posconfirm'] = true;

            tab.splice(index, 1, com);
            this.cache.cacheRequest('userCommande', tab);
            resolve(com);
          }
        }
      }
      if (method == 'remove') {
        let data2 = [];
        let tab = await this.cache.getCachedRequest('userCommande');
        // console.log('from cache', data2);
        let storeId = this.saveRandom.getStoreId();
        if (tab && tab.length) {
          tab = tab.filter((elt) => {
            return elt.localId !== order.localId && elt.storeId == storeId;
          });
          tab = tab.filter((elt) => {
            return elt.localId !== order.localId && elt.storeId == storeId;
          });
          if (tab && tab.length) {
            this.cache.cacheRequest(`userCommande`, tab);
          } else {
            this.cache.cacheRequest(`userCommande`, []);
          }
          let facturePayées: any[] = await this.cache.getCachedRequest(
            'invoicePaie'
          );

          if (facturePayées && facturePayées.length) {
            if (order['invoiceCancel']) {
            } else {
              let found = tab.find((elt) => {
                return elt.localId !== order.localId;
              });
              if (found) {
              } else {
                facturePayées.push(order);
              }
            }
          } else {
            facturePayées = [];
            if (order['invoiceCancel']) {
            } else {
              facturePayées.push(order);
            }
          }
          let res = await this.cache.cacheRequest(`invoicePaie`, facturePayées);

          resolve('ok');
        } else {
          resolve('rien');
        }
      }

      if (method == 'update') {
        //  let tab = [];
        //  tab = JSON.parse(localStorage.getItem(`userCommande`));
        let tab = await this.cache.getCachedRequest('userCommande');

        if (tab && tab.length) {
          tab.forEach((elt) => {
            if (elt.localId === order['localId']) {
              elt['Posconfirm'] = true;
            }
            return;
          });
          this.cache.cacheRequest('userCommande', tab);
          // localStorage.setItem(`userCommande`, JSON.stringify(tab));
        }
      }
    });
  }
}
