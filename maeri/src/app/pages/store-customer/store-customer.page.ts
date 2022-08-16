import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { AddStoreCustomerPage } from '../add-store-customer/add-store-customer.page';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { UpdateStoreCustomerPage } from '../update-store-customer/update-store-customer.page';
import { DisplayStoreCustomerPage } from '../display-store-customer/display-store-customer.page';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { ManagesocketService } from 'src/app/services/managesocket.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
@Component({
  selector: 'app-store-customer',
  templateUrl: './store-customer.page.html',
  styleUrls: ['./store-customer.page.scss'],
})
export class StoreCustomerPage implements OnInit {
  customerList = [];
  public sockets;
  url: any;
  useBonus: Boolean = false;
  tabRole: any[] = [];
  constructor(
    public modalController: ModalController,
    private adminService: AdminService,
    public urlService: UrlService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private saveRandom: SaverandomService,
    private router: Router,
    private notifi: NotificationService,
    private manageSocket: ManagesocketService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    let setting = JSON.parse(localStorage.getItem('setting'));
    console.log(setting);
    this.languageChanged();
    if (setting[0]['use_bonus']) {
      this.useBonus = true;
    }
    console.log(setting);
    this.takeUrl();
    this.webServerSocket(localStorage.getItem('adminId'));
    this.tabRole = this.saveRandom.getTabRole();
    if (this.tabRole.includes(9)) {
    }
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  ionViewWillEnter() {
    this.getMyCustomer();
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // alert(this.url);
    });
  }

  getMyCustomer() {
    this.notifi.presentLoading();
    this.adminService.getUserCustumer().subscribe((res) => {
      console.log(res);
      this.customerList = res['custumers'];
      this.saveRandom.setCustomerList(this.customerList);
      this.notifi.dismissLoading();
    });
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: AddStoreCustomerPage,
      cssClass: 'mymodal-class',
    });
    modal.onDidDismiss().then((res) => {
      console.log(res);
    });

    return await modal.present();
  }

  webServerSocket(id) {
    // this.socket.connect();
    this.sockets = io(this.url);
    this.sockets.on('connect', function () {});
    this.sockets.on(`${id}customerAdd`, async (data) => {
      this.customerList.unshift(data);
    });
    this.sockets.on(`${id}customerUpdate`, async (data) => {
      let index = this.customerList.findIndex((custo) => custo._id == data._id);
      if (index >= 0) {
        this.customerList.splice(index, 1, data);
      }
    });

    this.sockets.on(`${id}customerDelete`, async (data) => {
      this.customerList = this.customerList.filter(
        (custo) => custo._id != data._id
      );
    });
  }
  async manageCustumer(customer) {
    console.log(customer);
    if (this.tabRole.includes(9)) {
      this.saveRandom.setData(customer);
      this.router.navigateByUrl('store-customer-balance');
    } else {
      let tab = [
        {
          text: 'Display customer',
          icon: 'share',
          handler: () => {
            this.displayCustomer(customer);
          },
        },
        {
          text: 'Customer Invoice',
          icon: 'person',
          handler: () => {
            this.displayInvoicesCustomer(customer);
          },
        },

        {
          text: 'Customer Balance',
          icon: 'person',
          handler: () => {
            this.saveRandom.setData(customer);
            this.router.navigateByUrl('store-customer-balance');
          },
        },
        {
          text: 'Delete Customers',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log(customer);
            this.confirmDelete(customer);
          },
        },
        {
          text: 'Update',
          icon: 'share',
          handler: () => {
            this.updateCustomer(customer);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ];
      if (this.useBonus) {
        let obj = {
          text: 'Display Point',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          },
        };
        tab.push(obj);
      }
      const actionSheet = await this.actionSheetController.create({
        header: `customer : ${customer.name}`,
        cssClass: 'my-actionSheet-class',
        buttons: tab,
      });
      await actionSheet.present();

      const { role } = await actionSheet.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
  }

  async updateCustomer(customer) {
    const modal = await this.modalController.create({
      component: UpdateStoreCustomerPage,
      cssClass: 'mymodal-class',
      componentProps: { customer: customer },
    });
    modal.onDidDismiss().then((res) => {
      console.log(res);
    });

    return await modal.present();
  }

  async displayCustomer(customer) {
    const modal = await this.modalController.create({
      component: DisplayStoreCustomerPage,
      cssClass: 'mymodal-class',
      componentProps: { customer: customer },
    });
    modal.onDidDismiss().then((res) => {
      console.log(res);
    });

    return await modal.present();
  }

  async confirmDelete(customer) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alertClass',
      header: 'Confirm!',
      message: `Delete ${customer.name} ?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'YES',
          cssClass: 'danger',
          handler: () => {
            this.adminService
              .deleteUserCustumer(customer._id)
              .subscribe((res) => {});
          },
        },
      ],
    });

    await alert.present();
  }
  displayInvoicesCustomer(customer) {
    this.notifi.presentLoading();
    this.adminService.getInvoiceCustomer(customer._id).subscribe(
      (invoices) => {
        this.notifi.dismissLoading();
        if (invoices['docs'].length) {
          this.saveRandom.setCustomerInvoices(invoices['docs']);
          this.router.navigateByUrl('store-customer-invoice');
        } else {
          this.notifi
            .presentError('not invoices found', 'primary')
            .then(() => {});
        }
      },
      (err) => {
        this.notifi.dismissLoading();
        this.notifi
          .presentError(
            'unable to join server please check your internet connection',
            'danger'
          )
          .then(() => {});
      }
    );
  }

  displayBonus() {
    this.router.navigateByUrl('display-bonus-customer');
  }
  displayLeaderClients() {
    console.log(this.customerList);

    let leaderList = this.customerList.filter((customer) => customer.Role == 1);
    console.log(leaderList);
    if (leaderList) {
      this.saveRandom.setCustomerList(this.customerList);
      this.saveRandom.setData(leaderList);
      this.router.navigateByUrl('leader-list');
    }
  }
}
