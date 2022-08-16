import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ActionSheetController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { ProductPackItemModalPage } from '../product-pack-item-modal/product-pack-item-modal';
import { ProductPackItemDetailsPage } from '../product/product-pack-item-details/product-pack-item-details.page';
import { Socket } from 'ngx-socket-io';
import { RestApiService } from '../services/rest-api.service';
import { TranslateConfigService } from '../translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-item-list',
  templateUrl: './product-item-list.page.html',
  styleUrls: ['./product-item-list.page.scss'],
})
export class ProductItemListPage implements OnInit {
  productsItem: any;
  adminId: any;
  tabRoles = [];
  prodUpdate: boolean = false;
  dataItem: any;
  display: boolean = false;
  products = [];
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    // public loadingController: LoadingController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private socket: Socket
  ) {
    this.takeProductItems();
    // this.takeProduct();
    this.languageChanged();
  }

  ngOnInit() {
    console.log('ProductPackItemAddsPage');
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
      this.display = true;
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId);
    }
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  takeProductItems() {
    let tab = [];
    this.restApiService.getProductItem().subscribe(async (data: any[]) => {
      //this.restApiService.getProductList().subscribe(data => {

      this.productsItem = data;
      console.log(this.productsItem);
      this.productsItem = await data.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.products.forEach((prod) => {
        let arr = this.productsItem.filter((elt) => {
          return elt.maeriId == prod.maeriId;
        });

        if (arr.length === 2) {
          arr.forEach((item) => {
            if (item.quantityStore || item.tabitem.length) {
              this.restApiService
                .deleteProductItem(item._id)
                .subscribe((data) => {});
            }
          });
        }
        if (arr.length) {
          arr.forEach((item) => {
            if (item.quantityStore || item.tabitem.length) {
              this.restApiService
                .deleteProductItem(item._id)
                .subscribe((data) => {});
            }
          });
        }
      });
    });
  }

  takeProduct() {
    this.restApiService.getProduct().subscribe((data) => {
      this.products = data['products'];
      console.log(this.products);

      this.takeProductItems();
    });
  }

  webServerSocket(id) {
    this.socket.connect();

    this.socket.emit('set-name', name);

    this.socket.fromEvent(`${id}newProductItem`).subscribe(async (data) => {
      this.productsItem.unshift(data);
    });
    this.socket.fromEvent(`${id}productItem`).subscribe(async (data) => {
      console.log('pack item change ');
      if (data && data['_id']) {
        let index = await this.productsItem.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        this.productsItem.splice(index, 1, data);
      }
    });
    this.socket.fromEvent(`${id}productItemDelete`).subscribe(async (data) => {
      console.log('items delete', data);
    });
  }
  updateItems(data) {
    //prod = "update";
    console.log(data);
    this.prodUpdate = true;
    this.dataItem = data;
    /* const modal = await this.modalController.create({
      component: ProductPackItemModalPage,
      componentProps: {
        product: pack
      }
    });
    modal.onDidDismiss().then(data => {
      // console.log(data);
      //console.log(data["data"]);
      if (data["data"] === "error") {
        console.log("hello");
        this.presentAlert("error");
      } else {
        this.presentToast();
      }
    });
    return await modal.present(); */
  }
  async displayDetails(pack) {
    // pack.flag = "update";
    const modal = await this.modalController.create({
      component: ProductPackItemDetailsPage,
      componentProps: {
        product: pack,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      console.log(data['data']);
      if (data['data'] === 'erico') {
        console.log('hello');
      } else {
        //this.presentAlert(data);
      }
    });
    return await modal.present();
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: 'ELPIS',
      subHeader: ` ${data}`,
      //message: data.data.message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  deleteProductItems(items) {
    console.log(items);
    let id = items._id;
    this.restApiService.deleteProductItem(id).subscribe((data) => {
      console.log(data);
      this.productsItem = this.productsItem.filter((elt) => {
        return elt._id !== id;
      });
    });
  }

  async presentActionSheet(items) {
    console.log(items);
    const actionSheet = await this.actionSheetController.create({
      //  header: "Albums",
      buttons: [
        /* {
          text: "Delete",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.deleteProductItems(items);
          }
        }, */
        /* {
          text: "Add quantity",
          icon: "add",
          handler: () => {
            this.updateItems(items);
          }
        },*/
        {
          text: 'View Details',
          icon: 'heart',
          handler: () => {
            this.displayDetails(items);
          },
        },
        {
          text: 'Reset',
          icon: 'close',

          handler: () => {
            console.log('Cancel clicked');
            console.log(items);
            this.restApiService
              .resetProductItem({ id: items._id })
              .subscribe((data) => {
                console.log(data);
              });
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: `product have been save.`,
      duration: 2000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-class',
    });
    toast.present();
  }
  async presentToastError() {
    const toast = await this.toastController.create({
      message: `error update.`,
      duration: 5000,
      position: 'top',
      animated: true,
      //cssClass: "my-custom-class"
    });
    toast.present();
  }
  updateProd(form) {
    //console.log(this.dataItem);
    // console.log(form.value);
    form.value['id'] = this.dataItem['_id'];
    console.log(form.value);
    this.restApiService.updateProductItem(form.value).subscribe(
      (data) => {
        this.prodUpdate = false;
        this.dataItem = '';
        this.presentToast();
        console.log(data);
      },
      (err) => {
        console.log(err);
        this.presentToastError();
        this.prodUpdate = false;
        this.dataItem = '';
      }
    );
  }
}
