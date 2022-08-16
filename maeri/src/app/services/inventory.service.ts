import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  inventory: any;
  cashClose: any = 0;
  constructor() {}

  getInventoryList() {
    if (this.inventory === null || this.inventory === undefined) {
      return 0;
    } else {
      return this.inventory;
    }
  }
  setInventoryList(data) {
    console.log(data);
    this.inventory = data;
  }

  getCash() {
    if (this.cashClose) {
      return this.cashClose;
    } else {
      return 0;
    }
  }
  setCash(data) {
    this.cashClose = data;
  }
}
