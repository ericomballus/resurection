import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { environment, uri } from 'src/environments/environment';
import {
  IonicImageLoaderComponent,
  ImageLoaderService,
} from 'ionic-image-loader';

import {
  NavController,
  ModalController,
  AlertController,
  IonSlides,
  LoadingController,
  //  Events,
  ToastController,
} from '@ionic/angular';
import { CartPage } from 'src/app/cart/cart.page';
import { Router } from '@angular/router';
import { ManageCartService } from 'src/app/services/manage-cart.service';
import { Socket } from 'ngx-socket-io';
import { CountItemsService } from 'src/app/services/count-items.service';
import { TranslateConfigService } from 'src/app/translate-config.service';
import {
  NetworkService,
  ConnectionStatus,
} from 'src/app/services/network.service';
import { Network } from '@ionic-native/network/ngx';
import { HttpClient } from '@angular/common/http';
import { AdminService } from 'src/app/services/admin.service';
//import { CacheService } from "ionic-cache";
import { RestApiService } from 'src/app/services/rest-api.service';
import { CachingService } from 'src/app/services/caching.service';

@Component({
  selector: 'app-displayitems',
  templateUrl: './displayitems.component.html',
  styleUrls: ['./displayitems.component.scss'],
})
export class DisplayitemsComponent implements OnInit {
  // @Input() products: any;
  // @Input() productResto: any;
  @Output() valueChange = new EventEmitter();
  @ViewChild('mySlider', { static: true }) slides: IonSlides;
  products: any;
  products2: any;
  productResto = [];
  productResto2: any;
  packs = [];
  allProducts = [];
  pack2: any;
  totalItems = 0;
  totalPrice = 0;
  Reduction: any;
  Itemprice: any;
  isItemAvailable = false;
  isItemAvailable2 = false;
  checkRole: any;
  tabRole: any;
  btnProducts = true; //display bouton items
  btnAllProducts = false; //display bouton pack
  btnResto = false;
  btnPack = false;
  isLoading = false; //loadin controller flag
  cartValue: any;
  tabRoles = [];
  adminId: any;
  userName: any;
  erico: any;
  openCashDate: any;
  jsonProducts = null;
  constructor(
    public restApiService: RestApiService,
    public manageCartService: ManageCartService,
    public countItemsService: CountItemsService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public alertController: AlertController,
    private router: Router,
    public loadingController: LoadingController,
    private socket: Socket,
    private translateConfigService: TranslateConfigService,
    //  public events: Events,
    private networkService: NetworkService,
    private toastController: ToastController,
    private network: Network,
    private http: HttpClient,
    private adminService: AdminService,
    private imageLoader: ImageLoaderService,
    private cache: CachingService
  ) {
    this.networkService.initializeNetworkEvents();
    this.takeCashOpen();
    if (JSON.parse(localStorage.getItem('user'))['name']) {
      this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    }

    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(5) ||
      this.tabRoles.includes(4)
    ) {
      this.getItems();
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId);
    } else {
      this.router.navigateByUrl('Login');
    }
    this.languageChanged();
  }

  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  async getItems() {
    setTimeout(() => {
      this.takeProduct();

      setTimeout(() => {
        console.log('serveur resto take');

        this.takeProductResto();
      }, 1000);
    }, 2000);
  }

  ngOnInit() {}

  takeCashOpen() {
    setTimeout(() => {
      this.adminService.getOpenCash().subscribe((data) => {
        // console.log("cash", data);

        if (data['docs'].length) {
          //console.log("hello");

          this.openCashDate = data['docs'][0]['openDate'];
          this.getItems();
        } else {
          this.cashDateAlert();
        }
      });
    }, 5000);
  }

  webServerSocket(id) {
    this.socket.connect();

    this.socket.emit('set-name', name);

    this.socket.fromEvent(`${id}newProductItem`).subscribe(async (data) => {
      // this.productsItem.unshift(data);
    });
    this.socket.fromEvent(`${id}productItem`).subscribe(async (data) => {
      if (data && data['_id']) {
        let index = await this.products.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        this.products.splice(index, 1, data);
        let index2 = await this.allProducts.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        this.allProducts.splice(index2, 1, data);
      }
    });
    this.socket
      .fromEvent(`${id}productItemDelete`)
      .subscribe(async (data) => {});
    this.socket.fromEvent(`${id}manufacturedItem`).subscribe(async (data) => {
      if (data && data['_id']) {
        let index = await this.productResto.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        this.productResto.splice(index, 1, data);
      }
    });
    this.socket.fromEvent(`${this.adminId}cashOpen`).subscribe(async (data) => {
      // console.log("cash event");
      this.takeCashOpen();
      if (!this.products.length) {
      }
    });
    this.socket
      .fromEvent(`${this.adminId}cashClose`)
      .subscribe(async (data) => {
        // console.log("cash event");
        this.products = [];
        this.productResto = [];
        if (!this.products.length) {
        }
      });
  }

  takeProduct() {
    this.restApiService.getProductItem().subscribe(
      (data) => {
        //this.products = data["items"];
        this.products = data;
        this.cache.cacheRequest('productsItem', data).then((result) => {
          // console.log("cache service", result);
        });
        // localStorage.setItem(`products`, JSON.stringify(data));
        // this.allProducts = this.products;
        if (this.products.length > 0) {
          this.allProducts = [...this.allProducts, ...this.products];
        }
      },
      (err) => {
        // console.log("il erreur ici", err);
        //this.products = this.cache.getCachedRequest("productsItem");
        // console.log(this.cache.getItem("productsItem"));
      }
    );
  }

  takePackitems() {
    this.restApiService.getPackItem().subscribe((data) => {
      // console.log(data);
      this.packs = data['items'];
      if (this.packs.length > 0) {
        this.allProducts = [...this.allProducts, ...this.packs];
      }
    });
  }
  takeProductResto() {
    // this.presentLoading();
    this.restApiService.getManufacturedProductItemResto2().subscribe((data) => {
      this.productResto = data;
      this.productResto2 = this.productResto;
      this.cache.cacheRequest('productsResto', data).then((result) => {
        //console.log("cache service", result);
      });
      if (this.productResto.length > 0) {
        this.allProducts = [...this.productResto, ...this.allProducts];
      }
    });
  }
  next() {
    //display pack list
    // this.BtnItems = true;
    // this.BtnPack = false;
    this.slides.slideNext();
  }
  prev() {
    //display items
    //this.BtnItems = false;
    // this.BtnPack = true;
    this.slides.slidePrev();
  }

  buyItem(prod) {
    let id = prod._id;
    // this.initializeNetworkEvents();
    if (
      this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline &&
      this.tabRoles.includes(5)
    ) {
      let toast = this.toastController.create({
        message: `please check with point of sale.`,
        duration: 5000,
        position: 'bottom',
      });
      toast.then((toast) => toast.present());
      return;
    }
    //let url = prod.url;
    this.cartValue = this.restApiService.getCart2();
    console.log('la valeur du cart', this.cartValue);
    if (this.Itemprice - this.Reduction <= 100) {
      this.presentAlert();
    } else if (this.Itemprice > 0 && this.Itemprice - this.Reduction > 100) {
    } else {
      if (prod.quantityStore <= 0) {
        this.showPresentAlert();
      } else {
        console.log(prod._id);
        console.log('products', prod);
        console.log('store', prod.quantityStore);

        if (this.cartValue && this.cartValue['cart']) {
          console.log('table after value', this.cartValue['cart']);
          console.log('table after', this.cartValue['products']);
          let tab = this.cartValue['products'].filter((elt) => {
            return elt.item._id === prod._id;
          })[0];
          console.log('table', tab);

          if (tab && tab.qty === prod.quantityStore) {
            this.showPresentAlert();
            return;
          } else {
            let data = {};
            data['product'] = prod;
            data['cart'] = this.cartValue['cart'];
            let cart = this.manageCartService.addToCart(data);
            console.log(cart);

            this.totalItems = cart['totalQty'];
            this.valueChange.emit(this.totalItems);
            this.totalPrice = cart['totalPrice'];
            this.restApiService.saveCart({
              cart: cart,
              products: cart.generateArray(),
            });

            let tab = this.countItemsService.getQtyItems(
              this.products,
              cart.generateArray(),
              prod
            );
            console.log('new tab', tab);
            this.products = tab;
          }
        } else {
          let cart = this.manageCartService.addToCart(prod);
          // console.log(cart);
          this.totalItems = cart['totalQty'];
          this.valueChange.emit(this.totalItems);
          this.totalPrice = cart['totalPrice'];
          this.restApiService.saveCart({
            cart: cart,
            products: cart.generateArray(),
          });
          let tab = this.countItemsService.getQtyItems(
            this.products,
            cart.generateArray(),
            prod
          );
          console.log('new tab', tab);
          this.products = tab;
        }
      }
    }
  }
  // openCart(){}
  buyItemResto(prod) {
    console.log(prod);
    let id = prod._id;
    //let url = prod.url;
    this.cartValue = this.restApiService.getCart2();
    console.log('la valeur du cart', this.cartValue);
    if (this.Itemprice - this.Reduction <= 100) {
      this.presentAlert();
    } else if (this.Itemprice > 0 && this.Itemprice - this.Reduction > 100) {
      //  console.log("hello hello");
    } else {
      // console.log("hello hello hello");
      console.log(prod);
      if (this.cartValue && this.cartValue['cart']) {
        /* let tab = this.cartValue["products"].filter(elt => {
            return elt.item._id === prod._id;
          })[0]; */
        let data = {};
        data['product'] = prod;
        data['cart'] = this.cartValue['cart'];
        let cart = this.manageCartService.addToCart(data);
        //console.log(cart);
        // console.log("id ici 1", id);
        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        this.valueChange.emit(this.totalItems);
        // console.log("resto", tab[0]);
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
        let tab2 = this.countItemsService.getQtyItems(
          this.productResto,
          cart.generateArray(),
          prod
        );
        console.log('new tab', tab2);
        this.productResto = tab2;
      } else {
        let cart = this.manageCartService.addToCart(prod);
        console.log(cart);
        console.log('id ici 2', id);
        this.totalItems = cart['totalQty'];
        this.valueChange.emit(this.totalItems);
        this.totalPrice = cart['totalPrice'];
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
        let tab = this.countItemsService.getQtyItems(
          this.productResto,
          cart.generateArray(),
          prod
        );
        console.log('new tab', tab);
        this.productResto = tab;
      }
    }
  }
  // naviguer entre les categories
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.target.value);
    let check = ev.target.value;
    if (check === 'product') {
      this.btnAllProducts = false;
      this.btnPack = false;
      this.btnProducts = true;
      this.btnResto = false;
      console.log(this.products);
    } else if (check === 'productResto') {
      this.btnResto = true;
      this.btnProducts = false;
      this.btnAllProducts = false;
      this.btnPack = false;
    } else if (check === 'pack') {
      this.btnResto = false;
      this.btnProducts = false;
      this.btnAllProducts = false;
      this.btnPack = true;
    } else {
      this.btnResto = false;
      this.btnProducts = false;
      this.btnAllProducts = true;
      this.btnPack = false;
    }
  }

  buyPack(pack) {
    //_id ici est celui du packitems a partir du quel il
    // a été cré

    this.cartValue = this.restApiService.getCart2();
    console.log(pack);
    if (this.cartValue) {
      let data = {};
      data['product'] = pack;
      data['cart'] = this.cartValue['cart'];
      let cart = this.manageCartService.addToCart(data);
      console.log(cart);
      this.totalItems = cart['totalQty'];
      this.valueChange.emit(this.totalItems);
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    } else {
      let cart = this.manageCartService.addToCart(pack);
      console.log(cart);
      this.totalItems = cart['totalQty'];
      this.valueChange.emit(this.totalItems);
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    }
  }

  getCart() {
    console.log('here');
    this.cartValue = this.restApiService.getCart();
  }

  displayCart() {
    this.navCtrl.navigateForward('cart');
  }

  async openCart() {
    const modal = await this.modalController.create({
      component: CartPage,
    });
    modal.onDidDismiss().then((data) => {
      // console.log("de retour", data["data"]);
      if (data['data'] === undefined) {
        this.totalItems = 0;
        this.valueChange.emit(this.totalItems);
        this.totalPrice = 0;
        this.restApiService.saveCart({});

        //reinitialisation de pack et products
        this.products.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
        });
        this.packs.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
        });
        this.productResto.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
        });
        return;
      }
      this.restApiService.saveCart(data['data']);
      if (data['data']['cart']) {
        this.totalItems = data['data']['cart']['totalQty'];
        this.valueChange.emit(this.totalItems);
        this.totalPrice = data['data']['cart']['totalPrice'];
      }

      if (data['data'] === 'update') {
        this.totalItems = 0;
        this.totalPrice = 0;
        this.valueChange.emit(this.totalItems);
        this.restApiService.saveCart({});
        this.products.forEach((elt) => {
          elt['qty'] = 0;
        });
        this.packs.forEach((elt) => {
          elt['qty'] = 0;
        });
        this.productResto.forEach((elt) => {
          elt['qty'] = 0;
        });
        return;
      }
      if (data['data']['products'].length) {
        // console.log("pord...", data["data"]["products"]);

        this.packs.forEach((pack) => {
          let id = pack['_id'];
          // console.log(id);
          data['data']['products'].forEach((elt) => {
            if (elt.item._id == id) {
              // console.log("erico");
              // console.log(elt.item.qty);
              pack['qty'] = elt.qty;
              this.updateTabPacks(pack, id);
            } else {
              // pack["qty"] = 0;
            }
          });
        });
        this.products.forEach((prod) => {
          let id = prod['_id'];
          // console.log(id);
          data['data']['products'].forEach((elt) => {
            if (elt.item._id == id) {
              prod['qty'] = elt.qty;
              this.updateTabProducts(prod, id);
            } else {
              //prod["qty"] = 0;
            }
          });
        });

        this.productResto.forEach((prod) => {
          let id = prod['_id'];
          data['data']['products'].forEach((elt) => {
            if (elt.item._id == id) {
              prod['qty'] = elt.qty;
              this.updateTabProResto(prod, id);
            } else {
            }
          });
        });

        return;
        /*
          this.packs.forEach(elt => {
            console.log("autre boucle");
            if (elt["qty"]) {
              elt["qty"] = 0;
            }
          });
          */
      }
      if (data['data'] === 'update' || data['data']) {
        this.totalItems = 0;
        this.totalPrice = 0;
        this.valueChange.emit(this.totalItems);
        this.restApiService.saveCart({});
        //this.router.navigateByUrl("product-item-list");
        //reinitialisation de pack et products
        this.products.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
        });
        this.packs.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
        });
        this.productResto.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
        });
        // this.router.navigateByUrl("product-item-list");
      } else {
        this.totalItems = data['data']['cart']['totalQty'];
        this.valueChange.emit(this.totalItems);
        this.totalPrice = data['data']['cart']['totalPrice'];
        this.restApiService.saveCart(data['data']);
      }
    });
    return await modal.present();
  }

  priceChange(prod) {
    console.log(prod);
    this.Itemprice = prod.sellingPrice;
  }
  displayPrice(val) {
    console.log(val);
    this.Reduction = val;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'le prix entré n.est pas bon.',
      buttons: ['OK'],
    });

    await alert.present();
  }
  initializeItems() {
    this.products2 = this.products;
  }
  handleInputItems(ev) {
    this.presentLoading();
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.restApiService.getProductByName(val).subscribe((data) => {
        this.dismissLoading();
        this.products2 = data['product'];
      });
    } else {
      this.isItemAvailable = false;
      this.products2 = [];
    }
  }

  handleInputPack(ev) {
    // this.initializeItems();

    // set val to the valueif (this.ignoreNextChange) {
    /* if (this.isItemAvailable) {
        this.isItemAvailable = false;
        return;
      }  */
    this.presentLoading();
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isItemAvailable2 = true;
      this.restApiService.getPackitemByName(val).subscribe((data) => {
        this.dismissLoading();
        this.pack2 = data['pack'];
      });
      /* this.products2 = this.products2.filter(item => {
          return item["name"].toLowerCase().indexOf(val.toLowerCase()) > -1;
        });*/
    } else {
      this.isItemAvailable2 = false;
      this.pack2 = [];
    }
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 3000,
      })
      .then((a) => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }
  search(pack) {
    this.isItemAvailable = false;
    this.isItemAvailable2 = false;
    console.log(pack);
  }

  async showPresentAlert() {
    const alert = await this.alertController.create({
      header: 'ALERT',
      // subHeader: ` ${data}`,
      //message: data.data.message,
      message: `NOT ENOUGTH IN STOCK!
        please contact wharehouse`,
      cssClass: 'AlertStock',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async cashDateAlert() {
    const alert = await this.alertController.create({
      header: 'ALERT',
      // subHeader: ` ${data}`,
      //message: data.data.message,
      message: `PLEASE OPEN CASH DATE!`,
      cssClass: 'AlertStock',
      buttons: ['OK'],
    });

    await alert.present();
  }

  updateTabPacks(pack, id) {
    let a = pack;
    let index = this.packs.findIndex((elt) => {
      return elt._id === id;
    });

    this.packs.splice(index, 1, a);
  }
  updateTabProducts(prod, id) {
    let a = prod;
    let index = this.products.findIndex((elt) => {
      return elt._id === id;
    });

    this.products.splice(index, 1, a);
  }

  updateTabProResto(prod, id) {
    let a = prod;
    let index = this.productResto.findIndex((elt) => {
      return elt._id === id;
    });

    this.productResto.splice(index, 1, a);
  }
  clearCache(ev) {
    console.log('ok');
    this.imageLoader.clearCache();
  }
  onImageLoad(ev) {
    console.log(ev);
    console.log(ev['_src']);
  }
}
