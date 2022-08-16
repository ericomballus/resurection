import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../services/admin.service';

import {
  ModalController,
  AlertController,
  LoadingController,
  // Events,
  ToastController,
  Platform,
  MenuController,
  ActionSheetController,
} from '@ionic/angular';
import { DetailsPage } from './details/details.page';
import { Router } from '@angular/router';
import { ConfimOrderPage } from '../confim-order/confim-order.page';
import { TranslateConfigService } from '../translate-config.service';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil, takeWhile } from 'rxjs/operators';
import { OfflineManagerService } from '../services/offline-manager.service';
import { ScreensizeService } from '../services/screensize.service';
import { RestApiService } from '../services/rest-api.service';
//import { CacheService } from "ionic-cache";
import { GeofenceService } from '../services/geofence.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

import { UrlService } from '../services/url.service';
import { NetworkService } from '../services/network.service';
import { MyeventsService } from '../services/myevents.service';
import { HTTP } from '@ionic-native/http/ngx';
import { PrinterService } from '../services/printer.service';
import { NotificationService } from '../services/notification.service';
import { ManagesocketService } from '../services/managesocket.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { PickEmployeeRetailerPage } from '../employees/pick-employee-retailer/pick-employee-retailer.page';
import { SaverandomService } from '../services/saverandom.service';
import { CachingService } from '../services/caching.service';
import { TranslateService } from '@ngx-translate/core';
const API_STORAGE_KEY = 'specialkey';
import io from 'socket.io-client';
import { Admin } from '../models/admin.model';
import { Setting } from '../models/setting.models';
//import { ElectronService } from '../services/electron.service';
//const electron = (<any>window).require('electron');
@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.page.html',
  styleUrls: ['./point-of-sale.page.scss'],
})
export class PointOfSalePage implements OnInit, OnDestroy {
  public mysockets;
  public shopSocket;
  public url;
  public sockets;
  isDesktop: boolean;
  orders = [];

  adminId: any;
  tabRoles = [];
  admin: boolean = false;
  adminUser: Admin;
  manager: boolean = false;
  userName: any;
  notification = [];
  selectedLanguage: string;
  openCashDate: any;
  openCashDateId: any;
  ip: string;
  lat: any = 0;
  lng: any = 0;
  viewMode = 'invoices';
  products: any;
  products2: any;
  productResto = [];
  shopAutorisation: boolean = false;
  totalItems = 0;

  desktopTab = [];
  transaction = [];

  cashOpened: Boolean;
  casgData: any;
  tables: any;
  storeName = 'MAERI';
  serverStatus = new BehaviorSubject(false);
  senderId = JSON.parse(localStorage.getItem('user'))['_id'];
  destroy$ = new Subject();
  randomId = '';
  loadInvoice = false;
  sub: boolean = true;

  EmployesList: any[] = [];
  setting: Setting;

  constructor(
    private adminService: AdminService,
    public modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public router: Router,
    private translateConfigService: TranslateConfigService,
    private offlineManager: OfflineManagerService,
    public events: MyeventsService,
    private screensizeService: ScreensizeService,
    public restApiService: RestApiService,
    public geofenceService: GeofenceService,
    private urlService: UrlService,
    public toastController: ToastController,
    public netWorkservice: NetworkService,
    private httpN: HTTP,
    private printer: PrinterService,
    private platform: Platform,
    private menu: MenuController,
    private notifi: NotificationService,
    private getStoreName: GetStoreNameService,
    public actionSheet: ActionSheetController,
    public authService: AuthServiceService,
    public saveRandom: SaverandomService,
    public cacheService: CachingService,
    private manageSocket: ManagesocketService,
    public translate: TranslateService //  public es: ElectronService
  ) {
    //this.checkLocalServer()
    this.menu.enable(true, 'first');
  }

  ionViewDidEnter() {
    if (this.platform.is('android') || this.platform.is('cordova')) {
      this.scanPrinter();

      if (this.netWorkservice.loaderServer) {
      } else {
        this.netWorkservice.loadLocalServer();
      }
    } else if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      this.printer.webPrinter('texte');
    } else if (
      this.platform.is('desktop') ||
      this.platform.is('mobileweb') ||
      this.platform.is('electron')
    ) {
    }
    if (!this.netWorkservice.state) {
      this.netWorkservice.initializeNetworkEvents();
    }

    this.screenCheck();
    this.getSetting();
    this.takeUrl();
    this.takeCashOpen();
    this.languageChanged();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (JSON.parse(localStorage.getItem('user'))['name']) {
      this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    }

    if (this.tabRoles.includes(1)) {
      this.admin = true;
    }
    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(4) ||
      this.tabRoles.includes(2)
    ) {
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId);
    }
  }

  ionViewWillEnter() {
    let dataInStorage;

    this.listenEvent();
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    if (storeId) {
      this.getStoreName
        .takeNameById(storeId)
        .then((res: string) => (this.storeName = res));
    }
    this.getTransaction();
    this.adminUser = this.saveRandom.getAdminAccount();
  }
  ngOnInit() {
    this.setting = this.saveRandom.getSetting();
    this.setting.use_Consigne;
  }

  listenEvent() {
    this.events
      .getNewOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (res) => {
          if (res) {
            setTimeout(() => {
              let dataInStorage;
              this.cacheService
                .getCachedRequest('userCommande')
                .then((data: any[]) => {
                  if (data && data.length) {
                    setTimeout(() => {
                      //  this.getOrders();
                    }, 1500);
                    this.orders = [];
                    dataInStorage = data;
                    //  this.orders = dataInStorage;
                    this.useStorageData(dataInStorage);
                  } else {
                    this.getOrders();
                  }
                })
                .catch((err) => {
                  console.log('erorrr');
                  this.getOrders();
                });
            }, 1000);
          } else {
            setTimeout(() => {
              this.getOrders();
            }, 1000);
          }
        },
        (err) => {
          console.log(' erreur ici===>', err);
          this.getOrders();
        }
      );
    this.events
      .getInvoiceSale()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {});
    this.events
      .getPublishOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // alert("display invoices");
        if (data['localId']) {
          setTimeout(() => {
            let index = this.orders.findIndex((elt) => {
              return elt.localId === data['localId'];
            });

            if (index >= 0) {
              // alert("existe deja");
            } else {
              data.anime = true;
              data.anime = true;
              data['Posconfirm'] = true;
              if (data['userName'] == this.userName) {
                data['sender'] = 'POS';
                // data["confirm"] = true;
              }

              this.events.posStoreOrders(data, 'update').then((res) => {});
            }
          }, 1000);
        }
      });
    this.events
      .getConfirmOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        // alert("service confirm order");
        if (data['localId']) {
          let index = this.orders.findIndex((elt) => {
            return elt.localId === data['localId'];
          });
          if (index >= 0) {
            let changes = this.orders[index];
            changes['Posconfirm'] = true;
            changes['confirm'] = true;
            this.orders[index]['Posconfirm'] = true;
            this.orders[index]['confirm'] = true;
            this.orders.splice(index, 1, changes);
          }
        }
      });

    this.events
      .getInvoiceCancel()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        setTimeout(() => {
          let index = this.orders.findIndex((elt) => {
            return elt.localId == data['localId'];
          });
          if (index >= 0) {
            this.orders = this.orders.filter((elt) => {
              return elt.localId !== data['localId'];
            });
          }
        }, 3000);
      });

    this.events
      .getInvoiceCancelUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        setTimeout(() => {
          if (data['localId']) {
            let index = this.orders.findIndex((elt) => {
              return elt.localId === data['localId'];
            });
            if (index >= 0) {
              if (data['commandes']) {
                // changes["commandes"] = data["commandes"];
                this.orders.splice(index, 1, data);
              }
            }
          }
        }, 3000);
      });

    this.events
      .getAddOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        if (id) {
          setTimeout(async () => {
            let index1 = this.orders.findIndex((elt) => {
              return elt.localId === id;
            });
            if (index1 >= 0) {
              let tab;
              // tab = JSON.parse(localStorage.getItem(`userCommande`));
              tab = this.cacheService.getCachedRequest('userCommande');

              if (tab && tab.length) {
                let index2 = tab.findIndex((elt) => {
                  return elt.localId === id;
                });
                // changes["Posconfirm"] = true;
                if (index2 >= 0) {
                  let changes = tab[index2];
                  let totalPrice = 0;
                  changes['commandes'].forEach((com) => {
                    com['products'].forEach((prod) => {
                      totalPrice = totalPrice + prod['price'];
                    });
                  });
                  changes['totalPrice'] = totalPrice;
                  this.orders.splice(index1, 1, changes);
                }
              }
            }
          }, 2000);
        }
      });
  }
  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
    this.sockets.disconnect();
  }
  ngOnDestroy() {
    // this.destroy$ = null;
  }

  scanPrinter() {
    this.printer.scan('hello');
  }

  scanIpAddress(data) {
    this.netWorkservice.getInfoHotspot(data);
  }

  takeUrl() {
    this.urlService
      .getUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.url = data;
      });
  }

  getLocalData() {
    let tab = [];
    this.offlineManager
      .getStorageData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data && !data.length && data.commande) {
          this.orders.unshift(data);
          return;
        } else {
        }
        if (data && data.length) {
          data.forEach((order) => {
            order['data']['_id'] = order['id'];
            tab.push(order['data']);
          });
        }
      });
  }
  checkIfOrder(order) {
    const found = this.orders.filter((elt) => elt['_id'] == order['_id']);
    if (found.length) {
    } else {
      this.orders.unshift(order);
    }
  }

  takeCashOpen() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    if (JSON.parse(localStorage.getItem('openCashDateObj'))) {
      this.cashOpened = true;
    }
    this.adminService
      .getOpenCashFromPointOfSale(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data['docs'].length > 0) {
          this.cashOpened = true;
          this.openCashDate = data['docs'][0]['openDate'];
          this.casgData = data['docs'][0];
          this.openCashDateId = data['docs'][0]['_id'];

          localStorage.setItem(
            'openCashDateObj',
            JSON.stringify(data['docs'][0])
          );
          localStorage.setItem('openCashDateId', data['docs'][0]['_id']);
          let openId = JSON.parse(localStorage.getItem('openCashDateObj'))[
            '_id'
          ];

          // this.takeTransaction();
          setTimeout(() => {}, 2000);
        } else {
          this.cashOpened = false;
          this.presentToast('PLEASE OPEN CASH!');
        }
      });
  }

  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  webServerSocket(id) {
    // let sockets = null;

    //  this.sockets = this.manageSocket.getMySocket();
    this.sockets = io(this.url);
    //.getSocket()
    // .pipe(takeWhile(() => this.sub))
    //  .subscribe((sockets) => {

    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.sockets.on(`${id}${storeId}newOrder`, (data) => {
      console.log('new order', data);
      console.log('storeId==>', storeId);
      this.events.posStoreOrders(data, 'store').then(() => {
        if (this.orders && this.orders.length) {
          let index = this.orders.findIndex((elt) => {
            return elt.localId == data['localId'];
          });
          if (index >= 0) {
            this.orders.splice(index, 1, data);
          } else {
            this.orders.unshift(data);
          }
        } else {
          // this.orders.unshift(data);
        }
      });
    });
    this.sockets.on(`${id}newInvoiceChange`, (data) => {
      let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];

      if (data['localId'] === this.randomId) {
        console.log('rienn===');
      } else {
        this.getOrders(openId);
      }
    });

    this.sockets.on(`${id}invoiceadd`, (data) => {
      let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
      if (data['localId'] === this.randomId) {
        console.log('rienn===');
      } else {
        if (!this.platform.is('android') && !this.platform.is('ios')) {
          this.getOrders(openId);
        } else {
          this.getOrders(openId);
        }
      }
    });

    this.sockets.on(`${id}${storeId}buyOrder`, (data) => {
      /* let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
      let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];

      if (data['localId'] === this.randomId) {
        console.log('rienn===');
      } else {
        if (!this.platform.is('android') && !this.platform.is('ios')) {
          this.getOrders(openId);
        } else {
          this.getOrders(openId);
        } 
      }*/
    });
    this.sockets.on(`${id}${storeId}deleteOrder`, (data) => {
      let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
      if (!this.platform.is('android') && !this.platform.is('ios')) {
        if (data['localId'] === this.randomId) {
          console.log('rienn===');
        } else {
          this.getOrders(openId);
        }
      }
    });

    this.sockets.on(`${id}${storeId}invoiceCancel`, (data) => {
      let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
      if (!this.platform.is('android') && !this.platform.is('ios')) {
        this.getOrders(openId);
      }
    });

    this.sockets.on(`${id}serviceConfirmOrder`, (data) => {
      let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
      if (!this.platform.is('android') && !this.platform.is('ios')) {
        this.getOrders(openId);
      }
    });
    this.sockets.on(`newBill`, (data) => {
      let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
      if (data['localId'] === this.randomId) {
        console.log('rienn===');
      } else {
        if (!this.platform.is('android') && !this.platform.is('ios')) {
          this.getOrders(openId);
        }
      }
    });

    this.sockets.on(`${id}${storeId}confirmOrder`, (data) => {
      let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
      if (!this.platform.is('android') && !this.platform.is('ios')) {
        this.getOrders(openId);
      }
    });

    this.sockets.on(`serverconnect`, (data) => {});
    this.sockets.on(`${this.adminId}${storeId}cashClose`, async (data) => {
      this.notifi.dismissLoading();
      this.cashOpened = false;
      if (this.saveRandom.getSetting().sale_Gaz) {
        this.notifi.presentLoading();
        try {
          let montantVendu = await this.getBills();
          console.log(data);

          let storeId = data.storeId;
          let store = await this.foundStore(storeId);

          let res = await this.setBudgetAndUpdate(store, montantVendu);
          await this.updateWithoutExit(res);
          this.notifi.dismissLoading();
          this.presentToast('CASH IS CLOSE !');
          this.router.navigateByUrl('Login');
        } catch (error) {}
      } else {
        this.presentToast('CASH IS CLOSE !');
        localStorage.removeItem('openCashDateId');
        localStorage.removeItem('openCashDateObj');
        this.cacheService.cacheRequest(`invoicePaie`, []);
        this.router.navigateByUrl('Login');
      }

      // this.manageSocket.disconnectSocket();
    });
    this.sockets.on(`${this.adminId}${storeId}cashOpen`, (data) => {
      this.takeCashOpen();
    });
    this.sockets.on(`${this.adminId}newSetting`, (data) => {
      this.getSetting();
    });

    this.sockets.on(`${this.adminId}employeAdd`, (data) => {
      this.takeEmployees();
    });

    this.sockets.on(`${id}transactionNewItem`, (data) => {
      this.notifi.presentToast('you have new notification', 'danger');
      this.transaction.unshift(data['data']);
    });
    // });
    //});
  }

  async getOrders(openCashDateId?) {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
    let id = this.saveRandom.getCashOpenId();
    let openId = JSON.parse(localStorage.getItem('openCashDateObj'))['_id'];
    // this.getLocalInvoice();
    console.log('prendre les factures ici====>');

    this.adminService
      // .getInvoiceNotPaie()
      .getInvoiceNotPaieAdmin2(openId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (data) => {
          if (this.loadInvoice) {
            this.notifi.dismissLoading();
            this.loadInvoice = false;
          }
          if (data && data['docs'] && id) {
            this.tables = data['docs'];
            let tab = data['docs'].filter((elt) => {
              if (
                (elt.openCashDateId === id &&
                  elt.sale === false &&
                  elt.storeId === storeId) ||
                elt.partially === true
                //&&
                // elt.invoiceCancel === false
                //&&
                //  elt.senderId === senderId
              ) {
                return elt;
              }
            });
            let userName = JSON.parse(localStorage.getItem('user'))['name'];

            if (tab && tab.length) {
              tab.forEach((element) => {
                let total = 0;
                element['commandes'].forEach((com) => {
                  com['products'].forEach((prod) => {
                    total = total + prod['price'];
                  });
                });
                element['totalPrice'] = total;
                if (
                  element.userName == userName ||
                  element.senderId == senderId
                ) {
                  element['Posconfirm'] = true;
                  element['confirm'] = true;
                }

                if (element && element['Posconfirm'] == true) {
                  let index = this.orders.findIndex((elt) => {
                    return elt.localId == element['localId'];
                  });

                  if (index >= 0) {
                    if (element.invoiceCancel) {
                      this.orders.splice(index, 1);
                    } else {
                      this.orders.splice(index, 1, element);
                    }
                  } else {
                    if (!element.invoiceCancel) {
                      this.orders.push(element);
                    }
                  }
                }
              });
            }
            this.orders = this.orders.sort((a, b) => {
              return new Date(a.created).getTime() -
                new Date(b.created).getTime() >
                0
                ? -1
                : 1;
            });

            this.orders.forEach((elt) => {
              console.log(elt);

              if (elt['trancheList'] && elt['trancheList'].length) {
                elt['recu'] = 0;
                elt['trancheList'].forEach((t) => {
                  elt['recu'] = elt['recu'] + t['montant'];
                });
              }
            });

            this.notification = tab.filter((elt) => {
              if (
                // elt.openCashDateId == openCashDateId &&
                elt.confirm == false &&
                elt.Posconfirm == false &&
                elt.storeId === storeId &&
                elt.invoiceCancel === false
              ) {
                return elt;
              }
            });
            /* this.orders = this.orders.filter((elt) => {
              if (elt.Posconfirm == true) {
                return elt;
              }
            });*/

            this.desktopTab = this.notification;

            // localStorage.setItem('userCommande', JSON.stringify(tab));
            let invoicesPaie = await this.cacheService.getCachedRequest(
              'invoicePaie'
            ); // toutes les factures payées
            this.cacheService
              .getCachedRequest('userCommande')
              .then((localData: any[]) => {
                if (localData && localData.length) {
                  tab.forEach((com) => {
                    let index = localData.findIndex((elt) => {
                      return elt.localId == com['localId'];
                    });
                    if (invoicesPaie && invoicesPaie.length) {
                      let indexPaie = invoicesPaie.findIndex((inv) => {
                        return inv.localId == com['localId'];
                      });
                      if (indexPaie >= 0) {
                        // la facture a deja été payé
                      } else {
                        if (index >= 0) {
                          localData.splice(index, 1, com);
                        } else {
                          localData.push(com);
                        }
                      }
                    } else {
                      if (index >= 0) {
                        localData.splice(index, 1, com);
                      } else {
                        localData.push(com);
                      }
                    }
                  });
                  localData = localData.filter(
                    (doc) => doc.invoiceCancel === false
                  );
                  this.cacheService.cacheRequest('userCommande', localData);
                } else {
                  tab = tab.filter((doc) => doc.invoiceCancel === false);
                  this.cacheService.cacheRequest('userCommande', tab);
                }
              });
          }
        },
        (err) => {
          //  this.notifi.presentAlert(`some error ${err}`);
        }
      );

    /*
        
        
        */
  }
  print(order) {}
  buyPack(order) {
    this.adminService
      .buyOrder(order._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.orders = this.orders.filter((elt) => {
            return elt._id !== order._id;
          });
        },
        (err) => {}
      );
  }

  async viewMobileManageOrder(order) {
    let a: any = {};
    this.translate.get('MENU.displayInvoice').subscribe((t) => {
      a['displayInvoice'] = t;
    });
    this.translate.get('MENU.cancel').subscribe((t) => {
      a['cancel'] = t;
    });
    if ((order['Posconfirm'] = true)) {
    }

    const actionSheet = await this.actionSheet.create({
      buttons: [
        {
          text: a.displayInvoice + '?',
          role: 'destructive',
          icon: 'eye',
          handler: () => {
            console.log('Delete clicked');
            this.displayDetails(order);
          },
        },
        {
          text: a.cancel,
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }

  async displayDetails(order) {
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        order2: order,
        Pos: false,
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(async (data) => {
      if (data['data'] === 'cancel invoice') {
        setTimeout(async () => {
          let tab;
          // tab = JSON.parse(localStorage.getItem(`userCommande`));
          tab = await this.cacheService.getCachedRequest('userCommande');
          if (tab && tab.length) {
            this.orders = tab.filter((elt) => {
              return elt.localId !== order['localId'];
            });
            this.orders = this.orders.sort((a, b) => {
              return new Date(a.created).getTime() -
                new Date(b.created).getTime() >
                0
                ? -1
                : 1;
            });
          } else {
            this.orders = [];
          }
        }, 1000);
      }
      if (data['data'] === 'no_update') {
        return;
      }
      if (data['data']['status'] === 'ok ok') {
        this.randomId = order['localId'];
        this.restoreData(order);
      }
      if (data['data'] === 'partially paie') {
        // if (this.platform.is('android') || this.platform.is('ios')) {
        //  setTimeout(() => {
        let index = this.orders.findIndex((elt) => {
          return elt.localId === order['localId'];
        });
        if (index >= 0) {
          //this.orders
          this.orders.splice(index, 1, order);
        }
        let tab;
        // tab = JSON.parse(localStorage.getItem(`userCommande`));
        tab = await this.cacheService.getCachedRequest('userCommande');
        if (tab && tab.length) {
          tab.forEach((element) => {
            let total = 0;
            element['commandes'].forEach((com) => {
              com['products'].forEach((prod) => {
                total = total + prod['price'];
              });
            });
            element['totalPrice'] = total;
          });

          let index = tab.findIndex((elt) => {
            return elt.localId === order['localId'];
          });
          if (index >= 0) {
            tab.splice(index, 1, order);
            this.cacheService.cacheRequest('userCommande', tab);
          }
        }
        // }, 5000);
        // }
      }
    });
    return await modal.present();
  }

  restoreData(order) {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    setTimeout(async () => {
      let tab;
      tab = await this.cacheService.getCachedRequest('userCommande');
      if (tab && tab.length) {
        tab.forEach((element) => {
          let total = 0;
          element['commandes'].forEach((com) => {
            com['products'].forEach((prod) => {
              total = total + prod['price'];
            });
          });
          element['totalPrice'] = total;
        });

        this.orders = tab.filter((elt) => {
          return (
            elt.localId !== order['localId'] &&
            elt.storeId === storeId &&
            // elt.senderId === this.senderId &&
            elt.Posconfirm != false
          );
        });
        this.orders = this.orders.sort((a, b) => {
          return new Date(a.created).getTime() - new Date(b.created).getTime() >
            0
            ? -1
            : 1;
        });
      } else {
        this.orders = [];
      }
    }, 1500);
  }
  confirmOrders(ev: Event) {
    this.adminService.buyConfirmOder(ev.target['value']).subscribe(
      (data) => {
        this.orders.unshift(data['resultat']);
        this.notification = this.notification.filter((elt) => {
          return elt._id !== ev.target['value'];
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //here======================
  async presentModal() {
    const modal = await this.modalController.create({
      component: ConfimOrderPage,
      componentProps: {
        data: this.notification,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data['data']['order']) {
        let obj = data['data']['order'];
        this.displayCounter(obj);
      } else {
      }
    });
    return await modal.present();
  }
  displayCounter(order) {
    order['Posconfirm'] = true;
    if (order['userName'] == this.userName) {
      order['sender'] = 'POS';
      order['confirm'] = true;
    }
    this.orders.unshift(order);
    //  this.orders.unshift(data["resultat"]);
    let tab = [];
    tab = JSON.parse(localStorage.getItem(`userCommande`));

    if (tab && tab.length) {
      tab.forEach((elt) => {
        if (elt.localId === order['localId']) {
          elt['Posconfirm'] = true;
        }
      });
      this.cacheService.cacheRequest(`userCommande`, tab);
    }
    this.adminService.buyConfirmOder(order['localId'], order).subscribe(
      (data) => {},
      (err) => {
        console.log(err);
      }
    );
  }
  getSetting() {
    setTimeout(() => {
      this.adminService
        .getCompanySetting()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          let obj = data['company'][0];
          if (obj['logo']) {
            this.printer.download(obj['logo']); //android
            if (this.platform.is('electron')) {
              let tab = obj['logo'].split('/');
              let fileId = tab.pop().split('?').shift();
              let path = `${fileId}`;
              /* this.cacheService
                .saveImagesToLocalServer({
                  url: obj['logo'],
                  filename: 'logo',
                })
                .then((res: string) => {
                  
                })
                .catch((err) => {
                  console.log('error here', err);
                });*/
            }
          }

          if (obj.use_wifi) {
            if (this.platform.is('android')) {
              this.scanIpAddress(data);
            }
          }

          if (obj.employePercentPrice) {
            this.takeEmployees();
          }
          if (data['company'].length) {
            this.lat = obj['latitude'];
            this.lng = obj['longitude'];
            this.ip = obj['ip'];
            if (obj['name']) {
              localStorage.setItem('company', obj['name']);
            } else {
              localStorage.setItem('company', 'Maeri');
            }

            this.saveRandom.setSetting(obj);
            localStorage.setItem('setting', JSON.stringify(obj));
            this.events.publishSetting(obj);

            if (this.platform.is('android')) {
              // this.geofenceService.addGeofence(this.lat, this.lng);
            }
          }
        });
    }, 2000);
  }
  screenCheck() {
    setTimeout(() => {
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
    }, 10);
  }

  displayService() {
    this.shopAutorisation = !this.shopAutorisation;
  }
  displayCart($event) {
    this.totalItems = $event;
  }

  takeTransaction() {
    setTimeout(() => {
      this.adminService
        .getTransactionNotconfirm()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.transaction = data['docs'];
          if (this.transaction.length > 0) {
            // this.router.navigateByUrl("procurment-product-item");
            //  this.presentAlertConfirm();
          }
        });
      this.restApiService
        .getProvision()
        .pipe(takeUntil(this.destroy$))
        .subscribe((tab) => {
          if (tab.length > 0) {
            //  this.presentAlertConfirm();
            //this.router.navigateByUrl("procurment-product-item");
          }
        });
    }, 5000);
  }

  async presentAlertConfirm() {
    const toast = await this.toastController.create({
      message: 'vous avez reçu un nouveau stock de produit!.',
      duration: 6000,
    });
    toast.present();
  }

  async postCashOpen() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];

    const alert = await this.alertController.create({
      header: 'CASH OPEN',
      inputs: [
        {
          name: 'cashFund',
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alertCancel',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          cssClass: 'alertButton',
          handler: (data) => {
            console.log('data for cash open ==>', data);
            // return;
            if (isNaN(parseFloat(data['cashFund']))) {
              this.notifi.presentToast('aucune valeur reçu', 'danger');
            } else {
              this.notifi.presentLoading();
              data['storeId'] = storeId;
              this.adminService
                .postCashOpen(data)
                .pipe(takeUntil(this.destroy$))
                .subscribe(async (data) => {
                  this.takeCashOpen();

                  this.cashOpened = false;
                  localStorage.setItem(
                    'openCashDate',
                    data['message']['openDate']
                  );
                  localStorage.setItem('numFacture', null);

                  this.notifi.dismissLoading();
                  this.presentToast('CASH IS OPEN!');
                });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  closeCash(data) {
    this.notifi.presentLoading();
    this.adminService
      .closeCashOpenPos(this.casgData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (data) => {
          this.cashOpened = false;

          let openId = localStorage.getItem('openCashDateObj');
          this.cacheService.cacheRequest(`invoicePaie`, []);

          this.notifi.dismissLoading();
          setTimeout(() => {
            localStorage.removeItem('openCashDate');
          }, 2000);
          this.router.navigateByUrl('Login');
        },
        (err) => {
          this.notifi.presentToast(
            'impossible de fermer la caisse car impossible de joindre le serveur distant',
            'danger'
          );
        }
      );
  }

  foundStore(id) {
    return new Promise((resolve, reject) => {
      let s: any[] = this.adminUser.storeId;
      console.log('admin store list', s);

      let f = s.find((elt) => elt.id == id);
      if (f) {
        resolve(f);
      } else {
        reject(null);
      }
    });
  }
  setBudgetAndUpdate(store, totalPrice) {
    return new Promise((resolve, reject) => {
      if (store['reste']) {
        store.reste = store.reste + totalPrice;
      } else {
        store['reste'] = store.budget + totalPrice;
      }
      resolve(store);
    });
  }
  updateWithoutExit(store) {
    return new Promise((resolve, reject) => {
      let storeList = this.adminUser.storeId;
      let index = storeList.findIndex((s) => s.id == store.id);
      console.log('index ici ===>', index);
      if (index >= 0) {
        this.adminUser.storeId.splice(index, 1, store);
        this.adminService.updateCustomer(this.adminUser).subscribe(
          (data) => {
            console.log('user update ===>', data);
            resolve(data);
            let admin = data['resultat'];
            if (admin) {
              let arr = [];
              arr.push(admin);
              let s = { count: 1, users: arr };
              localStorage.removeItem('credentialAccount');
              localStorage.setItem('credentialAccount', JSON.stringify(s));
            }
          },
          (err) => console.log(err)
        );
      } else {
        resolve(true);
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

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'closeCash',
      message: `open: ${this.casgData.cashFund}`,
      inputs: [
        {
          name: 'closing_cash',
          type: 'number',
          placeholder: 'closing cash',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (parseInt(data['cashFund'])) {
              data['cashFund'] = parseInt(data['cashFund']);
              // console.log(tableNumber);
            } else {
              //tableNumber = 0;
              // console.log(tableNumber);
            }

            if (parseInt(data['closing_cash'])) {
              data['closing_cash'] = parseInt(data['closing_cash']);
              // console.log(tableNumber);
            } else {
              data['closing_cash'] = 0;
            }
            this.casgData['closing_cash'] = parseInt(data['closing_cash']);
            if (this.casgData['closing_cash']) {
              this.closeCash(data);
            } else {
              this.notifi.presentToast('aucune valeur reçu', 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  }
  async useStorageData(dataInStorage, openCashDateId?) {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.tables = dataInStorage;
    let tabNotif = [];
    let tab = [];
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    if (dataInStorage && dataInStorage.length) {
      // let tab = [];
      dataInStorage.forEach((elt) => {
        if (elt.storeId === storeId) {
          if (elt.userName == userName) {
            elt['Posconfirm'] = true;
          }
          tab.push(elt);
        }
      });
    }

    tab = tab.sort((a, b) => {
      return new Date(a.created).getTime() - new Date(b.created).getTime() > 0
        ? -1
        : 1;
    });

    if (tab && tab.length) {
      tab.forEach((inv) => {
        let index = this.orders.findIndex((elt) => {
          elt.localId == inv['localId'];
        });
        if (index >= 0) {
          // this.orders.splice(index, 1, data);
        } else {
          this.orders.unshift(inv);
        }
      });
      this.orders.forEach((elt) => {
        console.log(elt);

        if (elt['trancheList'] && elt['trancheList'].length) {
          elt['recu'] = 0;
          elt['trancheList'].forEach((t) => {
            elt['recu'] = elt['recu'] + t['montant'];
          });
        }
      });
    } else {
      // this.orders = tab;
      tab = tab.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime() > 0
          ? -1
          : 1;
      });

      tab.forEach((element) => {
        let total = 0;
        element['commandes'].forEach((com) => {
          com['products'].forEach((prod) => {
            total = total + prod['price'];
          });
        });
        element['totalPrice'] = total;
      });
    }
    this.orders = tab;
    this.orders.forEach((elt) => {
      console.log(elt);

      if (elt['trancheList'] && elt['trancheList'].length) {
        elt['recu'] = 0;
        elt['trancheList'].forEach((t) => {
          elt['recu'] = elt['recu'] + t['montant'];
        });
      }
    });

    tabNotif = dataInStorage.filter((elt) => {
      return (
        // elt.openCashDateId == openCashDateId &&
        elt.confirm == false && elt.Posconfirm == false
      );
    });

    if (tabNotif && tabNotif.length) {
      this.notification = tabNotif;
    }
    this.desktopTab = this.notification;
  }

  async pickRetailer() {
    this.authService
      .getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (data) => {
        let list: any[] = data['employes'];
        list = list.filter((employe) => employe.isRetailer);
        if (list.length > 0) {
          const modal = await this.modalController.create({
            component: PickEmployeeRetailerPage,
            backdropDismiss: false,
            componentProps: {
              retailerList: list,
            },
          });
          modal.onWillDismiss().then(async (data) => {
            console.log(data);
            if (data['data']['retailer']) {
              let employe = data['data']['retailer'];
              let product = employe['productsToSale'];
              if (product && product.length) {
                this.saveRandom.confirmIfIsRetailer();
                this.saveRandom.setRetailer(employe);
                let path = { url: 'point-of-sale' };
                localStorage.setItem('backTo', JSON.stringify(path));
                this.router.navigateByUrl('/shop');
              } else {
                this.notifi.presentError(
                  'this employe not have products please provide some before',
                  'danger'
                );
              }
            }
          });
          return await modal.present();
        } else {
          this.notifi.presentError(
            'please provide your retailer before',
            'danger'
          );
        }
      });
  }

  displayCustomers() {
    this.router.navigateByUrl('/store-customer');
  }

  async getLocalInvoice() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
    let data;
    this.cacheService
      .getCachedRequest('userCommande')
      .then((res) => {
        data = res;
        if (data && data.length && Array.isArray(data)) {
          this.tables = data;
          let tab = data.filter((elt) => {
            if (
              //elt.openCashDateId === openCashDateId &&
              elt.sale === false &&
              elt.storeId === storeId &&
              elt.invoiceCancel === false
              // &&
              // elt.senderId === senderId
            ) {
              return elt;
            }
          });
          let userName = JSON.parse(localStorage.getItem('user'))['name'];

          if (tab.length) {
            tab.forEach((element) => {
              let total = 0;
              element['commandes'].forEach((com) => {
                com['products'].forEach((prod) => {
                  total = total + prod['price'];
                });
              });
              element['totalPrice'] = total;
              if (
                element.userName == userName ||
                element.senderId == senderId
              ) {
                element['Posconfirm'] = true;
                element['confirm'] = true;
              }
            });
          }

          this.orders = [];
          this.orders = this.orders.concat(tab);
          this.orders = this.orders.sort((a, b) => {
            return new Date(a.created).getTime() -
              new Date(b.created).getTime() >
              0
              ? -1
              : 1;
          });

          this.notification = this.orders.filter((elt) => {
            if (
              // elt.openCashDateId == openCashDateId &&
              elt.confirm == false &&
              elt.Posconfirm == false &&
              elt.storeId === storeId
            ) {
              return elt;
            }
          });
          this.orders = this.orders.filter((elt) => {
            if (elt.Posconfirm == true) {
              return elt;
            }
          });

          this.desktopTab = this.notification;
        }
      })
      .catch((err) => {
        console.log('erreur decté ici pos', err);
        this.loadInvoice = true;
        this.notifi.presentLoading();
      });
  }
  takeEmployees() {
    this.authService.getEmployees().subscribe((data) => {
      this.EmployesList = data['employes'];
      this.EmployesList = this.EmployesList.sort((c, b) =>
        c.name > b.name ? 1 : -1
      );
      this.saveRandom.setEmployeList(this.EmployesList);
    });
  }

  showNotification() {
    // console.log(electron);
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
  getBills() {
    let rembourse = 0;
    let montant = 0;
    return new Promise((resolve, reject) => {
      this.adminService.getBill().subscribe(
        (data) => {
          console.log(data);

          if (data['docs'].length) {
            montant = 0;
            rembourse = 0;
            data['docs'].forEach((elt) => {
              if (elt.commande.montantReduction) {
                montant = montant + elt.commande.montantReduction;
                elt.montantReduction = elt.commande.montantReduction;
              } else {
                montant = montant + elt.montant;
              }
              if (elt['trancheList'] && elt['trancheList'].length) {
                elt['recu'] = 0;
                elt['trancheList'].forEach((t) => {
                  elt['recu'] = elt['recu'] + t['montant'];
                  /// console.log(elt['recu']);
                });
              }

              if (elt['rembourse'] && elt['reimbursed'] == 1) {
                rembourse = rembourse + elt.rembourse;
              }

              if (elt['recu']) {
                elt.rembourse = elt['recu'] - elt.montant;
              }
            });
            resolve(montant);
          } else {
            resolve(0);
          }
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }
}
