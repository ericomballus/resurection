import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Admin } from 'src/app/models/admin.model';
import { AdminService } from 'src/app/services/admin.service';
import { ExpenseService } from 'src/app/services/expense.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
})
export class AddExpensePage implements OnInit {
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  categories: any[] = [];
  userStore = [];
  categorieId = null;
  storeId = null;
  reason = null;
  admin: Admin;
  constructor(
    private expenseService: ExpenseService,
    private notifi: NotificationService,
    private saveRandom: SaverandomService,
    private adminService: AdminService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    let storeList: any[] = this.saveRandom.getStoreList();
    let setting = JSON.parse(localStorage.getItem('setting'))[0];
    this.userStore = storeList;
    this.storeId = this.userStore[0]['id'];
    this.getCategorie();
    this.admin = this.saveRandom.getAdminAccount();
  }

  getCategorie() {
    if (this.expenseService.getLocalCategorie().length) {
      this.categories = this.expenseService.getLocalCategorie();
    } else {
      this.expenseService.getExpenseCategories().subscribe((docs: any) => {
        this.categories = docs;
        this.expenseService.setCategorie(docs);
      });
    }
  }
  async postExpense(form) {
    this.notifi.presentLoading();
    console.log(form.value);
    console.log(this.categorieId);
    console.log(this.storeId);
    console.log(this.reason);
    let expense = form.value;
    expense['storeId'] = this.storeId;
    expense['reason'] = this.reason;
    expense['categorieId'] = this.categorieId;
    let store = await this.foundStore(this.storeId);
    store = await this.setBudgetAndUpdate(store, expense['amount']);
    this.expenseService.postExpense(expense).subscribe(
      (doc) => {
        this.updateWithoutExit(store);
        this.formulaire.reset();
        this.notifi.dismissLoading();
        this.notifi.presentToast('enregistré avec success !', 'success');
      },
      (err) => {
        this.notifi.dismissLoading();
        if (err.error && err.error.message) {
          let store = this.userStore.find((s) => s.id == this.storeId);
          this.notifi.presentToast(
            `${store.name} ${err.error.message}`,
            'danger'
          );
        }
      }
    );
  }
  chooseCategorie(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
    this.categorieId = ev.target['value'];

    let found = this.categories.filter(
      (item) => item['_id'] === this.categorieId
    )[0];
    console.log(found);
    this.reason = found.name;
  }
  async assignStore(ev) {
    console.log(ev.target.value);
    this.storeId = ev.target.value;
  }

  foundStore(id) {
    return new Promise((resolve, reject) => {
      let s: any[] = this.userStore;
      let f = s.find((elt) => elt.id == id);
      if (f) {
        resolve(f);
      } else {
        reject(null);
      }
    });
  }
  setBudgetAndUpdate(store, totalPrice) {
    return new Promise((resolve, reject) => {
      if (store['reste']) {
        store.reste = store.reste - totalPrice;
      } else {
        store['reste'] = store.budget - totalPrice;
      }
      resolve(store);
    });
  }

  updateWithoutExit(store) {
    let storeList = this.admin.storeId;
    let index = storeList.findIndex((s) => s.id == store.id);
    if (index >= 0) {
      this.admin.storeId.splice(index, 1, store);
      this.adminService.updateCustomer(this.admin).subscribe(
        (data) => {
          let admin = data['resultat'];
          console.log('result here===>', admin);
          if (admin) {
            let arr = [];
            arr.push(admin);
            let s = { count: 1, users: arr };
            localStorage.removeItem('credentialAccount');
            localStorage.setItem('credentialAccount', JSON.stringify(s));
          }
        },
        (err) => console.log(err)
      );
    }
  }
}
