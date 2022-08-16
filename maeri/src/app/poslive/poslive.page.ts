import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { AdminService } from '../services/admin.service';

import { Router } from '@angular/router';
import {
  NavController,
  AlertController,
  ToastController,
  Platform,
  MenuController,
} from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ProductUpdatePage } from '../product-update/product-update.page';
//import { PrintService } from "../print.service";
//import domtoimage from "dom-to-image";
import { EmployeeAddPage } from '../employees/employee-add/employee-add.page';
import { CartService } from '../cart.service';
import { TranslateConfigService } from '../translate-config.service';
//import { Chart } from "chart.js";
import { UrlService } from '../services/url.service';
import io from 'socket.io-client';
import { FcmService } from '../services/fcm.service';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { Location, NgLocalization } from '@angular/common';

@Component({
  selector: 'app-poslive',
  templateUrl: './poslive.page.html',
  styleUrls: ['./poslive.page.scss'],
})
export class PoslivePage implements OnInit {
  tabRoles = [];

  admin: boolean = false;
  manager: boolean = false;
  userName: any;
  adminId: any;
  cart = [];
  items = [];
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
  @ViewChild('barCanvas', { static: true })
  barCanvas: ElementRef;
  @ViewChild('doughnutCanvas', { static: true })
  doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas', { static: true })
  lineCanvas: ElementRef;

  cashOpening: any;
  casgData: any;
  columns: any;
  rows: any;
  Resto = [];
  Bar = [];
  Shop = [];
  ServiceList = [];
  totalVente = 0;
  totalVenteResto = 0;
  totalVenteBar = 0;
  totalVenteService = 0;
  totalVenteShop = 0;
  totalsaleProd = 0;
  openTicket = 0;
  openTicketBar = 0;
  openTicketResto = 0;
  openTicketShop = 0;
  openTicketService = 0;
  cashDayTicket = 0;
  cashBar = 0;
  cashResto = 0;
  cashService = 0;
  cashShop = 0;
  public sockets;
  public url;
  barOpen: Boolean = false;
  restoOpen: Boolean = false;
  shopOpen: Boolean = false;
  serviceOpen: Boolean = false;
  restoTab = [];
  barTab = [];
  shopTab = [];
  serviceTab = [];
  billsBar = 0;
  billsResto = 0;
  billsShop = 0;
  billsService = 0;
  cashOpened: Boolean;
  manageStockWithService: Boolean = false;
  //constructor
  constructor(
    private restApiService: RestApiService,
    private router: Router,
    public navCtrl: NavController,
    public modalController: ModalController,
    private render: Renderer2,
    private cartService: CartService,
    private translateConfigService: TranslateConfigService,
    public alertController: AlertController,
    public adminService: AdminService,
    public toastController: ToastController,
    public urlService: UrlService,
    public fcm: FcmService,
    public notif: NotificationService,
    private menu: MenuController,
    private location: Location
  ) {
    this.menu.enable(true, 'first');

    // console.log();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(6)) {
      let msg =
        "vous n'avez pas souscrit au service pos live. contacter l'équipe Maeri pour bénéficier du service";
      this.notif.presentError(msg, 'danger');
      this.location.back();
    } else if (JSON.parse(localStorage.getItem('poslive'))) {
      if (JSON.parse(localStorage.getItem('user'))['name']) {
        this.userName = JSON.parse(localStorage.getItem('user'))['name'];
      }

      this.tabRoles = JSON.parse(localStorage.getItem('roles'));
      if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
        // this.takeProduct();
        this.user = JSON.parse(localStorage.getItem('user'));
        this.checkRole = JSON.parse(localStorage.getItem('tabrole'));
        if (this.checkRole && this.checkRole.length) {
          this.tabRole = this.checkRole.filter((elt) => {
            return elt.numberId === 2;
          });
        }
      }

      if (this.tabRoles.includes(1)) {
        this.admin = true;
      }
      if (this.tabRoles.includes(2)) {
        this.manager = true;
      }

      this.selectedLanguage = this.translateConfigService.getDefaultLanguage();

      setTimeout(() => {
        // this.takeBills();
        // this.getOrders();
      }, 2000);
    } else {
      let msg =
        "vous n'avez pas souscrit au service pos live. contacter l'équipe Maeri pour bénéficier du service";
      this.notif.presentError(msg, 'danger');
    }

    // this.getSetting();
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('poslive'))) {
      this.takeUrl();
      //  this.items = this.cartService.getProducts();
      // this.cart = this.cartService.getCart();
      this.takeCashOpen();

      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId);
      this.fcm.getToken();
    }

    //this.takePaieInvoice();
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // alert(this.url);
    });
  }

  languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  addToCart(product) {
    this.cartService.addProduct(product);
  }

  takeCashOpen() {
    this.adminService.getOpenCash().subscribe((data) => {
      console.log(data);

      if (data['docs'].length) {
        this.cashOpening = data['docs'].length;
        this.cashOpened = true;
        this.casgData = data['docs'][0];
        localStorage.setItem('openCashDate', data['docs'][0]['openDate']);

        setTimeout(() => {
          this.takePaieInvoice();
          this.takeBills();
          this.getOrders();
          // this.findMax();
        }, 1000);
      } else {
        //  this.presentToast("PLEASE OPEN CASH!");
      }
    });
  }

  takePaieInvoice() {
    this.adminService.getOrder().subscribe((data) => {
      console.log(data);
      this.totalVente = 0;
      this.Bar = [];
      this.Resto = [];
      // this.cashResto = 0;
      //this.cashBar = 0;
      data['docs'].forEach((elt) => {
        if (elt['_id']['type'] === 'manufacturedItems') {
          this.Resto.push(elt);
          // this.cashResto = this.cashResto + elt["totalSalesAmount"];
        }
        if (elt['_id']['type'] === 'productItems') {
          this.Bar.push(elt);
          //  this.cashBar = this.cashBar + elt["totalSalesAmount"];
        }
        if (elt['_id']['type'] === 'shoplist') {
          this.Shop.push(elt);
          //  this.cashBar = this.cashBar + elt["totalSalesAmount"];
        }
        if (elt['_id']['type'] === 'billard') {
          this.ServiceList.push(elt);
          //  this.cashBar = this.cashBar + elt["totalSalesAmount"];
        }
      });
    });
  }

  takeBills() {
    this.adminService.getBill().subscribe((data) => {
      console.log('hello bills');
      console.log(data);

      let tab = data['docs'];

      this.cashBar = 0;
      this.cashResto = 0;
      this.cashDayTicket = tab.length;
      this.totalsaleProd = 0;
      tab.forEach((elt) => {
        elt['commandes'].forEach((pro) => {
          pro['products'].forEach((items) => {
            //  console.log(items);

            if (items['item']['productType'] === 'manufacturedItems') {
              this.cashResto = this.cashResto + items['price'];
              this.restoTab.push(elt.created);
            }
            if (items['item']['productType'] === 'productItems') {
              this.cashBar = this.cashBar + items['price'];
              this.barTab.push(elt.created);
            }
            if (items['item']['productType'] === 'shoplist') {
              this.cashShop = this.cashShop + items['price'];
              this.shopTab.push(elt.created);
              //  this.cashBar = this.cashBar + elt["totalSalesAmount"];
            }
            if (items['item']['productType'] === 'billard') {
              this.cashService = this.cashService + items['price'];
              this.serviceTab.push(elt.created);
            }
          });
        });

        this.totalsaleProd = this.totalsaleProd + elt.montant;
      });
      //console.log(this.restoTab);
      //console.log(this.barTab);
      this.billsResto = Array.from(new Set(this.restoTab)).length;
      this.billsBar = Array.from(new Set(this.barTab)).length;
      this.billsShop = Array.from(new Set(this.shopTab)).length;
      this.billsService = Array.from(new Set(this.serviceTab)).length;
      console.log('bills shop', this.billsShop);
      console.log('bills service', this.billsService);
    });
  }

  async getOrders() {
    let tabResto = [];
    let tabBar = [];
    let tabShop = [];
    let tabService = [];
    let countInvoiceResto = [];
    let countInvoiceBar = [];
    let countInvoiceShop = [];
    let countInvoiceService = [];
    let NumfactureResto = [];
    let NumfactureBar = [];
    let NumfactureShop = [];
    let NumfactureService = [];
    this.adminService.getInvoiceNotPaieAdmin().subscribe(
      async (data) => {
        console.log(data);

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
          if (elt['_id']['type'] === 'shoplist') {
            tabShop.push(elt);
            countInvoiceShop.push(elt['count']);
            NumfactureShop.push(elt['_id']['numFacture']);
          }
          if (elt['_id']['type'] === 'billard') {
            tabService.push(elt);
            countInvoiceService.push(elt['count']);
            NumfactureService.push(elt['_id']['numFacture']);
          }
        });
        this.openTicketResto = Array.from(new Set(NumfactureResto)).length;
        this.openTicketBar = Array.from(new Set(NumfactureBar)).length;
        this.openTicketShop = Array.from(new Set(NumfactureShop)).length;
        this.openTicketService = Array.from(new Set(NumfactureService)).length;

        tabResto.forEach((item) => {
          this.totalVenteResto = this.totalVenteResto + item.totalSalesAmount;
        });
        tabBar.forEach((item) => {
          this.totalVenteBar = this.totalVenteBar + item.totalSalesAmount;
        });
        tabShop.forEach((item) => {
          this.totalVenteShop = this.totalVenteShop + item.totalSalesAmount;
        });
        tabService.forEach((item) => {
          this.totalVenteService =
            this.totalVenteService + item.totalSalesAmount;
        });
        console.log('bar here', this.totalVenteBar);
        console.log('resto here', this.totalVenteResto);
        console.log('shop sale here', this.totalVenteShop);
        console.log('service sale here', this.totalVenteService);
      },
      (err) => {
        // console.log("error here", err);
      }
    );
  }

  openCart() {
    this.router.navigate(['cart']);
  }
  findDoublons(arr) {}

  /* async takeUsers() {
    this.role = await localStorage.getItem("user");
    this.restApiService.getUser(this.role.toString()).subscribe((data) => {
      console.log(data["users"][2]["listclient"]);
    });
  } */

  goCategoryPage() {
    this.navCtrl.navigateBack('category');
  }

  goProductPage() {
    this.navCtrl.navigateBack('product');
  }
  goItemPage() {
    this.navCtrl.navigateForward('product-pack');
  }

  goAddItemPage() {
    this.navCtrl.navigateForward('product-item-add');
  }
  goAddPackItemPage() {
    this.navCtrl.navigateForward('product-pack-item-add');
  }
  goShopPage() {
    this.navCtrl.navigateForward('shop');
  }

  goPointOfSalePage() {
    this.navCtrl.navigateForward('point-of-sale');
  }

  takeProduct() {
    this.restApiService.getProduct().subscribe((data) => {
      // ;
      this.products = data['products'];
      //  let max = data["products"][0]["maxproduct"];
      // let max2 = data["products"].length;
      // this.percentproduct = (max2 / max) * 100;
      setTimeout(() => {
        this.percentproduct = 80;
        let max = data['products'][0]['maxproduct'];
        let max2 = data['products'].length;
        this.percentproduct = (max2 / max) * 100;
      }, 1000);
      if (!data['products'].length) {
        this.restApiService.getProduct().subscribe((data) => {
          console.log('ici', data);
        });
      }
    });
  }

  deleteProduct(product) {
    console.log(product);
    this.restApiService.deleteProduct(product._id).subscribe((data) => {
      this.restApiService.getProductListAfterDelete().subscribe((data) => {
        this.products = data['products'];
      });
    });
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

  async employeeAdd() {
    const modal = await this.modalController.create({
      component: EmployeeAddPage,
      componentProps: {
        product: 'employeeAddFlag',
      },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }
  async employeeShow() {
    const modal = await this.modalController.create({
      component: EmployeeAddPage,
      componentProps: {
        product: 'employeeShowFlag',
      },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  webServerSocket(id) {
    // this.socket.connect();
    this.sockets = io(this.url);
    this.sockets.on('connect', function () {});
    this.sockets.on(`${id}buyOrder`, async (data) => {
      // this.presentToast2("new command");
      this.takePaieInvoice();
      this.getOrders();
      this.takeBills();
    });

    this.sockets.on(`${id}newOrder`, async (data) => {
      this.getOrders();
      console.log('cancel order', data);
    });
    this.sockets.on(`${id}invoiceCancel`, async (data) => {
      // this.presentToast2("new order!");
      console.log('cancel order', data);
      this.getOrders();
      this.takePaieInvoice();
      this.openTicket = this.openTicket + 1;
    });

    this.sockets.on(`${id}invoiceadd`, async (data) => {
      console.log('add order', data);
      let tp = 0;
      this.getOrders();
      this.takePaieInvoice();
      this.totalVente = this.totalVente - tp;
    });

    this.sockets.on(`${id}newBill`, async (data) => {
      console.log('new bill', data);
      this.totalsaleProd = this.totalsaleProd + data['montant'];
      // this.presentToast2("new order!");
      this.getOrders();
      this.takePaieInvoice();
      this.takeBills();
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
      if (data['company'].length) {
        let obj = data['company'][0];
        localStorage.setItem(
          'useResource',
          JSON.stringify(obj['use_resource'])
        );
        localStorage.setItem(
          'manageStockWithService',
          JSON.stringify(obj['manageStockWithService'])
        );

        setTimeout(() => {
          if (localStorage.getItem('manageStockWithService') === 'true') {
            this.manageStockWithService = true;
          }
        }, 1000);
      }
    });
  }

  openBar() {
    this.barOpen = !this.barOpen;
    console.log(this.Bar);
  }

  openResto() {
    this.restoOpen = !this.restoOpen;
  }
  openShop() {
    this.shopOpen = !this.shopOpen;
  }
  openService() {
    this.serviceOpen = !this.serviceOpen;
  }
  async presentAlertPrompt() {
    if (localStorage.getItem('manageStockWithService') === 'true') {
      if (JSON.parse(localStorage.getItem('cashClose'))) {
        let closeCash = parseInt(JSON.parse(localStorage.getItem('cashClose')));
        this.casgData['closing_cash'] = closeCash;
        this.closeCash(this.casgData);
      } else {
        this.closeCash(this.casgData);
      }
    } else {
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
              }

              if (parseInt(data['closing_cash'])) {
                data['closing_cash'] = parseInt(data['closing_cash']);
                // console.log(tableNumber);
              } else {
                data['closing_cash'] = 0;
              }
              this.casgData['closing_cash'] = parseInt(data['closing_cash']);
              this.closeCash(this.casgData);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  async postCashOpen() {
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
            if (data) {
              console.log('**//**//**//');

              this.adminService.postCashOpen(data).subscribe((data) => {
                console.log(data);
                this.takeCashOpen();
                localStorage.removeItem('firstTime');
                localStorage.setItem('firstTime', 'ok');
                this.cashOpened = false;
                localStorage.setItem(
                  'openCashDate',
                  data['message']['openDate']
                );
                localStorage.setItem('openCashDateId', data['message']['_id']);
                localStorage.setItem(
                  'openCashDateObj',
                  JSON.stringify(data['message'])
                );

                // this.router.navigateByUrl("before-inventory");
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
    this.adminService.closeCashOpen(this.casgData).subscribe((data) => {
      this.cashOpened = false;
      // localStorage.removeItem("firstTime");
      this.presentToast('CASH IS CLOSE!');
      // localStorage.removeItem("openCashDate");
      // localStorage.removeItem("cashClose");
      // let openId = JSON.parse(localStorage.getItem("openCashDateId"));
      this.router.navigateByUrl('before-inventory');
    });
  }
}
