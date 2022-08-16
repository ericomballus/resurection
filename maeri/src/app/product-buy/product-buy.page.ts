import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LoadingController,
  AlertController,
  ModalController,
  NavController,
  IonSlides,
} from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { ManageCartService } from '../services/manage-cart.service';
import { RestApiService } from '../services/rest-api.service';
import { CartPage } from '../cart/cart.page';
import { RangeByStoreService } from '../services/range-by-store.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { ResourcesService } from '../services/resources.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-product-buy',
  templateUrl: './product-buy.page.html',
  styleUrls: ['./product-buy.page.scss'],
})
export class ProductBuyPage implements OnInit {
  @ViewChild('mySlider', { static: true }) slides: IonSlides;
  products = [];
  products2: any;
  productResto: any;
  productRestoItem: any[] = [];
  packs: any[] = [];
  packs2 = [];
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
  btnProducts = false; //display bouton items
  btnAllProducts = false; //display bouton pack
  btnResto = false;
  btnPack = true;
  isLoading = false; //loadin controller flag
  cartValue: any;
  tabRoles = [];
  adminId: any;
  multiStoreProductitem: any;
  resourceItem: any;
  multiStoreResourceitem: any[] = [];
  multiStoreList: any[] = [];
  multiStoreService: any[] = [];
  totalBtl = 0;
  storeTypeTab = [];
  productListTab: any;
  productServiceTab: any;
  //productResto = [];
  budget = 0;
  constructor(
    public restApiService: RestApiService,
    public manageCartService: ManageCartService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public alertController: AlertController,
    private router: Router,
    public loadingController: LoadingController,
    private socket: Socket,
    public rangeByStoreService: RangeByStoreService,
    public getStoreName: GetStoreNameService,
    private resourceService: ResourcesService,
    public saveRandom: SaverandomService
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.storeTypeTab = JSON.parse(localStorage.getItem('adminUser'))[
      'storeType'
    ];
    if (
      this.storeTypeTab.includes('bar') ||
      this.storeTypeTab.includes('resto')
    ) {
      this.storeTypeTab.push('resource');
    } else if (this.saveRandom.getSetting().use_resource) {
      this.storeTypeTab.push('resource');
    }
    console.log('store types here====>', this.storeTypeTab);
    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(2) ||
      this.tabRoles.includes(6)
    ) {
      this.adminId = localStorage.getItem('adminId');
      // this.webServerSocket(this.adminId);
    } else {
      this.router.navigateByUrl('Login');
    }

    if (this.tabRoles.includes(2)) {
      // let storeId= this.saveRandom.getStoreId()
      // this.storeTypeTab= this.storeTypeTab.filter((store) => store.id == storeId)
    }
  }
  ionViewWillEnter() {}
  getItems() {
    this.takePack();

    setTimeout(() => {
      this.takePackitems();
      this.takeProduct();
      this.getResources();
      this.takeProductListShop();
      this.takeProductServiceList();
    }, 500);
    setTimeout(() => {
      this.takeProductResto();
    }, 1000);
  }
  ngOnInit() {
    this.getItems();
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
        let urlp = this.products[index]['url'];
        this.products.splice(index, 1, data);
        this.products[index]['url'] = urlp;
        /* let index2 = await this.allProducts.findIndex((elt) => {
          return elt._id === data["_id"];
        });*/
        // this.allProducts.splice(index2, 1, data);
      }
    });
    this.socket
      .fromEvent(`${id}productItemDelete`)
      .subscribe(async (data) => {});
    this.socket.fromEvent(`${id}manufacturedItem`).subscribe(async (data) => {
      // console.log("items delete", data);
      if (data && data['_id']) {
        let index = await this.productResto.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        // console.log(index);
        if (index >= 0) {
          this.productResto.splice(index, 1, data);

          let urlp = this.productResto[index]['url'];
          this.productResto.splice(index, 1, data);
          this.productResto[index]['url'] = urlp;
        }
      }
    });
  }

  async takeProduct() {
    this.restApiService.getProductItem().subscribe(async (data: any[]) => {
      this.products = data;
      console.log('this is product====>', data);

      if (this.products.length > 0) {
      }
    });
  }
  //61690bc0a70557233c046e7d  61690bc0a70557233c046e7d   productitemsid = 61690bc1a70557233c046e93  61690bc0a70557233c046e7d
  async takePackitems() {
    let randomObj = {};
    this.restApiService.getProduct().subscribe((data) => {
      console.log('product get here====>', data);

      let tab = data['products'].filter((elt) => {
        return elt['desabled'] == false;
      });
      data['products'].forEach((prod) => {
        randomObj[prod._id] = prod;
      });
      tab.forEach(async (elt) => {
        if (elt['resourceList'].length > 0) {
          this.packs = this.packs.filter((pack) => {
            return pack.productId !== elt._id;
          });
        } else {
          this.packs.forEach((pack) => {
            if (pack.productId == elt._id) {
              pack['packPrice'] = elt['packPrice'];
            }
          });
        }
      });

      let prodFilter = [];
      this.packs.forEach((elt) => {
        if (randomObj[elt.productId]) {
          prodFilter.push(elt);
        }
      });
      this.packs = prodFilter;
      this.rangeByStoreService.rangeProductByStore(this.packs).then((res) => {
        this.multiStoreProductitem = res;
      });
    });
  }

  removeToPack(elt) {
    return new Promise((resolve, reject) => {
      this.packs = this.packs.find((pack) => {
        return pack.productId !== elt._id;
      });

      resolve('ok');
    });
  }

  takePack() {
    this.restApiService.getPack().subscribe(async (data) => {
      // this.packs = data["docs"];

      data.forEach((elt) => {
        elt.name.replace(/\s/g, '');
        elt['name'] = elt['name'].toUpperCase();
      });
      data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      this.packs = data;
      this.packs = this.packs.filter((pack) => {
        return pack.productId !== null;
      });
      console.log('packs===', this.packs);
      if (this.packs.length > 0) {
      }
    });
  }

  getResources() {
    this.resourceService.getResourcesItem().subscribe((data) => {
      console.log('resouces ici===>', data);
      this.resourceItem = data['resources'].filter((elt) => {
        return elt['desabled'] == false;
      });
      console.log('resouces item here===>', this.resourceItem);
      this.rangeByStoreService
        .rangeProductByStore(this.resourceItem)
        .then((res: any[]) => {
          console.log('resulat by store===>', res);
          this.multiStoreResourceitem = res;
        });
    });
  }

  next() {
    this.slides.slideNext();
  }
  prev() {
    this.slides.slidePrev();
  }

  buyItem(obj) {
    let a = Object.keys(obj);

    this.restApiService.saveCart({});
    this.totalItems = 0;
    this.totalPrice = 0;
    // this.totalBtl = 0;
    for (const prop of a) {
      obj[prop]['prod']['removeQuantity'] = obj[prop]['sale'];
      this.totalItems = this.totalItems + obj[prop]['sale'];
      this.totalPrice = this.totalPrice + obj[prop]['coast'];

      this.buyPackProduct(obj[prop]['prod']);
    }
    return;
    for (const key in obj) {
      let prod = obj[key]['prod'];
      let id = prod._id;

      this.cartValue = this.restApiService.getCart2();
      // console.log("la valeur du cart", this.cartValue);

      if (this.cartValue && this.cartValue['cart']) {
        let data = {};
        data['product'] = prod;
        data['cart'] = this.cartValue['cart'];
        let cart = this.manageCartService.addToCart(data);

        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        let b = [];
        b = cart.generateArray().filter((elt) => {
          return elt.item._id === id;
        });
        let index = this.products.findIndex((elt) => {
          return elt._id === prod._id;
        });
        prod['qty'] = b[0]['qty'];
        // console.log("hello2", prod);
        this.products.splice(index, 1, prod);

        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
      } else {
        //let cart = this.manageCartService.addToCart(prod);
        let cart = this.manageCartService.addToCart(prod);
        //  console.log(cart);
        //  console.log(cart.generateArray());
        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        let b = [];
        b = cart.generateArray().filter((elt) => {
          return elt.item._id === id;
        });
        let index = this.products.findIndex((elt) => {
          return elt._id === prod._id;
        });
        prod['qty'] = b[0]['qty'];
        //  console.log("hello2", prod);
        this.products.splice(index, 1, prod);

        this.products.splice(index, 1, prod);

        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
      }
    }
  }
  updatePackProduct(prod) {
    let id = prod._id;

    this.cartValue = this.restApiService.getCart2();
    console.log(this.cartValue);
  }

  buyPackProduct(prod) {
    // console.log(prod);
    let id = prod._id;

    this.cartValue = this.restApiService.getCart2();

    if (this.cartValue && this.cartValue['cart']) {
      let data = {};
      data['product'] = prod;
      data['cart'] = this.cartValue['cart'];
      let cart = this.manageCartService.addToCart(data);
      let items = cart['items'];
      let oldTotalPrice = this.totalPrice;
      // this.totalPrice = 0;
      for (const key in items) {
        let obj = items[key]['item'];
        if (obj['packPrice']) {
          /*  this.totalPrice =
            this.totalPrice + items[key]["qty"] * obj["packPrice"]; */
        } else {
          // this.totalPrice = oldTotalPrice;
        }
      }

      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.packs.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod['qty'] = b[0]['qty'];
      // console.log("hello2", prod);
      this.packs.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    } else {
      let cart = this.manageCartService.addToCart(prod);

      let items = cart['items'];
      for (const key in items) {
        let obj = items[key]['item'];
        if (obj['sizePack']) {
        } else {
          // this.totalPrice = 0;
        }
      }

      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.packs.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod['qty'] = b[0]['qty'];
      //  console.log("hello2", prod);
      this.packs.splice(index, 1, prod);

      this.packs.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    }
  }
  displayPriceQuantity(obj) {
    let a = Object.keys(obj);
    this.restApiService.saveCart({});
    this.totalItems = 0;
    this.totalPrice = 0;
    // this.totalBtl = 0;
    for (const prop of a) {
      obj[prop]['prod']['removeQuantity'] = obj[prop]['sale'];

      if (obj[prop]['remove'] === 1) {
        this.totalItems = this.totalItems + obj[prop]['sale'];
        this.totalPrice = this.totalPrice + obj[prop]['coast'];
      } else {
        if (obj[prop]['prod']['nbrBtl'] >= 1) {
          let price =
            obj[prop]['prod']['nbrBtl'] * obj[prop]['prod']['purchasingPrice'];
          this.totalPrice = this.totalPrice + price;
          this.totalBtl = this.totalBtl + obj[prop]['prod']['nbrBtl'];
        }
        this.totalItems = this.totalItems + obj[prop]['sale'];
        this.totalPrice = this.totalPrice + obj[prop]['coast'];
      }
      console.log(obj[prop]['prod']);
      // return;

      this.buyPackProduct(obj[prop]['prod']);
    }
  }
  // naviguer entre les categories
  segmentChanged(ev: any) {
    // console.log("Segment changed", ev.target.value);
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
    // console.log(pack);
    if (this.cartValue) {
      let data = {};
      data['product'] = pack;
      data['cart'] = this.cartValue['cart'];
      let cart = this.manageCartService.addToCart(data);
      // console.log(cart);
      this.totalItems = cart['totalQty'];
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
        // commande: true
      });
    } else {
      let cart = this.manageCartService.addToCart(pack);
      // console.log(cart);
      this.totalItems = cart['totalQty'];
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    }
  }

  getCart() {
    // console.log("here");
    this.cartValue = this.restApiService.getCart();
  }

  displayCart() {
    this.navCtrl.navigateForward('cart');
  }

  async openCart() {
    this.saveRandom.setResumePurchase({
      totalPrice: this.totalPrice,
      totalItems: this.totalItems,
      totalBtl: this.totalBtl,
    });
    const modal = await this.modalController.create({
      component: CartPage,
      componentProps: {
        commande: true,
      },
    });
    modal.onDidDismiss().then((data) => {
      this.restApiService.saveCart(data['data']);
      if (data['data']['cart']) {
      }

      if (data['data'] === 'update') {
        this.totalItems = 0;
        this.totalPrice = 0;
        this.restApiService.saveCart({});
        this.products.forEach((elt) => {
          elt['qty'] = 0;
          elt['fisrtValueAdd'] = 0;
          elt['inputValue'] = 0;
        });
        this.packs.forEach((elt) => {
          elt['qty'] = 0;
          elt['fisrtValueAdd'] = 0;
          elt['inputValue'] = '';
        });
        setTimeout(() => {
          this.packs = [];
          this.productRestoItem = [];
          this.router.navigateByUrl('/purchase');
        }, 2000);
        return;
      }
      if (data['data'].length) {
        this.packs.forEach((pack) => {
          let id = pack['_id'];
          //  console.log(id);
          data['data']['products'].forEach((elt) => {
            if (elt.item._id == id) {
              pack['qty'] = elt.qty;
              this.updateTabPacks(pack, id);
            } else {
              // pack["qty"] = 0;
            }
          });
        });
        this.products.forEach((prod) => {
          let id = prod['_id'];
          //  console.log(id);
          data['data']['products'].forEach((elt) => {
            if (elt.item._id == id) {
              // console.log("erico");
              //  console.log(elt.item.qty);
              prod['qty'] = elt.qty;
              this.updateTabProducts(prod, id);
            } else {
              // prod["qty"] = 0;
            }
          });
        });

        return;
      }
      if (data['data'] === 'update') {
        this.totalItems = 0;
        this.totalPrice = 0;
        this.restApiService.saveCart({});
        //  console.log("je repars");

        this.router.navigateByUrl('product-item-list');
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
        this.router.navigateByUrl('product-item-list');
      } else {
        // this.totalItems = data["data"]["cart"]["totalQty"];
        // this.totalPrice = data["data"]["cart"]["totalPrice"];
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
    //  console.log(val);
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
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {});
  }
  search(pack) {
    this.isItemAvailable = false;
    this.isItemAvailable2 = false;
    // console.log(pack);
  }

  updateTabPacks(pack, id) {
    let a = pack;
    let index = this.packs.findIndex((elt) => {
      return elt._id === id;
    });

    this.packs.splice(index, 1, a);
  }
  updateTabProducts(prod, id) {
    // console.log(prod);

    let a = prod;
    let index = this.products.findIndex((elt) => {
      return elt._id === id;
    });

    this.products.splice(index, 1, a);
  }
  async buyItemResto(prod) {
    let id = prod._id;

    this.cartValue = this.restApiService.getCart2();
    // console.log("la valeur du cart", this.cartValue);

    if (this.cartValue && this.cartValue['cart']) {
      let data = {};
      data['product'] = prod;
      data['cart'] = this.cartValue['cart'];
      let cart = this.manageCartService.addToCart(data);

      this.totalItems = cart['totalQty'];
      this.totalPrice = cart['totalPrice'];
      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.productResto.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod['qty'] = b[0]['qty'];
      // console.log("hello2", prod);
      this.productResto.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
      this.rangeByStoreService
        .rangeProductByStore(this.productResto)
        .then((res: any[]) => {
          res = this.productRestoItem;
        });
    } else {
      let cart = this.manageCartService.addToCart(prod);
      //  console.log(cart);
      //  console.log(cart.generateArray());
      this.totalItems = cart['totalQty'];
      this.totalPrice = cart['totalPrice'];
      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.productResto.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod['qty'] = b[0]['qty'];
      //  console.log("hello2", prod);
      this.productResto.splice(index, 1, prod);

      this.productResto.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
      this.rangeByStoreService
        .rangeProductByStore(this.productResto)
        .then((res: any[]) => {
          res = this.productRestoItem;
        });
    }
  }
  takeProductResto() {
    this.restApiService
      .getManufacturedProductItemResto2()
      .subscribe(async (data) => {
        this.productResto = data;
        //this.products = data["items"];
        this.rangeByStoreService
          .rangeProductByStore(data)
          .then((res: any[]) => {
            res = this.productRestoItem;
          });

        //this.productResto = data;
      });
  }

  takeProductServiceList() {
    this.restApiService.getBillardList().subscribe(async (data) => {
      let a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));

      if (this.tabRoles.includes(2)) {
        let storeId = this.saveRandom.getStoreId();
        a = a.filter((prod) => prod.storeId == storeId);
        this.productServiceTab =
          await this.rangeByStoreService.rangeProductByStore(a);

        this.multiStoreService = this.productServiceTab;
      } else {
        this.productServiceTab =
          await this.rangeByStoreService.rangeProductByStore(a);

        this.multiStoreService = this.productServiceTab;
      }
    });
  }

  takeProductListShop() {
    this.restApiService.getShopList().subscribe(async (data) => {
      let a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
      this.productListTab = await this.rangeByStoreService.rangeProductByStore(
        a
      );

      this.multiStoreList = this.productListTab;
    });
  }
  SlideInfo(storeId) {
    let storeList: any[] = this.saveRandom.getStoreList();
    let store = storeList.find((s) => s.id == storeId);

    if (store && this.saveRandom.getSetting().sale_Gaz) {
      if (store.reste) {
        this.budget = store.reste;
      } else if (store.budget) {
        this.budget = store.budget;
      } else {
        this.budget = 0;
      }
    }
  }
}
