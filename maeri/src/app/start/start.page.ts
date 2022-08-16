import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { AdminService } from '../services/admin.service';

import { Router } from '@angular/router';
import {
  NavController,
  AlertController,
  ToastController,
  Platform,
  MenuController,
  Animation,
  AnimationController,
  IonContent,
} from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ProductUpdatePage } from '../product-update/product-update.page';
import { TranslateConfigService } from '../translate-config.service';
import { MyeventsService } from '../services/myevents.service';
import { NetworkService } from '../services/network.service';
import { SelectvendorService } from '../services/selectvendor.service';
import { NotificationService } from '../services/notification.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { ManagerInventoryService } from '../services/manager-inventory.service';
import { ManagesocketService } from '../services/managesocket.service';
import { ScreensizeService } from '../services/screensize.service';
import { SaverandomService } from '../services/saverandom.service';
import { Setting } from '../models/setting.models';
import { Store } from '../models/store.model';
import { ElectronService } from '../services/electron.service';
import { Product } from '../models/product.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UrlService } from '../services/url.service';
import io from 'socket.io-client';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  @ViewChild('appfooter', { static: false }) appfooter: ElementRef;
  @ViewChild('main') mainpage: IonContent;
  tabRoles = [];
  public sockets;
  public url;
  admin: boolean = false;
  manager: boolean = false;
  userName: any;
  adminId: any;
  isDesktop: boolean;
  cart = [];
  items = [];
  proposalOrders = 0;
  user: any;
  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true,
  };
  role: string;
  products: any;
  percentproduct: number = 50;
  percent: number = 50;
  radius: number = 100;
  radius1: number = 100;
  fullTime: any = '00:01:30';
  timer: any = false;
  progress: any = 0;
  mballus: any = 'products';
  checkRole: any;
  tabRole: any;
  selectedLanguage: string;

  cashOpening: any;
  casgData: any;
  columns: any;
  rows: any;
  Resto = [];
  Bar = [];
  totalVente = 0;
  totalVenteResto = 0;
  totalVenteBar = 0;
  totalsaleProd = 0;
  openTicket = 0;
  openTicketBar = 0;
  openTicketResto = 0;
  cashDayTicket = 0;
  cashBar = 0;
  cashResto = 0;

  barOpen: Boolean = false;
  restoOpen: Boolean = false;
  restoTab = [];
  barTab = [];
  inventaireList = [];
  billsBar = 0;
  billsResto = 0;
  cashOpened: Boolean;
  manageStockWithService: Boolean = false;
  disableBtn: Boolean = false;
  productItem: any[] = [];
  productItem2 = [];
  adminstrator: Boolean = false;
  bg: '';
  multistore = true;
  multiStoreProductitem = [];
  enableFooter: Boolean = true;
  valueDate: Date;
  userCustomerAuthorisation = false;
  saleToRetailer = false;
  setting: Setting;
  storeList: Store[];
  useBonus = false;
  showBtn = true;
  destroy$ = new Subject();
  showMe = false;
  constructor(
    private restApiService: RestApiService,
    public router: Router,
    public modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public alertController: AlertController,
    public adminService: AdminService,
    public toastController: ToastController,
    private menu: MenuController,
    public events: MyeventsService,
    public netWorkservice: NetworkService,
    public vendorService: SelectvendorService,
    public notif: NotificationService,
    public getStoreName: GetStoreNameService,
    public restApi: RestApiService,
    private managerService: ManagerInventoryService,
    private animationCtrl: AnimationController,
    private manageSocket: ManagesocketService,
    private screensizeService: ScreensizeService,
    public saveRandom: SaverandomService,
    private plt: Platform,
    private electronService: ElectronService,
    private urlService: UrlService
  ) {
    let user = {};
    /// this.setting = JSON.parse(localStorage.getItem('setting'))[0];
    if (JSON.parse(localStorage.getItem('user')).length) {
      user = JSON.parse(localStorage.getItem('user'))[0];
    } else {
      user = JSON.parse(localStorage.getItem('user'));
    }
    console.log('the user here ===>', user);

    this.userName = user['name'] ? user['name'] : user['firstName'];

    if (user && user['venderRole']) {
      this.router.navigateByUrl('vendor-start');
    } else {
      // console.log(user);

      if (JSON.parse(localStorage.getItem('user'))['name']) {
        //  this.userName = JSON.parse(localStorage.getItem('user'))['name'];
      }

      this.tabRoles = JSON.parse(localStorage.getItem('roles'));

      if (this.tabRoles.includes(2) || this.tabRoles.includes(6)) {
        this.disableBtn = true;

        this.takeTheLastInventory();
      }
      if (this.tabRoles.includes(1)) {
        this.adminstrator = true;
        this.enableFooter = false;
        this.menu.enable(true, 'first');
      }
      if (
        this.tabRoles.includes(1) ||
        this.tabRoles.includes(2) ||
        this.tabRoles.includes(6)
      ) {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.checkRole = JSON.parse(localStorage.getItem('tabrole'));
        if (this.checkRole && this.checkRole.length) {
          this.tabRole = this.checkRole.filter((elt) => {
            return elt.numberId === 2 || elt.numberId === 6;
          });
        }
      }

      if (this.tabRoles.includes(1)) {
        this.admin = true;
      }
      if (this.tabRoles.includes(2)) {
        this.manager = true;
      }
      if (this.tabRoles.includes(6)) {
        this.manager = true;
        this.saveRandom.setSuperManager();
      }

      this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
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
  takeUrl() {
    this.urlService
      .getUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.url = data;
        this.webServerSocket();
      });
  }
  ngAfterViewInit() {
    this.screenCheck();
    const animation: Animation = this.animationCtrl
      .create()
      //.addElement(this.appfooter.nativeElement)
      .addElement(document.querySelector('.square'))
      .duration(2000)
      .fromTo('transform', 'translateY(40px)', 'translateY(0px)')
      .fromTo('opacity', '0', '1');

    const animation2: Animation = this.animationCtrl
      .create()
      //.addElement(this.appfooter.nativeElement)
      .addElement(document.querySelector('.stock'))
      .duration(2000)
      .fromTo('transform', 'translateX(40px)', `translateX(0px)`)
      .fromTo('opacity', '0', '1');

    const animation3: Animation = this.animationCtrl
      .create()
      //.addElement(this.appfooter.nativeElement)
      .addElement(document.querySelector('.plusvendus'))
      .duration(2000)
      .fromTo('transform', 'translateX(40px)', `translateX(0px)`)
      .fromTo('opacity', '0', '1');

    const animation4: Animation = this.animationCtrl
      .create()
      //.addElement(this.appfooter.nativeElement)
      .addElement(document.querySelector('.jourvente'))
      .duration(2000)
      .fromTo('transform', 'translateX(40px)', `translateX(0px)`)
      .fromTo('opacity', '0', '1');

    animation.play();
    animation3.play();
    animation4.play();
    animation2.play();
  }

  ionViewWillEnter() {
    let user = {};

    this.valueDate = new Date();
    //  this.pushNotification();
    if (JSON.parse(localStorage.getItem('user')).length) {
      user = JSON.parse(localStorage.getItem('user'))[0];
    } else {
      user = JSON.parse(localStorage.getItem('user'));
    }
    if (user && user['venderRole']) {
      this.router.navigateByUrl('vendor-start');
    } else {
      ///  this.takeProductItems();

      let a = this.vendorService.getProposalOrder();
      if (a.length) {
        this.proposalOrders = a.length;
      }
    }
    this.setting = this.saveRandom.getSetting();
    console.log(this.setting);
  }

  ionViewDidEnter() {
    let user = {};
    let result = JSON.parse(localStorage.getItem('user'));

    if (result.length && result[0]) {
      user = JSON.parse(localStorage.getItem('user'))[0];
    } else {
      user = JSON.parse(localStorage.getItem('user'));
    }
    if (user && user['venderRole']) {
      this.router.navigateByUrl('vendor-start');
    }
  }
  ngOnInit() {
    this.menu.enable(true, 'first');

    this.adminId = localStorage.getItem('adminId');
    this.getSetting();
    this.getProposalOrders(this.adminId);
    this.takeUrl();
  }

  registerUserCustomer() {
    setTimeout(() => {
      let setting = JSON.parse(localStorage.getItem('setting'))[0];
      if (setting && setting['register_customer']) {
        this.userCustomerAuthorisation = true;
      } else {
        this.userCustomerAuthorisation = false;
      }
    }, 2000);
  }

  languageChanged() {
    localStorage.setItem('language', this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
    this.events.setLanguage(this.selectedLanguage);
  }

  takeCashOpen() {
    this.adminService.getOpenCash().subscribe((data) => {
      if (data['docs'].length) {
        this.cashOpening = data['docs'].length;
        this.cashOpened = true;
        this.casgData = data['docs'][0];
        localStorage.setItem('openCashDate', data['docs'][0]['openDate']);
        localStorage.setItem(
          'openCashDateObj',
          JSON.stringify(data['docs'][0])
        );
      } else {
        localStorage.removeItem('openCashDate');
        localStorage.removeItem('openCashDateObj');
        localStorage.removeItem('openCashDateId');
        localStorage.removeItem('queryDate');
        localStorage.removeItem('d');
        localStorage.removeItem('dpick');
      }
    });
  }
  get3LastResume() {
    /* this.adminService.get3LastResumeAdminInventory().subscribe((data) => {
      this.inventaireList = data['docs'];
      console.log('inventaire===>', this.inventaireList);
    }); */
  }
  takePaieInvoice() {
    this.adminService.getOrder().subscribe((data) => {
      this.totalVente = 0;
      this.Bar = [];
      this.Resto = [];
      data['docs'].forEach((elt) => {
        if (elt['_id']['type'] === 'manufacturedItems') {
          this.Resto.push(elt);
        }
        if (elt['_id']['type'] === 'productItems') {
          this.Bar.push(elt);
        }
      });
    });
  }

  takeBills() {
    this.adminService.getBill().subscribe((data) => {
      let tab = data['docs'];

      this.cashBar = 0;
      this.cashResto = 0;
      this.cashDayTicket = tab.length;
      this.totalsaleProd = 0;
      tab.forEach((elt) => {
        elt['commandes'].forEach((pro) => {
          pro['products'].forEach((items) => {
            if (items['item']['productType'] === 'manufacturedItems') {
              this.cashResto = this.cashResto + items['price'];
              this.restoTab.push(elt.numFacture);
            }
            if (items['item']['productType'] === 'productItems') {
              this.cashBar = this.cashBar + items['price'];
              this.barTab.push(elt.numFacture);
            }
          });
        });

        this.totalsaleProd = this.totalsaleProd + elt.montant;
      });
      this.billsResto = Array.from(new Set(this.restoTab)).length;
      this.billsBar = Array.from(new Set(this.barTab)).length;
    });
  }

  async getOrders() {
    let tabResto = [];
    let tabBar = [];
    let countInvoiceResto = [];
    let countInvoiceBar = [];
    let NumfactureResto = [];
    let NumfactureBar = [];
    this.adminService.getInvoiceNotPaieAdmin().subscribe(
      async (data) => {
        this.totalVenteResto = 0;
        this.totalVenteBar = 0;
        data['docs'].forEach((elt) => {
          if (elt['_id']['type'] === 'manufacturedItems') {
            tabResto.push(elt);
            countInvoiceResto.push(elt['count']);
            NumfactureResto.push(elt['_id']['numFacture']);
          }
          if (elt['_id']['type'] === 'productItems') {
            tabBar.push(elt);
            countInvoiceBar.push(elt['count']);
            NumfactureBar.push(elt['_id']['numFacture']);
          }
        });
        this.openTicketResto = Array.from(new Set(NumfactureResto)).length;
        this.openTicketBar = Array.from(new Set(NumfactureBar)).length;

        tabResto.forEach((item) => {
          this.totalVenteResto = this.totalVenteResto + item.totalSalesAmount;
        });
        tabBar.forEach((item) => {
          this.totalVenteBar = this.totalVenteBar + item.totalSalesAmount;
        });
      },
      (err) => {
        // console.log("error here", err);
      }
    );
  }

  async presentUpdate(product) {
    //console.log(product);
    const modal = await this.modalController.create({
      component: ProductUpdatePage,
      componentProps: {
        product: product,
      },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  webServerSocket() {
    let id = localStorage.getItem('adminId');
    let storeId = this.saveRandom.getStoreId();
    this.sockets = io(this.url);
    // this.manageSocket
    // .getSocket()
    // .pipe(takeUntil(this.destroy$))
    // .subscribe((sockets) => {
    this.sockets.on('connect', () => {});
    this.sockets.on(`${id}buyOrder`, async (data) => {});

    this.sockets.on(`${id}cashClose`, (data) => {
      this.takeCashOpen();
    });

    this.sockets.on(`${id}newproposalOrder`, async (data) => {
      this.getProposalOrders(id);
      this.notif.presentToast('proposition de commande', 'success');
    });

    this.sockets.on(`${id}RetailerConfirmOrderProposal`, async (data) => {
      setTimeout(() => {
        this.getProposalOrders(id);
      }, 1000);
      this.notif.presentToast('commande envoyé!', 'success');
    });
    this.sockets.on(`${id}RetailerConfirmOrder`, async (data) => {
      if (data['status'] == 4 && data['isBuy'] == 1) {
        // this.addToStock(data["commandes"]);
        let msg = `la Commande livré !!!`;
        this.notif.presentToast(msg, 'success');
      }

      if (data['status'] == 3) {
        let msg = `la Commande est disponible.`;
        this.notif.presentToast(msg, 'warning');
      }

      if (data['status'] == 2) {
        let msg = `Commande en cours de traitement `;
        this.notif.presentToast(msg, 'primary');
      }

      if (data['status'] == 1) {
        let msg = `Commande confirmé `;
        this.notif.presentToast(msg, 'primary');
      }
    });
    this.sockets.on(`${id}invoiceCancel`, async (data) => {
      // this.presentToast2("new order!");
      console.log('depuis start page ligne 477');

      // this.getOrders();
      // this.takePaieInvoice();
      this.openTicket = this.openTicket + 1;
    });

    this.sockets.on(`${id}invoiceadd`, async (data) => {
      let tp = 0;
      this.getOrders();
      this.takePaieInvoice();
      this.totalVente = this.totalVente - tp;
    });

    this.sockets.on(`${id}newBill`, async (data) => {
      console.log('depuis start page ligne 492');
      this.totalsaleProd = this.totalsaleProd + data['montant'];
      this.getOrders();
      this.takePaieInvoice();
      this.takeBills();
    });
    this.sockets.on(`${id}${storeId}billardItem`, async (data: Product) => {
      if (data.quantityToAlert && data.quantityStore <= data.quantityToAlert) {
        let message = `le produit ${data.name} doit etre ravitaillé la quantité en vente est: ${data.quantityStore}`;
        if (this.plt.is('electron')) {
          this.sendNotification(message);
        }
        this.notif.presentToast(message, 'danger');
      }
    });
    // });
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
  async presentToast2(msg) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-classIn',
    });
    toast.present();
  }

  getSetting() {
    this.adminService.getCompanySetting().subscribe((data) => {
      this.takeCashOpen();

      if (data['company'].use_bonus) {
        this.useBonus = true;
      }

      if (data['company'].length) {
        let obj = data['company'][0];

        if (!obj['multi_store']) {
          this.multistore = false;
        }
        this.saveRandom.setSetting(obj);

        localStorage.setItem('setting', JSON.stringify(data['company']));
        this.bg = obj['logo'];

        localStorage.setItem(
          'useResource',
          JSON.stringify(obj['use_resource'])
        );
        localStorage.setItem(
          'manageStockWithService',
          JSON.stringify(obj['manageStockWithService'])
        );
        localStorage.setItem('poslive', JSON.stringify(obj['use_pos_live']));
        this.setting = this.saveRandom.getSetting();
        if (this.setting) {
          this.productItem = [];
          this.takeProductItems();
          this.takeProductServiceList();
          if (this.setting.manage_expenses) {
            this.showMe = true;
          }
        }
        this.storeList = this.saveRandom.getStoreList();
        let storeType = this.saveRandom.getStoreTypeList();
        if (
          !this.setting.check_service_quantity &&
          storeType.length == 1 &&
          storeType.includes('services')
        ) {
          // this.showBtn = false;
        }
        this.manageStockWithService = obj['manageStockWithService'];
        if (obj['saleToRetailer']) {
          this.saleToRetailer = true;
          localStorage.setItem('saleToRetailer', JSON.stringify(true));
        } else {
          localStorage.setItem('saleToRetailer', JSON.stringify(false));
        }
      }
    });
  }

  takeInvoiceAggregate() {
    this.adminService.getInvoiceByDate3().subscribe((data) => {
      this.cart = data['docs'];
    });
  }

  openResto() {
    this.restoOpen = !this.restoOpen;
  }
  async presentAlertPrompt() {
    if (localStorage.getItem('manageStockWithService') === 'true') {
      localStorage.removeItem('oneOnly');
      if (JSON.parse(localStorage.getItem('cashClose'))) {
        this.closeCash(this.casgData);
      } else {
        this.closeCash(this.casgData);
      }
    } else {
      const alert = await this.alertController.create({
        cssClass: 'closeCash',
        message: `open: ${this.casgData.cashFund}, want to close cash ?`,
        /* inputs: [
          {
            name: "closing_cash",
            type: "number",
            placeholder: "closing cash",
          },
        ],*/
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
            handler: () => {
              //this.casgData["closing_cash"] = parseInt(data["closing_cash"]);
              this.closeCash(this.casgData);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  async postCashOpen() {
    let storeTypes = this.saveRandom.getAdminAccount().storeType;
    if (storeTypes.length == 1 && storeTypes.includes('services')) {
      this.router.navigateByUrl('fiche-pointage');
    } else {
      this.router.navigateByUrl('inventaire-list');
    }
  }

  closeCash(data) {
    //this.casgData = data["docs"][0];
    localStorage.setItem('openCashDate', data['openDate']);
    localStorage.setItem('openCashDateObj', JSON.stringify(data));
    this.router.navigateByUrl('before-inventory');
  }

  takeProductItems() {
    this.restApiService.getProductItem().subscribe((data: any[]) => {
      this.get3LastResume();
      this.takeInvoiceAggregate();
      this.productItem = [...this.productItem, ...data];
      // this.productItem = data;
      this.productItem2 = data;
      this.productItem = this.productItem.filter((elt) => {
        return elt['quantityItems'] <= elt['quantityToAlert'];
      });
      this.productItem = this.productItem.sort(
        (a, b) => a['quantityItems'] - b['quantityItems']
      );
      this.sortProductItem();
      let group = this.productItem.reduce((r, a) => {
        r[a.storeId] = [...(r[a.storeId] || []), a];
        return r;
      }, {});
      this.multiStoreProductitem = [];

      for (const property in group) {
        this.multiStoreProductitem.push(group[property]);
      }

      this.multiStoreProductitem.forEach(async (arr) => {
        let name = await this.getStoreName.takeName(arr);
        arr['storeName'] = name;
      });
    });
  }

  takeProductServiceList() {
    let storeType: any[] = this.saveRandom.getAdminAccount().storeType;
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.restApiService.getBillardList().subscribe(async (data) => {
      if (storeType.includes('shop')) {
        this.takeProductListShop();
      }

      //let a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
      let a = data['product'];
      if (this.saveRandom.getSuperManager()) {
        a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
      } else {
        a = data['product'].filter((elt) => elt.storeId === storeId);
      }

      this.productItem = [...this.productItem, ...a];
      this.sortProductItem();
    });
  }

  takeProductListShop() {
    this.restApiService.getShopList().subscribe(async (data) => {
      let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
      let a = data['product'];
      if (this.saveRandom.getSuperManager()) {
        a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
      } else {
        a = data['product'].filter((elt) => elt.storeId === storeId);
      }
      this.productItem = [...this.productItem, ...a];
      this.sortProductItem();
    });
  }

  sortProductItem() {
    if (this.productItem.length) {
    }
    this.productItem = this.productItem.sort((b, c) => {
      if (b.name.toLocaleLowerCase() > c.name.toLocaleLowerCase()) {
        return 1;
      }
      if (b.name.toLocaleLowerCase() < c.name.toLocaleLowerCase()) {
        return -1;
      }
      return 0;
    });
  }

  async logOut() {
    let a: any = {};
    this.translate.get('MENU.ok').subscribe((t) => {
      a['ok'] = t;
    });
    this.translate.get('MENU.no').subscribe((t) => {
      a['cancel'] = t;
    });
    this.translate.get('MENU.leaveapp').subscribe((t) => {
      a['leaveapp'] = t;
    });
    const alert = await this.alertController.create({
      header: '',
      message: a.leaveapp.toUpperCase(),
      buttons: [
        {
          text: a.cancel.toUpperCase(),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: a.ok.toUpperCase(),
          handler: async () => {
            this.events.newInvoices({});
            this.events.newOrder({});
            this.events.invoiceSale({});
            this.events.publishOrder({});
            this.events.addToOrder({});
            this.events.invoiceSale({});
            this.events.serviceConfirmOrder({});
            this.events.serviceConfirmOrder({});
            this.events.invoiceUpdateCancel({});
            if (this.plt.is('android')) {
              this.netWorkservice.stopServer().then((res) => {
                this.router.navigateByUrl('Login');
                navigator['app'].exitApp();
              });
            } else {
              this.router.navigateByUrl('Login');
              navigator['app'].exitApp();
            }
          },
        },
      ],
      //  console.log(this.allCart);
    });
    await alert.present();
  }
  getProposalOrders(adminId) {
    this.vendorService
      .retailerGetOrdersProposal(adminId)
      .subscribe((data: Array<any>) => {
        this.proposalOrders = data.length;
        if (data.length) {
          this.vendorService.setProposalOrder(data);
        } else {
          ///this.vendorService.setProposalOrder([]);
        }
      });
  }
  displayProposalOrders() {
    this.router.navigateByUrl('retailer-display-order-proposal');
  }
  makeInventory() {
    this.router.navigateByUrl('before-inventory');
  }
  takeTheLastInventory() {
    this.managerService.getLastInventory().subscribe(
      (result: any) => {
        if (!result.length) {
          this.managerService.postInvetory([]).subscribe(
            (result2) => {},
            (err) => {}
          );
        }
      },
      (err) => {}
    );
  }

  listYourRetailer() {
    this.router.navigateByUrl('/employee-retailer-list');
  }
  displayBill() {
    this.router.navigateByUrl('manager-display-bill');
  }
  sendNotification(msg) {
    this.electronService.showNotification(msg);
  }
}
