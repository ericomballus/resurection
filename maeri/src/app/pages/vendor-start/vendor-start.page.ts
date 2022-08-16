import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { AdminService } from '../../services/admin.service';

import { Router } from '@angular/router';
import {
  NavController,
  AlertController,
  ToastController,
  Platform,
  MenuController,
} from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { TranslateConfigService } from '../../translate-config.service';
import { Socket } from 'ngx-socket-io';
import { UrlService } from '../../services/url.service';
import io from 'socket.io-client';
import { FcmService } from '../../services/fcm.service';
import { tap } from 'rxjs/operators';
import { MyeventsService } from '../../services/myevents.service';
import { NetworkService } from '../../services/network.service';
import { SelectvendorService } from 'src/app/services/selectvendor.service';
//import { LocalNotifications } from "@ionic-native/local-notifications/ngx";

@Component({
  selector: 'app-vendor-start',
  templateUrl: './vendor-start.page.html',
  styleUrls: ['./vendor-start.page.scss'],
})
export class VendorStartPage implements OnInit {
  tabRoles = [];
  user: any;
  admin: boolean = false;
  manager: boolean = false;
  userName: any;
  adminId: any;
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
  public sockets;
  public url;
  barOpen: Boolean = false;
  restoOpen: Boolean = false;
  proposalOrders = 0;
  restoTab = [];
  barTab = [];
  commandeList = [];
  billsBar = 0;
  billsResto = 0;
  cashOpened: Boolean;
  manageStockWithService: Boolean = false;
  disableBtn: Boolean = false;
  productItem: any;
  adminstrator: Boolean = false;
  checkRole: any;
  tabRole: any;
  selectedLanguage: string;
  constructor(
    private restApiService: RestApiService,
    public router: Router,
    public navCtrl: NavController,
    public modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public alertController: AlertController,
    public adminService: AdminService,
    public toastController: ToastController,
    private socket: Socket,
    public urlService: UrlService,
    public fcm: FcmService,
    private menu: MenuController,
    public events: MyeventsService,
    public netWorkservice: NetworkService,
    public vendorService: SelectvendorService // private localNotifications: LocalNotifications
  ) {
    this.menu.enable(true, 'first');
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(2)) {
      this.disableBtn = true;
    }
    if (this.tabRoles.includes(1)) {
      this.adminstrator = true;
    }
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
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
    this.getSetting();
  }

  ngOnInit() {
    this.takeUrl();
    this.adminId = localStorage.getItem('adminId');
    /*.pipe(
      tap((msg) => {
        this.presentToast(msg.body);
      })
    );*/
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
    });
  }

  languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  takeCashOpen() {
    this.adminService.getOpenCash().subscribe((data) => {
      this.takeProductItems();
      if (data['docs'].length) {
        this.cashOpening = data['docs'].length;
        this.cashOpened = true;
        this.casgData = data['docs'][0];
        localStorage.setItem('openCashDate', data['docs'][0]['openDate']);
      } else {
        //  this.presentToast("PLEASE OPEN CASH!");
      }
    });
  }
  get5LastOrder() {
    let vendor = JSON.parse(localStorage.getItem('user'))[0];
    this.webServerSocket(vendor['_id']);

    this.vendorService
      .get5LastOrders(vendor['_id'])
      .subscribe((data: Array<any>) => {
        console.log(data);

        this.commandeList = data;
      });
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

  openOrder(inv, i) {
    if (this.commandeList[i]['open']) {
      this.commandeList[i]['open'] = false;
    } else {
      this.commandeList[i]['open'] = true;
    }
  }

  takeBills() {
    this.adminService.getBill().subscribe((data) => {
      let tab = data['docs'];
      console.log(tab.length);
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

  webServerSocket(id) {
    // this.socket.connect();
    this.getProposalOrders(id);
    this.sockets = io(this.url);
    this.sockets.on('connect', function () {});
    this.sockets.on(`${id}buyOrder`, async (data) => {
      // this.presentToast2("new command");
      this.takePaieInvoice();
      this.getOrders();
      this.takeBills();
    });

    this.sockets.on(`${id}newOrder`, async (data) => {});
    this.sockets.on(`${id}invoiceCancel`, async (data) => {
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
      // this.getOrders();
      //this.takePaieInvoice();
      // this.takeBills();
    });
    this.sockets.on(`${id}newRetailerOrder`, async (data) => {
      console.log(data);

      // this.commandeList = data;
      this.getProposalOrders(id);
      this.get5LastOrder();
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
      // this.get3LastResume();
      this.takeCashOpen();

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

  takeInvoiceAggregate() {
    this.adminService.getInvoiceByDate3().subscribe((data) => {
      // this.cart = data["docs"];
    });
  }

  openResto() {
    this.restoOpen = !this.restoOpen;
  }
  async presentAlertPrompt() {
    if (localStorage.getItem('manageStockWithService') === 'true') {
      localStorage.removeItem('oneOnly');
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

  takeProductItems() {
    this.restApiService.getProductItem().subscribe((data) => {
      console.log(data);

      this.get5LastOrder();
      this.productItem = data;
      this.vendorService.setProducts(this.productItem);
      this.productItem = this.productItem.filter((elt) => {
        return elt['quantityItems'] <= elt['quantityToAlert'];
      });
      this.productItem = this.productItem.sort(
        (a, b) => a['quantityItems'] - b['quantityItems']
      );
      console.log(this.productItem);
    });
  }

  async logOut() {
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
            this.events.newInvoices({});
            this.events.newOrder({});
            this.events.invoiceSale({});
            this.events.publishOrder({});
            this.events.addToOrder({});
            this.events.invoiceSale({});
            this.events.serviceConfirmOrder({});
            this.events.serviceConfirmOrder({});
            this.events.invoiceUpdateCancel({});
            this.netWorkservice.stopServer().then((res) => {
              this.router.navigateByUrl('Login');
              navigator['app'].exitApp();
            });
          },
        },
      ],
      //  console.log(this.allCart);
    });
    await alert.present();
  }
  displayOrders() {
    this.router.navigateByUrl('vendor-orders');
  }

  getProposalOrders(adminId) {
    this.vendorService
      //.vendorGetOrdersProposal(adminId)
      .getNotConfirmOrders(adminId)
      .subscribe((data: Array<any>) => {
        console.log(data);
        this.proposalOrders = data.length;
        if (data.length) {
          this.vendorService.setProposalOrder(data);
        }
      });
  }
  displayProposalOrders() {
    //this.router.navigateByUrl("retailer-display-order-proposal");
    this.router.navigateByUrl('vendor-orders');
  }
}
