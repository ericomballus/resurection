import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
//import { CatService } from "../../services/cat.service";
import {
  ModalController,
  LoadingController,
  ToastController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { BillardAddPage } from '../billard-add/billard-add.page';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { BillardUpdatePage } from '../billard-update/billard-update.page';
import { GetStoreNameService } from '../services/get-store-name.service';
import { UrlService } from '../services/url.service';
import { ManagesocketService } from '../services/managesocket.service';
import { SaverandomService } from '../services/saverandom.service';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';
import { Observable, from, of, zip, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../translate-config.service';
import { Setting } from 'src/app/models/setting.models';
import { ScreensizeService } from '../services/screensize.service';
@Component({
  selector: 'app-billard',
  templateUrl: './billard.page.html',
  styleUrls: ['./billard.page.scss'],
})
export class BillardPage implements OnInit {
  public sockets;
  public url;
  products: Product[] = [];
  isLoading: any;
  tabRoles = [];
  admin: boolean = false;
  multiStoreProductitem = [];
  segment = 'enabled';
  display_segment = false;
  actif_products = [];
  adminId: any;
  storeList: Store[] = [];
  desactive = true;
  displayImages = true;
  selectedLanguage: string;
  randObj = {};
  listenEvent = true;
  setting: Setting;
  isDesktop: boolean;
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private notif: NotificationService,
    private router: Router,
    public getStoreName: GetStoreNameService,
    private manageSocket: ManagesocketService,
    private saveRandom: SaverandomService,
    public restApi: RestApiService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private screensizeService: ScreensizeService
  ) {
    //this.takeProduct();
    this.webServerSocket();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(2) ||
      this.tabRoles.includes(6)
    ) {
      this.takeProduct();
    }

    if (this.tabRoles.includes(1)) {
      this.admin = true;
    }
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  ngOnInit() {
    //  this.storeList = this.saveRandom.getStoreList();
    let adminAccount = JSON.parse(localStorage.getItem('user'))[0];
    this.storeList = adminAccount['storeId'];
    this.setting = this.saveRandom.getSetting();
  }
  screenCheck() {
    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        //  window.location.reload();
      }

      this.isDesktop = isDesktop;
    });
  }

  webServerSocket() {
    let id = localStorage.getItem('adminId');
    this.manageSocket.getSocket().subscribe((sockets) => {
      sockets.on(`${id}newProductService`, (data) => {
        if (this.listenEvent) {
          let newprod = data['data'];
          newprod['url'] = data['url'];
          this.products.push(newprod);
          this.rangeProductByStore();
        }
      });
    });
  }
  takeProduct() {
    this.notif.presentLoading();
    this.restApiService.getBillardList().subscribe((data) => {
      this.notif.dismissLoading();

      this.products = [];
      this.products = data['product'];
      console.log('less produit', this.products);

      this.actif_products = data['product'];
      if (this.products.length > 40) {
        this.displayImages = false;
      }
      this.rangeProductByStore();
    });
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
      })
      .then((a) => {
        a.present().then(() => {
          // console.log("presented");
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }

  async selectSource() {
    const modal = await this.modalController.create({
      component: BillardAddPage,
      componentProps: {
        tabproducts: { products: this.products, page: 'billard' },
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      // this.products = data["data"];
    });
    return await modal.present();
  }
  deleteBillard(prod) {
    this.notif.presentLoading();
    this.restApiService.deleteBillardGame(prod).subscribe((data) => {
      this.notif.dismissLoading();
      this.notif.presentToast('delete ok !', 'primary');
      this.products = this.products.filter((elt) => {
        return elt._id !== prod._id;
      });
      this.rangeProductByStore();
      /*  this.restApiService.getProductListAfterDelete().subscribe(data => {
        this.products = data["products"];
      }); */
    });
  }
  addCategorie() {
    this.router.navigateByUrl(`/category?page=billard.page`);
  }

  async productUpdate(prod) {
    console.log(prod);
    const modal = await this.modalController.create({
      component: BillardUpdatePage,
      componentProps: {
        product: prod,
        page: 'billard',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data'] === 'no_update') {
        console.log(data['data']);
      } else {
        // console.log(data["data"]);
        if (data['data']['product']) {
          let obj = data['data']['product'];
          let index = this.products.findIndex((elt) => {
            return elt._id === obj._id;
          });

          this.products.splice(index, 1, obj);
          this.rangeProductByStore();
        }
      }
    });
    return await modal.present();
  }

  rangeProductByStore() {
    let group = this.products.reduce((r, a) => {
      r[a.storeId] = [...(r[a.storeId] || []), a];
      return r;
    }, {});
    this.multiStoreProductitem = [];
    //let randomArr = [];
    //  console.log(group);

    for (const property in group) {
      this.multiStoreProductitem.push(group[property]);
      // randomArr.push(group[property]);
    }

    console.log('group here', this.multiStoreProductitem);
    if (this.multiStoreProductitem.length > 1) {
      this.desactive = false;
    }
    if (this.multiStoreProductitem.length) {
      this.multiStoreProductitem.forEach(async (arr) => {
        arr.forEach((prod) => {
          if (prod['desabled']) {
            this.display_segment = true;
          }
        });
        let name = await this.getStoreName.takeName(arr);
        arr['storeName'] = name;
      });
    }
  }

  addResource() {
    this.router.navigateByUrl(`/resource?page=billard`);
  }

  async addToAllStore() {
    this.listenEvent = false;
    this.notif.presentLoading();
    for (let store of this.storeList) {
      for (let prod of this.products) {
        if (prod.storeId !== store.id) {
          prod.storeId = store.id;
          await this.buildProduct(prod, store);
        }
      }
    }

    this.notif.dismissLoading();
    this.takeProduct();
    //this.restApi.transferBillardGame(formData).subscribe((data) => {});
  }

  async TransferOne(product) {
    this.notif.presentLoading();
    let cmp = 1;
    for (let store of this.storeList) {
      if (store.id == product.storeId) {
      } else {
        try {
          let res = await this.checkIfExist(product, store.id);

          cmp = cmp + 1;

          if (cmp == this.storeList.length) {
            this.notif.dismissLoading();
          }
        } catch (error) {
          let res: Product = await this.buildProduct(product, store);
          cmp = cmp + 1;
          console.log(res);
          this.products.push(res);
          if (cmp == this.storeList.length) {
            this.notif.dismissLoading();
            this.rangeProductByStore();
          }
        }
      }
    }
  }

  buildProduct(product: Product, store: Store): Promise<Product> {
    return new Promise((resolve, reject) => {
      let super_warehouse = false;
      let idList = [];
      if (store.super_warehouse) {
        super_warehouse = true;
        for (let p of this.products) {
          if (p.filename == product.filename && p.name == product.name) {
            if (!idList.includes(p._id)) {
              idList.push(p._id);
            }
          }
        }
        let prod = this.buildProd(product, store, idList, super_warehouse);
        this.restApi.transferBillardGame(prod).subscribe(
          (data) => {
            resolve(data['data']);
          },
          (err) => {
            resolve(err);
          }
        );
      } else {
        let prod = this.buildProd(product, store, idList, super_warehouse);
        this.restApi.transferBillardGame(prod).subscribe(
          async (data) => {
            let prod: Product = data['data'];
            for (let store of this.storeList) {
              if (store.super_warehouse && store.id !== prod.storeId) {
                // await this.addProdToSuperWareHouse(prod, store.id);
              }
            }
            resolve(data['data']);
          },
          (err) => {
            resolve(err);
          }
        );
      }
    });
  }
  checkIfExist(prod: Product, storeId) {
    return new Promise((resolve, reject) => {
      let obj = this.products.find(
        (p) =>
          p.storeId == storeId &&
          p.filename == prod.filename &&
          p.name == prod.name
      );
      if (obj) {
        resolve(obj);
      } else {
        reject(false);
      }
    });
  }
  removeWrongData(arr) {
    let pro = zip(from(arr), interval(100)).pipe(map(([prod]) => prod));
    pro.subscribe(
      (data) => {
        console.log('delete this==>', data);
        this.restApiService.deleteBillardGame(data).subscribe((resp) => {
          console.log(resp);
        });
      },
      (err) => {},
      () => {}
    );
  }

  buildProd(product: Product, store: Store, idList, super_warehouse) {
    let prod = {
      adminId: product.adminId,
      name: product.name,
      sellingPrice: product.sellingPrice,
      purchasingPrice: product.purchasingPrice,
      categoryName: product.categoryName,
      categoryId: product.categoryId,
      superCategory: product.superCategory,
      storeId: store.id,
      url: product.url,
      filename: product.filename,
      originalname: product.originalname,
      super_warehouse: super_warehouse,
      productId: product._id,
      idList: idList,
    };
    return prod;
  }
  updateAll() {
    let cmp = 0;
    this.notif.presentLoading();
    this.products.forEach(async (prod) => {
      await this.wareHouseUtils(prod);
      cmp = cmp + 1;

      if (cmp == this.products.length) {
        this.notif.dismissLoading();
        let arr = this.generateArray();
        if (arr.length) {
          console.log('array length ===>', arr.length);

          this.updateSuperWareHouseProducts(arr);
        }
      }
    });
  }
  wareHouseUtils(prod: Product) {
    return new Promise((resolve, reject) => {
      let store = this.storeList.find((s) => s.super_warehouse == true);
      let product = this.products.find(
        (p) => p.name == prod.name && p.storeId == store.id
      );
      if (product && product.idList) {
        if (product && product.idList.includes(prod._id)) {
          resolve(true);
        } else {
          product.idList.push(prod._id);
          product.changes = true;
          this.randObj[prod._id] = product;
          resolve(true);
        }
      }
    });
  }
  update(prod: Product) {
    this.restApi.updateBillardGame(prod).subscribe((data) => {
      console.log('update hello', data);
    });
  }
  generateArray(): Product[] {
    const arr = [];
    for (var id in this.randObj) {
      arr.push(this.randObj[id]);
    }
    return arr;
  }

  updateSuperWareHouseProducts(arr: Product[]) {
    let pro = zip(from(arr), interval(200)).pipe(map(([prod]) => prod));
    pro.subscribe(
      (data) => {
        this.update(data);
      },
      (err) => {},
      () => {}
    );
  }
  addProdToSuperWareHouse(prod: Product, storeId) {
    return new Promise((resolve, reject) => {
      let product = this.products.find(
        (p) => p.storeId == storeId && p.name == prod.name
      );
      if (product) {
        if (product.idList && !product.idList.includes(prod._id)) {
          product.idList.push(prod._id);
          this.update(product);
          resolve(prod);
        } else {
          resolve(prod);
        }
      } else {
        resolve(prod);
      }
    });
  }
}
