import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { Store } from 'src/app/models/store.model';
import { SuperwarehouseService } from 'src/app/services/superwarehouse.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Product } from 'src/app/models/product.model';
import { productCart } from 'src/app/models/productCart';
import { AgenceCommande } from 'src/app/models/agenceCommande';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { groupBy, mergeMap, toArray, takeUntil, map } from 'rxjs/operators';
import {
  from,
  BehaviorSubject,
  Observable,
  Subject,
  zip,
  interval,
} from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Invoice } from 'src/app/models/invoice';
import { log } from 'console';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { CachingService } from 'src/app/services/caching.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-fc-home',
  templateUrl: './fc-home.page.html',
  styleUrls: ['./fc-home.page.scss'],
})
export class FcHomePage implements OnInit {
  public sockets;
  public url;
  public adminId;
  billTab: Invoice[] = [];
  EmployesList: any[] = [];
  destroy$ = new Subject();
  orders: any[] = [];
  randomId = '';
  customerList = [];
  constructor(
    private menu: MenuController,
    private adminService: AdminService,
    private notifi: NotificationService,
    private random: SaverandomService,
    private swService: SuperwarehouseService,
    public restApiService: RestApiService,
    public router: Router,
    private urlService: UrlService,
    public authService: AuthServiceService,
    public modalController: ModalController,
    public cacheService: CachingService,
    private networkService: NetworkService
  ) {}

  ngOnInit() {
    this.getSetting();
    this.takeEmployees();
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'first');
    this.getCustomerBill();
    this.getOrders();
    this.takeUrl();
  }
  ionViewWillLeave() {
    this.sockets.connected = false;
    this.sockets.disconnected = true;
    this.adminId = null;
    this.url = null;
  }
  goToShop() {
    this.router.navigateByUrl('sc-shop');
  }

  takeUrl() {
    this.urlService
      .getUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('url ici===', data);

        this.url = data;
        this.adminId = localStorage.getItem('adminId');
        this.webServerSocket();
        // alert(this.url);
      });
  }

  webServerSocket() {
    let storeId = this.random.getStoreId();
    this.sockets = io(this.url);
    this.sockets.on('connect', function () {
      console.log('je suis connecté socket', this.url);
    });

    this.sockets.on(`${this.adminId}billUpdate`, (data) => {
      let index = this.orders.findIndex((p) => p._id == data._id);
      if (index >= 0 && data.caisseConfirm == false) {
        this.orders.splice(index, 1, data);
      }
    });

    this.sockets.on(`${this.adminId}${storeId}newOrder`, (data) => {
      if (data.customerId) {
        let found = this.customerList.find(
          (client) => client._id == data.customerId
        );
        if (found) {
          data.customer = found;
        }
        this.orders.unshift(data);
      } else {
        this.orders.unshift(data);
      }
      // this.orders.unshift(data);
      /* if (data.customerId) {
        let found = this.customerList.find(
          (client) => client._id == data.customerId
        );
        if (found) {
          data.customer = found;
        }
        this.orders.unshift(data);
      } else {
        this.orders.unshift(data);
      }*/
    });
    this.sockets.on(`${this.adminId}saConfirm`, (data) => {
      let index = this.orders.findIndex((p) => p._id == data._id);
      if (index >= 0 && data.caisseConfirm == true) {
        this.orders.splice(index, 1);
      }
    });
    this.sockets.on(`${this.adminId}swConfirm`, (data) => {
      let index = this.orders.findIndex((p) => p._id == data._id);
      if (index >= 0 && data.caisseConfirm == true) {
        this.orders.splice(index, 1);
      }
    });

    this.sockets.on(`${this.adminId}${storeId}invoiceCancel`, (data) => {
      this.orders = this.orders.filter((f) => f._id !== data._id);
    });
  }

  getSetting() {
    this.adminService.getCompanySetting().subscribe(
      (data) => {
        if (data['company'].length) {
          let obj = data['company'][0];

          this.random.setSetting(obj);
          localStorage.setItem('setting', JSON.stringify(data['company']));
          localStorage.setItem(
            'useResource',
            JSON.stringify(obj['use_resource'])
          );
          localStorage.setItem(
            'manageStockWithService',
            JSON.stringify(obj['manageStockWithService'])
          );
          localStorage.setItem('poslive', JSON.stringify(obj['use_pos_live']));
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCustomerBill() {
    this.adminService.getBill().subscribe((data: { docs: Invoice[] }) => {
      console.log('bill here', data);
      this.billTab = data.docs.filter(
        (inv) => inv.scConfirm == true && inv.swConfirm == false
      );
    });
  }
  takeEmployees() {
    this.authService.getEmployees().subscribe((data) => {
      console.log('voici les emplo===>', data);

      this.EmployesList = data['employes'];
      this.EmployesList = this.EmployesList.sort((c, b) =>
        c.name > b.name ? 1 : -1
      );
      this.random.setEmployeList(this.EmployesList);
    });
  }

  async getOrders() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
    this.adminService
      .getInvoiceNotPaieAdmin2(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (data: any[]) => {
          console.log('voici les invoices===>', data);
          this.getMyCustomer();
          this.orders = data.filter(
            (inv) => inv.scConfirm == true && inv.caisseConfirm == false
          );
        },
        (err) => {
          //  this.notifi.presentAlert(`some error ${err}`);
        }
      );

    /*
        
        
        */
  }

  deleteBill(com, i) {
    console.log(com);
  }

  async displayBill(order, i) {
    console.log(order);
    /* if (!order.swConfirm) {
      this.notifi.presentToast(
        'La facture est en cours de traitement chez le gestionnaire de stock ...',
        'danger'
      );
      return;
    }*/
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
        let index = this.orders.findIndex((elt) => {
          return elt.localId === order['localId'];
        });
        if (index >= 0) {
          //this.orders
          this.orders.splice(index, 1, order);
        }
      }
    });
    return await modal.present();
  }

  restoreData(order) {
    setTimeout(async () => {
      this.orders = this.orders.filter((elt) => {
        return elt.localId !== order['localId'];
      });
      this.orders = this.orders.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime() > 0
          ? -1
          : 1;
      });
    }, 1500);
  }

  getMyCustomer() {
    this.adminService.getUserCustumer().subscribe((res) => {
      this.customerList = res['custumers'];
      console.log('voici les clients');
      this.orders.forEach((f) => {
        let found = this.customerList.find(
          (client) => client._id == f.customerId
        );
        if (found) {
          f.customer = found;
        }
      });
    });
  }
}
