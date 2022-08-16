import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Admin } from 'src/app/models/admin.model';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {
  storeList: any[] = [];
  custumer: Admin;
  constructor(
    public saveRadom: SaverandomService,
    private modal: ModalController,
    private notifi: NotificationService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    let arr = this.saveRadom.getStoreList();
    arr.forEach((store) => {
      if (!store.budget) {
        store['budget'] = 0;
      }
    });
    this.storeList = arr;
    this.custumer = JSON.parse(localStorage.getItem('user'))[0];
    // console.log(this.custumer);
  }

  closeModal() {
    this.modal.dismiss();
  }

  updateWithoutExit() {
    this.notifi.presentLoading();
    this.adminService.updateCustomer(this.custumer).subscribe(
      (data) => {
        // this.updateCompanySetting();
        this.notifi.dismissLoading();

        let s = [];
        s.push(this.custumer);
        localStorage.setItem('user', JSON.stringify(s));
      },
      (err) => console.log(err)
    );
  }
  display(p, i) {
    if (!p['open']) {
      p['open'] = true;
    } else {
      p['open'] = false;
    }
    console.log(p);
  }
  getBudgetValue(ev, p, i) {
    let b = parseInt(ev.detail.value);
    this.storeList[i]['budget'] = b;
    this.storeList[i]['reste'] = 0;
  }

  save(store, index) {
    store.open = false;
    this.custumer.storeId = this.storeList;
    this.updateWithoutExit();
  }
}
