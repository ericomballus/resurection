import { Injectable } from '@angular/core';
import { AdminService } from './admin.service';
import { SaverandomService } from './saverandom.service';

@Injectable({
  providedIn: 'root',
})
export class GetStoreNameService {
  adminData = null;
  constructor(
    private adminService: AdminService,
    private saveRandom: SaverandomService
  ) {}

  takeName(value) {
    let adminId = '';
    return new Promise((resolve, reject) => {
      if (JSON.parse(localStorage.getItem('user'))['adminId']) {
        adminId = JSON.parse(localStorage.getItem('user'))['adminId'];
      } else {
        adminId = localStorage.getItem('adminId');
      }

      let storeName = '';
      if (!this.adminData) {
        if (this.saveRandom.getStoreList()) {
          let storeList = this.saveRandom.getStoreList();

          let store = storeList.filter((str) => str.id == value[0]['storeId']);

          if (store.length) {
            storeName = store[0]['name'];
          } else {
            storeName = 'no name';
          }
          resolve(storeName);
        } else {
          this.adminService.getUserById(adminId).subscribe((result) => {
            //  this.adminData = result["users"];

            let USER = result['users'][0]['storeId'];
            let store = USER.filter((str) => {
              // console.log(`store Id ${str.id}  ===> ${value[0]["storeId"]}`);

              return str.id == value[0]['storeId'];
            });
            // console.log(store);
            if (store.length) {
              storeName = store[0]['name'];
            } else {
              storeName = 'no name';
            }
            resolve(storeName);
          });
        }
      } else {
      }
    });
  }

  takeNameById(storeId: string) {
    let adminId = '';
    return new Promise((resolve, reject) => {
      if (JSON.parse(localStorage.getItem('user'))['adminId']) {
        adminId = JSON.parse(localStorage.getItem('user'))['adminId'];
      } else {
        adminId = localStorage.getItem('adminId');
      }

      let storeName = '';
      if (!this.adminData) {
        //  console.log(value);

        this.adminService.getUserById(adminId).subscribe((result) => {
          let USER = result['users'][0]['storeId'];
          let store = USER.filter((str) => {
            return str.id == storeId;
          });
          // console.log(store);
          if (store.length) {
            storeName = store[0]['name'];
          } else {
            storeName = 'no name';
          }
          resolve(storeName);
        });
      } else {
      }
    });
  }

  getCustumerStoreList() {
    let adminId = '';
    return new Promise((resolve, reject) => {
      if (JSON.parse(localStorage.getItem('user'))['adminId']) {
        adminId = JSON.parse(localStorage.getItem('user'))['adminId'];
      } else {
        adminId = localStorage.getItem('adminId');
      }

      this.adminService.getUserById(adminId).subscribe((result) => {
        let STORE = result['users'][0]['storeId'];
        resolve(STORE);
      });
    });
  }

  getLocalStoreList() {
    return new Promise((resolve, reject) => {
      if (JSON.parse(localStorage.getItem('user'))[0]['storeId']) {
        let STORE = JSON.parse(localStorage.getItem('user'))[0]['storeId'];
        resolve(STORE);
      } else if (
        JSON.parse(localStorage.getItem('credentialAccount'))['users'][0][
          'storeId'
        ]
      ) {
        let STORE = JSON.parse(localStorage.getItem('credentialAccount'))[
          'users'
        ][0]['storeId'];
        resolve(STORE);
      } else {
        reject('no store found');
      }
    });
  }
}
