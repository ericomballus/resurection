import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {
  ModalController,
  AlertController,
  NavParams,
  ActionSheetController,
  // Events,
} from '@ionic/angular';
import { AdminService } from '../services/admin.service';
import { PopComponent } from '../popovers/pop/pop.component';
import { SelectvendorService } from '../services/selectvendor.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { SaverandomService } from '../services/saverandom.service';
import { SupercashierService } from '../services/supercashier.service';
import { Admin } from '../models/admin.model';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
})
export class PurchasePage implements OnInit {
  allPurchase: Array<any>;
  articles = [];
  totalPurchase = 0;
  quantity = 0;
  venders = [];
  vendorRole: Boolean = false;
  admin: Admin;
  constructor(
    private adminService: AdminService,
    private popover: PopoverController,
    public router: Router,
    public actionSheet: ActionSheetController,
    public alertController: AlertController,
    private notifi: NotificationService,
    private random: SaverandomService,
    private scService: SupercashierService,
    private saveRandom: SaverandomService
  ) {
    if (
      JSON.parse(localStorage.getItem('user'))[0] &&
      JSON.parse(localStorage.getItem('user'))[0].venderRole
    ) {
      this.vendorRole = JSON.parse(localStorage.getItem('user'))[0].venderRole;
    }
  }

  ngOnInit() {
    this.admin = this.random.getAdminAccount();
  }
  ionViewWillEnter() {
    let storeId = this.random.getStoreId();
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.getVendor();

    this.adminService.getPurchase().subscribe((data) => {
      if (tabRoles.includes(2)) {
        this.allPurchase = data['docs'].filter((p) => p.storeId == storeId);
      } else {
        this.allPurchase = data['docs'];
        // this.allPurchase = data['docs'].filter((p) => p.storeId == storeId);
      }

      if (this.random.getSetting().sale_Gaz) {
        this.allPurchase.forEach(async (p) => {
          if (!p.ischecked) {
            try {
              let store = await this.foundStore(p.storeId);
              if (store['budget']) {
                p['ischecked'] = true;
                let s = await this.setBudgetAndUpdate(store, p.totalPrice, p);
                this.updateWithoutExit(s);
              }
            } catch (error) {}
          }
        });
      }
    });
  }

  foundStore(id) {
    return new Promise((resolve, reject) => {
      let s: any[] = this.admin.storeId;
      let f = s.find((elt) => elt.id == id);
      if (f) {
        resolve(f);
      } else {
        reject(null);
      }
    });
  }

  setBudgetAndUpdate(store, totalPrice, p) {
    return new Promise((resolve, reject) => {
      if (store['reste']) {
        store.reste = store.reste - totalPrice;
      } else {
        store['reste'] = store.budget - totalPrice;
      }

      this.adminService.updatePurchase(p).subscribe(
        (res) => {
          //  console.log(res);

          resolve(store);
        },
        (err) => reject(err)
      );
    });
  }

  updateWithoutExit(store) {
    let storeList = this.admin.storeId;

    let index = storeList.findIndex((s) => s.id == store.id);
    console.log(index);

    if (index >= 0) {
      this.admin.storeId.splice(index, 1, store);
      this.adminService.updateCustomer(this.admin).subscribe(
        (data) => {
          // this.updateCompanySetting();
        },
        (err) => console.log(err)
      );
    }
  }

  openPurchase(p, i) {
    if (this.allPurchase[i]['open']) {
      this.allPurchase[i]['open'] = false;
      this.articles = [];
    } else {
      this.allPurchase[i]['open'] = true;

      this.allPurchase[i]['articles'].forEach((elt) => {
        console.log(elt);

        this.totalPurchase = elt.totalPrice;
        if (elt.totalQty) {
          this.quantity = elt.totalQty;
        } else {
          this.quantity = elt.quantity;
        }
        if (elt.products) {
          elt.products.forEach((prod) => {
            console.log(prod);

            if (
              prod['item']['packPrice'] > 1 &&
              prod['item']['qty'] !== prod['item']['packPrice']
            ) {
              prod['packPrice'] = parseInt(prod['item']['packPrice']);
            } else {
              prod['packPrice'] = prod['item']['purchasingPrice'];
            }
          });
          this.articles = [...this.articles, ...elt.products];
        } else {
          //  elt.articles.forEach((prod) => {
          if (elt['item']['packPrice']) {
            elt['packPrice'] = parseInt(elt['item']['packPrice']);
          } else {
            elt['packPrice'] = 0;
          }
          // });
          this.articles.push(elt);
        }
      });
      console.log(this.articles);
    }
  }

  CreatePopover() {
    this.router.navigateByUrl('product-buy');
  }

  getVendor() {
    this.adminService.getVendors().subscribe((result: Array<any>) => {
      this.venders = result;
    });
  }

  removePurchase(p, i) {
    this.notifi.presentLoading();
    this.adminService.deletePurchase(p).subscribe((data) => {
      this.notifi.dismissLoading();
      this.allPurchase = this.allPurchase.filter((elt) => elt._id !== p._id);
    });
  }

  dsiplayPurchase(p, i) {
    console.log(p);
    this.random.setData(p);
    this.router.navigateByUrl('purchase-confirm');
  }

  async presentAlertConfirm(p, i) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `Voulez vous supprimer ?`,
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'OUI',
          handler: () => {
            this.removePurchase(p, i);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentActionSheet(p, i) {
    let arr = [];
    arr.push({
      text: 'List',
      icon: 'share',
      handler: () => {
        this.openPurchase(p, i);
      },
    });
    if (this.saveRandom.getSetting().refueling_from_warehouse_production) {
      arr.push({
        text: 'Bordereau livraison',
        role: 'destructive',
        icon: 'share',
        handler: () => {
          this.dsiplayPurchase(p, i);
        },
      });
    }
    arr.push({
      text: 'Supprimer',
      role: 'destructive',
      icon: 'trash',
      handler: () => {
        this.presentAlertConfirm(p, i);
      },
    });
    arr.push({
      text: 'Close',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    });

    const actionSheet = await this.actionSheet.create({
      header: 'Albums',
      buttons: arr,
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }
}
