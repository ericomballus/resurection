import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
//import { CatService } from "../../services/cat.service";
import {
  ModalController,
  LoadingController,
  ToastController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { ProductAddPage } from './../product-add/product-add.page';
import { ProductPackItemDetailsPage } from '../product-pack-item-details/product-pack-item-details.page';
import { ProductManufacturedItemAddPage } from '../product-manufactured-item-add/product-manufactured-item-add.page';
import { ProductResourceUpdatePage } from 'src/app/product-resource-update/product-resource-update.page';
import { ProductManufacturedUserPage } from '../product-manufactured-user/product-manufactured-user.page';
import { RangeByStoreService } from 'src/app/services/range-by-store.service';
import { UrlService } from 'src/app/services/url.service';
import io from 'socket.io-client';
import { Router } from '@angular/router';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { Setting } from 'src/app/models/setting.models';
@Component({
  selector: 'app-product-manufactured',
  templateUrl: './product-manufactured.page.html',
  styleUrls: ['./product-manufactured.page.scss'],
})
export class ProductManufacturedPage implements OnInit {
  products = [];
  productsPick = [];
  isLoading: any;
  tabRoles = [];
  admin: boolean = false;
  multiStoreProduct: any;
  url: any;
  public sockets;
  adminId: any;
  setting: Setting;
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public rangeByStoreService: RangeByStoreService,
    private urlService: UrlService,
    private router: Router,
    public saveRandom: SaverandomService
  ) {
    //this.takeProduct();
    this.takeUrl();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
      this.takeProduct();
    }

    if (this.tabRoles.includes(1)) {
      this.admin = true;
    }
  }

  ngOnInit() {
    this.setting = this.saveRandom.getSetting();
  }

  takeUrl() {
    console.log('uri add waiting...');
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      console.log('uri add', data);
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId);
    });
  }

  webServerSocket(id) {
    this.sockets = io(this.url);
    //  this.socket.connect();

    this.sockets.on(`${id}manufactured`, async (data) => {
      console.log(data);

      this.takeProductAfter();
    });
  }

  takeProduct() {
    let tab = [];
    this.presentLoading();
    this.restApiService.getProductListResto().subscribe(async (data) => {
      console.log(data);
      this.dismissLoading()
        .then((res) => {})
        .catch((err) => {});
      if (data) {
        this.products = [];
        tab = data;
        this.productsPick = data;
        if (tab.length) {
          tab.forEach((elt) => {
            if (elt.desabled) {
              console.log('non');
            } else {
              this.products.push(elt);
            }
          });
          this.multiStoreProduct =
            await this.rangeByStoreService.rangeProductByStore(this.products);
          console.log(this.multiStoreProduct);
        }
      }
    });
  }

  takeProductAfter() {
    let tab = [];
    this.restApiService.getProductListResto().subscribe(async (data) => {
      if (data) {
        this.products = [];
        tab = data;
        this.productsPick = data;
        if (tab.length) {
          tab.forEach((elt) => {
            if (elt.desabled) {
              console.log('non');
            } else {
              this.products.push(elt);
            }
          });
          this.multiStoreProduct =
            await this.rangeByStoreService.rangeProductByStore(this.products);
        }
      }
    });
  }

  async productRestoAddFromMaeri() {
    const modal = await this.modalController.create({
      component: ProductAddPage,
      componentProps: {
        tabproducts: { products: this.productsPick, flag: 'product_add_resto' },
      },
    });
    modal.onDidDismiss().then((data) => {
      this.takeProductAfter();
      // this.products = data["data"];
    });
    return await modal.present();
  }

  async productRestoAddFromUser() {
    const modal = await this.modalController.create({
      component: ProductManufacturedUserPage,
      backdropDismiss: false,
      componentProps: {
        tabproducts: {
          products: this.productsPick,
          page: 'product-manufactured',
        },
      },
    });
    modal.onDidDismiss().then((data) => {
      // this.products = data["data"];
      //  this.takeProduct();
    });
    return await modal.present();
  }

  async productRestoUpdate(items, i) {
    const modal = await this.modalController.create({
      //component: ProductManufacturedItemAddPage,
      component: ProductResourceUpdatePage,
      backdropDismiss: false,
      componentProps: {
        product: items,
        page: 'product-manufactured',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      //this.products = data["data"];
      if (data['data'] === 'update') {
        this.presentToast('product update');
        this.takeProduct();
      } else {
        // this.presentError("error update failed!");
      }
    });
    return await modal.present();
  }

  deleteProduct(product) {
    console.log(product);
    let id = product._id;
    this.presentLoading();
    this.restApiService.deleteProductResto(product._id).subscribe((data) => {
      this.dismissLoading();
      this.presentToast('product delete');
      console.log(data);

      /* this.products = this.products.filter((prod) => {
        return prod._id != id;
      });*/
      this.takeProduct();
      /*  this.restApiService.getProductListAfterDelete().subscribe(data => {
        this.products = data["products"];
      }); */
    });
  }

  async displayDetails(pack) {
    // pack.flag = "update";
    this.presentLoading();
    this.restApiService
      .getOneManufacturedProductItemResto(pack._id)
      .subscribe(async (data) => {
        //  console.log(data);
        this.dismissLoading();
        const modal = await this.modalController.create({
          component: ProductPackItemDetailsPage,
          componentProps: {
            product: data['docs'][0],
          },
        });
        modal.onDidDismiss().then((data) => {
          console.log(data);
          console.log(data['data']);
          if (data['data'] === 'erico') {
            console.log('hello');
          } else {
            this.presentAlert(data);
          }
        });
        return await modal.present();
      });

    /*  ;*/
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

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      animated: true,
      color: 'success',
      // cssClass: "my-custom-class",
    });
    toast.present();
  }

  async presentError(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-class2',
    });
    toast.present();
  }

  async presentActionSheet(items) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [
        {
          text: 'Update',
          icon: 'add',
          handler: () => {
            // this.productRestoUpdate(items);
          },
        },
        {
          text: 'View Details',
          icon: 'heart',
          handler: () => {
            console.log('Favorite clicked');
            this.displayDetails(items);
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteProduct(items);
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
      ],
    });
    await actionSheet.present();
  }
  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: 'ELPIS',
      subHeader: 'sauvegarde ok',
      //message: data.data.message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async selectSource() {
    this.productRestoAddFromUser();
    /* const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      // header: 'Confirm!',
      message: "SELECT FROM MAERI ?",
      buttons: [
        {
          text: "NO",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.productRestoAddFromUser();
          },
        },
        {
          text: "YES",
          handler: () => {
            this.productRestoAddFromMaeri();
          },
        },
      ],
    });

    await alert.present(); */
  }
  addCategorie() {
    this.router.navigateByUrl(`/category?page=product-manufactured`);
  }
  addResource() {
    this.router.navigateByUrl(`/resource?page=product-manufactured`);
  }
}
