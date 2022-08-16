import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
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
import { CartPage } from '../cart/cart.page';
import { Router } from '@angular/router';
import { ManageCartService } from '../services/manage-cart.service';
import { CountItemsService } from '../services/count-items.service';
import { TranslateConfigService } from '../translate-config.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../services/admin.service';
import { UrlService } from '../services/url.service';
import { ScreensizeService } from '../services/screensize.service';
import { Productmanager } from '../manage-cart/manageProducts';
import { CatService } from '../services/cat.service';
import { groupBy, mergeMap, toArray, takeUntil, map } from 'rxjs/operators';
import {
  from,
  BehaviorSubject,
  Observable,
  Subject,
  zip,
  interval,
} from 'rxjs';
import { OfflineManagerService } from '../services/offline-manager.service';
import { MyeventsService } from '../services/myevents.service';
import { HTTP } from '@ionic-native/http/ngx';
import { NotificationService } from '../services/notification.service';
import { ResourcesService } from '../services/resources.service';
import { RangeByStoreService } from '../services/range-by-store.service';
import { ManagesocketService } from '../services/managesocket.service';
import { GroupByCategorieService } from '../services/group-by-categorie.service';
import { CachingService } from '../services/caching.service';
import { SaverandomService } from '../services/saverandom.service';
import { ConvertToPackService } from '../services/convert-to-pack.service';
import { RetailerPriceService } from '../services/retailer-price.service';
import { GammeService } from '../services/gamme.service';
import { Gamme } from '../models/gamme.model';
import { GammeBeforeSalePage } from '../gamme/gamme-before-sale/gamme-before-sale.page';
import { Product } from '../models/product.model';
import { TranslateService } from '@ngx-translate/core';
import { Setting } from '../models/setting.models';
import { ConfirmPage } from '../modals/confirm/confirm.page';
import { AuthServiceService } from '../services/auth-service.service';
import { MakechangePage } from '../modals/makechange/makechange.page';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  @ViewChild('mySlider') slides: IonSlides;
  @ViewChildren('itemlist', { read: ElementRef }) items: any;
  @ViewChild('slideWithNav', { static: false }) slideWithNav: any;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChildren('lastSlide') lastSlide: QueryList<any>;
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
  gammeListTab: Gamme[];
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
    public saveRandom: SaverandomService,
    private convert: ConvertToPackService,
    private retailerPrice: RetailerPriceService,
    private gammeService: GammeService,
    public translate: TranslateService,
    private notifi: NotificationService,
    public authService: AuthServiceService
  ) {
    this.setting = this.saveRandom.getSetting();
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

    // this.networkService.initializeNetworkEvents();
    this.checkCart();
    this.takeUrl();

    if (JSON.parse(localStorage.getItem('user'))['name']) {
      this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    }

    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(5) ||
      this.tabRoles.includes(4) ||
      this.tabRoles.includes(2)
    ) {
    } else {
      this.router.navigateByUrl('Login');
    }

    if (this.tabRoles.includes(4) || this.tabRoles.includes(2)) {
      this.pos = true;
    }

    this.languageChanged();

    if (this.tabRoles.includes(5)) {
      this.takeCashOpen();
    } else {
      this.takeCashOpen();
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

  ngAfterViewInit() {
    this.spinner = false;
    this.lastSlide.changes.pipe(takeUntil(this.destroy$)).subscribe((t) => {
      if (t._changesDetected) {
        setTimeout(() => {
          this.notification.dismissLoading();
          setTimeout(() => {
            this.spinner = true;
            this.navSlide = true;
          }, 3000);
        }, 500);
        setTimeout(() => {
          this.isLoad = true;
        }, 5000);
      }
    });
  }
  ionViewWillEnter() {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.saleToRetailer = this.saveRandom.checkIfIsRetailer();
    if (localStorage.getItem('addFlag')) {
      this.flagAdd = localStorage.getItem('addFlag');
    }
    this.events
      .addOneProduct()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          if (data['item']) {
            if (data['mode']) {
              this.buyItem(data['item'], data['store'], data['mode']);
            } else {
              if (data['item']['quantityStore'] <= 0) {
                if (this.saveRandom.getSetting().check_service_quantity) {
                  let a: any = {};
                  this.translate.get('MENU.not_enough').subscribe((t) => {
                    a['message'] = t;
                  });
                  this.notification.presentError(a['message'], 'danger');
                  return;
                }
              } else {
                if (data['item'].productType == 'billard') {
                  this.buyItemGame(data['item']);
                } else if (data['item'].productType == 'shoplist') {
                  this.buyItemProList(data['item']);
                } else if (data['item'].productType == 'manufacturedItems') {
                  this.buyItemResto(data['item'], data['item']['index']);
                }
              }
            }
          }
        },
        (err) => {
          //  this.events.addOneProduct().unsubscribe();
        }
      );
    this.events
      .removeOneProduct()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data['item']) {
          if (data['mode']) {
            this.removeOne(data['item'], data['mode']);
          } else {
            console.log('shop page ligne 361', data['item']);

            this.removeOne(data['item']);
          }
        }
      });

    if (this.tabRoles.includes(5)) {
      this.getSettins();
    } else {
      this.getCustomerItems();
    }
    this.getTransaction();
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
      this.takeProduct();
    }

    if (
      this.storeTypeTab.includes('services') ||
      this.storeTypeTab.includes('produits')
    ) {
      this.takeGame();
      setTimeout(() => {
        //  this.takeGame();
      }, 1500);
    }

    if (this.storeTypeTab.includes('shop')) {
      if (this.storeTypeTab.length == 1) {
        this.takeProductListShop(true);
      } else {
        setTimeout(() => {
          this.takeProductListShop();
        }, 1500);
      }
    }
    if (
      this.storeTypeTab.includes('resto') &&
      this.storeTypeTab.includes('bar')
    ) {
      setTimeout(() => {
        this.takeProductResto();
      }, 3000);
    } else {
      this.takeProductResto();
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
    if (localStorage.getItem('addFlag')) {
      this.numFacture = JSON.parse(localStorage.getItem('order'))['numFacture'];

      this.flagAdd = localStorage.getItem('addFlag');
    }
  }

  cancelAdd() {
    localStorage.removeItem('order');
    localStorage.removeItem('addFlag');
    this.flagAdd = false;
  }
  getSettins() {
    this.adminService
      .getCompanySetting()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          if (this.tabRoles.includes(5)) {
            if (data['company'][0]['use_gamme']) {
              this.storeTypeTab.push('Gamme');
            }

            if (data['company'][0]['SaleInPack']) {
              this.checkPack = true;
              localStorage.setItem('saleAsPack', 'true');
            } else {
              this.checkPack = false;
            }

            this.storeTypeTab = JSON.parse(localStorage.getItem('adminUser'))[
              'storeType'
            ];
            this.pet = this.storeTypeTab[0];
            if (this.storeTypeTab.includes('bar')) {
              this.takeProduct();
            }
            if (data['company']['use_gamme']) {
              this.storeTypeTab.push('Gammes');
              this.getAllGamme();
            }

            if (this.storeTypeTab.includes('services')) {
              setTimeout(() => {
                this.takeGame();
              }, 1500);
            }

            if (this.storeTypeTab.includes('shop')) {
              setTimeout(() => {
                this.takeProductListShop();
              }, 1500);
            }
            if (
              this.storeTypeTab.includes('resto') &&
              this.storeTypeTab.includes('bar')
            ) {
              setTimeout(() => {
                this.takeProductResto();
              }, 3000);
            } else {
              this.takeProductResto();
            }

            if (localStorage.getItem('addFlag')) {
              this.numFacture = JSON.parse(localStorage.getItem('order'))[
                'numFacture'
              ];

              this.flagAdd = localStorage.getItem('addFlag');
            }
          }

          let mac = null;
          let company = data['company'][0];
          localStorage.setItem('setting', JSON.stringify(company));
          if (company['macServer']) {
            mac = company['macServer'];
            localStorage.setItem('mac', mac);
          }

          if (company.use_wifi) {
            this.urlService.useWifiIp(company);
          } else if (company.use_desktop) {
            this.urlService.useDesktop(company);
          } else if (company['macServer']) {
            this.urlService.useLocalServer(mac);
          } else {
            this.notification.presentError(
              'please provide the configuration to use local server',
              'warning'
            );
          }
          this.autorisationNumber = 0;
          this.cacheService.cacheRequest('MySettings', data);
        },
        (err) => {
          this.cacheService.getCachedRequest('MySettings').then((data) => {
            if (data) {
              this.settingOfflineMode(data);
            }
          });
        }
      );
  }

  takeCashOpen() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.adminService.getOpenCashFromPointOfSale(storeId).subscribe((data) => {
      if (data['docs'].length) {
        //console.log("hello");
        this.getCategories();
        this.openCashDate = data['docs'][0]['openDate'];
        localStorage.setItem('openCashDate', this.openCashDate);
        localStorage.setItem(
          'openCashDateObj',
          JSON.stringify(data['docs'][0])
        );
      } else {
        this.cashDateAlert();
      }
    });
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
      sockets.on(`${this.adminId}productItem`, (data) => {
        setTimeout(async () => {
          if (data && data['_id']) {
            if (this.checkPack) {
              data = await this.convert.convertSingleProduct(data);
            }
            let index = await this.allUserProducts.findIndex((prod) => {
              return prod._id === data['_id'];
            });
            if (index >= 0) {
              let urlp = this.allUserProducts[index]['url'];
              this.allUserProducts.splice(index, 1, data);
              this.allUserProducts[index]['url'] = urlp;
            }

            let storeValue = await this.cacheService.getCachedRequest(
              'MyProductItems'
            );

            if (storeValue) {
              // storeValue.forEach(async (elt) => {
              let index = await storeValue.findIndex((prod) => {
                return prod._id === data['_id'];
              });
              if (index >= 0) {
                let urlp = storeValue[index]['url'];
                storeValue.splice(index, 1, data);
                storeValue[index]['url'] = urlp;
              }
              // });
              await this.cacheService.cacheRequest(
                'MyProductItems',
                storeValue
              );
            }
          }
        }, 1000);
      });
      sockets.on(`${id}newBill`, (data) => {
        this.takeProductResto();
        let userName = JSON.parse(localStorage.getItem('user'))['name'];
        let billTab = JSON.parse(localStorage.getItem(`allBill`));
        let openCashDateId = JSON.parse(
          localStorage.getItem('openCashDateObj')
        )['_id'];

        if (data['userName'] == userName) {
          if (billTab && billTab.length) {
            let index = billTab.findIndex((elt) => {
              return elt.localId === data['localId'];
            });
            if (index >= 0) {
            } else {
              billTab.push(data);
              localStorage.setItem(`allBill`, JSON.stringify(billTab));
            }
          } else {
            let tab = [];
            tab.push(data);
            localStorage.setItem(`allBill`, JSON.stringify(tab));
          }
        }
      });
      sockets.on(`${id}newSetting`, (data) => {
        setTimeout(() => {
          this.cacheService.getCachedRequest('MySettings').then((result) => {
            if (result) {
              result['company'][0] = data;
              this.cacheService.cacheRequest('MySettings', result);
            }
          });
          this.urlService.useWifiIp(data);
        }, 2000);
      });

      sockets.on(`${id}productItemGlace`, async (data) => {
        if (data && data['_id']) {
          let index = await this.allUserProducts.findIndex((prod) => {
            return prod._id === data['_id'];
          });
          if (index >= 0) {
            let urlp = this.allUserProducts[index]['url'];
            this.allUserProducts.splice(index, 1, data);
            this.allUserProducts[index]['url'] = urlp;
          }

          let storeValue = await this.cacheService.getCachedRequest(
            'MyProductItems'
          );
          if (storeValue) {
            //storeValue.forEach(async (elt) => {
            let index = await storeValue.findIndex((prod) => {
              return prod._id === data['_id'];
            });
            if (index >= 0) {
              let urlp = storeValue[index]['url'];
              storeValue.splice(index, 1, data);
              storeValue[index]['url'] = urlp;
            }
            // });
            await this.cacheService.cacheRequest('MyProductItems', storeValue);
          }
        }
      });

      //localStorage;
      sockets.on(`${id}productItemToShop`, async (data) => {
        if (data && data['_id']) {
          let index = await this.allUserProducts.findIndex((prod) => {
            return prod._id === data['_id'];
          });
          if (index >= 0) {
            let urlp = this.allUserProducts[index]['url'];
            this.allUserProducts.splice(index, 1, data);
            this.allUserProducts[index]['url'] = urlp;
          }

          let storeValue = await this.cacheService.getCachedRequest(
            'MyProductItems'
          );

          if (storeValue) {
            // storeValue.forEach(async (elt) => {
            let index = await storeValue.findIndex((prod) => {
              return prod._id === data['_id'];
            });
            if (index >= 0) {
              let urlp = storeValue[index]['url'];
              storeValue.splice(index, 1, data);
              storeValue[index]['url'] = urlp;
            }
            // });
            await this.cacheService.cacheRequest('MyProductItems', storeValue);
          }
        }
      });

      sockets.on(`${id}manufacturedItem`, async (data) => {
        if (data && data['_id']) {
          let index = await this.productResto.findIndex((elt) => {
            return elt._id === data['_id'];
          });
          // this.productResto.splice(index, 1, data);
          let urlp = this.productResto[index]['url'];
          this.productResto.splice(index, 1, data);
          this.productResto[index]['url'] = urlp;
          this.productResto2 = await this.groupByService.groupArticles(
            this.productResto
          );
        }
      });
      sockets.on(`${this.adminId}productlist`, (data) => {
        this.productList.forEach((arr) => {
          if (arr[0]['categoryName'] == data['categoryName']) {
            let index = arr.findIndex((elt) => {
              return elt._id === data['_id'];
            });
            if (index >= 0) {
              arr.splice(index, 1, data);
            }
          }
        });
      });

      sockets.on(`${this.adminId}billardItem`, (data) => {
        if (this.randomList.length) {
          this.productListTab = this.randomList;
        }

        this.productListTab.forEach((arr) => {
          if (arr[0]['categoryName'] == data['categoryName']) {
            let index = arr.findIndex((elt) => {
              return elt._id === data['_id'];
            });
            if (index >= 0) {
              data['url'] = arr[index]['url'];
              arr.splice(index, 1, data);
            }
          }
        });
      });
      sockets.on(`${this.adminId}${storeId}billardItem`, (data) => {
        if (this.randomList.length) {
          this.productListTab = this.randomList;
        }

        this.productListTab.forEach((arr) => {
          if (arr[0]['categoryName'] == data['categoryName']) {
            let index = arr.findIndex((elt) => {
              return elt._id === data['_id'];
            });
            if (index >= 0) {
              data['url'] = arr[index]['url'];
              arr.splice(index, 1, data);
            }
          }
        });
      });
      sockets.on(`${this.adminId}${storeId}cashOpen`, (data) => {
        this.takeCashOpen();
      });

      sockets.on(`${this.adminId}${storeId}cashClose`, (data) => {
        if (this.tabRoles.includes(5)) {
          this.cacheService.cacheRequest(`invoicePaie`, []);
          this.router.navigateByUrl('Login');
          this.notification.presentToast('CASH IS CLOSE!', 'warning');
        } else {
        }
      });
      sockets.on(`${id}transactionNewItem`, (data) => {
        this.notifi.presentToast('you have new notification', 'danger');
        this.transaction.unshift(data['data']);
      });
      sockets.on(`${id}employeAdd`, (data) => {
        this.takeEmployees();
      });
    });
  }

  takeEmployees() {
    this.authService.getEmployees().subscribe((data) => {
      let arr = data['employes'].sort((c, b) => (c.name > b.name ? 1 : -1));
      this.saveRandom.setEmployeList(arr);
    });
  }

  async takeProduct() {
    this.notification.presentLoading();
    let storeValue = null;
    try {
      storeValue = await this.cacheService.getCachedRequest('MyProductItems');
      console.log('store', storeValue);
    } catch (error) {
      storeValue = null;
    }
    if (storeValue) {
      this.allUserProducts = storeValue;
      this.allUserProductsList = storeValue;
      this.notification.dismissLoading();
    }
    this.restApiService
      .getProductItemData()
      /*  .pipe(
        map((elt) => {
          this.allUserProducts = elt;
          return elt;
        }),
        mergeMap((v) =>
          from(v).pipe(
            groupBy((task) => task['produceBy']),
            mergeMap((group) => group.pipe(toArray()))
          )
        )
      ) */
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (data: any[]) => {
          this.spinner = true;
          this.isLoad = true;
          this.allUserProducts = data;
          this.notification.dismissLoading();
          this.handleProductItem(data);
        },
        (err) => {}
      );
    if (storeValue) {
    } else {
      /* this.restApiService
        .getProductItemGroup()
        .pipe(
          map((elt) => {
            this.allUserProducts = elt;
            return elt;
          }),
          mergeMap((v) =>
            from(v).pipe(
              groupBy((task) => task['produceBy']),
              mergeMap((group) => group.pipe(toArray()))
            )
          )
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async (data: any[]) => {
            this.handleProductItem(data);
          },
          (err) => {}
        );*/
    }
  }
  async handleProductItem(data) {
    let tabl = [];
    //let a = data.sort((c, b) => (c.categoryName > b.categoryName ? 1 : -1));
    let a = data;

    if (this.saveRandom.checkIfIsRetailer()) {
      let retailer = this.saveRandom.getRetailer();

      let retailerProd = retailer['productsToSale'];

      a = await this.retailerPrice.converToRetailerPrice(retailerProd, a);
    }
    if (this.checkPack) {
      this.saleToPack = true;
      a = await this.convert.convertToPack(a);
    }
    this.allUserProducts = a;
    this.allUserProductsList = a;
    this.tab.push(a);
    this.userProducts = this.tab;
    this.products = [];
    if (this.userProducts.length) {
      // this.categories.forEach((cat) => {});
    }

    this.choise = 'boisson';

    /* this.userProducts.forEach(async (arr) => {
      this.group = await arr.reduce((r, a) => {
        r[a.categoryName] = [...(r[a.categoryName] || []), a];
        return r;
      }, {});
      arr = [];

      for (const property in this.group) {
        arr.push(this.group[property]);
      }

      let i = tabl.length;
      tabl[i] = arr;
    });

    this.userProducts2 = await tabl; */
    this.cacheService.cacheRequest('MyProductItems', this.allUserProducts);
  }
  fireSlide(slideView) {
    this.content.scrollToTop();
  }
  goToNextSlide() {
    this.slides.slideNext();
  }
  backToNextSlide() {
    this.slides.slidePrev();
  }

  async takeProductResto() {
    // this.notification.presentLoading();
    console.log('url event for request', this.urlEvent);

    let group;
    let tabl = [];
    let cacheData = await this.cacheService
      .getCachedRequest('productsResto')
      .catch((err) => {
        this.restApiService
          .getManufacturedProductItemResto3(this.urlEvent)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            async (data) => {
              let arr = [];
              //  this.productResto2 = await data;
              this.productResto = data;
              arr = await this.groupByService.groupArticles(data);
              this.productResto2 = arr;
              return this.cacheService.cacheRequest(
                'productsResto',
                this.productResto2
              );
            },
            (err) => {}
          );
      });
    if (cacheData && cacheData.length) {
      this.productResto = [];
      this.productResto2 = cacheData;
      this.productResto2.forEach((arr) => {
        this.productResto = [...this.productResto, ...arr];
      });

      this.restApiService
        .getManufacturedProductItemResto3(this.urlEvent)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async (data) => {
            let arr = [];
            //  this.productResto2 = await data;
            this.productResto = data;
            arr = await this.groupByService.groupArticles(data);
            this.productResto2 = arr;
            return this.cacheService.cacheRequest(
              'productsResto',
              this.productResto2
            );
          },
          (err) => {}
        );
    } else {
      this.restApiService
        .getManufacturedProductItemResto3(this.urlEvent)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async (data) => {
            let arr = [];
            //  this.productResto2 = await data;
            this.productResto = data;
            arr = await this.groupByService.groupArticles(data);
            this.productResto2 = arr;
            return this.cacheService.cacheRequest(
              'productsResto',
              this.productResto2
            );
          },
          (err) => {}
        );
    }
  }

  async removeOne(prod, mode?) {
    // return;
    if (mode === 'modeG') {
      if (prod.modeG <= 0) {
        return;
      }
      prod.modeG = prod.modeG - 1;
      prod.glace++;
      prod.quantityStore++;
      this.removeOneItem(prod);
    } else if (mode === 'modeNG') {
      if (prod.modeNG <= 0) {
        return;
      }
      prod.modeNG = prod.modeNG - 1;
      prod.quantityStore++;
      this.removeOneItem(prod);
    } else if (mode === 'CA') {
      if (prod.CA <= 0) {
        return;
      }
      prod.CA = prod.CA - 1;
      prod.cassierStore = prod.cassierStore + 1;
      this.removeOneCA(prod);
    } else if (mode === 'BTL') {
      if (prod.BTL <= 0) {
        return;
      }
      prod.BTL = prod.BTL - 1;
      prod.btlsStore = prod.btlsStore + 1;
      let prodId = prod._id;
      this.removeOneItem(prod, prodId);
    } else {
      console.log('aucun mode');

      this.removeIn(prod['item']);
    }
  }

  async buyOne(prod, mode?) {
    // return;
    if (mode === 'modeG') {
      if (prod.modeG <= 0) {
        return;
      }
      prod.modeG = prod.modeG + 1;
      prod.glace = prod.glace - 1;
      prod.quantityStore = prod.quantityStore - 1;
    } else if (mode === 'modeNG') {
      if (prod.modeNG <= 0) {
        return;
      }
      prod.modeNG = prod.modeNG + 1;
      prod.quantityStore = prod.quantityStore - 1;
    } else if (mode === 'CA') {
      if (prod.CA <= 0) {
        return;
      }
      prod.CA = prod.CA + 1;
      prod.cassierStore = prod.cassierStore - 1;
      this.addOneCA(prod);
    } else if (mode === 'BTL') {
      if (prod.BTL <= 0) {
        return;
      }
      prod.BTL = prod.BTL + 1;
      prod.btlsStore = prod.btlsStore - 1;
      let randomId = prod._id + 'BTL' + prod._id;
      this.addOneSpecificItme(prod, randomId);
    } else {
      prod.quantityStore--;
      if (prod['nbr']) {
        prod['nbr'] = prod['nbr'] + 1;
      }
      if (prod['qty']) {
        prod['qty'] = prod['qty'] + 1;
      }
      this.removeOneItem(prod);
    }
  }

  async buyItem(prod, store?, mode?) {
    // let this.checkPack = await this.saveRandom.checkIfUsePack();
    console.log(prod);
    if (this.checkPack && prod.sellingPackPrice == 1) {
      this.notification.presentToast(
        'please provide selling pack price for this product after you use it, contact your admin company',
        'danger'
      );
      return;
    }
    if (
      store <= 0 &&
      prod.resourceList.length <= 0 &&
      this.saveRandom.getSetting().check_bar_quantity
    ) {
      this.showPresentAlert();
      return;
    }
    if (mode == 'BTL') {
      prod['orientationBTL'] = 'BTL';
      prod['orientationCA'] = null;
    } else if (mode == 'CA') {
      prod['orientationCA'] = 'CA';
      prod['orientationBTL'] = null;
    }
    if (
      prod.glace &&
      store == prod.glace &&
      mode === 'NG' &&
      prod.resourceList.length <= 0 &&
      this.saveRandom.getSetting().check_bar_quantity
    ) {
      this.showPresentAlert();
      return;
    }

    if (prod.resourceList.length) {
      let verificateur = await this.checkIfAvaible(prod);

      if (verificateur.includes(false)) {
        this.showPresentAlert(this.tabNotif);
        return;
      }
    }

    let productsManager = new Productmanager(prod);
    let result = productsManager.add(mode);

    if (result !== undefined) {
      prod['modeNG'] = result.modeNG;
      prod['modeG'] = result.modeG;
      prod['nonglace'] = result.nonglace;
      prod['glace'] = result.glace;
      prod['quantityStore'] = result.quantityStore;
      prod['CA'] = result.CA;
      prod['BTL'] = result.BTL;
      prod['cassierStore'] = result.cassierStore;
      prod['btlsStore'] = result.btlsStore;

      this.incremente(prod);
    } else {
    }
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

  async removeOneCA(prod) {
    let data = this.restApiService.getCart2();
    let result;

    result = await this.manageCartService.removeOneCaToCart(
      prod._id,
      data['cart']
    );

    this.totalItems = result['cart']['totalQty'];
    this.totalPrice = result['cart']['totalPrice'];
    this.restApiService.saveCart({
      cart: result['cart'],
      products: result['cart'].generateArray(),
    });
  }

  async addOneCA(prod) {
    let data = this.restApiService.getCart2();
    let result;

    result = await this.manageCartService.addOneCaToCart(
      prod._id,
      data['cart']
    );

    this.totalItems = result['cart']['totalQty'];
    this.totalPrice = result['cart']['totalPrice'];
    this.restApiService.saveCart({
      cart: result['cart'],
      products: result['cart'].generateArray(),
    });
  }

  async addOneSpecificItme(prod, randomId) {
    let data = this.restApiService.getCart2();
    let result;

    result = await this.manageCartService.addOneSpecific(prod, randomId);

    this.totalItems = result['cart']['totalQty'];
    this.totalPrice = result['cart']['totalPrice'];
    this.restApiService.saveCart({
      cart: result['cart'],
      products: result['cart'].generateArray(),
    });
  }

  /*getion des produit du resto*/
  async changeNumTable(num?) {
    this.productResto.forEach((elt) => {
      elt.nbr = 0;
    });
    this.productResto2 = await this.groupByService.groupArticles(
      this.productResto
    );
    // this.numPlat = this.numPlat + 1;
    this.numPlat = this.plalist.length + 1;
    this.numPlatRandom = this.numPlat;

    this.plalist.push(this.numPlat);
    let i;
    for (i = 0; i < this.items['_results'].length; i++) {
      this.items['_results'][i].nativeElement.classList.remove('platActif');
    }

    let j = this.items['_results'].length - 1;
    setTimeout(() => {
      this.items['_results'][j + 1].nativeElement.classList.add('platActif');
    }, 300);
  }

  async showPlat(numPlat, j) {
    let i;
    for (i = 0; i < this.items['_results'].length; i++) {
      this.items['_results'][i].nativeElement.classList.remove('platActif');
    }
    this.items['_results'][j].nativeElement.classList.add('platActif');
    let tab = [];
    // console.log(this.plat);
    this.numPlatRandom = numPlat;
    this.numPlat = numPlat;
    this.plat.forEach((elt) => {
      if (elt.plat == numPlat && elt.nbr > 0) {
        tab.push(elt.produit);
      }
    });
    this.productResto.forEach((prod) => {
      prod.nbr = 0;
      this.plat.forEach((elt) => {
        if (
          elt.plat == numPlat &&
          elt.nbr > 0 &&
          elt.produit['_id'] == prod['_id']
        ) {
          prod.nbr = elt.nbr;
        }
      });
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

  async removeInPlat(prod, i) {
    if (prod.nbr > 0) {
      prod.nbr = prod.nbr - 1;
    }

    if (prod.nbr == 0) {
      prod.nbr = 0;
    }

    setTimeout(() => {
      this.removeOneItem(prod);
    }, 500);
    //  console.log(this.numPlatRandom);
    this.plat.forEach((elt) => {
      if (elt.plat == this.numPlatRandom && elt.produit['_id'] == prod['_id']) {
        elt.nbr = elt.nbr - 1;
      }
    });
  }
  async buyItemResto(prod, i) {
    prod['index'] = i;
    console.log(prod);

    if (prod.resourceList && prod.resourceList.length) {
      let verificateur = await this.checkIfAvaible(prod);

      if (verificateur.includes(false)) {
        this.showPresentAlert(this.tabNotif);
        return;
      }
    }
    let index = this.plat.findIndex((elt) => {
      return elt.plat == this.numPlat && elt['produit']['_id'] == prod['_id'];
    });

    if (index >= 0) {
      let nbr = this.plat[index]['nbr'] + 1;
      if (prod['nbr']) {
        prod['nbr'] = prod['nbr'] + 1;
      } else {
        prod['nbr'] = 1;
      }

      this.plat.splice(index, 1, {
        plat: this.numPlat,
        produit: prod,
        nbr: prod['nbr'],
      });
    } else {
      prod['nbr'] = 1;
      this.plat.push({ plat: this.numPlat, produit: prod, nbr: 1 });
    }

    let id = prod._id;
    this.cartValue = this.restApiService.getCart2();
    //  console.log("la valeur du cart", this.cartValue);
    if (this.Itemprice - this.Reduction <= 100) {
      this.presentAlert();
    } else if (this.Itemprice > 0 && this.Itemprice - this.Reduction > 100) {
    } else {
      // console.log(prod);
      if (this.cartValue && this.cartValue['cart']) {
        let data = {};
        data['product'] = prod;
        data['cart'] = this.cartValue['cart'];
        let cart = this.manageCartService.addToCart(data);
        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
        let tab2 = this.countItemsService.getQtyItems(
          this.productResto,
          cart.generateArray(),
          prod
        );

        let index = this.productResto2[i].findIndex((elt) => {
          return elt._id == prod['_id'];
        });
        if (index >= 0) {
          this.productResto2[i].splice(index, 1, prod);
        }

        /* this.productResto2 = await this.groupByService.groupArticles(
          this.productResto
        );*/
      } else {
        let cart = this.manageCartService.addToCart(prod);

        this.totalItems = cart['totalQty'];
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

        this.productResto = tab;

        let index = this.productResto2[i].findIndex((elt) => {
          return elt._id == prod['_id'];
        });
        if (index >= 0) {
          this.productResto2[i].splice(index, 1, prod);
        }
        /* this.productResto2 = await this.groupByService.groupArticles(
          this.productResto
        );*/
      }
    }
  }

  async buyItemGame(prod, change?, type?) {
    let id = prod._id;
    let obj = {};

    if (this.saveRandom.getVoucher() && !this.checkVoucher(prod)) {
      // this.translate.get('')
      this.notification.presentAlert(
        `Le montant des achats ne doit pas depasser ${
          this.saveRandom.getVoucher().price
        }`
      );
      return;
    }
    if (prod.resourceList && prod.resourceList.length) {
      let verificateur = await this.checkIfAvaible(prod);

      if (verificateur.includes(false)) {
        this.showPresentAlert(this.tabNotif);
        return;
      }
    }

    if (prod['quantityStore'] <= 0 && !prod['_id'].endsWith('vide')) {
      if (prod.productType == 'shoplist') {
        if (this.saveRandom.getSetting().check_List_quantity) {
          let a: any = {};
          this.translate.get('MENU.not_enough').subscribe((t) => {
            a['message'] = t;
          });
          this.notification.presentError(a['message'], 'danger');
          return;
        }
      } else if (prod.productType == 'billard') {
        if (this.saveRandom.getSetting().check_service_quantity) {
          let a: any = {};
          this.translate.get('MENU.not_enough').subscribe((t) => {
            a['message'] = t;
          });
          this.notification.presentError(a['message'], 'danger');
          return;
        }
      }
    }
    if (prod['_id'].endsWith('vide') && prod['bottle_empty'] <= 0) {
      if (this.saveRandom.getSetting().check_service_quantity) {
        let a: any = {};
        this.translate.get('MENU.not_enough').subscribe((t) => {
          a['message'] = t;
        });
        this.notification.presentError(a['message'], 'danger');
        return;
      }
    }

    if (change) {
    }

    this.cartValue = this.restApiService.getCart2();
    if (prod['_id'].endsWith('vide')) {
      prod['status'] = 'vide';
      if (this.cartValue && this.cartValue['cart']) {
        let data = {};
        data['product'] = prod;
        data['cart'] = this.cartValue['cart'];
        let cart = this.manageCartService.addToCart(data);

        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
        let tab2 = this.countItemsService.getQtyItems(
          this.productsGame,
          cart.generateArray(),
          prod
        );
        if (prod['nbr']) {
          prod['nbr'] = prod['nbr'] + 1;
        } else {
          prod['nbr'] = 1;
        }
        this.productsGame = tab2;
        prod['bottle_empty'] = prod['bottle_empty'] - 1;
      } else {
        let cart = this.manageCartService.addToCart(prod);
        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
        let tab = this.countItemsService.getQtyItems(
          this.productsGame,
          cart.generateArray(),
          prod
        );

        this.productsGame = tab;
        if (prod['nbr']) {
          prod['nbr'] = prod['nbr'] + 1;
        } else {
          prod['nbr'] = 1;
        }
        prod['bottle_empty'] = prod['bottle_empty'] - 1;
      }
    } else if (prod['quantityStore'] > 0 || prod['productType'] == 'billard') {
      if (this.cartValue && this.cartValue['cart']) {
        let data = {};
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
        let tab2 = this.countItemsService.getQtyItems(
          this.productsGame,
          cart.generateArray(),
          prod
        );
        if (prod['nbr']) {
          prod['nbr'] = prod['nbr'] + 1;
        } else {
          prod['nbr'] = 1;
        }
        this.productsGame = tab2;
        if (parseInt(prod['quantityStore'])) {
          prod['quantityStore'] = parseInt(prod['quantityStore']);
        }

        if (prod['quantityStore'] > 0) {
          prod['quantityStore'] = prod['quantityStore'] - 1;
        }
      } else {
        let cart = this.manageCartService.addToCart(prod);
        this.totalItems = cart['totalQty'];
        this.totalPrice = cart['totalPrice'];
        this.restApiService.saveCart({
          cart: cart,
          products: cart.generateArray(),
        });
        let tab = this.countItemsService.getQtyItems(
          this.productsGame,
          cart.generateArray(),
          prod
        );

        this.productsGame = tab;
        if (prod['nbr']) {
          prod['nbr'] = prod['nbr'] + 1;
        } else {
          prod['nbr'] = 1;
        }
        if (prod['quantityStore'] > 0) {
          prod['quantityStore'] = prod['quantityStore'] - 1;
        }
      }
    } else {
      console.log('====', prod);
      this.showPresentAlert();
    }
  }
  // naviguer entre les categories
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

  logScrollStart() {
    // console.log('start svrol');
  }
  logScrollEnd() {
    // console.log('start svrol');
  }
  async logScrolling($event) {
    // const scrollElement = await $event.target.getScrollElement();
    // console.log({ scrollElement });
  }

  buyPack(pack) {
    //_id ici est celui du packitems a partir du quel il
    // a été cré

    this.cartValue = this.restApiService.getCart2();
    if (this.cartValue) {
      let data = {};
      data['product'] = pack;
      data['cart'] = this.cartValue['cart'];
      let cart = this.manageCartService.addToCart(data);

      this.totalItems = cart['totalQty'];
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    } else {
      let cart = this.manageCartService.addToCart(pack);

      this.totalItems = cart['totalQty'];
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    }
  }

  getCart() {
    this.cartValue = this.restApiService.getCart();
  }

  displayCart() {
    this.navCtrl.navigateForward('cart');
  }

  async openCart() {
    this.notification.presentLoading();
    if (this.plat.length) {
      localStorage.setItem('plat', JSON.stringify(this.plat));
    } else {
      localStorage.setItem('plat', JSON.stringify([]));
    }
    const modal = await this.modalController.create({
      component: CartPage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(async (data) => {
      if (data['data'] && data['data']['order']) {
        this.confirmAndPrint(data['data']['order']);
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
                parseInt(prod['quantityStore']) - prod['nbr'];
              }
            });
          });
        }

        if (this.productListTab && this.productListTab.length > 0) {
          this.productListTab.forEach((arr) => {
            arr.forEach((prod) => {
              if (prod['qty']) {
                prod['qty'] = 0;
              }
              if (prod['nbr']) {
                prod['nbr'] = 0;
                prod['quantityStore'] =
                  parseInt(prod['quantityStore']) - prod['nbr'];
              }
            });
          });
        }

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
  initializeItems() {
    this.products2 = this.products;
  }
  handleInputItems(ev) {
    this.notification.presentLoading();
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.restApiService.getProductByName(val).subscribe((data) => {
        this.notification.dismissLoading();
        this.products2 = data['product'];
      });
    } else {
      this.isItemAvailable = false;
      this.products2 = [];
    }
  }

  handleInputPack(ev) {
    this.notification.presentLoading();
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isItemAvailable2 = true;
      this.restApiService.getPackitemByName(val).subscribe((data) => {
        this.notification.dismissLoading();
        this.pack2 = data['pack'];
      });
    } else {
      this.isItemAvailable2 = false;
      this.pack2 = [];
    }
  }
  search(pack) {
    this.isItemAvailable = false;
    this.isItemAvailable2 = false;
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
  onImageLoad(ev) {
    //  console.log(ev);
    //  console.log(ev["_src"]);
  }
  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  incremente(prod) {
    if (this.platform.is('android')) {
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
    }
    this.cartValue = this.restApiService.getCart2();
    if (this.Itemprice - this.Reduction <= 100) {
      this.presentAlert();
    } else if (this.Itemprice > 0 && this.Itemprice - this.Reduction > 100) {
    } else {
      if (this.autorisationNumber && prod.store <= this.autorisationNumber) {
        if (prod.quantityStore) {
          this.warnin(prod);
        }
      } else {
        if (this.cartValue && this.cartValue['cart']) {
          let tab = this.cartValue['products'].filter((elt) => {
            return elt.item._id === prod._id;
          })[0];

          let data = {};
          data['product'] = prod;
          data['cart'] = this.cartValue['cart'];

          let cart = this.manageCartService.addToCart(data);

          this.totalItems = cart['totalQty'];
          this.totalPrice = cart['totalPrice'];
          this.restApiService.saveCart({
            cart: cart,
            products: cart.generateArray(),
          });

          let tabn = this.countItemsService.getQtyItems(
            this.products,
            cart.generateArray(),
            prod
          );

          this.products = tabn;
        } else {
          let cart = this.manageCartService.addToCart(prod);
          // console.log(cart);
          this.totalItems = cart['totalQty'];
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

          this.products = tab;
        }
      }
    }
  }

  gestionNonGlace(prod, store) {
    if (prod['modeNG']) {
      prod['modeNG'] = prod['modeNG'] + 1;
      prod['quantityStore'] = prod['quantityStore'] - 1;
      if (prod['glace']) {
        prod['nonglace'] = prod['quantityStore'] - prod['glace'];
      } else {
        //  prod["nonglace"] = prod["nonglace"] + 1;
        prod['nonglace'] = prod['quantityStore'];
      }
      // prod["tabNG"].push(prod);
    } else {
      // prod["tabNG"] = [];
      //  prod["tabNG"].push(prod);

      prod['modeNG'] = 1;
      prod['quantityStore'] = prod['quantityStore'] - 1;
      if (prod['glace']) {
        prod['nonglace'] = prod['quantityStore'] - prod['glace'];
      } else {
        prod['nonglace'] = prod['quantityStore'];
      }
    }
    // if (prod["nonglace"] && prod["nonglace"] > 0 && prod["quantityStore"] > 0) {
    if (store) {
      if (prod['nonglace'] === 0) {
        // prod["nonglace"] = store;
      }
      this.incremente(prod);
    } else {
      // this.showPresentAlert();
      return;
    }
  }
  //provisoire
  warnin(prod) {
    if (this.cartValue && this.cartValue['cart']) {
      let tab = this.cartValue['products'].filter((elt) => {
        return elt.item._id === prod._id;
      })[0];
      // console.log("table", tab);

      if (tab && tab.qty === prod.quantityStore) {
        //  this.showPresentAlert();
        return;
      } else {
        let data = {};
        data['product'] = prod;
        data['cart'] = this.cartValue['cart'];
        let cart = this.manageCartService.addToCart(data);
        // console.log(cart);
        this.totalItems = cart['totalQty'];
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
        // console.log("new tab", tab);
        this.products = tab;
      }
    }
  }
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

  compare(a, b) {
    if (a.categoryName < b.categoryName) {
      return -1;
    }
    if (a.categoryName > b.categoryName) {
      return 1;
    }
    return 0;
  }
  getCategories() {
    //this.getItems();
    let user = JSON.parse(localStorage.getItem('adminUser'));
    this.categories = user['storeType'];
  }

  sendToServer(tabRandom: Array<any>) {
    let tab = [];

    from(tabRandom)
      .pipe(
        groupBy((prod) => prod.produceBy),
        // return each item in group as array
        mergeMap((group) => group.pipe(toArray()))
      )
      .subscribe((val) => {
        tab.push(val);
      });

    this.userProducts = tab;
    if (this.userProducts[0][0]['packSize']) {
      this.choise = 'all';
    } else {
      this.choise = 'mychoise';
    }
  }

  sendData() {
    let tabData = JSON.parse(localStorage.getItem(`storedreq`));
    if (tabData && tabData.length) {
      let dataTSend = tabData[0];

      this.offlineManager.sendLocalDataToserver(dataTSend).subscribe((data) => {
        tabData = tabData.filter((elt) => elt !== dataTSend);
        dataTSend['data']['_id'] = dataTSend['id'];
        setTimeout(() => {}, 1000);
        localStorage.setItem(`storedreq`, JSON.stringify(tabData));
      });
    } else {
    }
  }

  async notifier(texte: string) {
    const toast = await this.toastController.create({
      message: texte,
      duration: 5000,
      animated: true,
      position: 'top',
    });
    toast.present();
  }

  /// gestion des stocks par le manager
  async checkIfAvaible(prod): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      let verificateur = [];
      this.tabNotif = [];
      if (!this.saveRandom.getSetting().check_resource) {
        resolve([true]);
      } else {
        if (prod['resourceList'].length) {
          let resourceList = prod['resourceList'];

          let resultat = await this.resourceService.checkAvaibleResources(
            prod['resourceList']
          );

          let randomValue = 0;
          resourceList.forEach(async (resource) => {
            let nbr = 0;
            if (prod.qty) {
              prod['qtyRandom'] = prod['qty'] + 1;
            } else {
              prod['qtyRandom'] = 1;
            }

            let tab = await this.verifyAsync(
              prod,
              randomValue,
              resource,
              resultat,
              verificateur,
              resource['quantity'] * prod['qtyRandom']
            );
            verificateur = [...verificateur, ...tab];
          });

          resolve(verificateur);
        }
      }
    });
  }
  verifyAsync(
    prod,
    randomValue,
    resource,
    resultat,
    verificateur,
    nbr
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resultat.forEach((res) => {
        if (res.thetype == 'productItems') {
          res['resourceId'] = res['productId'];
          res['sizeUnit'] = 1;
          res['unitName'] = res['unitNameProduct'];

          res['random'] = res['quantityStore'] * res['sizeUnitProduct'];
          // res["quantityStore"] = res["random"];
        }

        if (res.resourceId == resource.resourceId) {
          if (res.unitName == resource.unitName) {
            if (
              res['random'] &&
              res['random'] >= 0 &&
              res.random * res.sizeUnit - nbr >= 0 &&
              nbr > 0
            ) {
              verificateur.push(true);
            } else if (
              res['random'] &&
              res['random'] >= 0 &&
              res.random * res.sizeUnit - nbr < 0 &&
              nbr > 0
            ) {
              verificateur.push(false);
              this.tabNotif.push(res);
            } else {
              if (res.quantityStore * res.sizeUnit - nbr >= 0 && nbr > 0) {
                verificateur.push(true);
              } else {
                verificateur.push(false);
                this.tabNotif.push(res);
              }
            }
          }

          if (res.unitName == 'kg' && resource.unitName == 'g') {
            if (res.quantityStore * res.sizeUnit * 1000 - nbr >= 0 && nbr > 0) {
              verificateur.push(true);
            } else {
              verificateur.push(false);
              this.tabNotif.push(res);
            }
          }
          if (res.unitName == 'l' && resource.unitName == 'cl') {
            if (
              res['random'] &&
              res['random'] >= 0 &&
              res.random * res.sizeUnit - nbr >= 0 &&
              nbr > 0
            ) {
              verificateur.push(true);
            } else if (
              res['random'] &&
              res['random'] >= 0 &&
              res.random * res.sizeUnit - nbr < 0 &&
              nbr > 0
            ) {
              verificateur.push(false);
              this.tabNotif.push(res);
            } else {
              if (
                res.quantityStore * res.sizeUnit * 100 - nbr >= 0 &&
                nbr > 0
              ) {
                verificateur.push(true);
              } else {
                verificateur.push(false);
                this.tabNotif.push(res);
              }
            }
          }
        }
      });
      resolve(verificateur);
    });
  }

  async takeGame() {
    this.notification.presentLoading();
    this.cacheService
      .getCachedRequest('serviceProductList')
      .then((data) => {
        this.productListTab = data;
        this.notification.dismissLoading();
        this.restApiService
          .getBillardList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(async (data) => {
            console.log('billard list here', data);

            let arr = [];
            if (data) {
              let setting = JSON.parse(localStorage.getItem('setting'));
              if (this.saveRandom.checkIfIsRetailer()) {
                let retailer = this.saveRandom.getRetailer();

                let retailerProd = retailer['productsToSale'];

                arr = await this.retailerPrice.converToRetailerPrice(
                  retailerProd,
                  // data['product']
                  data
                );
                arr = await this.groupByService.groupArticles(arr);
                this.productListTab = [];
                this.productListTab = arr;
                this.notification.dismissLoading();
              } else {
                if (setting['use_gamme']) {
                  this.urlPackage = data[0]['url'];
                  //this.urlPackage = data['product'][0]['url'];
                  this.gammeService.setProducts(data);
                  //this.gammeService.setProducts(data['product']);
                }

                // arr = await this.groupByService.groupArticles(data['product']);
                arr = await this.groupByService.groupArticles(data);
                this.productListTab = arr;
                this.notification.dismissLoading();
                this.cacheService.cacheRequest(
                  'serviceProductList',
                  this.productListTab
                );
              }
            }
          });
      })
      .catch((err) => {
        // this.notification.dismissLoading();
        this.restApiService
          .getBillardList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            async (data) => {
              let arr = [];
              if (data) {
                let setting = JSON.parse(localStorage.getItem('setting'));
                if (setting['use_gamme']) {
                  this.gammeService.setProducts(data);
                }
                arr = await this.groupByService.groupArticles(data);
                this.productListTab = arr;
                this.notification.dismissLoading();
                this.cacheService.cacheRequest(
                  'serviceProductList',
                  this.productListTab
                );
              }
            },
            (err) => {
              this.notification.dismissLoading();
            }
          );
      });
  }

  async getAllGamme() {
    this.cacheService
      .getCachedRequest('gammeList')
      .then((data) => {
        this.gammeListTab = data;

        this.gammeService
          .getGammeList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(async (data: Gamme[]) => {
            if (data) {
              this.gammeListTab = data;
              this.cacheService.cacheRequest('gammeList', this.gammeListTab);
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
              this.gammeListTab = data;
              this.cacheService.cacheRequest('gammeList', this.gammeListTab);
            }
          });
      });
  }

  segmentListChanged(ev) {
    this.arr.forEach((elt) => {
      if (elt[0]['superCategory'] == ev.target.value) {
        this.productList = elt;
      }
    });
  }

  findProductList(ev) {
    // Reset items back to all of the items

    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable3 = true;
      this.arrList2 = this.arrListRandom.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.isItemAvailable3 = false;
    }
  }
  findProductItemList(ev) {
    // Reset items back to all of the items

    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.isItemAvailable3 = true;
      this.arrList2 = this.allUserProductsList.filter((item) => {
        return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.isItemAvailable3 = false;
    }
  }
  buyEmptyBottle(prod) {
    let c = this.restApiService.getCart2();

    let qty = 0;
    qty = prod['btlVide'];
    let obj = {};
    for (const key in prod) {
      obj[key] = prod[key];
    }
    obj['_id'] = obj['_id'] + 'vide';
    obj['sellingPrice'] = obj['bottle_empty_Price'];
    obj['name'] = prod['name'] + ' ' + 'vide';
    obj['originId'] = prod['_id'];
    obj['sale_type'] = 'emballage';
    if (c && c['products']) {
      let id = obj['_id'];
      let arr: any[] = c['products'];
      let found = arr.find((p) => p.item._id == id);
      if (found) {
        // qty = found.qty + 1;
        console.log(prod['btlVide']);
        obj['nbr'] = prod['btlVide'];
      }
    } else {
      console.log(prod['btlVide']);

      obj['nbr'] = prod['btlVide'];
    }
    if (qty && qty > prod.bottle_empty) {
      let msg = `le nombre de bouteille vide ${prod.name} en stock est insuffisant`;
      this.notification.presentError(msg, 'danger');
      return;
    }
    return obj;
    // this.buyItemGame(obj);
  }
  getValueVide(ev, prod) {
    let nbr = parseInt(ev.detail.value);
    if (nbr && nbr > prod['bottle_empty']) {
      let msg = `le nombre de bouteille vide ${prod.name} en stock est insuffisant`;
      this.notification.presentError(msg, 'danger');
      return;
    } else if (nbr && nbr > 0) {
      prod['btlVide'] = nbr;
      let result = this.buyEmptyBottle(prod);
      result['nbr'] = nbr;
      console.log(result);

      this.addMoreOne(result);
    } else if (nbr == 0) {
      prod['btlVide'] = nbr;
      let result = this.buyEmptyBottle(prod);
      result['nbr'] = nbr;
      this.addMoreOne(result);
    } else {
      prod['btlVide'] = 0;
      let result = this.buyEmptyBottle(prod);
      result['nbr'] = 0;
      this.addMoreOne(result);
    }
  }
  getValueBtl(ev, prod) {
    let nbr = parseInt(ev.detail.value);
    if (nbr && nbr > prod['quantityStore']) {
      this.notifi.presentToast(
        `la quantité en stock est inférieur a ${nbr}`,
        'danger'
      );
    } else if (nbr && nbr > 0) {
      prod['nbr'] = nbr;
      this.addMoreOne(prod);
    } else if (nbr == 0) {
      prod['nbr'] = nbr;
      this.addMoreOne(prod);
    } else {
      prod['nbr'] = nbr;
      this.addMoreOne(prod);
    }
  }

  addMoreOne(prod) {
    this.cartValue = this.restApiService.getCart2();
    if (this.cartValue && this.cartValue['cart']) {
      let data = {};
      prod['sc'] = true;
      prod['value'] = prod['nbr'];
      data['product'] = prod;
      data['cart'] = this.cartValue['cart'];
      let cart = this.manageCartService.addToCart(data);
      this.totalItems = cart['totalQty'];
      this.totalPrice = cart['totalPrice'];
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
      prod['value'] = prod.nbr;
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
  }
  makeChanges(ev, prod) {
    console.log(ev);
    let id = ev.detail.value;
    let product = this.arrListRandom.find((p) => p._id == id);
    this.presentAlertPrompt(product, prod)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  async presentAlertPrompt(pToChange, prod) {
    let data = { ToChange: pToChange, product: prod };
    let nom = prod.name;
    this.saveRandom.setData(data);
    const modal = await this.modalController.create({
      component: MakechangePage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(async () => {
      try {
        await this.notifi.presentAlertConfirm(
          `confirmer échange ${pToChange.name} ---> ${nom}`,
          'OUI',
          'NON'
        );
        let info = `${pToChange.name} ---> ${nom}`;
        let result = this.saveRandom.getData();
        let prod = result['product'];
        let obj = {};
        for (const key in prod) {
          obj[key] = prod[key];
        }
        obj['originId'] = obj['_id'];
        if (result.pleine) {
          obj['sale_type'] = 'emballage&contenu';
          obj['sellingPrice'] = obj['sellingPrice'] + result['montant'];
          obj['_id'] = obj['_id'] + 'emballage&contenu';
          // obj['name'] = obj['name'] + 'emc';
          obj['name'] = info + ' ' + 'EMC';
        }
        if (result.vide) {
          obj['sale_type'] = 'emballage';
          obj['_id'] = obj['_id'] + 'vide';
          obj['name'] = obj['name'];
          obj['sellingPrice'] = result['montant'];
          //montant du troque
          // obj['name'] = obj['name'] + 'ECH';
          obj['name'] = info + ' ' + 'ECH';
        }
        obj['nbr'] = result.nbr;
        this.addMoreOne(obj);
        let p = this.saveRandom.getProductToUpdate();
        if (p) {
          p[pToChange._id] = { product: pToChange, quantity: result.nbr };

          this.saveRandom.setProductToUpdate(p);
        } else {
          let u = {};
          u[pToChange._id] = { product: pToChange, quantity: result.nbr };

          this.saveRandom.setProductToUpdate(u);
        }
      } catch (error) {
        console.log(error);
      }
    });
    return await modal.present().then((created) => {
      //
    });
  }
  buyEmballagePro(prod) {
    let c = this.restApiService.getCart2();
    let qty = 0;

    let obj = {};
    for (const key in prod) {
      obj[key] = prod[key];
    }
    obj['_id'] = obj['_id'] + 'emballage&contenu';
    obj['originId'] = prod['_id'];
    obj['sale_type'] = 'emballage&contenu';
    obj['sellingPrice'] = obj['bottle_empty_Price'] + prod.sellingPrice;
    obj['name'] = prod['name'] + ' ' + 'EC'; //emballage et contenu
    if (c && c['products']) {
      let id = obj['_id'];
      let arr: any[] = c['products'];
      let found = arr.find((p) => p.item._id == id);
      if (found) {
        qty = found.qty + 1;
        console.log(qty);
      }
    } else {
      qty = 1;
    }
    if (qty && qty > prod.quantityStore) {
      let msg = `le nombre de bouteille ${prod.name} en stock est insuffisant`;
      this.notification.presentError(msg, 'danger');
      return;
    }

    this.buyItemGame(obj);
  }
  buyItemProList(prod, type?) {
    this.buyItemGame(prod, null, type);
    this.isItemAvailable3 = false;
  }
  async takeProductListShop(loading?) {
    this.cacheService
      .getCachedRequest('productsListShop')
      .then((data: any[][]) => {
        this.arrListRandom = [];
        this.productList = data;
        data.forEach((arr) => {
          this.arrListRandom = [...this.arrListRandom, ...arr];
        });

        this.restApiService
          .getShopList2()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            async (data) => {
              let arr = [];
              if (data) {
                /* data['product'] = data['product'].sort((a, b) => {
                  if (a.categoryName < b.categoryName) {
                    return -1;
                  }
                  return 0;
                });*/
                arr = await this.groupByService.groupArticles(
                  data['product'],
                  loading
                );
                this.productList = arr;
                this.arrListRandom = data['product'];
                this.cacheService.cacheRequest(
                  'productsListShop',
                  this.productList
                );
              }
            },
            (err) => console.log(err)
          );

        //take data
      })
      .catch((err) => {
        this.restApiService
          .getShopList2()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            async (data) => {
              let arr = [];
              if (data) {
                /*data['product'] = data['product'].sort((a, b) => {
                  if (a.categoryName < b.categoryName) {
                    return -1;
                  }
                  return 0;
                });*/
                arr = await this.groupByService.groupArticles(
                  data['product'],
                  loading
                );
                this.productList = arr;
                this.arrListRandom = data['product'];
                this.cacheService.cacheRequest(
                  'productsListShop',
                  this.productList
                );
              }
            },
            (err) => console.log(err)
          );
      });
  }
  settingOfflineMode(data) {
    if (this.tabRoles.includes(5)) {
      if (data['company'][0]['SaleInPack']) {
        this.checkPack = true;
        localStorage.setItem('saleAsPack', 'true');
      } else {
        this.checkPack = false;
      }

      this.storeTypeTab = JSON.parse(localStorage.getItem('adminUser'))[
        'storeType'
      ];
      this.pet = this.storeTypeTab[0];
      if (this.storeTypeTab.includes('bar')) {
        this.takeProduct();
      }
      if (data['company']['use_gamme']) {
        this.storeTypeTab.push('Gamme');
        this.getAllGamme();
      }
      if (this.storeTypeTab.includes('services')) {
        setTimeout(() => {
          this.takeGame();
        }, 1500);
      }

      if (this.storeTypeTab.includes('shop')) {
        setTimeout(() => {
          this.takeProductListShop();
        }, 1500);
      }
      if (
        this.storeTypeTab.includes('resto') &&
        this.storeTypeTab.includes('bar')
      ) {
        setTimeout(() => {
          this.takeProductResto();
        }, 3000);
      } else {
        this.takeProductResto();
      }

      if (localStorage.getItem('addFlag')) {
        this.numFacture = JSON.parse(localStorage.getItem('order'))[
          'numFacture'
        ];

        this.flagAdd = localStorage.getItem('addFlag');
      }
    }

    let mac = null;
    let company = data['company'][0];
    localStorage.setItem('setting', JSON.stringify(company));
    if (company['macServer']) {
      mac = company['macServer'];
      localStorage.setItem('mac', mac);
    }

    if (company.use_wifi) {
      this.urlService.useWifiIp(company);
    } else if (company.use_desktop) {
      this.urlService.useDesktop(company);
    } else if (company['macServer']) {
      this.urlService.useLocalServer(mac);
    } else {
      this.notification.presentError(
        'please provide the configuration to use local server',
        'warning'
      );
    }
    this.autorisationNumber = 0;
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
        // gamme.productList = data.data['gamme']['productList'];
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
        this.productListTab.forEach((arr: Product[]) => {
          listProduct = [...listProduct, ...arr];
        });

        if (newGamme.length) {
          newGamme.forEach((gam) => {
            // this.productListTab.forEach((arr: Product[]) => {
            let index = listProduct.findIndex((prod) => {
              return prod._id == gam._id;
            });
            if (index >= 0) {
              if (listProduct[index].quantityStore < gam.toRemove * quantity) {
                autorisation = false;
                notFound.push(listProduct[index]);
              } else {
                listProduct[index].quantityStore =
                  listProduct[index].quantityStore - gam.toRemove * quantity;
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
              if (listProduct[index].quantityStore < gam.toRemove * quantity) {
                autorisation = false;
                notFound.push(listProduct[index]);
              } else {
                listProduct[index].quantityStore =
                  listProduct[index].quantityStore - gam.toRemove * quantity;
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
          /* setTimeout(() => {
            if (JSON.parse(localStorage.getItem('oldGamme'))) {
              console.log('gamme dans le storage=======');

              gamme.productList = JSON.parse(
                localStorage.getItem('oldGamme')
              ).productList;
              gamme.sellingPrice = JSON.parse(
                localStorage.getItem('oldGamme')
              ).sellingPrice;
            }
            localStorage.removeItem('oldGamme');
          }, 35000);*/
        }
      }
    });
    return await modal.present();
  }

  addGammeToCart(gamme: Gamme) {
    return new Promise((resolve, reject) => {
      this.checkVoucher(gamme); //verifier si il y'a un bon de commande et calculer le montant restant

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
  checkVoucher(prod) {
    let voucher = this.saveRandom.getVoucher();
    if (voucher) {
      let pt = this.totalPrice + prod.sellingPrice;
      let price = voucher.price;
      let res = price - pt;
      console.log(res);
      if (res >= 0) {
        return true;
      } else {
        return false;
      }
    }
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
      this.restApiService.cleanCart();
      let tab = this.restApiService.getCart();
      // this.restApiService.cleanCart();
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
          arr.forEach((prod) => {
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
      // this.modalController.dismiss('update');
    });
    return await modal.present().then((created) => {
      //
    });
  }

  getTransaction() {
    let role = 2;
    if (this.tabRoles.includes(2)) {
      role = 2;
    } else {
      role = 0;
    }
    this.adminService
      .getStoreMballusTransaction(this.saveRandom.getStoreId(), role)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // this.takeProduct();
        console.log('trasaction', data['docs']);

        this.transaction = data['docs'];
        if (this.transaction.length) {
          this.notifi.presentToast('you have new notification', 'danger');
        }
      });
  }
}
