import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin, BehaviorSubject, concat } from 'rxjs';
import { switchMap, finalize, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { UrlService } from './url.service';
import { environment, uri } from '../../environments/environment';
//import 'firebase/database';
import { SaverandomService } from './saverandom.service';
import { CachingService } from './caching.service';
const STORAGE_REQ_KEY = 'storedreq';
const STORAGE_REQ_KEY2 = 'myCommande';
interface StoredRequest {
  url: string;
  type: string;
  data: any;
  time: number;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class OfflineManagerService {
  url: string = 'http://192.168.100.10:3000/';
  storageSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem(`${STORAGE_REQ_KEY}`))
  );
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController,
    private urlService: UrlService,
    private saveRandom: SaverandomService,
    private cache: CachingService
  ) {
    this.takeUrl();
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

  storeRequest(url, type, data) {
    let toast = this.toastController.create({
      message: `Your data is stored locally because you seem to be offline.`,
      duration: 3000,
      position: 'bottom',
    });
    toast.then((toast) => toast.present());

    let action: StoredRequest = {
      url: url,
      type: type,
      data: data,
      time: new Date().getTime(),
      id: Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5),
    };
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

    // localStorage.setItem(`${STORAGE_REQ_KEY}`, JSON.stringify(data));
    let tab = JSON.parse(localStorage.getItem(`${STORAGE_REQ_KEY}`));
    if (tab) {
      tab.push(action);
    } else {
      tab = [action];
    }
    localStorage.setItem(`${STORAGE_REQ_KEY}`, JSON.stringify(tab));
    let products = JSON.parse(localStorage.getItem(`${STORAGE_REQ_KEY}`));
    let nbr = products.length;
    let index = nbr - 1;
    action['data']['_id'] = action['id'];
    this.storageSubject.next(action['data']);
    return of(products[index]);
    // Save old & new local transactions back to Storage
    // return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    //}
    /*  return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    }); */
  }
  sendRequests(operations: StoredRequest[]) {
    let obs = [];

    for (let op of operations) {
      // console.log("Make one request: ", op);
      // let oneObs = this.http.request(op.type, op.url, op.data);
      delete op.data.commande;
      delete op.data.products;
      delete op.data.userName;
      delete op.data.sale;
      delete op.data.created;
      console.log(op.data);

      let oneObs = this.http.post(op.url, op.data);
      obs.push(oneObs);
    }

    return forkJoin(obs);
    // return concat(obs);
  }

  sendLocalDataToserver(obj) {
    console.log(obj);

    if (obj.type === 'POST') {
      return this.http.post(obj.url, obj.data).pipe(
        catchError((err) => {
          console.log('offfline service page', err);
          return of(false);
          /*  return this.storeCommande(
            obj.url,
            'POST',
            obj.data
          
          );*/
        })
      );
    }
    if (obj.type === 'PATCH') {
      return this.http.patch(obj.url, obj.data).pipe(
        catchError((err) => {
          return of(false);
        })
      );
      /* .pipe(
        catchError((err) => {
          return this.storeCommande(
            obj.url,
            'PATCH',
            obj.data
           
          );
        })
      );*/
    }
  }
  getStorageData() {
    return this.storageSubject;
  }

  localServerMakePost(path, method, body) {
    let openCashDate = localStorage.getItem('openCashDate');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    let a = this.url.split('3000');
    let ur = a[0] + '3000';
    let url = ur + path;
    let isRetailer = false;
    if (this.saveRandom.checkIfIsRetailer()) {
      isRetailer = true;
    }

    if (!body['localId']) {
      alert('pas de local id');
    }
    let data = {
      cart: body['cart'],
      adminId: localStorage.getItem('adminId'),
      tableNumber: body['tableNumber'],
      confirm: body['confirm'],
      Posconfirm: body['Posconfirm'],
      openCashDate: openCashDate,
      openCashDateId: openCashDateId,
      userName: body['userName'],
      numFacture: body['numFacture'],
      localId: body['localId'],
      senderId: body['senderId'],
      storeId: body['storeId'],
      resourceList: body['resourceList'],
      isRetailer: isRetailer,
    };
    return this.http.post(url, data).pipe(
      catchError((err) => {
        // this.offlineManager.storeRequest(url, "POST", data);
        console.log('ici error', err);

        return this.storeCommande(
          url,
          'POST',
          data
          // throw new Error(err);
        );
      })
    );
  }

  localServerMakePatch(path, method, body) {
    if (body['url']) {
      let a = this.url.split('3000');
      let ur = a[0] + '3000';
      let url = ur + path;
      return this.http.patch(url, body).pipe(
        // return from("hello");
        catchError((err) => {
          return this.storeCommande(url, 'PATCH', body);
        })
      );
    } else {
      let a = this.url.split('3000');
      let ur = a[0] + '3000';
      let url = ur + path;

      return this.http.patch(url, body).pipe(
        catchError((err) => {
          // this.offlineManager.storeRequest(url, "POST", data);
          console.log('ici error', err);

          return this.storeCommande(
            url,
            'PATCH',
            body
            // throw new Error(err);
          );
        })
      );
    }
  }

  localServerCancelOrder(path, method, body) {
    if (body['url']) {
      return this.http.patch(body['url'], body).pipe(
        catchError((err) => {
          return this.storeCommande(body['url'], 'PATCH', body);
        })
      );
    } else {
      let a = this.url.split('3000');
      let ur = a[0] + '3000';
      let url = ur + path;

      return this.http.patch(url, body).pipe(
        catchError((err) => {
          // this.offlineManager.storeRequest(url, "POST", data);
          console.log('ici error', err);

          return this.storeCommande(
            url,
            'PATCH',
            body
            // throw new Error(err);
          );
        })
      );
    }
  }

  storeCommande(url, type, data) {
    let id = 'nothing';
    if (data['localId']) {
      id = data['localId'];
    }
    let obj = {
      url: url,
      type: type,
      data: data,
      id: id,
    };
    console.log('to store ===>', obj);
    /* this.cache
      .getCachedRequest('lesCommandes')
      .then((docs) => {
        let tab: any[] = docs;
        if (tab && tab.length) {
          tab = tab.filter((com) => com['id'] != data['id']);
          tab.push(obj);
        } else {
          tab = [];
          tab.push(obj);
        }
        this.cache.cacheRequest(`lesCommandes`, tab);
      })
      .catch((err) => {
        console.log(err);
      });*/
    this.tryToSendDataToServer(obj, data);
    let toast = this.toastController.create({
      message: `Your data is stored locally because you seem to be offline.`,
      duration: 1000,
      position: 'bottom',
    });
    toast.then((toast) => toast.present());
    // resolve(data)
    return of(data);
  }

  tryToSendDataToServer(obj, data) {
    console.log(obj);

    if (obj.type === 'POST') {
      this.http.post(obj.url, obj.data).subscribe(
        (res) => {
          console.log('success operation =====>', res);
        },
        (err) => {
          this.cache
            .getCachedRequest('lesCommandes')
            .then((docs) => {
              let tab: any[] = docs;
              if (tab && tab.length) {
                tab = tab.filter((com) => com['id'] != data['id']);
                tab.push(obj);
              } else {
                tab = [];
                tab.push(obj);
              }
              this.cache.cacheRequest(`lesCommandes`, tab);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
    if (obj.type === 'PATCH') {
      this.http.patch(obj.url, obj.data).subscribe(
        (res) => {
          console.log('success operation =====>', res);
        },
        (err) => {
          this.cache
            .getCachedRequest('lesCommandes')
            .then((docs) => {
              let tab: any[] = docs;
              if (tab && tab.length) {
                tab = tab.filter((com) => com['id'] != data['id']);
                tab.push(obj);
              } else {
                tab = [];
                tab.push(obj);
              }
              this.cache.cacheRequest(`lesCommandes`, tab);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
  }
}
