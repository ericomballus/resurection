import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '../models/store.model';
import { AdminService } from '../services/admin.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { NotificationService } from '../services/notification.service';
import { SaverandomService } from '../services/saverandom.service';
import { SuperManagerService } from '../services/super-manager.service';
import { RestApiService } from '../services/rest-api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Admin } from '../models/admin.model';
import { Setting } from '../models/setting.models';
import { RangeByStoreService } from '../services/range-by-store.service';
import { Product } from '../models/product.model';
import { MenuController, Platform } from '@ionic/angular';
import { MyeventsService } from '../services/myevents.service';
import { TranslateConfigService } from '../translate-config.service';
import { RefuelingService } from '../services/refueling.service';
import { AuthServiceService } from '../services/auth-service.service';
@Component({
  selector: 'app-super-manager',
  templateUrl: './super-manager.page.html',
  styleUrls: ['./super-manager.page.scss'],
})
export class SuperManagerPage implements OnInit {
  storeList: Store[] = [];
  setting: Setting;
  admin: Admin;
  destroy$ = new Subject();
  storeTypeTab = [];
  productServiceTab: any;
  totalProd = 0;
  randomObj = {};
  arr: any[] = [];
  totalRefueling = 0;
  EmployesList: any[] = [];
  constructor(
    private router: Router,
    private notifi: NotificationService,
    private saveRandom: SaverandomService,
    public getStoreName: GetStoreNameService,
    private adminService: AdminService,
    private superManagerService: SuperManagerService,
    private restApiService: RestApiService,
    private rangeByStoreService: RangeByStoreService,
    private menu: MenuController,
    private events: MyeventsService,
    private translateConfigService: TranslateConfigService,
    private refueling: RefuelingService,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.takeEmployees();
  }
  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  init() {
    this.storeList.forEach((store) => {
      this.randomObj[store.id] = { store: store };
    });
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  ionViewDidEnter() {
    this.randomObj = {};
    this.arr = [];
    this.getSetting();
    this.menu.enable(true, 'first');
    this.storeList = this.saveRandom.getStoreList();
    this.storeList.forEach((store) => {
      this.randomObj[store.id] = { store: store };
    });
    this.admin = this.saveRandom.getAdminAccount();
    this.setting = this.saveRandom.getSetting();
    this.storeTypeTab = this.admin.storeType;

    this.init();
    this.getOpenCash();
    this.saveRandom.setSuperManager();
  }
  getOpenCash() {
    this.storeList.forEach((store) => {
      this.superManagerService
        .getOpenCash(store.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          console.log('cash open', data);
          if (data['docs'].length) {
            this.randomObj[store.id]['openCash'] = data['docs'][0];
          } else {
            this.randomObj[store.id]['openCash'] = { open: false };
          }

          this.randomObj[store.id]['storeId'] = store.id;
        });
    });
    // this.getAllProducts();
    this.getRefueling();
  }

  getAllProducts() {
    if (this.storeTypeTab.includes('bar')) {
      //  this.takeProduct();
    }

    if (
      this.storeTypeTab.includes('services') ||
      this.storeTypeTab.includes('produits')
    ) {
      setTimeout(() => {
        this.takeProductServiceList();
      }, 1000);
    }

    if (this.storeTypeTab.includes('shop')) {
      setTimeout(() => {
        // this.takeProductListShop();
      }, 1500);
    }
    if (
      this.storeTypeTab.includes('resto') &&
      this.storeTypeTab.includes('bar')
    ) {
      setTimeout(() => {
        // this.takeProductResto();
      }, 3000);
    } else {
      // this.takeProductResto();
    }

    if (this.setting['use_gamme']) {
      // this.getAllGamme();
    }
  }

  takeProductServiceList() {
    this.notifi.presentLoading();
    console.log('strat hereles produits');
    this.restApiService.getBillardList().subscribe(async (data) => {
      //  this.totalProd=
      console.log('les produits', data['product']);

      let res: Product[] = data['product'];
      // let tab = res.sort((c, b) => (c.name > b.name ? 1 : -1));
      res.forEach((product) => {
        this.totalProd =
          this.totalProd + product.quantityStore + product.quantityItems;
        if (
          this.randomObj[product.storeId] &&
          this.randomObj[product.storeId]['quantity'] > 0
        ) {
          // let nbr = this.randomObj[product.storeId]['quantity'];
          this.randomObj[product.storeId]['quantity'] =
            this.randomObj[product.storeId]['quantity'] +
            product.quantityStore +
            product.quantityItems;
        } else {
          this.randomObj[product.storeId]['quantity'] =
            product.quantityStore + product.quantityItems;
        }

        if (
          this.randomObj[product.storeId] &&
          this.randomObj[product.storeId]['quantityStore'] > 0
        ) {
          let qtyStore = this.randomObj[product.storeId]['quantityStore'];
          this.randomObj[product.storeId]['quantityStore'] =
            qtyStore + product.quantityStore;
        } else {
          this.randomObj[product.storeId]['quantityStore'] =
            product.quantityStore;
        }

        if (
          this.randomObj[product.storeId] &&
          this.randomObj[product.storeId]['quantityItems'] > 0
        ) {
          let qtyItems = this.randomObj[product.storeId]['quantityItems'];
          this.randomObj[product.storeId]['quantityItems'] =
            qtyItems + product.quantityItems;
        } else {
          this.randomObj[product.storeId]['quantityItems'] =
            product.quantityItems;
        }

        //  this.randomObj[product.storeId]['product'] = product;
      });

      for (const property in this.randomObj) {
        this.arr.push(this.randomObj[property]);
      }

      this.notifi.dismissLoading();
      // this.productServiceTab =
      //  await this.rangeByStoreService.rangeProductByStore(res);
      console.log('service', this.arr);
    });
  }

  getSetting() {
    setTimeout(() => {
      this.adminService
        .getCompanySetting()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          let obj = data['company'][0];
          // this.getRefueling();
          if (data['company'].length) {
            if (obj['name']) {
            } else {
              localStorage.setItem('company', 'Maeri');
            }
            this.events.publishDisplayType(this.storeTypeTab);
            this.events.publishSetting(obj);
            this.saveRandom.setSetting(obj);
            localStorage.setItem('setting', JSON.stringify(obj));
          }
        });
    }, 2000);
  }

  getRefueling() {
    this.refueling.superManagerRefueling().subscribe((res: any) => {
      this.getAllProducts();
      res.forEach((product) => {
        this.totalRefueling = product.newquantity;
        if (
          this.randomObj[product.storeId] &&
          this.randomObj[product.storeId]['newquantity']
        ) {
          this.randomObj[product.storeId]['newquantity'] =
            this.randomObj[product.storeId]['newquantity'] +
            product.newquantity;
        } else {
          this.randomObj[product.storeId]['newquantity'] = product.newquantity;
        }
      });
    });
  }

  goToWarehouse() {
    this.router.navigateByUrl('warehouse');
  }
  goToRefueling() {
    this.router.navigateByUrl('manager-refueling');
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
