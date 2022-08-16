import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { ImageLoaderService } from 'ionic-image-loader';

import {
  NavController,
  ModalController,
  AlertController,
  IonSlides,
  LoadingController,
  // Events,
  ToastController,
  NavParams,
  PopoverController,
  IonContent,
  MenuController,
  Platform,
} from '@ionic/angular';
import { CartPage } from '../../cart/cart.page';
import { Router } from '@angular/router';
import { ManageCartService } from '../../services/manage-cart.service';
import { CountItemsService } from '../../services/count-items.service';
import { TranslateConfigService } from '../../translate-config.service';
import {
  NetworkService,
  ConnectionStatus,
} from '../../services/network.service';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../services/admin.service';
import { UrlService } from '../../services/url.service';
import { ScreensizeService } from '../../services/screensize.service';
import { Productmanager } from '../../manage-cart/manageProducts';
import { CatService } from '../../services/cat.service';
import { groupBy, mergeMap, toArray, takeUntil, map } from 'rxjs/operators';
import {
  from,
  BehaviorSubject,
  Observable,
  Subject,
  zip,
  interval,
} from 'rxjs';
import { OfflineManagerService } from '../../services/offline-manager.service';
import { MyeventsService } from '../../services/myevents.service';
import { HTTP } from '@ionic-native/http/ngx';
import { NotificationService } from '../../services/notification.service';
import { ResourcesService } from '../../services/resources.service';
import { RangeByStoreService } from '../../services/range-by-store.service';
import { ManagesocketService } from '../../services/managesocket.service';
import { GroupByCategorieService } from '../../services/group-by-categorie.service';
import { CachingService } from '../../services/caching.service';
import { SaverandomService } from '../../services/saverandom.service';
import { ConvertToPackService } from '../../services/convert-to-pack.service';
import { RetailerPriceService } from '../../services/retailer-price.service';
import { GammeService } from '../../services/gamme.service';
import { Gamme } from '../../models/gamme.model';
import { GammeBeforeSalePage } from '../../gamme/gamme-before-sale/gamme-before-sale.page';
import { Product } from '../../models/product.model';
import { TranslateService } from '@ngx-translate/core';
import { Setting } from '../../models/setting.models';
import { ConfirmPage } from '../../modals/confirm/confirm.page';
import { Location } from '@angular/common';
import { PickCustomerPage } from 'src/app/pages/pick-customer/pick-customer.page';

@Component({
  selector: 'app-sc-shop',
  templateUrl: './sc-shop.page.html',
  styleUrls: ['./sc-shop.page.scss'],
})
export class ScShopPage implements OnInit {
  products = [];
  products2: any;
  productResto = [];
  randomP = [];
  randomShop = [];
  randomResto = [];
  randomList = [];
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
  isItemAvailable3 = false;
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
  public sockets;
  public url;
  loading: any;
  autorisationNumber: any;
  displayNumber: any;
  screenSize: any;
  pos: Boolean = false;
  userProducts = [];
  userProducts2 = [];
  allUserProducts = [];
  allUserProductsList = [];
  categories = [];
  productsCat = [];
  valuename: any;
  segment = 'boisson';
  choise: any;
  tableToDisplay: Array<any>;
  tableCheckDisplay = [];
  productsGame = [];
  ortherProducts = [];
  tables: any;
  objGen = {};
  updateFlag: any;
  numPlat = 1;
  numPlatRandom = 0;
  plat = [];
  plalist = [1];
  flagAdd: any = false;
  subscription: Observable<any>;
  subscription2: any;
  public urlEvent;
  productStatus = new BehaviorSubject(false);
  displayList = false;
  numFacture;
  storeType = [];
  tabNotif = [];
  productList: any;
  arr = [];
  arrList = [];
  arrList2 = [];
  arrListRandom = [];
  storeTypeTab = [];
  productServiceTab: any;
  productListTab: any[] = [];
  gammeListTab: any[];
  productListGroup: any;
  multiStoreList: any;
  multiStoreService: any;
  pet: any;
  saleToPack = false;
  checkPack = false;
  saleToRetailer = false;
  isRetailer = false;
  spinner: boolean;
  tab = [];
  group;
  // destroy$: Subject<boolean> = new Subject<boolean>();
  destroy$ = new Subject();
  isLoad = false;
  navSlide = false;
  isDesktop = false;
  showMe = true;
  urlPackage = '';
  voucher: any;
  setting: Setting;
  transaction = [];
  clientType: string = null;
  randomObj = {};
  grammage = 0;
  zoneList: any[] = [];
  customer: any;
  constructor(
    public restApiService: RestApiService,
    public manageCartService: ManageCartService,
    public countItemsService: CountItemsService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public alertController: AlertController,
    public router: Router,
    public loadingController: LoadingController,
    private translateConfigService: TranslateConfigService,
    public events: MyeventsService,
    private networkService: NetworkService,
    private toastController: ToastController,

    private adminService: AdminService,
    private imageLoader: ImageLoaderService,
    private urlService: UrlService,
    private screensizeService: ScreensizeService,
    public popoverController: PopoverController,
    private offlineManager: OfflineManagerService,
    private menu: MenuController,
    private httpN: HTTP,
    public notification: NotificationService,
    public resourceService: ResourcesService,
    public rangeByStoreService: RangeByStoreService,
    private manageSocket: ManagesocketService,
    private groupByService: GroupByCategorieService,
    private platform: Platform,
    private cacheService: CachingService,
    private saveRandom: SaverandomService,
    private convert: ConvertToPackService,
    private retailerPrice: RetailerPriceService,
    private gammeService: GammeService,
    public translate: TranslateService,
    private notifi: NotificationService,
    private location: Location
  ) {
    this.setting = this.saveRandom.getSetting();
    this.zoneList = this.setting.zone;
    this.screenCheck();
    this.menu.enable(true, 'first');
    let adminUser = JSON.parse(localStorage.getItem('adminUser'));
    this.storeType = adminUser['storeType'];
    if (
      (adminUser['displayType'] && adminUser['displayType'] == 'card') ||
      this.storeType.includes('bar') ||
      this.storeType.includes('resto')
    ) {
      this.displayList = false;
    } else {
    }

    this.networkService.initializeNetworkEvents();
    this.checkCart();
    this.takeUrl();

    if (JSON.parse(localStorage.getItem('user'))['name']) {
      this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    }

    this.tabRoles = JSON.parse(localStorage.getItem('roles'));

    if (this.tabRoles.includes(8)) {
      this.pos = true;
    }

    this.languageChanged();
    if (this.tabRoles.includes(5)) {
      // this.takeCashOpen();
    } else {
      //this.takeCashOpen();
    }
  }

  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  checkCart() {
    this.cartValue = this.restApiService.getCart2();

    if (this.cartValue && this.cartValue['cart']) {
      this.totalItems = this.cartValue['cart']['totalQty'];
      this.totalPrice = this.cartValue['cart']['totalPrice'];
    }
  }

  async takeUrl() {
    this.urlService
      .getUrlEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (data) => {
        this.urlEvent = data;
        this.adminId = localStorage.getItem('adminId');
        this.webServerSocket(this.adminId);
      });
  }

  ngOnInit() {
    let d = this.saveRandom.getVoucher();
    if (d) {
      this.voucher = true;
    } else {
      this.voucher = false;
    }
  }

  ionViewWillEnter() {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.saleToRetailer = this.saveRandom.checkIfIsRetailer();
    if (localStorage.getItem('addFlag')) {
      this.flagAdd = localStorage.getItem('addFlag');
    }

    this.getCustomerItems();
  }

  ionViewWillLeave() {
    if (localStorage.getItem('backTo')) {
      localStorage.removeItem('backTo');
    }
    this.saveRandom.isNotRetailer();
    this.destroy$.next();
    this.destroy$.complete();
    this.cartValue = this.restApiService.getCart2();
    if (this.cartValue && this.cartValue['cart']) {
      this.restApiService.saveCart({});
    }
  }

  getCustomerItems() {
    if (JSON.parse(localStorage.getItem('setting'))) {
      let setting = JSON.parse(localStorage.getItem('setting'));
      if (Array.isArray(setting)) {
      } else {
      }
      if (Array.isArray(setting)) {
        if (setting[0]['SaleInPack']) {
          this.checkPack = true;
          localStorage.setItem('saleAsPack', 'true');
        } else {
          this.checkPack = false;
        }
      } else {
        if (setting['SaleInPack']) {
          this.checkPack = true;
          localStorage.setItem('saleAsPack', 'true');
        } else {
          this.checkPack = false;
        }
      }
    }
    this.storeTypeTab = JSON.parse(localStorage.getItem('adminUser'))[
      'storeType'
    ];
    this.storeTypeTab.forEach((title, index) => {
      if (title == 'services') {
        this.storeTypeTab[index] = 'produits';
      }
      if (title == 'Gammes') {
        this.storeTypeTab[index] = 'Gammes';
      }
    });

    this.pet = this.storeTypeTab[0];

    if (this.storeTypeTab.includes('bar')) {
      // this.takeProduct();
    }

    if (
      this.storeTypeTab.includes('services') ||
      this.storeTypeTab.includes('produits')
    ) {
      this.takeGame();
    }

    if (this.storeTypeTab.includes('shop')) {
      setTimeout(() => {
        // this.takeProductListShop();
      }, 1500);
    }
    let setting = JSON.parse(localStorage.getItem('setting'));
    if (Array.isArray(setting)) {
      if (setting[0]['use_gamme']) {
        this.storeTypeTab.push('Gammes');
        this.getAllGamme();
      }
    } else {
      if (setting['use_gamme']) {
        this.storeTypeTab.push('Gammes');
        this.getAllGamme();
      }
    }
  }

  cancelAdd() {
    localStorage.removeItem('order');
    localStorage.removeItem('addFlag');
    this.flagAdd = false;
  }

  getOrdersFromLocalServer() {
    setInterval(() => {
      let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
      let data = {
        sender: senderId,
      };
      let obj = JSON.stringify(data);
      let url = this.url + `invoice/ready/to/take?localId=${senderId}`;
      this.httpN.setDataSerializer('utf8');
      this.httpN
        .patch(url, obj, {})
        .then((res) => {
          alert(JSON.parse(JSON.stringify(res)));
          let commande = JSON.parse(res['data']);
          if (commande && commande.length) {
            this.events.storeOrders(commande, 'saveAll', []).then((res) => {});
          }
        })
        .catch((err) => {});
    }, 20 * 1000);
  }
  async webServerSocket(id) {
    this.manageSocket.getSocket().subscribe((sockets) => {
      sockets.on(`${id}newProductList`, (data) => {});

      let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
      sockets.on('connect', function () {});
      sockets.on(`${this.adminId}productItem`, (data) => {});
      sockets.on(`${id}newBill`, (data) => {});
      sockets.on(`${id}newSetting`, (data) => {
        setTimeout(() => {
          this.cacheService.getCachedRequest('MySettings').then((result) => {
            if (result) {
              result['company'][0] = data;
              this.cacheService.cacheRequest('MySettings', result);
            }
          });
          // this.urlService.useWifiIp(data);
        }, 2000);
      });

      sockets.on(`${id}productItemGlace`, async (data) => {});

      //localStorage;
      sockets.on(`${id}productItemToShop`, async (data) => {});

      sockets.on(`${id}manufacturedItem`, async (data) => {});
      sockets.on(`${this.adminId}productlist`, (data) => {});

      sockets.on(`${this.adminId}billardItem`, (data) => {});
      sockets.on(`${this.adminId}${storeId}billardItem`, (data) => {
        let index = this.productListTab.findIndex((p) => p._id == data._id);
        if (index >= 0) {
          console.log('index===>', index);
          this.productListTab.splice(index, 1, data);
        }
      });

      sockets.on(`${id}transactionNewItem`, (data) => {
        this.notifi.presentToast('you have new notification', 'danger');
        this.transaction.unshift(data['data']);
      });
    });
  }

  async buyItemGame(prod, value) {
    let id = prod._id;
    if (prod['quantityItems'] <= 0) {
      this.notifi.presentToast(`le stock disponible est égale a 0`, 'danger');
      return;
    }

    this.cartValue = this.restApiService.getCart2();

    if (prod['quantityItems'] > 0) {
      if (this.cartValue && this.cartValue['cart']) {
        let data = {};
        prod['sc'] = true;
        prod['value'] = value;
        data['product'] = prod;
        data['cart'] = this.cartValue['cart'];
        let cart = this.manageCartService.addToCart(data);

        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];

        // console.log("resto", tab[0]);
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });

        if (parseInt(prod['quantityItems'])) {
          prod['quantityItems'] = prod['quantityItems'] - prod.toSale;
        }
        if (prod['quantityStore'] > 0) {
          //prod['quantityStore'] = prod['quantityStore'] - 1;
        }
      } else {
        prod['sc'] = true;
        prod['value'] = value;
        let cart = this.manageCartService.addToCart(prod);
        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
        if (parseInt(prod['quantityItems'])) {
          prod['quantityItems'] = prod['quantityItems'] - prod.toSale;
        }
      }
    } else {
      console.log('====', prod);
      this.showPresentAlert();
    }
  }
  // naviguer entre les categories

  getCart() {
    this.cartValue = this.restApiService.getCart();
  }

  displayCart() {
    this.navCtrl.navigateForward('cart');
  }

  async openCart() {
    this.notification.presentLoading();
    this.saveRandom.setClientType(this.clientType);
    if (this.plat.length) {
      localStorage.setItem('plat', JSON.stringify(this.plat));
    } else {
      localStorage.setItem('plat', JSON.stringify([]));
    }
    this.generateArrayManagerMode();
    const modal = await this.modalController.create({
      component: CartPage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(async (data) => {
      if (data['data'] && data['data']['order']) {
        console.log('==========================retour', data['data']);

        this.confirmAndPrint(data['data']['order']);
        let tab = this.restApiService.getCart();
        this.restApiService.cleanCart();
        localStorage.removeItem('order');
        localStorage.removeItem('addFlag');
        this.flagAdd = false;
        this.totalItems = 0;
        this.totalPrice = 0;

        this.restApiService.saveCart({});

        this.plalist = [];
        this.plalist = [1];
        this.numPlat = 1;
        this.plat = [];
        this.numPlatRandom = 0;
        let setting = JSON.parse(localStorage.getItem('setting'));
        if (setting['use_gamme']) {
          this.gammeListTab.forEach((gamme) => {
            gamme.nbr = 0;
            gamme['quantityToSale'] = 0;
          });
        }
        if (this.userProducts2 && this.userProducts.length > 0) {
          this.userProducts.forEach((elt) => {
            if (elt['modeG']) {
              elt['modeG'] = 0;
            }
            if (elt['modeNG']) {
              elt['modeNG'] = 0;
            }

            if (elt['qty']) {
              elt['qty'] = 0;
            }
            if (parseInt(elt['CA'])) {
              elt['cassierStore'] = elt['cassierStore'] + elt['CA'];
            } else {
              elt['cassierStore'] = elt['cassierStore'];
            }
            if (parseInt(elt['BTL'])) {
              elt['btlsStore'] = elt['btlsStore'] + elt['BTL'];
            } else {
              elt['btlsStore'] = elt['btlsStore'];
            }
            if (elt['CA']) {
              elt['CA'] = 0;
            }
            if (elt['BTL']) {
              elt['BTL'] = 0;
            }
          });
        }
        this.allUserProductsList.forEach((elt) => {
          if (elt['modeG']) {
            //  elt['glace'] = elt['glace'] - elt['modeG'];
            elt['modeG'] = 0;
          }
          if (elt['modeNG']) {
            //  elt['quantityStore'] = elt['quantityStore'] - elt['modeNG'];
            elt['modeNG'] = 0;
          }

          if (elt['qty']) {
            elt['qty'] = 0;
          }
          if (parseInt(elt['CA'])) {
            // elt['cassierStore'] = elt['cassierStore'] - elt['CA'];
          } else {
            elt['cassierStore'] = elt['cassierStore'];
          }
          if (parseInt(elt['BTL'])) {
            // elt['btlsStore'] = elt['btlsStore'] - elt['BTL'];
          } else {
            elt['btlsStore'] = elt['btlsStore'];
          }
          if (elt['CA']) {
            elt['CA'] = 0;
          }
          if (elt['BTL']) {
            elt['BTL'] = 0;
          }
        });
        // });

        if (localStorage.getItem('backTo')) {
          setTimeout(() => {
            let page = JSON.parse(localStorage.getItem('backTo'));
            let goTo = page['url'];

            this.router.navigateByUrl(goTo);
            localStorage.removeItem('backTo');
          }, 2000);
        }

        if (this.packs && this.packs.length > 0) {
          this.packs.forEach((elt) => {
            elt['qty'] = 0;
          });
        }
        if (this.productsGame && this.productsGame.length > 0) {
          this.productsGame.forEach((elt) => {
            elt['qty'] = 0;
          });
        }

        if (this.productResto && this.productResto.length > 0) {
          this.productResto.forEach((elt) => {
            elt['nbr'] = 0;
          });
          this.productResto2 = await this.groupByService.groupArticles(
            this.productResto
          );
        }

        if (this.productList && this.productList.length > 0) {
          this.productList.forEach((arr) => {
            arr.forEach((prod) => {
              if (prod['qty']) {
                prod['qty'] = 0;
              }
              if (prod['nbr']) {
                prod['nbr'] = 0;
              }
            });
          });
        }

        if (this.productListTab && this.productListTab.length > 0) {
          this.productListTab.forEach((arr) => {
            arr.toSale = 0;
            arr.forEach((prod) => {
              prod.toSale = 0;
              if (prod['qty']) {
                prod['qty'] = 0;
              }
              if (prod['nbr']) {
                prod['nbr'] = 0;
                prod['quantityStore'] = parseInt(prod['quantityStore']);
              }
            });
          });
        }

        return;
      }
      if (data['data'] === undefined) {
        let setting = JSON.parse(localStorage.getItem('setting'));

        if (setting['use_gamme']) {
          this.gammeListTab.forEach((gamme) => {
            gamme.nbr = 0;
            gamme['quantityToSale'] = 0;
          });
        }
        if (localStorage.getItem('backTo')) {
          localStorage.removeItem('backTo');
        }

        if (this.randomP && this.randomP.length) {
          this.userProducts2 = this.randomP;
        }
        if (this.randomList && this.randomList.length) {
          this.productListTab = this.randomList;
        }
        if (this.randomResto && this.randomResto.length) {
          this.productResto2 = this.randomResto;
        }
        if (this.randomShop && this.randomShop.length) {
          this.arrList = this.randomShop;
        }

        this.events.refresh();
        this.restApiService.cleanCart();
        this.totalItems = 0;
        this.totalPrice = 0;
        this.restApiService.saveCart({});
        this.plalist = [];
        this.plalist = [1];
        this.numPlat = 1;
        this.plat = [];
        this.numPlatRandom = 0;
        if (this.userProducts2 && this.userProducts2.length) {
          this.userProducts2.forEach((arr1) => {
            arr1.forEach((arr2) => {
              arr2.forEach((elt) => {
                if (parseInt(elt['modeNG'])) {
                  elt['quantityStore'] = elt['modeNG'] + elt['quantityStore'];
                } else {
                  elt['quantityStore'] = elt['quantityStore'];
                }

                if (parseInt(elt['modeG'])) {
                  elt['glace'] = elt['modeG'] + elt['glace'];
                } else {
                  elt['glace'] = elt['glace'];
                }
                if (parseInt(elt['CA'])) {
                  elt['cassierStore'] = elt['CA'] + elt['cassierStore'];
                } else {
                  elt['cassierStore'] = elt['cassierStore'];
                }
                if (parseInt(elt['BTL'])) {
                  elt['btlsStore'] = elt['BTL'] + elt['btlsStore'];
                } else {
                  elt['btlsStore'] = elt['btlsStore'];
                }

                elt['qty'] = 0;
                elt['modeG'] = 0;
                elt['modeNG'] = 0;
                elt['BTL'] = 0;
                elt['CA'] = 0;
              });
            });
          });
        }

        this.productsGame.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
        });
        this.productResto.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
          if (elt['nbr']) {
            elt['nbr'] = 0;
          }
        });
        this.productResto2 = await this.groupByService.groupArticles(
          this.productResto
        );
        this.productList.forEach((elt) => {
          if (elt['qty']) {
            elt['qty'] = 0;
          }
          if (elt['nbr']) {
            elt['nbr'] = 0;
          }
        });
        this.productListTab.forEach((elt) => {
          elt.toSale = 0;
          if (elt['qty']) {
            elt['qty'] = 0;
          }
          if (elt['nbr']) {
            elt['nbr'] = 0;
          }
        });

        return;
      }

      if (localStorage.getItem('manageStockWithService') === 'true') {
        let d = JSON.parse(localStorage.getItem('d'));
      }

      if (data['data']['cart']) {
      }

      if (data['data'] === 'update') {
        let tab = this.restApiService.getCart();
        this.restApiService.cleanCart();
        localStorage.removeItem('order');
        localStorage.removeItem('addFlag');
        this.flagAdd = false;
        this.totalItems = 0;
        this.totalPrice = 0;

        this.restApiService.saveCart({});

        this.plalist = [];
        this.plalist = [1];
        this.numPlat = 1;
        this.plat = [];
        this.numPlatRandom = 0;
        let setting = JSON.parse(localStorage.getItem('setting'));
        if (setting['use_gamme']) {
          this.gammeListTab.forEach((gamme) => {
            gamme.nbr = 0;
            gamme['quantityToSale'] = 0;
          });
        }
        if (this.userProducts2 && this.userProducts.length > 0) {
          this.userProducts.forEach((elt) => {
            if (elt['modeG']) {
              elt['modeG'] = 0;
            }
            if (elt['modeNG']) {
              elt['modeNG'] = 0;
            }

            if (elt['qty']) {
              elt['qty'] = 0;
            }
            if (parseInt(elt['CA'])) {
              elt['cassierStore'] = elt['cassierStore'] + elt['CA'];
            } else {
              elt['cassierStore'] = elt['cassierStore'];
            }
            if (parseInt(elt['BTL'])) {
              elt['btlsStore'] = elt['btlsStore'] + elt['BTL'];
            } else {
              elt['btlsStore'] = elt['btlsStore'];
            }
            if (elt['CA']) {
              elt['CA'] = 0;
            }
            if (elt['BTL']) {
              elt['BTL'] = 0;
            }
          });
        }
        this.allUserProductsList.forEach((elt) => {
          if (elt['modeG']) {
            //  elt['glace'] = elt['glace'] - elt['modeG'];
            elt['modeG'] = 0;
          }
          if (elt['modeNG']) {
            //  elt['quantityStore'] = elt['quantityStore'] - elt['modeNG'];
            elt['modeNG'] = 0;
          }

          if (elt['qty']) {
            elt['qty'] = 0;
          }
          if (parseInt(elt['CA'])) {
            // elt['cassierStore'] = elt['cassierStore'] - elt['CA'];
          } else {
            elt['cassierStore'] = elt['cassierStore'];
          }
          if (parseInt(elt['BTL'])) {
            // elt['btlsStore'] = elt['btlsStore'] - elt['BTL'];
          } else {
            elt['btlsStore'] = elt['btlsStore'];
          }
          if (elt['CA']) {
            elt['CA'] = 0;
          }
          if (elt['BTL']) {
            elt['BTL'] = 0;
          }
        });
        // });

        if (localStorage.getItem('backTo')) {
          setTimeout(() => {
            let page = JSON.parse(localStorage.getItem('backTo'));
            let goTo = page['url'];

            this.router.navigateByUrl(goTo);
            localStorage.removeItem('backTo');
          }, 2000);
        }

        if (this.packs && this.packs.length > 0) {
          this.packs.forEach((elt) => {
            elt['qty'] = 0;
          });
        }
        if (this.productsGame && this.productsGame.length > 0) {
          this.productsGame.forEach((elt) => {
            elt['qty'] = 0;
          });
        }

        if (this.productResto && this.productResto.length > 0) {
          this.productResto.forEach((elt) => {
            elt['nbr'] = 0;
          });
          this.productResto2 = await this.groupByService.groupArticles(
            this.productResto
          );
        }

        if (this.productList && this.productList.length > 0) {
          this.productList.forEach((arr) => {
            arr.forEach((prod) => {
              if (prod['qty']) {
                prod['qty'] = 0;
              }
              if (prod['nbr']) {
                prod['nbr'] = 0;
              }
            });
          });
        }

        if (this.productListTab && this.productListTab.length > 0) {
          this.productListTab.forEach((arr) => {
            arr.toSale = 0;
            arr.forEach((prod) => {
              prod.toSale = 0;
              if (prod['qty']) {
                prod['qty'] = 0;
              }
              if (prod['nbr']) {
                prod['nbr'] = 0;
              }
            });
          });
        }

        setTimeout(() => {
          this.location.back();
        }, 2000);
        return;
      }
      if (data['data']['products'] && data['data']['products'].length) {
        this.packs.forEach((pack) => {
          let id = pack['_id'];
          // console.log(id);
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
      }
      if (data['data'] === 'update-cancel') {
        let tab = this.restApiService.getCart();
        this.restApiService.cleanCart();
        localStorage.removeItem('order');
        localStorage.removeItem('addFlag');
        this.flagAdd = false;
        this.totalItems = 0;
        this.totalPrice = 0;

        this.restApiService.saveCart({});
        if (this.productsGame && this.productsGame.length > 0) {
          this.productsGame.forEach((elt) => {
            elt['qty'] = 0;
          });
        }

        if (this.productResto && this.productResto.length > 0) {
          this.productResto.forEach((elt) => {
            elt['quantityStore'] = elt['nbr'] + elt['quantityStore'];
            elt['nbr'] = 0;
          });
          this.productResto2 = await this.groupByService.groupArticles(
            this.productResto
          );
        }

        if (this.productList && this.productList.length > 0) {
          this.productList.forEach((arr) => {
            arr.forEach((prod) => {
              if (prod['qty']) {
                prod['qty'] = 0;
              }
              if (prod['nbr']) {
                prod['quantityStore'] = prod['nbr'] + prod['quantityStore'];
                prod['nbr'] = 0;
              }
            });
          });
        }

        if (this.productListTab && this.productListTab.length > 0) {
          this.productListTab.forEach((arr) => {
            arr.toSale = 0;
            arr.forEach((prod) => {
              console.log(prod);

              if (prod['qty']) {
                prod['quantityStore'] = prod['qty'] + prod['quantityStore'];
                prod['qty'] = 0;
              }
              if (prod['nbr']) {
                prod['quantityStore'] = prod['nbr'] + prod['quantityStore'];
                prod['nbr'] = 0;
              }
            });
          });
        }
      } else {
        this.totalItems = data['data']['cart']['totalQty'];
        this.totalPrice = data['data']['cart']['totalPrice'];
        this.restApiService.saveCart(data['data']);
      }
    });

    return await modal.present().then((created) => {
      this.notification.dismissLoading();
    });
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

  async showPresentAlert(tabNotif?: Array<any>) {
    if (tabNotif) {
      let message = '';
      tabNotif.forEach((resource) => {
        message =
          message +
          ` - ${resource.name}
          
          , 
        `;
      });

      const alert = await this.alertController.create({
        header: 'NOT ENOUGTH:',
        // subHeader: ` ${data}`,
        //message: data.data.message,
        message: message.toUpperCase(),

        buttons: ['OK'],
      });

      await alert.present();
    } else {
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

  async updateTabProResto(prod, id) {
    let a = prod;
    let index = this.productResto.findIndex((elt) => {
      return elt._id === id;
    });

    this.productResto.splice(index, 1, a);
    this.productResto2 = await this.groupByService.groupArticles(
      this.productResto
    );
  }
  clearCache(ev) {
    this.imageLoader.clearCache();
  }

  //provisoire

  screenCheck() {
    this.screensizeService
      .isDesktopView()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDesktop) => {
        if (this.isDesktop && !isDesktop) {
          // Reload because our routing is out of place
          //  window.location.reload();
        }

        this.isDesktop = isDesktop;
      });
  }

  /// gestion des stocks par le manager

  async takeGame() {
    this.notification.presentLoading();

    this.notification.dismissLoading();
    this.restApiService
      .getBillardList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (data) => {
        let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];

        this.productListTab = data['product']
          .filter((prod) => prod.storeId == storeId)
          .sort((c, b) => (c.name > b.name ? 1 : -1));
        this.gammeService.setProducts(this.productListTab);
        this.notification.dismissLoading();
      });
  }

  async getAllGamme() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.cacheService
      .getCachedRequest('gammeList')
      .then((data) => {
        this.gammeListTab = data;
        this.gammeService
          .getGammeList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(async (data: any[]) => {
            if (data) {
              this.gammeListTab = data.filter(
                (gamme) => gamme.storeId == storeId
              );
              console.log('les gammes ici ===>', this.gammeListTab);
              // this.gammeService.setProducts(this.gammeListTab);
            }
          });
      })
      .catch((err) => {
        this.gammeService
          .getGammeList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(async (data: Gamme[]) => {
            console.log(data);
            if (data) {
              this.gammeListTab = data.filter(
                (gamme) => gamme.storeId == storeId
              );
              // this.gammeService.setProducts(this.gammeListTab);
              // console.log('les gammes ici ===>', this.gammeListTab);
            }
          });
      });
  }

  async confirmAndPrint(data) {
    console.log('hello data', data);

    this.saveRandom.setData(data);
    // this.router.navigateByUrl('confirm');
    const modal = await this.modalController.create({
      component: ConfirmPage,
      backdropDismiss: true,
    });
    modal.onDidDismiss().then(async (data) => {
      console.log(data);
      // this.modalController.dismiss('update');
    });
    return await modal.present().then((created) => {
      //
    });
  }

  getValueR(ev, pack) {
    let nbr = parseInt(ev.detail.value);
    if (nbr && nbr > pack['quantityItems']) {
      if (pack.toSale) {
        pack['quantityItems'] = pack['quantityItems'] + pack.toSale;
      }
      pack.toSale = 0;
      this.buyItemGame(pack, 0);
      this.calculGrammage(pack.masse, pack);
      this.notifi.presentToast(
        `la quantité en stock est inférieur a ${nbr}`,
        'danger'
      );
    } else if (nbr && nbr > 0) {
      pack.toSale = nbr;
      this.buyItemGame(pack, nbr);
      this.calculGrammage(pack.masse, pack);
    } else if (nbr == 0) {
      pack.toSale = 0;
      this.buyItemGame(pack, nbr);
      this.calculGrammage(pack.masse, pack);
    } else {
      if (pack.toSale) {
        pack['quantityItems'] = pack['quantityItems'] + pack.toSale;
      }
      pack.toSale = 0;
      if (this.randomObj[pack._id]) {
        delete this.randomObj[pack._id];
        this.generateArrayManagerMode();
      }
      this.buyItemGame(pack, 0);
    }
  }
  typeDeClient(ev) {
    console.log(ev);
    if (ev.detail.value == 'SM') {
      // super marché
      this.clientType = ev.detail.value;
      this.productListTab.forEach((p) => {
        p.randomPrices = p.sellingPrice;
        let pR = (p.sellingPrice * 25) / 100;
        let sMP = p.sellingPrice - pR;
        // p.sellingPrice = p.superMarketPrice;
        p.sellingPrice = sMP;
      });
    } else if (ev.detail.value && ev.detail.value !== 'SM') {
      this.clientType = ev.detail.value;
      this.productListTab.forEach((p) => {
        if (p.randomPrices) {
          p.sellingPrice = p.randomPrices;
        }
      });
    }
    console.log(this.productListTab);
  }

  async selectCustomer() {
    if (this.tabRoles.includes(5)) {
      this.notifi.presentToast(
        'vous ne pouvez pas utiliser cette option, rapprocher vous de la caisse',
        'danger'
      );
      return;
    }

    const modal = await this.modalController.create({
      component: PickCustomerPage,
      cssClass: 'mymodal-class',
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((res) => {
      if (res['data']['customer']) {
        this.customer = res['data']['customer'];
        console.log(this.customer);
        this.saveRandom.setCustomer(this.customer);
        if (this.customer && this.customer.customerType == 'SM') {
          if (this.customer.reduction) {
            this.productListTab.forEach((p) => {
              p.randomPrices = p.sellingPrice;
              let pR = (p.sellingPrice * this.customer.reduction) / 100;
              let sMP = p.sellingPrice - pR;
              // p.sellingPrice = p.superMarketPrice;
              p.sellingPrice = sMP;
            });
          } else {
            this.productListTab.forEach((p) => {
              if (p.randomPrices) {
                p.sellingPrice = p.randomPrices;
              }
            });
          }
        }
      }
    });

    return await modal.present();
  }
  removeCustomer() {
    this.customer = null;
    this.saveRandom.setCustomer(this.customer);
    this.productListTab.forEach((p) => {
      if (p.randomPrices) {
        p.sellingPrice = p.randomPrices;
      }
    });
  }

  findProductList(ev) {
    // Reset items back to all of the items

    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable3 = true;
      this.arrList2 = this.productListTab.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.isItemAvailable3 = false;
    }
  }

  async segmentChanged(ev: any) {
    // this.spinner = false;
    this.showMe = false;
    this.notification.presentLoading();
    this.pet = ev.target.value;
    this.isLoad = true;
    setTimeout(() => {
      this.showMe = true;
      this.notification.dismissLoading();
    }, 200);
  }
  async buyGamme(gamme: Gamme) {
    /* if (JSON.parse(localStorage.getItem('oldGamme'))) {
      console.log('gamme dans le storage=======');
      gamme.productList = JSON.parse(
        localStorage.getItem('oldGamme')
      ).productList;
      gamme.sellingPrice = JSON.parse(
        localStorage.getItem('oldGamme')
      ).sellingPrice;
    }
    localStorage.removeItem('oldGamme');*/

    this.gammeService.setGamme(gamme);
    const modal = await this.modalController.create({
      component: GammeBeforeSalePage,
      componentProps: {},
    });
    modal.onDidDismiss().then(async (data) => {
      if (data.data && data.data['add'] == true) {
        let quantity = data.data['quantity'];
        console.log(data);

        for (const gamm of data.data['gamme']['productList']) {
          let found = gamme.productList.find((g) => g._id == gamm._id);
          if (!found) {
            console.log('je pousse un nouveau');
            gamme.productList.push(gamm);
          }
        }
        let newGamme: Product[] = data.data['reste'];
        let autorisation = true;
        let notFound: Product[] = [];
        let notExist: Product[] = [];
        let listProduct: Product[] = [];
        /* this.productListTab.forEach((arr: Product[]) => {
          listProduct = [...listProduct, ...arr];
        });*/
        listProduct = this.productListTab;

        if (newGamme.length) {
          newGamme.forEach((gam) => {
            // this.productListTab.forEach((arr: Product[]) => {
            let index = listProduct.findIndex((prod) => {
              return prod._id == gam._id;
            });
            if (index >= 0) {
              if (listProduct[index].quantityItems < gam.toRemove * quantity) {
                autorisation = false;
                notFound.push(listProduct[index]);
              } else {
                listProduct[index].quantityItems =
                  listProduct[index].quantityItems - gam.toRemove * quantity;
              }
            }
            // });
          });
        } else {
          gamme.productList.forEach((gam) => {
            // this.productListTab.forEach((arr: Product[]) => {
            let index = listProduct.findIndex((prod) => {
              return prod._id == gam._id;
            });
            if (index >= 0) {
              if (listProduct[index].quantityItems < gam.toRemove * quantity) {
                autorisation = false;
                notFound.push(listProduct[index]);
              } else {
                listProduct[index].quantityItems =
                  listProduct[index].quantityItems - gam.toRemove * quantity;
              }
            } else {
              console.log('not found');
              notExist.push(gam);
            }
            //  });
          });
        }

        let price = data.data['prix'];
        gamme['sellingPrice'] = price;
        gamme.removeProductList = this.gammeService.getRemoveProductList();
        gamme.addProductList = this.gammeService.getaddProductList();
        if (notExist.length) {
          this.notification.cancelSale(notExist);
        } else if (!autorisation) {
          this.notification.cancelSale(notFound);
          return;
        } else {
          for (let index = 0; index < quantity; index++) {
            if (newGamme.length) {
              gamme['productList'] = data.data['gamme']['productList'];
              await this.addGammeToCart(gamme);
            } else {
              gamme['productList'] = data.data['gamme']['productList'];
              await this.addGammeToCart(gamme);
            }
          }
          console.log('=====end here===');
        }
      }
    });
    return await modal.present();
  }

  addGammeToCart(gamme: Gamme) {
    return new Promise((resolve, reject) => {
      this.cartValue = this.restApiService.getCart2();

      if (this.cartValue && this.cartValue['cart']) {
        let data = {};
        data['product'] = gamme;
        data['cart'] = this.cartValue['cart'];
        let cart = this.manageCartService.addToCart(data);

        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];

        // console.log("resto", tab[0]);
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });

        if (gamme['nbr']) {
          gamme['nbr'] = gamme['nbr'] + 1;
        } else {
          gamme['nbr'] = 1;
        }
        resolve(gamme);
      } else {
        let cart = this.manageCartService.addToCart(gamme);
        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });

        if (gamme['nbr']) {
          gamme['nbr'] = gamme['nbr'] + 1;
        } else {
          gamme['nbr'] = 1;
        }
        resolve(gamme);
      }
    });
  }

  async removeIn(prod) {
    console.log(prod);

    if (prod.nbr > 0) {
      prod.nbr = prod.nbr - 1;
    }

    if (prod.nbr == 0) {
      prod.nbr = 0;
    }

    if (prod.productType == 'Gamme') {
      let listProduct: Product[] = [];
      this.productListTab.forEach((arr: Product[]) => {
        listProduct = [...listProduct, ...arr];
      });

      if (prod['productList']) {
        let tab: Product[] = prod['productList'];
        tab.forEach((product) => {
          let index = listProduct.findIndex((pro) => {
            return pro._id == product._id;
          });
          if (index >= 0) {
            listProduct[index].quantityStore =
              listProduct[index].quantityStore + 1;
          }
        });
      }
    } else {
      setTimeout(() => {
        this.removeOneItem(prod);
        prod['quantityStore'] = prod['quantityStore'] + 1;
      }, 500);
    }

    //  console.log(this.numPlatRandom);
  }

  async removeOneItem(prod, randomId?) {
    let data = this.restApiService.getCart2();
    let result;
    console.log('shop page.ts 1137 ===>', prod);
    if (randomId) {
      result = this.manageCartService.removeOneToCart(
        prod._id,
        data['cart'],
        randomId
      );
    } else {
      result = this.manageCartService.removeOneToCart(prod._id, data['cart']);
    }
    console.log('shop page.ts 1146 ===>', result);

    this.totalItems = result['cart']['totalQty'];
    this.totalPrice = result['cart']['totalPrice'];
    this.restApiService.saveCart({
      cart: result['cart'],
      products: result['cart'].generateArray(),
    });
  }

  calculGrammage(val, prod) {
    /* console.log(ev.detail.value);
    console.log(prod);
    console.log(this.restApiService.getCart2());*/
    //let nbr = parseInt(ev.detail.value);
    let nbr = parseInt(val);
    if (nbr) {
      delete this.randomObj[prod._id];
      prod['grammage'] = prod.toSale * nbr;
      this.randomObj[prod._id] = prod;
    } else {
      // prod['grammage'] = 0;
      delete this.randomObj[prod._id];
    }
    this.generateArrayManagerMode();
  }

  generateArrayManagerMode() {
    let a = 0;
    for (var id in this.randomObj) {
      if (this.randomObj[id]['grammage']) {
        a = a + this.randomObj[id]['grammage'];
      }
    }
    this.grammage = a;
    this.saveRandom.setGrammage(this.grammage);
    if (this.saveRandom.getZone) {
      // this.saveRandom.calculDhl(this.setting);
    }
  }
  selectZone(ev) {
    console.log(ev.detail.value);
    let zone = this.zoneList.find((z) => z.name == ev.detail.value);
    console.log(zone);
    this.saveRandom.setZone(zone);
  }
}
