import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderDetailsPage } from 'src/app/order-details/order-details.page';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import {
  LoadingController,
  AlertController,
  NavController,
  IonSlides,
} from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { ManageCartService } from '../services/manage-cart.service';
import { RestApiService } from '../services/rest-api.service';
import { CartPage } from '../cart/cart.page';
import { async } from '@angular/core/testing';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { RangeByStoreService } from '../services/range-by-store.service';
import { NotificationService } from '../services/notification.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { SaverandomService } from '../services/saverandom.service';
import { Setting } from '../models/setting.models';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  //@ViewChild('slides') slides2;
  @Input() public productResto;
  //
  @Input() public multiStoreResto: any[];
  @Input() public multiStoreResource: any[];
  @Input() public packs: any[];
  @Input() public storeTypeTab;
  @Input() public multiStoreList: any[];
  @Input() public multiStoreService: any[];
  @Output() buyPacks = new EventEmitter();
  @Output() removeOnePacks = new EventEmitter();
  // @Output() addBtl = new EventEmitter();
  @Output() removeOneResto = new EventEmitter();
  @Output() buyProduct = new EventEmitter();
  @Output() displayItems = new EventEmitter();
  @Output() getSlideInfo = new EventEmitter();
  public sockets;
  adminId: any;
  public url;
  pet: any;
  randomObj = {};
  @ViewChild('mySlider', { static: true }) slides: IonSlides;
  @ViewChild('mySlider2') slides2: IonSlides;
  //products = [];
  products2: any;
  //productResto = [];
  // packs = [];
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
  btnProducts = true; //display bouton items
  btnAllProducts = false; //display bouton pack
  btnResto = false;
  btnPack = true;
  btnResource = false;
  isLoading = false; //loadin controller flag
  cartValue: any;
  tabRoles = [];
  multiStoreProductitem: any;
  isRetailer = false;
  setting: Setting;
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
    public notificationService: NotificationService,
    public getStoreName: GetStoreNameService,
    private saveRandom: SaverandomService
  ) {
    this.adminId = localStorage.getItem('adminId');
    this.notificationService.presentLoading();

    setTimeout(async () => {
      this.multiStoreProductitem =
        await this.rangeByStoreService.rangeProductByStore(this.packs);
      this.notificationService.dismissLoading();
      // console.log(this.multiStoreProductitem);
    }, 3000);

    // this.webServerSocket(this.adminId);
  }

  ngOnInit() {
    if (this.saveRandom.checkIfIsRetailer()) {
      this.isRetailer = true;
    }
    this.setting = this.saveRandom.getSetting();
    let arr: string[] = JSON.parse(localStorage.getItem('adminUser'))[
      'storeType'
    ];
    if (!this.setting.check_service_quantity) {
      this.storeTypeTab = arr.filter((s) => s !== 'services');
    } else {
      this.storeTypeTab = arr;
    }
    if (this.saveRandom.getSetting().use_resource) {
      this.storeTypeTab.push('resource');
    }
    this.storeTypeTab = this.storeTypeTab.filter((store) => store != 'resto');
    if (this.storeTypeTab.length) {
      this.pet = this.storeTypeTab[0];
    } else {
      //seulement si le user est restaurant only
      this.pet = 'resource';
    }

    setTimeout(() => {}, 1000);
  }
  segmentChangedEnter() {
    this.pet = 'product';
  }
  buyItem(prod) {
    // this.buyProduct.emit(prod);
    return new Promise((resolve, reject) => {
      this.buyProduct.emit(prod);
      setTimeout(() => {
        resolve('ok');
      }, 10);
    });
  }

  buyPackProduct(pack) {
    console.log(pack);
    // this.buyPacks.emit(pack);
    return new Promise((resolve, reject) => {
      this.buyPacks.emit(pack);
      setTimeout(() => {
        resolve('ok');
      }, 10);
    });
  }

  removePack(pack) {
    return new Promise((resolve, reject) => {
      this.removeOnePacks.emit(pack);
      setTimeout(() => {
        resolve('ok');
      }, 10);
    });
  }

  // naviguer entre les categories
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.target.value);
    let check = ev.target.value;
    this.pet = check;
    if (check == 'bar') {
      this.btnPack = true;
      this.btnResto = false;
      // console.log(this.products);
    } else if (check == 'resto') {
      this.btnResto = true;
      this.btnProducts = false;
      this.btnAllProducts = false;
      this.btnPack = false;
    } else if (check === 'pack') {
      this.btnResto = false;
      this.btnProducts = false;
      this.btnAllProducts = false; //btnResource
      this.btnPack = true;
    } else if (check === 'resource') {
      this.btnResto = false;
      this.btnProducts = false;
      //this.btnAllProducts = true;
      this.btnPack = false;
      this.btnResource = true;
    }
  }
  async slideChange() {
    try {
      let index = await this.slides2.getActiveIndex();
      console.log(index);
      console.log(this.multiStoreList[index]);
      let storeId = this.multiStoreList[index][0]['storeId'];
      this.getSlideInfo.emit(storeId);
    } catch (error) {}
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
    // this.products2 = this.products;
  }
  async getValueBtl(ev, prod) {
    let value = parseInt(ev.target['value']);
    let id = prod['_id'];
    let nbr = value;
    let storedItem = this.randomObj[id];
    if (parseInt(prod['packPrice'])) {
      prod['prix'] = parseInt(prod['packPrice']);
    } else {
      prod['prix'] = 0;
    }
    if (nbr && nbr > 0) {
      if (prod['sizePack'] && nbr >= prod['sizePack']) {
        //si le nbr de bouteile correspond a un cassier
        // prod["nbrBtl"] = "";
        console.log('hello');
        let val = nbr / prod['sizePack'];
        let val2 = nbr % prod['sizePack']; //nbr de bouteille
        prod['noHandle'] = 1;

        await this.addCassier(Math.trunc(val), prod); //Math.floor(val) est le nbr de cassier
        await this.addBtl(val2, prod);
        setTimeout(() => {
          prod['noHandle'] = 0;
        }, 2000);
      } else {
        //si le nbr de bouteile ne correspond pas a un cassier
        console.log('hello second');
        if (!storedItem) {
          if (prod['packPrice']) {
            this.randomObj[id] = {
              sale: 0,
              coast: 0,
              prod: prod,
            };
            prod['nbrBtl'] = nbr;
          } else {
            prod['packPrice'] = 0;
            this.randomObj[id] = {
              sale: 0,
              coast: 0,
              prod: prod,
            };
            prod['nbrBtl'] = nbr;
          }
        } else {
          // delete this.randomObj[id];
          // prod["nbrBtl"] = nbr;

          if (nbr) {
            if (prod['packPrice']) {
              console.log(this.randomObj[id]);
              this.randomObj[id]['prod']['nbrBtl'] = nbr;
            }
          } else {
            this.randomObj[id]['prod']['nbrBtl'] = 0;
          }
        }
        this.displayItems.emit(this.randomObj);
      }
    } else {
      console.log('rien');
      if (prod['noHandle']) {
      } else {
        prod['nbrBtl'] = 0;

        prod['inputValue'] = 0;
        // delete this.randomObj[id];

        this.displayItems.emit(this.randomObj);
      }

      // this.getOnePack(0, prod);
      /* if (!storedItem) {
        if (prod["packPrice"]) {
          this.randomObj[id] = {
            sale: 0,
            coast: 0,
            prod: prod,
          };
          prod["nbrBtl"] = 0;
        } else {
          if (prod["packPrice"]) {
            console.log(this.randomObj[id]);
            this.randomObj[id]["prod"]["nbrBtl"] = nbr;
          }
        }
      } */
    }
  }

  async addBtl(btl, prod) {
    let id = prod['_id'];
    let storedItem = this.randomObj[id];
    if (!storedItem) {
      if (prod['packPrice']) {
        console.log('hello mballus');
        this.randomObj[id] = {
          sale: 0,
          coast: 0,
          prod: prod,
        };
        prod['nbrBtl'] = btl;
      } else {
      }
    } else {
      // delete this.randomObj[id];
      // prod["nbrBtl"] = nbr;

      if (btl) {
        if (prod['packPrice']) {
          this.randomObj[id]['prod']['nbrBtl'] = btl;
        }
      } else {
        this.randomObj[id]['prod']['nbrBtl'] = 0;
      }
    }

    this.displayItems.emit(this.randomObj);
  }
  async getValue(ev, prod) {
    console.log('get value', prod);

    let value = parseInt(ev.target['value']);
    let id = prod['_id'];
    let nbr = value;

    if (parseInt(prod['packPrice'])) {
      prod['prix'] = parseInt(prod['packPrice']);
    } else {
      prod['prix'] = 0;
    }
    if (Number.isNaN(value)) {
      prod['myValue'] = 0;
    } else {
      if (nbr >= 0) {
        prod['myValue'] = nbr;
        if (prod['noHandle']) {
          return;
        } else {
          let storedItem = this.randomObj[id];
          console.log(prod);

          if (!storedItem) {
            if (prod['packPrice']) {
              this.randomObj[id] = {
                sale: nbr,
                coast: nbr * parseInt(prod['packPrice']),
                prod: prod,
              };
              prod['fisrtValueAdd'] = nbr;
            } else {
              this.randomObj[id] = {
                sale: nbr,
                coast: 0,
                prod: prod,
              };
            }
          } else {
            if (nbr) {
              prod['fisrtValueAdd'] = nbr;
              let obj = this.randomObj[id];
              if (obj['sale']) {
                // nbr = obj["sale"] + nbr;
              }

              if (prod['packPrice']) {
                this.randomObj[id] = {
                  sale: nbr,
                  coast: nbr * parseInt(prod['packPrice']),
                  prod: prod,
                };
              } else {
                this.randomObj[id] = {
                  sale: nbr,
                  coast: 0,
                  prod: prod,
                };
              }
            } else {
              prod['fisrtValueAdd'] = 0;
              prod['nbrBtl'] = 0;
              delete this.randomObj[id];
            }
          }
          if (prod['nbrCassier']) {
            prod['nbrCassier'] = prod['nbrCassier'] + nbr;
          } else {
            prod['nbrCassier'] = nbr;
          }
          this.displayItems.emit(this.randomObj);
        }
      }
    }
  }

  async addCassier(nbr, prod) {
    let id = prod['_id'];

    if (this.randomObj[id] && this.randomObj[id]['sale']) {
      prod['myValue'] = this.randomObj[id]['sale'] + nbr;
    } else {
      prod['myValue'] = nbr;
    }
    let storedItem = this.randomObj[id];

    if (parseInt(prod['packPrice'])) {
      prod['prix'] = parseInt(prod['packPrice']);
    } else {
      prod['prix'] = 0;
    }
    if (!storedItem) {
      if (prod['packPrice']) {
        this.randomObj[id] = {
          sale: nbr,
          coast: nbr * parseInt(prod['packPrice']),
          prod: prod,
        };
        prod['fisrtValueAdd'] = nbr;
      } else {
        this.randomObj[id] = {
          sale: nbr,
          coast: 0,
          prod: prod,
        };
      }
    } else {
      let qty = this.randomObj[id]['sale'] + nbr;
      delete this.randomObj[id];
      if (nbr) {
        if (prod['packPrice']) {
          this.randomObj[id] = {
            sale: qty,
            coast: qty * parseInt(prod['packPrice']),
            prod: prod,
          };
        } else {
        }
      }
    }
    if (prod['nbrCassier']) {
      prod['nbrCassier'] = prod['nbrCassier'] + nbr;
    } else {
      prod['nbrCassier'] = nbr;
    }
    this.displayItems.emit(this.randomObj);
  }
  async getOnePack(btl, prod) {
    let id = prod['_id'];
    // let nbr = ;
    let storedItem = this.randomObj[id];
    if (!storedItem) {
      if (btl) {
        if (prod['packPrice']) {
          this.randomObj[id] = {
            sale: 1,
            coast: 1 * parseInt(prod['packPrice']),
            prod: prod,
          };
          prod['fisrtValueAdd'] = 1;
        }
      }
    } else {
      if (btl) {
        let prodObj = this.randomObj[id];

        delete this.randomObj[id];
        let qty = prodObj['prod']['fisrtValueAdd'] + 1;
        this.randomObj[id] = {
          sale: qty,
          coast: qty * parseInt(prod['packPrice']),
          prod: prod,
        };
        prod['fisrtValueAdd'] = qty;
      } else {
        console.log('hi 2');

        if (!prod['nbrBtl'] && storedItem) {
          let prodObj = this.randomObj[id];

          delete this.randomObj[id];
          let qty = prod['qty'] - 1;
          console.log(qty);

          this.randomObj[id] = {
            sale: qty,
            remove: 1,
            coast: qty * parseInt(prod['packPrice']),
            prod: prod,
          };
          prod['fisrtValueAdd'] = qty - 1;
          prod['nbrBtl'] = '';
        }
      }
    }
    this.displayItems.emit(this.randomObj);
  }
  async getValueResto(ev, prod) {
    let value = parseInt(ev.target['value']);

    let id = prod['_id'];
    let nbr = value;
    let storedItem = this.randomObj[id];
    if (Number.isNaN(value)) {
      prod['fisrtValueAdd'] = null;
      prod['qty'] = 0;
    } else {
      prod['fisrtValueAdd'] = value;
    }
    if (this.saveRandom.checkIfIsRetailer()) {
      prod['purchasingPrice'] = prod['retailerPrice'];
    }
    if (!storedItem) {
      if (nbr) {
        if (prod['purchasingPrice']) {
          this.randomObj[id] = {
            sale: nbr,
            coast: nbr * parseInt(prod['purchasingPrice']),
            prod: prod,
          };
        } else {
          this.randomObj[id] = {
            sale: nbr,
            coast: 0,
            prod: prod,
          };
          // prod["fisrtValueAdd"] = nbr;
        }
        console.log(this.randomObj[id]);
      }
    } else {
      delete this.randomObj[id];
      if (nbr) {
        if (prod['purchasingPrice']) {
          this.randomObj[id] = {
            sale: nbr,
            coast: nbr * parseInt(prod['purchasingPrice']),
            prod: prod,
          };
        } else {
          this.randomObj[id] = {
            sale: nbr,
            coast: 0,
            prod: prod,
          };
        }
      } else {
        prod['qty'] = 0;
        this.randomObj[id] = {
          sale: 0,
          coast: 0,
          prod: prod,
        };
      }
    }

    this.buyProduct.emit(this.randomObj);
  }
  changePrice(ev, prod) {
    let value = parseInt(ev.target['value']);

    let id = prod['_id'];
    let nbr = 0;
    let storedItem = this.randomObj[id];
    if (Number.isNaN(value)) {
      prod['purchasingPrice'] = 0;
    } else {
      prod['purchasingPrice'] = value;
    }
    if (prod['fisrtValueAdd']) {
      nbr = prod['fisrtValueAdd'];
      if (!storedItem) {
        return;
      } else {
        delete this.randomObj[id];
        if (nbr) {
          prod['packPrice'] = nbr;
          // prod["purchasingPrice"] =
          this.randomObj[id] = {
            sale: nbr,
            coast: nbr * value,
            prod: prod,
          };
          console.log(prod);
        }
      }
      this.displayItems.emit(this.randomObj);
    }
  }
}
