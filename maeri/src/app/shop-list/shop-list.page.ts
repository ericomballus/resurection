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
import { ShopListAddPage } from '../shop-list-add/shop-list-add.page';
import { GetStoreNameService } from '../services/get-store-name.service';
import { ShopListUpdatePage } from '../shop-list-update/shop-list-update.page';
import { ManagesocketService } from '../services/managesocket.service';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.page.html',
  styleUrls: ['./shop-list.page.scss'],
})
export class ShopListPage implements OnInit {
  products = [];
  isLoading: any;
  tabRoles = [];
  admin: boolean = false;
  multiStoreProductitem = [];
  segment = 'enabled';
  display_segment = false;
  actif_products = [];
  storeList: Store[] = [];
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
    public saveRandom: SaverandomService
  ) {
    //this.takeProduct();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
      this.takeProduct();
    }

    if (this.tabRoles.includes(1)) {
      this.admin = true;
    }
    this.webServerSocket();
  }

  ngOnInit() {
    let adminAccount = JSON.parse(localStorage.getItem('user'))[0];
    this.storeList = adminAccount['storeId'];
  }

  webServerSocket() {
    let id = localStorage.getItem('adminId');
    this.manageSocket.getSocket().subscribe((sockets) => {
      console.log(sockets);
      sockets.on(`${id}newProductList`, (data) => {
        // this.products.push(data);
        setTimeout(() => {
          this.rangeProductByStore();
        }, 1000);
      });
    });
  }

  takeProduct() {
    this.notif.presentLoading();
    this.restApiService.getShopList().subscribe((data) => {
      console.log(data);
      this.notif.dismissLoading();
      this.products = data['product'];

      this.actif_products = this.products;
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

  async addProduct() {
    let tab = this.products;
    const modal = await this.modalController.create({
      component: ShopListAddPage,
      componentProps: {
        tabproducts: { products: tab, page: 'shop-list.page' },
      },
    });
    modal.onDidDismiss().then((data) => {
      // console.log(data);
      // this.products = data["data"];
    });
    return await modal.present();
  }
  deleteShopListProd(prod) {
    this.restApiService.deleteShopList(prod._id).subscribe((data) => {
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
    this.router.navigateByUrl(`/category?page=shop-list.page`);
  }

  rangeProductByStore() {
    let group = this.products.reduce((r, a) => {
      r[a.storeId] = [...(r[a.storeId] || []), a];
      return r;
    }, {});
    this.multiStoreProductitem = [];

    for (const property in group) {
      this.multiStoreProductitem.push(group[property]);
    }

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

  async productUpdate(prod) {
    console.log(prod);
    const modal = await this.modalController.create({
      component: ShopListUpdatePage,
      componentProps: {
        product: prod,
        page: 'billard.page',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data'] === 'no_update') {
        console.log(data['data']);
      } else {
        console.log(data['data']);
        if (data['data'] && data['data']['product']) {
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

  async TransferOne(product, i, j) {
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
  checkIfExist(prod: Product, storeId) {
    return new Promise((resolve, reject) => {
      let obj = this.products.find(
        (p) => p.storeId == storeId && p.name == prod.name
      );
      if (obj) {
        resolve(obj);
      } else {
        reject(false);
      }
    });
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
        this.restApiService.transferShopList(prod).subscribe(
          (data) => {
            resolve(data['data']);
          },
          (err) => {
            resolve(err);
          }
        );
      } else {
        let prod = this.buildProd(product, store, idList, super_warehouse);
        this.restApiService.transferShopList(prod).subscribe(
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
}
