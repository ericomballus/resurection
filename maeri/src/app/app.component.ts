import { Component, HostListener } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
//import { TranslateService } from "@ngx-translate/core";
//import { Events } from "@ionic/angular";
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateConfigService } from '../app/translate-config.service';
import { OfflineManagerService } from './services/offline-manager.service';
import { UrlService } from './services/url.service';
import { environment, uri } from '../environments/environment';
import { ImageLoaderConfigService } from 'ionic-image-loader';

import { ScreensizeService } from './services/screensize.service';
import { MyeventsService } from './services/myevents.service';
import { CachingService } from './services/caching.service';
import { Setting } from './models/setting.models';

//import { SaverandomService } from './services/saverandom.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  navigate: any[];
  adminId: any;
  tabRoles: any;
  userName: String = 'unknown';
  selectedLanguage: string;
  displayType = [];
  @HostListener('window:unload', ['$event'])
  isDesktop: boolean;
  setting: Setting;
  unloadHandler(event) {
    console.log('hi dont no why...');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunload(event) {
    console.log('hi dont no why twice time ...');
  }
  constructor(
    public events: MyeventsService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, //  public translate: TranslateService, //  @Inject(AppService) service: AppService
    private router: Router,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    private urlService: UrlService,
    private imageLoaderConfig: ImageLoaderConfigService,
    private screensizeService: ScreensizeService,
    private cachingService: CachingService,
    public toastController: ToastController
  ) {
    this.initializeApp();
    this.sideMenu();
    this.screenCheck();
    this.cachingService.initStorage();
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    localStorage.setItem('language', this.selectedLanguage);

    if (localStorage.getItem('language')) {
    } else {
      localStorage.setItem('language', this.selectedLanguage);
    }
    if (JSON.parse(localStorage.getItem('roles'))) {
      this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    }

    // this.handleRoles();
    this.events.getRole().subscribe((tab) => {
      this.tabRoles = tab;
      this.handleRoles();
    });
    this.events.getDisplayType().subscribe((data) => {
      this.displayType = data;
      this.handleRoles();
    });
    this.events.getSettin().subscribe((data: Setting) => {
      this.setting = data;
      this.handleRoles();
    });

    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {});
    }
  }
  screenCheck() {
    setTimeout(() => {
      this.screensizeService.isDesktopView().subscribe((isDesktop) => {
        // console.log(isDesktop);

        if (this.isDesktop && !isDesktop) {
        }

        this.isDesktop = isDesktop;
      });
    }, 10);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.screensizeService.onResize(this.platform.width());

      if (this.platform.is('android')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.imageLoaderConfig.enableDebugMode();
        this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
        this.imageLoaderConfig.setFallbackUrl('assets/bill2.png');
        this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);
      } else {
        setTimeout(() => {}, 3000);
      }
    });
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000,
      position: 'top',
      animated: true,
      //cssClass: "my-custom-class"
    });
    toast.present();
  }

  private saveToken(token) {
    //
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.screensizeService.onResize(event.target.innerWidth);
  }

  languageChanged() {
    localStorage.setItem('language', this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
    this.events.setLanguage(this.selectedLanguage);
  }

  languageChanged2() {
    console.log('changess box');
  }

  sideMenu() {}

  handleRoles() {
    if (JSON.parse(localStorage.getItem('user'))) {
      setTimeout(() => {
        // console.log(JSON.parse(localStorage.getItem("user")));
        this.userName = JSON.parse(localStorage.getItem('user'))['name'];
        // console.log("hello world");
      }, 500);
    }
    if (this.tabRoles) {
      if (this.tabRoles && this.tabRoles.length) {
        if (
          this.tabRoles.includes(3) &&
          this.tabRoles.includes(4) &&
          this.tabRoles.includes(2)
        ) {
          // this.giveMenu3();
          // return;
        } else if (this.tabRoles.includes(3) && this.tabRoles.includes(4)) {
          // this.giveMenu2();
        } else if (this.tabRoles.includes(2) && this.tabRoles.includes(3)) {
          // this.giveMenu3();
          // return;
        } else if (this.tabRoles.includes(4)) {
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/point-of-sale',
              icon: 'home',
              color: 'white',
            },
            {
              title: 'MENU.shop',
              url: 'shop',
              icon: 'cart',
              color: 'white',
            },

            {
              title: 'MENU.goods',
              url: 'procurment-product-item',
              icon: 'clipboard',
              color: 'white',
            },
            {
              title: 'MENU.manageitems',
              url: 'manageitems',
              icon: 'expand',
              color: 'white',
            },
            /*{
              title: "MENU.invoices",
              url: "invoice-paie",
              icon: "cash",
              color: "success",
              
            },*/
            {
              title: 'MENU.bill',
              url: '/bill',
              icon: 'documents-outline',
              color: 'white',
            },

            {
              title: 'MENU.activities',
              url: '/activitie',
              icon: 'pulse-outline',
              color: 'white',
            },

            /* 
            {
              title: 'MENU.purchaseVoucher',
              url: '/purchase-voucher',
              icon: 'cash',
              color: 'white',
            },
            
            {
              title: 'MENU.bill',   
              url: '/bill/my',
              icon: 'cash',
              color: 'white',
            },
            {
              title: 'MENU.consigne',
              url: 'consigne',
              icon: 'stopwatch-outline',
              color: 'white',
            },
            
            */
          ];

          if (this.setting && this.setting.is_Hospital) {
            this.navigate.push({
              title: 'patients',
              url: 'patient-list',
              icon: 'person',
              color: 'white',
            });
          }

          this.navigate.push(
            {
              title: 'MENU.printer',
              url: 'print-config',
              icon: 'print',
              color: 'white',
            },
            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'person-circle-outline',
              color: 'white',
            }
          );
          if (!this.displayType.includes('bar')) {
            this.navigate.splice(3, 1);
            this.navigate.splice(4, 1);
          }
        } else if (this.tabRoles.includes(5)) {
          //console.log("hello sho here");
          console.log('hello pcashier');
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/shop',
              icon: 'home',
              color: 'tertiary',
            },
            {
              title: 'MENU.activities',
              url: '/activitie',
              icon: 'expand',
              color: 'warning',
            },
            {
              title: 'MENU.bill',
              url: '/bill',
              icon: 'cash',
              color: 'tertiary',
            },
            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'tertiary',
            },
          ];
        } else if (this.tabRoles.includes(3)) {
          console.log('hello warehouse');

          this.navigate = [
            {
              title: 'MENU.warehouse',

              color: 'primary',
              children: [
                {
                  title: 'MENU.outgoing',
                  url: 'warehouse',
                  icon: 'appstore',
                },
                {
                  title: 'MENU.products',
                  url: 'product-item-list',
                  icon: 'home',
                },
                {
                  title: 'MENU.packs',
                  url: 'product-pack-item-add',
                  icon: 'home',
                },
              ],
            },
            {
              title: 'MENU.goods',
              url: 'procurment-product-item',
              icon: 'clipboard',
              color: 'success',
            },
            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'tertiary',
            },
          ];
        } else if (this.tabRoles.includes(6)) {
          console.log('super manger here');
          // let setting = this.saveRandom.getSetting();
          // console.log('hello setting', setting);
          let children = [];
          if (this.displayType.includes('bar')) {
            children.push({
              title: 'MENU.products',
              url: './product-list',
              icon: 'home',
            });
          }
          if (this.displayType.includes('resto')) {
            children.push({
              title: 'MENU.dishes',
              url: './product-manufactured',
              icon: 'home',
            });
          }
          if (this.displayType.includes('services')) {
            children.push({
              title: 'MENU.game',
              url: '/services',
              icon: 'expand',
              color: 'warning',
            });
          }
          if (this.displayType.includes('shop')) {
            children.push({
              title: 'shop',
              url: '/shop-list',
              icon: 'expand',
              color: 'warning',
            });
          }

          if (this.setting && this.setting['use_gamme']) {
            children.push({
              title: 'gamme',
              url: '/gamme',
              icon: 'expand',
              color: 'warning',
            });
          }
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/super-manager',
              icon: 'home',
              color: 'light',
            },
            {
              title: 'MENU.warehouse',
              color: 'light',
              children: [
                {
                  title: 'MENU.stock',
                  url: 'warehouse',
                  icon: 'appstore',
                },
              ],
            },
            {
              title: 'MENU.goods',
              url: 'manager-refueling',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'ACHATS',
              url: 'purchase',
              icon: 'expand',
              color: 'light',
            },
            {
              title: 'MENU.posLive',
              url: 'poslive',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'MENU.statistics',

              color: 'light',
              children: [
                {
                  title: 'MENU.invoices',
                  url: 'manager-display-bill',
                  icon: 'cash',
                  color: 'light',
                },
                {
                  title: 'MENU.sale_per_date',
                  url: 'sale-per-day',
                  icon: 'cash',
                  color: 'light',
                },
                {
                  title: 'MENU.fichepointage',
                  url: 'fiche-list',
                  icon: 'cash',
                  color: 'light',
                },
              ],
            },

            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'MENU.company',
              url: 'company',
              icon: 'clipboard',
              color: 'light',
            },
          ];
        } else if (this.tabRoles.includes(7)) {
          let children = [];
          if (this.displayType.includes('bar')) {
            children.push({
              title: 'MENU.products',
              url: './product-list',
              icon: 'home',
            });
          }
          if (this.displayType.includes('resto')) {
            children.push({
              title: 'MENU.dishes',
              url: './product-manufactured',
              icon: 'home',
            });
          }
          if (this.displayType.includes('services')) {
            children.push({
              title: 'MENU.game',
              url: '/services',
              icon: 'expand',
              color: 'warning',
            });
          }
          if (this.displayType.includes('shop')) {
            children.push({
              title: 'shop',
              url: '/shop-list',
              icon: 'expand',
              color: 'warning',
            });
          }

          if (this.setting && this.setting['use_gamme']) {
            children.push({
              title: 'gamme',
              url: '/gamme',
              icon: 'expand',
              color: 'warning',
            });
          }
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/sw-home',
              icon: 'home',
              color: 'light',
            },
            {
              title: 'MENU.commande',
              url: 'sw-commandes',
              icon: 'expand',
              color: 'light',
            },

            {
              title: 'MENU.goods',
              url: 'sw-transaction',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'MENU.invoicecustomer',
              url: '/bill',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'light',
            },
          ];
        } else if (this.tabRoles.includes(8)) {
          if (this.setting && this.setting['use_gamme']) {
          }
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/sc-home',
              icon: 'home',
              color: 'light',
            },
            /*
            {
              title: 'MENU.commande',
              url: 'sc-commande',
              icon: 'expand',
              color: 'light',
            },
           
           */

            {
              title: 'MENU.warehouse',
              url: 'sc-display-stock',
              icon: 'expand',
              color: 'light',
            },

            {
              title: 'MENU.goods',
              url: 'sc-transaction',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'light',
            },
          ];
        } else if (this.tabRoles.includes(9)) {
          if (this.setting && this.setting['use_gamme']) {
          }
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/fc-home',
              icon: 'home',
              color: 'light',
            },
            {
              title: 'MENU.commande',
              url: 'sc-shop',
              icon: 'expand',
              color: 'light',
            },

            {
              title: 'MENU.warehouse',
              url: 'sc-display-stock',
              icon: 'expand',
              color: 'light',
            },

            {
              title: 'MENU.bill',
              url: '/bill',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'MENU.customer',
              url: '/store-customer',
              icon: 'people-outline',
              color: 'light',
            },
            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'light',
            },
          ];
        } else if (this.tabRoles.includes(10)) {
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/sa-home',
              icon: 'home',
              color: 'light',
            },

            {
              title: 'MENU.warehouse',
              url: 'sc-display-stock',
              icon: 'expand',
              color: 'light',
            },

            {
              title: 'MENU.bill',
              url: '/bill',
              icon: 'clipboard',
              color: 'light',
            },
            {
              title: 'MENU.customer',
              url: '/store-customer',
              icon: 'people-outline',
              color: 'light',
            },
            {
              title: 'MENU.sale_per_date',
              url: 'sale-per-day',
              icon: 'cash',
              color: 'light',
            },

            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'light',
            },
          ];
        } else if (this.tabRoles.includes(12)) {
        } else if (this.tabRoles.includes(11)) {
          console.log('role id here', this.tabRoles);
          this.navigate = [
            {
              title: 'MENU.home',
              url: '/hospital-home',
              icon: 'home',
              color: 'light',
            },

            {
              title: 'MENU.patient_list',
              url: 'patient-list',
              icon: 'expand',
              color: 'light',
            },

            {
              title: 'MENU.profile',
              url: 'employees-update-password',
              icon: 'clipboard',
              color: 'light',
            },
          ];
        } else if (this.tabRoles.includes(1)) {
          let children = [];
          if (this.displayType.includes('bar')) {
            children.push({
              title: 'MENU.products',
              url: './product-list',
              icon: 'home',
            });
          }
          if (this.displayType.includes('resto')) {
            children.push({
              title: 'MENU.dishes',
              url: './product-manufactured',
              icon: 'home',
            });
          }
          if (this.displayType.includes('services')) {
            children.push({
              title: 'MENU.game',
              url: '/services',
              icon: 'expand',
              color: 'warning',
            });
          }
          if (this.displayType.includes('shop')) {
            children.push({
              title: 'shop',
              url: '/shop-list',
              icon: 'expand',
              color: 'warning',
            });
          }
          let setting: Setting = JSON.parse(localStorage.getItem('setting'));
          if (Array.isArray(setting)) {
            if (setting[0]['use_gamme']) {
              children.push({
                title: 'gamme',
                url: '/gamme',
                icon: 'expand',
                color: 'warning',
              });
            }
          } else {
            if (setting['use_gamme']) {
              children.push({
                title: 'gamme',
                url: '/gamme',
                icon: 'expand',
                color: 'warning',
              });
            }
          }
          this.navigate = [
            {
              title: 'MENU.home',
              url: 'start',
              icon: 'home',
              color: 'danger',
            },
            {
              title: 'MENU.company',
              url: 'company',
              icon: 'clipboard',
              color: 'tertiary',
            },
            /*
            
            {
              title: "MENU.sudocat",
              url: "/category-super",
              icon: "expand",
              color: "warning",
            },

            {
              title: "MENU.categories",
              url: "/category",
              icon: "expand",
              color: "warning",
            },
             {
                  title: "MENU.packs",
                  url: "product-pack",
                  icon: "home",
                },
                 {
              title: "MENU.resources",
              url: "/resource",
              icon: "expand",
              color: "warning",
            },
            */

            {
              title: 'MENU.products',
              color: 'dark',
              children: children,
            },

            {
              title: 'MENU.employees',
              url: '/employees-list',
              icon: 'contacts',
              color: 'medium',
            },
          ];

          if (children.length == 1) {
            children[0]['icon'] = 'clipboard';
            children[0]['color'] = 'warning';
            this.navigate.splice(2, 1, children[0]);
          }
          if (setting.saleToRetailer) {
            this.navigate.push({
              title: 'MENU.paiement',
              url: '/list-contrat',
              icon: 'expand',
              color: 'medium',
            });
            this.navigate.push({
              title: 'MENU.vendor',
              url: '/add-vendor',
              icon: 'expand',
              color: 'warning',
            });
          }
        } else if (this.tabRoles.includes(2)) {
          //console.log("company manager");
          if (localStorage.getItem('manageStockWithService') === 'true') {
            this.navigate = [
              {
                title: 'MENU.home',
                url: 'start',
                icon: 'home',
                color: 'danger',
              },
              {
                title: 'MENU.goods',
                url: 'procurment-product-item',
                icon: 'clipboard',
                color: 'success',
              },
              {
                title: 'ACHATS',
                url: 'purchase',
                icon: 'expand',
                color: 'success',
              },

              {
                title: 'MENU.statistics',
                ///icicic
                color: 'primary',
                children: [
                  {
                    title: 'MENU.sale_per_date',
                    url: 'sale-per-day',
                    icon: 'cash',
                    color: 'success',
                  },
                ],
              },

              {
                title: 'MENU.profile',
                url: 'employees-update-password',
                icon: 'clipboard',
                color: 'tertiary',
              },
            ];

            let setting = JSON.parse(localStorage.getItem('setting'));

            if (Array.isArray(setting)) {
              if (setting[0]['manage_expenses']) {
                this.navigate.push({
                  title: 'depenses',
                  url: '/home-expense',
                  icon: 'expand',
                  color: 'warning',
                });
                this.navigate.push({
                  title: 'clients',
                  url: '/store-customer',
                  icon: 'people',
                  color: 'warning',
                });
              }
            } else {
              if (setting['manage_expenses']) {
                this.navigate.push({
                  title: 'depenses',
                  url: '/home-expense',
                  icon: 'expand',
                  color: 'warning',
                });
                this.navigate.push({
                  title: 'clients',
                  url: '/store-customer',
                  icon: 'people',
                  color: 'warning',
                });
              }
            }
          } else {
            this.navigate = [
              {
                title: 'MENU.home',
                url: 'start',
                icon: 'home',
                color: 'danger',
              },

              {
                title: 'MENU.warehouse',
                color: 'primary',
                children: [
                  {
                    title: 'MENU.stock',
                    url: 'warehouse',
                    icon: 'appstore',
                  },
                  /* {
                    title: "MENU.products",
                    url: "product-item-list",
                    icon: "home",
                  },
                  {
                    title: "MENU.dishes",
                    url: "product-manufactured-manage",
                    icon: "home",
                  },
                  {
                    title: "MENU.packslist",
                    url: "product-pack-item-add",
                    icon: "home",
                  },*/
                  /*  {
                    title: "MENU.item_resource",
                    url: "product-resource-item",
                    icon: "appstore",
                  }, */
                ],
              },
              {
                title: 'MENU.goods',
                url: 'procurment-product-item',
                icon: 'clipboard',
                color: 'success',
              },
              {
                title: 'ACHATS',
                url: 'purchase',
                icon: 'expand',
                color: 'success',
              },
              {
                title: 'MENU.posLive',
                url: 'poslive',
                icon: 'clipboard',
                color: 'tertiary',
              },
              {
                title: 'MENU.statistics',
                ///icicic
                color: 'primary',
                children: [
                  {
                    title: 'MENU.invoices',
                    url: 'invoice-paie',
                    icon: 'cash',
                    color: 'success',
                  },
                  {
                    title: 'MENU.sale_per_date',
                    url: 'sale-per-day',
                    icon: 'cash',
                    color: 'success',
                  },

                  /* {
                    title: "MENU.activities",
                    url: "/",
                    icon: "expand",
                    color: "warning",
                  }, */
                ],
              },

              ,
            ];
          }

          if (this.setting && this.setting.is_Hospital) {
            this.navigate.push({
              title: 'patients',
              url: 'patient-list',
              icon: 'person',
              color: 'white',
            });
          }

          setTimeout(() => {
            let resource = JSON.parse(localStorage.getItem('useResource'));
            if (resource) {
              this.navigate[0].children.push({
                title: 'MENU.item_resource',
                url: 'product-resource-item',
                icon: 'appstore',
              });
            }
          }, 3000);
          this.navigate.push({
            title: 'MENU.profile',
            url: 'employees-update-password',
            icon: 'clipboard',
            color: 'tertiary',
          });
        }
      }
    }
  }

  async disconnect() {
    const alert = await this.alertController.create({
      header: '',
      message: 'LEAVE APP?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'YES',
          handler: async () => {
            // this.backgroundMode.moveToBackground();
            this.events.newInvoices({});
            this.events.newOrder({});
            this.events.invoiceSale({});
            this.events.publishOrder({});
            this.events.addToOrder({});
            this.events.invoiceSale({});
            this.events.serviceConfirmOrder({});
            this.events.serviceConfirmOrder({});
            this.events.invoiceUpdateCancel({});

            if (this.platform.is('android')) {
              // this.backgroundMode.overrideBackButton();
            }
            // this.backgroundMode.excludeFromTaskList();
            /*  this.netWorkservice.stopServer().then((res) => {
              this.router.navigateByUrl("Login");
              navigator["app"].exitApp();
            }); */
          },
        },
      ],
      //  console.log(this.allCart);
    });
    await alert.present();
  }

  giveMenu2() {
    //menu pos & waitress & warehouse
    this.navigate = [
      {
        title: 'MENU.orders',
        url: '/point-of-sale',
        icon: 'clipboard',
        color: 'tertiary',
      },
      {
        title: 'MENU.invoices',
        url: 'invoice-paie',
        icon: 'cash',
        color: 'success',
      },
      {
        title: 'MENU.goods',
        url: 'procurment-product-item',
        icon: 'clipboard',
        color: 'success',
      },
      {
        title: 'MENU.service',
        url: '/shop',
        icon: 'clipboard',
        color: 'tertiary',
      },
      {
        title: 'MENU.activities',
        url: '/activitie',
        icon: 'expand',
        color: 'warning',
      },
      {
        title: 'MENU.warehouse',

        color: 'primary',
        children: [
          {
            title: 'MENU.stock',
            url: 'warehouse',
            icon: 'appstore',
          },
          {
            title: 'MENU.products',
            url: 'product-item-list',
            icon: 'home',
          },
          {
            title: 'MENU.packs',
            url: 'product-pack-item-add',
            icon: 'home',
          },
        ],
      },
      {
        title: 'MENU.goods',
        url: 'procurment-product-item',
        icon: 'clipboard',
        color: 'success',
      },
      {
        title: 'MENU.printer',
        url: 'print-config',
        icon: 'print',
        color: 'tertiary',
      },
      {
        title: 'MENU.profile',
        url: 'employees-update-password',
        icon: 'clipboard',
        color: 'tertiary',
      },
    ];
  }

  giveMenu3() {
    this.navigate = [
      {
        title: 'MENU.home',
        url: 'start',
        icon: 'home',
        color: 'danger',
      },
      {
        title: 'MENU.orders',
        url: '/point-of-sale',
        icon: 'clipboard',
        color: 'tertiary',
      },
      {
        title: 'MENU.invoices',
        url: 'invoice-paie',
        icon: 'cash',
        color: 'success',
      },
      {
        title: 'MENU.goods',
        url: 'procurment-product-item',
        icon: 'clipboard',
        color: 'success',
      },
      {
        title: 'MENU.service',
        url: '/shop',
        icon: 'clipboard',
        color: 'tertiary',
      },
      {
        title: 'MENU.activities',
        url: '/activitie',
        icon: 'expand',
        color: 'warning',
      },
      {
        title: 'MENU.warehouse',

        color: 'primary',
        children: [
          {
            title: 'MENU.stock',
            url: 'warehouse',
            icon: 'appstore',
          },
          {
            title: 'MENU.products',
            url: 'product-item-list',
            icon: 'home',
          },
          {
            title: 'MENU.packs',
            url: 'product-pack-item-add',
            icon: 'home',
          },
        ],
      },
      {
        title: 'MENU.goods',
        url: 'procurment-product-item',
        icon: 'clipboard',
        color: 'success',
      },
      {
        title: 'MENU.statistics',

        color: 'primary',
        children: [
          {
            title: 'MENU.invoices',
            url: 'invoice-paie',
            icon: 'cash',
            color: 'success',
          },

          {
            title: 'MENU.activities',
            url: '/',
            icon: 'expand',
            color: 'warning',
          },
        ],
      },
      {
        title: 'MENU.printer',
        url: 'print-config',
        icon: 'print',
        color: 'tertiary',
      },
      {
        title: 'MENU.profile',
        url: 'employees-update-password',
        icon: 'clipboard',
        color: 'tertiary',
      },
    ];
  }
}
