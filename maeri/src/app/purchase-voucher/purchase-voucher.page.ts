import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { Setting } from '../models/setting.models';
import { DetailsPage } from '../point-of-sale/details/details.page';
import { AdminService } from '../services/admin.service';
import { CachingService } from '../services/caching.service';
import { ManagesocketService } from '../services/managesocket.service';
import { NotificationService } from '../services/notification.service';
import { SaverandomService } from '../services/saverandom.service';
import { ScreensizeService } from '../services/screensize.service';
import { UrlService } from '../services/url.service';
import { TranslateConfigService } from '../translate-config.service';
import { Bill } from 'src/app/models/bill.model';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseVoucherService } from '../services/purchase-voucher.service';
import { BonDeRemboursement } from '../models/refundVoucher.model';

@Component({
  selector: 'app-purchase-voucher',
  templateUrl: './purchase-voucher.page.html',
  styleUrls: ['./purchase-voucher.page.scss'],
})
export class PurchaseVoucherPage implements OnInit {
  data: any;
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  openCashDate: any;
  queryDate: any;
  invoices = [];
  montant = 0;
  rembourse = 0;
  tabRoles = [];
  userName: any;
  tabBill = [];
  isLoading = false;
  printAutorisation = false;
  public urlEvent;
  isDesktop: boolean;
  destroy$ = new Subject();
  setting: Setting;
  useGamme: boolean;
  produitRetour: Product[] = [];
  constructor(
    private calendar: NgbCalendar,
    public notif: NotificationService,
    private adminService: AdminService,
    private saveRandom: SaverandomService,
    private translateConfigService: TranslateConfigService,
    public alertController: AlertController, // public translate: TranslateService
    private urlService: UrlService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public router: Router,
    public screensizeService: ScreensizeService,
    private manageSocket: ManagesocketService,
    private notifi: NotificationService,
    public actionSheet: ActionSheetController,
    public translate: TranslateService,
    private voucherService: PurchaseVoucherService
  ) {}

  ngOnInit() {}
  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ionViewWillEnter() {
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
    this.getVouchers();
    this.screenCheck();
    this.setting = this.saveRandom.getSetting();
    this.useGamme = this.setting.use_gamme;
    this.languageChanged();
    let adminId = localStorage.getItem('adminId');
    this.webServerSocket(adminId);
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    console.log(lang);

    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  takeInventory() {
    this.notifi.presentLoading();
    let day;
    let month;
    let year;

    year = `${this.model.year.toString()}`;
    if (this.model.day.toString().length === 1) {
      let jour = this.model.day + 1;
      day = `${jour}`;
    } else {
      let jour = this.model.day + 1;
      day = `${jour}`;
    }

    if (this.model.month.toString().length === 1) {
      month = `${this.model.month}`;
    } else {
      month = `${this.model.month}`;
    }

    let start = new Date(
      this.model.year,
      this.model.month,
      this.model.day
    ).getTime();
    let end = new Date(
      this.model2.year,
      this.model2.month,
      this.model2.day
    ).getTime();

    if (start > end) {
      console.log('impossible');
      this.notif.presentError(
        'Sorry, the start date must be less than the end date',
        'danger'
      );
    } else {
      let d = {};
      d['start'] = new Date(
        this.model.year,
        this.model.month - 1,
        this.model.day + 1
      ).toISOString();
      d['end'] = new Date(
        this.model2.year,
        this.model2.month - 1,
        this.model2.day + 1
      ).toISOString();
      if (d['start'] == d['end']) {
        d['start'] = new Date(
          this.model.year,
          this.model.month - 1,
          this.model.day
        ).toISOString();
      }

      /* this.adminService.getBillDeleteAuth(d).subscribe((data: any[]) => {
        this.notifi.dismissLoading();
        this.invoices = [];
        if (data.length) {
          let tab: Bill[] = data;
          tab.forEach((bill) => {
            bill.purchaseOrder.forEach((elt) => {
              if (bill.customer) {
                let id = bill._id;
                elt['customer'] = bill.customer;
              } else {
                elt['customer'] = { name: 'non-defini' };
              }
              elt['billId'] = bill._id;
              this.invoices.push(elt);
            });
          });
        }
      });*/
    }
  }

  async getVouchers() {
    this.notif.presentLoading();
    this.voucherService.getPurchaseOrder().subscribe(
      (data: BonDeRemboursement[]) => {
        this.invoices = data;
        console.log(this.invoices);

        this.invoices.forEach((pro, index) => {
          let price = 0;

          pro['toRemove'].forEach((elt) => {
            price = price + elt.totalPrice;
          });
          pro['price'] = price;
          if (pro['customerId']) {
            let id = pro['customerId'];
            this.getCustomer(id, pro, index);
          }
        });

        this.notif.dismissLoading();
      },
      (err) => {
        this.notif.dismissLoading();
      }
    );
  }
  screenCheck() {
    setTimeout(() => {
      this.screensizeService.isDesktopView().subscribe((isDesktop) => {
        if (this.isDesktop && !isDesktop) {
        }

        this.isDesktop = isDesktop;
      });
    }, 10);
  }

  async displayDetails(order, index) {
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        order2: order,
        Bill: true,
      },
      cssClass: 'custom-modal',
    });
    modal.onDidDismiss().then((res) => {
      if (res.data && res.data['cancel']) {
        let doc = res.data['result'];
        this.invoices.splice(index, 1, doc);
      }
    });
    return await modal.present();
  }
  action(invoice, index) {
    console.log(invoice);
  }
  webServerSocket(id) {
    let storeId = this.saveRandom.getStoreId();
    this.manageSocket
      .getSocket()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sockets) => {
        sockets.on(`${id}billCancel`, (data) => {
          console.log('bill cancel', data);
        });
        sockets.on(`${id}${storeId}purchaseOrderChange`, (data) => {
          console.log('purchase order change', data);
          this.invoices = this.invoices.filter((bill) => {
            if (bill._id) {
              return bill._id !== data._id;
            } else {
              return bill.localId !== data.localId;
            }
          });
        });
      });
  }

  async viewMobileManageOrder(order: BonDeRemboursement, index) {
    let a: any = {};
    this.translate.get('MENU.backCash').subscribe((t) => {
      a['refundVoucher'] = t;
    });
    this.translate.get('MENU.replacewith').subscribe((t) => {
      a['replacewith'] = t;
    });
    this.translate.get('MENU.cancel').subscribe((t) => {
      a['cancel'] = t;
    });
    this.translate.get('MENU.returnProductConfirm').subscribe((t) => {
      a['returnProduct'] = t;
    });

    const actionSheet = await this.actionSheet.create({
      buttons: [
        {
          text: a.refundVoucher + '?',
          role: 'destructive',
          icon: 'eye',
          handler: () => {
            console.log(order);
            order['posConfirm'] = true;
            order['managerSend'] = false;
            order['repaymentWithCash'] = true;
            this.notifi
              .presentAlertConfirm(a.returnProduct)
              .then((res) => {
                order['returnProduct'] = true;
                this.notifi.presentLoading();
                this.updateVoucher(order, index);
              })
              .catch((err) => {
                order['returnProduct'] = false;

                this.notifi.presentLoading();
                this.updateVoucher(order, index);
              });
          },
        },
        {
          text: a.replacewith + '?',
          role: 'destructive',
          icon: 'cash',
          handler: () => {
            order.repaymentWithOtherProducts = true;
            console.log(order);
            this.saveRandom.setVoucher(order);
            this.router.navigateByUrl('/shop');
          },
        },
        {
          text: 'No',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getCustomer(customerId, order, index) {
    this.adminService.getOneCustumer(customerId).subscribe((customer) => {
      console.log(customer);
      order['customer'] = customer;
      this.invoices[index] = order;
    });
  }
  updateVoucher(order, index) {
    this.voucherService.updatePurchaseOrder(order).subscribe((data) => {
      console.log('result here', index, data);
      this.invoices = this.invoices.filter((vou) => vou._id !== order._id);
      this.notifi.dismissLoading();
      this.notifi.presentToast(`ok`, 'primary');
    });
  }
}
