import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Bill } from '../models/bill.model';
import { Product } from '../models/product.model';
import { Setting } from '../models/setting.models';
import { Store } from '../models/store.model';
import { DetailsPage } from '../point-of-sale/details/details.page';
import { AdminService } from '../services/admin.service';
import { AuthServiceService } from '../services/auth-service.service';
import { CachingService } from '../services/caching.service';
import { ChildBillService } from '../services/child-bill.service';
import { ManagesocketService } from '../services/managesocket.service';
import { NotificationService } from '../services/notification.service';
import { PurchaseVoucherService } from '../services/purchase-voucher.service';
import { SaverandomService } from '../services/saverandom.service';
import { ScreensizeService } from '../services/screensize.service';
import { UrlService } from '../services/url.service';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-manager-display-bill',
  templateUrl: './manager-display-bill.page.html',
  styleUrls: ['./manager-display-bill.page.scss'],
})
export class ManagerDisplayBillPage implements OnInit {
  data: any;
  model: NgbDateStruct;
  date: { year: number; month: number };
  model2: NgbDateStruct;
  date2: { year: number; month: number };
  openCashDate: any;
  queryDate: any;
  invoices: any[] = [];
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
  storeList: Store[] = [];
  EmployesList: any[] = [];
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
    private cache: CachingService,
    private manageSocket: ManagesocketService,
    private notifi: NotificationService,
    private voucherService: PurchaseVoucherService,
    private childInvoiceService: ChildBillService,
    public translate: TranslateService,
    private actionSheet: ActionSheetController,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.storeList = this.saveRandom.getStoreList();
    console.log(this.storeList);
    this.saveRandom.setStoreId(this.storeList[0].id);
    this.model = this.calendar.getToday();
    this.model2 = this.calendar.getToday();
    this.getBill();
    this.screenCheck();
    this.setting = this.saveRandom.getSetting();
    this.useGamme = this.setting.use_gamme;
    this.languageChanged();
    let adminId = localStorage.getItem('adminId');
    this.webServerSocket(adminId);
    this.takeEmployees();
  }
  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
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

      this.adminService.getBillDeleteAuth(d).subscribe((data: Bill[]) => {
        this.notifi.dismissLoading();

        data = data.sort((a, b) => {
          if (a.numFacture < b.numFacture) {
            //return -1;
          }
          var c: any = new Date(a.created);
          var d: any = new Date(b.created);
          return c - d;
          // return 0;
          //return new Date(b.created) - new Date(a.created);
        });
        this.invoices = data;
        console.log('query by date', data);
      });
    }
  }

  async getBill() {
    this.notif.presentLoading();
    //let tabChild = [];
    this.adminService.getBill(true, true).subscribe(
      (data) => {
        let tab = data['docs'].sort((a, b) => {
          if (a.numFacture < b.numFacture) {
            return -1;
          }
          return 0;
        });
        this.invoices = tab;
        this.invoices.forEach((elt, index) => {
          if (elt.montantReduction) {
            console.log('hello hello', elt);
            console.log('recu', elt.commande.montantRecu);
          }

          this.getChildVoucher(elt._id, index);
          this.getChildBill(elt._id, index);
        });

        this.notif.dismissLoading();
      },
      (err) => {
        this.notif.dismissLoading();
      }
    );

    return;
  }

  getInvoiceNotPaieAdmin() {}
  screenCheck() {
    setTimeout(() => {
      this.screensizeService.isDesktopView().subscribe((isDesktop) => {
        if (this.isDesktop && !isDesktop) {
        }

        this.isDesktop = isDesktop;
      });
    }, 10);
  }

  async displayDetails(invoice, index) {
    this.saveRandom.setData(invoice);
    localStorage.setItem('voucherBill', JSON.stringify(invoice));
    this.router.navigateByUrl('bill-details');
  }
  deleteInvoice(invoice, index) {
    console.log(invoice);

    this.saveRandom.setData(invoice);
    localStorage.setItem('voucherBill', JSON.stringify(invoice));
    this.router.navigateByUrl('delete-bill');
  }
  webServerSocket(id) {
    this.manageSocket
      .getSocket()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sockets) => {
        sockets.on(`${id}billCancel`, (data) => {
          console.log('manager display bill page ligne 244');
          console.log('bill cancel', data);
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

  getChildBill(id, index) {
    //childInvoiceService
    this.childInvoiceService.getOneChild(id).subscribe((data) => {
      if (data) {
        this.invoices[index].invoices.push(data);
      }
    });
  }

  getChildVoucher(id, index) {
    this.voucherService.getOnePurchase(id).subscribe((data) => {
      if (data) {
        this.invoices[index].purchaseOrder.push(data);
      }
    });
  }
  async viewMobileManageOrder(bill: Bill, index) {
    let a: any = {};
    this.translate.get('MENU.backCash').subscribe((t) => {
      a['refundVoucher'] = t;
    });
    this.translate.get('MENU.cancelInvoice').subscribe((t) => {
      a['cancel'] = t;
    });
    this.translate.get('MENU.displayInvoice').subscribe((t) => {
      a['display'] = t;
    });
    this.translate.get('MENU.returnProductConfirm').subscribe((t) => {
      a['returnProduct'] = t;
    });

    let arr = [
      {
        text: a.display + '?',
        role: 'destructive',
        icon: 'eye',
        handler: () => {
          console.log(bill);
          this.displayDetails(bill, index);
        },
      },
    ];

    if (!bill.cancel) {
      arr.push({
        text: a.cancel + '?',
        role: 'destructive',
        icon: 'cash',
        handler: () => {
          this.deleteInvoice(bill, index);
        },
      });
    }
    arr.push({
      text: 'Close',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    });

    const actionSheet = await this.actionSheet.create({
      buttons: arr,
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  selectStore(ev) {
    let selectedValues = Array.apply(null, ev.options) // convert to real Array
      .filter((option) => option.selected)
      .map((option) => option.value);
    //  this.storeId = ev.detail.value;
    // this.storeId = selectedValues[0];
    //  console.log(selectedValues);

    this.saveRandom.setStoreId(selectedValues[0]);
  }
  takeEmployees() {
    this.authService.getEmployees().subscribe((data) => {
      this.EmployesList = data['employes'];
      this.EmployesList = this.EmployesList.sort((c, b) =>
        c.name > b.name ? 1 : -1
      );
      this.saveRandom.setEmployeList(this.EmployesList);
    });
  }
}
