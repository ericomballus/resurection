import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
//import { CatService } from "../../services/cat.service";
import {
  ModalController,
  LoadingController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { ProductAddPage } from './../product-add/product-add.page';
import { ProductUpdatePage } from '../../product-update/product-update.page';
import { Socket } from 'ngx-socket-io';
import { from, Observable, concat, of } from 'rxjs';
import { filter, map, concatMap, concatAll } from 'rxjs/operators';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { GetStoreNameService } from 'src/app/services/get-store-name.service';
import { UserAddOwnProductPage } from 'src/app/user-add-own-product/user-add-own-product.page';
import { log } from 'console';
import { AddCocktailPage } from 'src/app/add-cocktail/add-cocktail.page';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { Setting } from 'src/app/models/setting.models';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  products = [];
  products_disable = [];
  all_products = [];
  actif_products: Array<any>;
  isLoading: any;
  adminId: any;
  tabRoles = [];
  packsArray = [];
  productArray = [];
  admin: boolean = false;
  arraySource: Observable<any>;
  productSource: Observable<any>;
  multiStoreProductitem = [];
  public sockets;
  public url;
  segment = 'enabled';
  display_segment = false;
  // joueAvec: Observable<any>;
  productItems: any;
  numIndex: any;
  storeProductArray: any[];
  setting: Setting;
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private socket: Socket,
    public alertController: AlertController,
    private router: Router,
    public urlService: UrlService,
    public getStoreName: GetStoreNameService,
    private notifi: NotificationService,
    public translate: TranslateService,
    public saveRandom: SaverandomService
  ) {}

  ngOnInit() {
    this.setting = this.saveRandom.getSetting();
  }
  ionViewDidEnter() {
    this.takeUrl();
    this.adminId = localStorage.getItem('adminId');
    this.webServerSocket(this.adminId);
  }
  ionViewWillEnter() {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
      this.takeProduct();
    }

    if (this.tabRoles.includes(1)) {
      this.admin = true;
    }
    console.log(JSON.parse(localStorage.getItem('setting')));
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // alert(this.url);
    });
  }

  webServerSocket(id) {
    this.sockets = io(this.url);
    //  this.socket.connect();

    this.sockets.on(`${id}newProduct`, async (data) => {
      data['url'] = await this.restApiService.getProducById(data['_id']);
      console.log(data);
      console.log(this.products);
      let index = this.products.findIndex((prod) => {
        return prod._id == data['_id'];
      });
      console.log(index);

      if (index >= 0) {
        // this.products.splice(index, 1, data);
        // console.log(this.products);
      } else {
        this.products.unshift(data);
        console.log(this.products);
      }
      this.rangeProductByStore();

      //
    });

    this.sockets.on(`${id}productUpdate`, async (data) => {
      // data['url'] = await this.restApiService.getProducById(data['_id']);
      console.log('update here', data);
      console.log(this.products);
      let productGroup = [];
      if (this.numIndex >= 0) {
        productGroup = this.multiStoreProductitem[this.numIndex];
      }
      if (productGroup.length) {
        let index = productGroup.findIndex((prod) => {
          return prod._id == data['_id'];
        });
        console.log(index);

        if (index >= 0) {
          this.multiStoreProductitem[this.numIndex].splice(index, 1, data);
          // console.log(this.products);
        }
      }

      console.log(this.multiStoreProductitem);

      //  this.rangeProductByStore();

      //
    });
  }

  takeProduct() {
    this.presentLoading();
    this.restApiService.getProductList().subscribe((data) => {
      console.log(data);

      data['products'].forEach((elt) => {
        elt.name.replace(/\s/g, '');
        elt['name'] = elt['name'].toUpperCase();
      });
      data['products'].sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      this.products = [];
      this.products = data['products'];
      this.products = data['products'].filter((elt) => {
        return elt['desabled'] == false;
      });
      this.dismissLoading()
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
      /* this.products_disable = data["products"].filter((elt) => {
        return elt["desabled"] == true;
      });*/
      this.actif_products = this.products;
      this.rangeProductByStore();
    });
  }
  async productAdd() {
    const modal = await this.modalController.create({
      component: ProductAddPage,
      componentProps: {
        // tabproducts: { products: this.products, flag: "product_add" }
        tabproducts: { products: this.products, flag: 'product_add' },
        page: 'product-list',
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data['data'].length) {
        setTimeout(() => {
          // this.takeProduct();
        }, 500);
      }
    });
    return await modal.present();
  }

  deleteProduct(product) {
    this.notifi.presentLoading();
    let productId = product._id;

    this.restApiService
      .productUpdate(product._id, {
        capacity: 'false',
        _id: product._id,
        display: false,
      })
      .subscribe(
        (resp) => {
          this.products = this.products.filter((elt) => {
            return elt._id !== product._id;
          });
          this.notifi.dismissLoading();
          this.takePack(productId);
          this.deleteProductItems(productId);

          /*  this.actif_products = this.products.filter((elt) => {
            return elt["display"];
          });*/

          this.rangeProductByStore();

          this.presentToast();
        },
        (err) => {
          console.log(err);
        }
      );
  }
  async productUpdate(product, i) {
    //console.log(product);
    this.numIndex = i;
    this.storeProductArray = this.multiStoreProductitem[i];
    let id = product._id;
    let url = product.url;
    const modal = await this.modalController.create({
      component: ProductUpdatePage,
      componentProps: {
        product: product,
        page: 'product-list',
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data['data'] === 'no_update') {
        console.log(data['data']);
      } else {
        // console.log(data["data"]);
        data['data']['url'] = url;
        product.url = data['data']['url'];
      }
    });
    return await modal.present();
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

  async presentToast() {
    const toast = await this.toastController.create({
      message: `product have been update.`,
      duration: 2000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-class',
    });
    toast.present();
  }
  takePack(id) {
    setTimeout(() => {
      let tab = [];
      this.restApiService.deletePack(id).subscribe((data) => {
        console.log(data);
        this.restApiService.deletePackItem2(id).subscribe((res) => {
          console.log(res);
        });
      });
    }, 1500);
  }

  deletePack(pack) {
    console.log(pack);
    let id = pack._id;
    this.restApiService.deletePack(id).subscribe((data) => {
      console.log(data);
    });
  }
  deleteProductItems(productId) {
    this.restApiService.deleteProductItem(productId).subscribe((data) => {
      console.log(data);
    });
  }
  pickProduct() {
    this.router.navigateByUrl('pick-product');
  }
  rangeProductByStore() {
    let group = this.products.reduce((r, a) => {
      r[a.storeId] = [...(r[a.storeId] || []), a];
      return r;
    }, {});
    this.multiStoreProductitem = [];
    console.log(group);

    for (const property in group) {
      this.multiStoreProductitem.push(group[property]);
    }
    console.log('group here', this.multiStoreProductitem);
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

  async selectSource() {
    let a: any = {};
    this.translate.get('MENU.selectMaeri').subscribe((t) => {
      a['selectMaeri'] = t;
    });
    this.translate.get('MENU.ok').subscribe((t) => {
      a['ok'] = t;
    });
    this.translate.get('MENU.no').subscribe((t) => {
      a['no'] = t;
    });
    const alert = await this.alertController.create({
      // cssClass: "my-custom-class",
      // header: 'Confirm!',

      message: a['selectMaeri'],
      buttons: [
        {
          text: a['no'],
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.selectProductType();
          },
        },
        {
          text: a['ok'],
          handler: () => {
            this.productAdd();
          },
        },
      ],
    });

    await alert.present();
  }

  async selectProductType() {
    if (!this.setting.use_resource) {
      this.userAddOwnProduct();
    } else {
      let a: any = {};
      this.translate.get('MENU.productType').subscribe((t) => {
        a['productType'] = t;
      });
      this.translate.get('MENU.product').subscribe((t) => {
        a['product'] = t;
      });
      this.translate.get('MENU.cancel').subscribe((t) => {
        a['cancel'] = t;
      });
      let tab = [];
      tab.push({
        text: a['product'],
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          this.userAddOwnProduct();
        },
      });
      if (this.setting.use_resource) {
        tab.push({
          text: 'COKTAIL',
          handler: () => {
            this.userAddCocktail();
          },
        });
      }
      tab.push({
        text: a['cancel'],
        handler: () => {
          // this.productAdd();
        },
      });
      const alert = await this.alertController.create({
        message: a['productType'],
        buttons: tab,
      });

      await alert.present();
    }
  }

  async userAddOwnProduct() {
    const modal = await this.modalController.create({
      component: UserAddOwnProductPage,
      componentProps: {
        page: 'product-list',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      // this.products = data["data"];
    });
    return await modal.present();
  }

  async userAddCocktail() {
    const modal = await this.modalController.create({
      component: AddCocktailPage,
      componentProps: {
        page: 'product-list',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      // this.products = data["data"];
    });
    return await modal.present();
  }

  addCategorie() {
    this.router.navigateByUrl(`/category?page=product-list`);
  }
  addResource() {
    this.router.navigateByUrl(`/resource?page=product-list`);
  }
}
