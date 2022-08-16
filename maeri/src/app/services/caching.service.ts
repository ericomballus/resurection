import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../models/invoice';

// Expire time in seconds
const TTL = 60 * 60;

// Key to identify only cached API data
//const CACHE_KEY = '_mycached_';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  random = [];
  toSave = [];
  url: string = 'http://127.0.0.1:3000/';
  constructor(private storage: Storage, private http: HttpClient) {}

  // Setup Ionic Storage
  async initStorage() {
    this.storage
      .create()
      .then((r) => {
        console.log(r);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Store request data
  cacheRequest(url, data): Promise<any> {
    const validUntil = new Date().getTime() + TTL * 1000;

    return this.storage.set(url, { validUntil, data });
  }

  // Try to load cached data
  async getCachedRequest(url): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const currentTime = new Date().getTime();
      this.storage
        .get(url)
        .then(async (storedValue) => {
          if (!storedValue) {
            // reject('pas de value en cache');
            resolve(null);
          } else if (storedValue.validUntil < currentTime) {
            await this.storage.remove(url);
            // reject('expiration time');
            resolve(null);
          } else {
            resolve(storedValue.data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Remove all cached data & files
  clearCachedData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const keys = await this.storage.keys();
      let userCommande = await this.getCachedRequest('userCommande');
      // let userCommande = await this.getCachedRequest('userCommande');

      keys.map(async (key) => {
        if (key) {
          await this.storage.remove(key);
        }
      });
      // localStorage.clear();
      if (userCommande) {
        await this.cacheRequest('userCommande', userCommande);
      } else {
        await this.cacheRequest('userCommande', []);
      }
      resolve('ok');
    });
  }
  clearOneCacheData(key): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (key) {
        await this.storage.remove(key);
      }
      // localStorage.clear();
      resolve('ok');
    });
  }

  async clearOneCommande(commande): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let tab: any[] = await this.getCachedRequest('lesCommandes');
      if (tab && tab.length) {
        tab = tab.filter((com) => com.id !== commande.id);
        await this.cacheRequest(`lesCommandes`, tab);
        resolve(tab);
      }
    });
  }

  // Example to remove one cached URL
  async invalidateCacheEntry(url) {
    await this.storage.remove(url);
  }
  saveImagesToLocalServer(data) {
    return new Promise((resolve, reject) => {
      let url: string = 'http://127.0.0.1:3030/' + 'tolocalserver';
      this.http.post(`${url}`, data).subscribe(
        (res: string) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  checkImages(data) {
    let url: string = 'http://127.0.0.1:3030/' + 'checkifimages';

    return new Promise((resolve, reject) => {
      this.http.post(url, data).subscribe(
        (res: string) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
    //return this.http.post(`${this.url}checkifimages`, data)
  }
}
