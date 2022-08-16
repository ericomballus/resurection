import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../services/notification.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-admin-display-collections',
  templateUrl: './admin-display-collections.page.html',
  styleUrls: ['./admin-display-collections.page.scss'],
})
export class AdminDisplayCollectionsPage implements OnInit {
  dbName: String;
  collections: Array<any>;
  custumers = [];
  custumersConnect = [];
  storeList = [];
  company: any;
  index: any;
  storeId = '';
  constructor(
    public adminService: AdminService,
    public notificationService: NotificationService,
    public alertController: AlertController,
    private saveRandom: SaverandomService,
    private notifi: NotificationService
  ) {}

  ngOnInit() {
    this.dbName = this.saveRandom.getDbName();
    this.collections = this.saveRandom.getCollectionList();
    this.getCustomers();
  }

  async dropCollection(item) {
    console.log(item);
    const alert = await this.alertController.create({
      cssClass: 'closeCash',
      message: `Drop collection ${item.name} ?`,

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: () => {
            this.notificationService.presentLoading();
            this.adminService
              .customersDropDbCollection(this.dbName, item.name)
              .subscribe(
                (res) => {
                  this.collections = this.collections.filter(
                    (items) => items.name !== item.name
                  );
                  this.notificationService.dismissLoading();
                  this.notificationService.presentToast(
                    `${item.name} drop succesfull!`,
                    'success'
                  );
                },
                (err) => {
                  this.notificationService.dismissLoading();
                  this.notificationService.presentToast(`${err}`, 'tertiary');
                }
              );
          },
        },
      ],
    });
    await alert.present();
  }
  getCollectionDocuments(item) {
    console.log(item);
    /* this.adminService.getDocsDbCollection(this.dbName, item.name).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.notificationService.dismissLoading();
        this.notificationService.presentToast(`${err}`, 'tertiary');
      }
    );*/
    if (!this.company && !this.storeId) {
      this.notifi.presentAlert('please select customer and store');
      return;
    }
    this.notifi.presentAlertConfirm('reset data ?', 'Yes', 'No').then((res) => {
      this.notifi.presentLoading();
      this.company['storeId'] = this.storeId;
      this.company['adminId'] = this.company._id;
      this.adminService
        .deleteDocsDbCollection(this.dbName, item.name, this.company)
        .subscribe(
          (res) => {
            console.log(res);
            this.custumers = JSON.parse(localStorage.getItem('customers'));
            //  this.getCustomers();
            // this.company = null;
            this.storeId = null;
            // this.index = -1;
            this.storeList = [];
            // this.custumers = [];
            setTimeout(() => {
              // this.custumers = this.custumersConnect;
            }, 2000);
            this.notifi.dismissLoading();
            this.notifi.presentToast('succesfully!', 'success');
          },
          (err) => {
            this.company = null;
            this.storeId = null;
            this.notificationService.dismissLoading();
            this.notificationService.presentToast(`${err}`, 'tertiary');
          }
        );
    });
  }

  getCustomers() {
    this.adminService.getUser().subscribe((data) => {
      console.log(data);
      this.custumers = [];

      this.custumers = data['users'];
      this.custumersConnect = data['users'];
      localStorage.setItem('customers', JSON.stringify(this.custumers));
    });
  }
  selectCustomer(ev) {
    console.log(ev);
    let id = ev.detail.value;
    this.storeList = [];
    console.log(this.custumers);
    console.log(this.storeList);
    let i = this.custumers.findIndex((elt) => elt._id == id);
    if (i >= 0) {
      this.index = i;
      console.log(i);
      this.company = this.custumers[i];
      this.storeList = this.company['storeId'];
      console.log(this.custumers[i]);
    }
  }
  selectStore(ev) {
    //  console.log(ev.detail.value);
    // console.log(this.storeList[this.index]);
    let selectedValues = Array.apply(null, ev.options) // convert to real Array
      .filter((option) => option.selected)
      .map((option) => option.value);
    //  this.storeId = ev.detail.value;
    this.storeId = selectedValues[0];
  }

  setSelected(ev) {
    let selectedValues = Array.apply(null, ev.options) // convert to real Array
      .filter((option) => option.selected)
      .map((option) => option.value);

    console.log(selectedValues);
    let id = selectedValues[0];

    let i = this.custumers.findIndex((elt) => elt._id == id);
    if (i >= 0) {
      this.index = i;
      this.company = this.custumers[i];
      this.storeList = this.company['storeId'];
      let j = this.custumers.findIndex((elt) => elt._id == id);
      if (i >= 0) {
        this.index = j;

        this.company = this.custumers[j];
        this.storeList = this.company['storeId'];
      }
    }
  }
}
