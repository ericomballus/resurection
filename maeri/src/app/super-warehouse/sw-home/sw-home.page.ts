import { Component, OnInit } from '@angular/core';
import { GetStoreNameService } from 'src/app/services/get-store-name.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RangeByStoreService } from 'src/app/services/range-by-store.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ServiceListService } from 'src/app/services/service-list.service';
import { UrlService } from 'src/app/services/url.service';
import io from 'socket.io-client';
import { MyeventsService } from 'src/app/services/myevents.service';
import { MenuController, ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { SuperwarehouseService } from 'src/app/services/superwarehouse.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Invoice } from 'src/app/models/invoice';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BillardUpdatePage } from 'src/app/billard-update/billard-update.page';
import { zip, from, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuperManagerService } from 'src/app/services/super-manager.service';

@Component({
  selector: 'app-sw-home',
  templateUrl: './sw-home.page.html',
  styleUrls: ['./sw-home.page.scss'],
})
export class SwHomePage implements OnInit {
  productServiceTab: Product[] = [];
  multiStoreService: any;
  public url;
  public adminId;
  public sockets;
  transaction = [];
  billTab: Invoice[] = [];
  customerList = [];
  destroy$ = new Subject();
  constructor(
    public getStoreName: GetStoreNameService,
    public rangeByStoreService: RangeByStoreService,
    private servicelistService: ServiceListService,
    private saveRandom: SaverandomService,
    private notifi: NotificationService,
    public restApiService: RestApiService,
    public urlService: UrlService,
    private menu: MenuController,
    private events: MyeventsService,
    private swService: SuperwarehouseService,
    private supermanagerService: SuperManagerService,
    public router: Router,
    private adminService: AdminService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getSetting();
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'first');
    this.takeUrl();
    this.takeProductServiceList();
    this.getPurchase();
    this.getCustomerBill();
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      console.log('url ici===', data);

      this.url = data;
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId, data);
      // alert(this.url);
    });
  }

  takeProductServiceList() {
    //  this.notifi.presentLoading();
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.restApiService.getBillardList().subscribe(async (data) => {
      let a: any[] = data['product'].sort((b, c) => {
        if (b.name.toLocaleLowerCase() > c.name.toLocaleLowerCase()) {
          return 1;
        }
        if (b.name.toLocaleLowerCase() < c.name.toLocaleLowerCase()) {
          return -1;
        }
        return 0;
      });

      a = data['product'];
      //  this.notifi.dismissLoading();
      console.log('=====>', a);
      this.productServiceTab = a.filter((prod) => prod.desabled == false);
    });
  }

  webServerSocket(id, url) {
    this.sockets = io(url);
    let storeId = this.saveRandom.getStoreId();
    this.sockets.on('connect', function () {
      console.log('je suis connecté socket', url);
    });

    this.sockets.on(`${this.adminId}warehouseChange`, (data) => {
      this.transaction.push(data);
      this.notifi.presentToast('you have new notification', 'danger');
    });

    this.sockets.on(`${id}${storeId}buyOrder`, (data) => {
      console.log('new here ===>', data);
      if (data.customerId && !data.swConfirm) {
        let found = this.customerList.find(
          (client) => client._id == data.customerId
        );
        if (found) {
          data.customer = found;
        }
        this.billTab.unshift(data);
      } else {
        if (!data.swConfirm) {
          this.billTab.unshift(data);
        }
      }
    });
    this.sockets.on(`${id}${storeId}invoiceCancel`, (data) => {
      this.billTab = this.billTab.filter((f) => f._id !== data._id);
    });
    this.sockets.on(`${id}${storeId}billardItem`, (data) => {
      console.log(data);

      let index = this.productServiceTab.findIndex(
        (elt) => elt._id == data._id
      );
      if (index >= 0) {
        this.productServiceTab.splice(index, 1, data);
      }
    });
  }
  goTo() {
    this.transaction = [];
    this.router.navigateByUrl('sw-commandes');
  }

  getPurchase() {
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.adminService.getPurchase().subscribe((data) => {
      this.transaction = data['docs'].filter(
        (p: any) =>
          'scConfirm' in p &&
          p.scConfirm == true &&
          'swConfirm' in p &&
          p.swConfirm == false
      );
    });
  }

  addValue(ev, i: number) {
    let value = parseInt(ev.target['value']);
    let prod = this.productServiceTab[i];
    if (value && value > 0) {
      this.notifi
        .presentAlertConfirm(
          `add ${ev.detail.value} to ${prod.name} ?`,
          'oui',
          'non'
        )
        .then(() => {
          this.notifi.presentLoading();
          this.productServiceTab[i].quantityItems =
            this.productServiceTab[i].quantityItems + parseInt(ev.detail.value);
          let data = { id: prod._id, newquantity: value, name: prod.name };
          data['adminId'] = prod.adminId;
          data['employeId'] = JSON.parse(localStorage.getItem('user'))['_id'];
          data['production'] = true;
          data['sender'] = JSON.parse(localStorage.getItem('user'));
          this.swService.updateBillardGame(data).subscribe(
            (data) => {
              let p: Product = data['resultat'];
              this.productServiceTab.splice(i, 1, p);
              this.notifi.dismissLoading();
              this.supermanagerService
                .getProductionTransaction()
                .subscribe((res) => {
                  console.log('all warerouse production transaction ===>', res);
                });
            },
            (err) => {
              console.log(err);
            }
          );
        })
        .catch(() => {});
    }
  }
  sendServiceList(data) {
    this.servicelistService.updateServiceItemQuantity(data).subscribe((res) => {
      this.notifi.dismissLoading();
    });
  }
  sendServiceListToServer(tabServiceList) {
    if (tabServiceList.length) {
      let pro = zip(from(tabServiceList), interval(500)).pipe(
        map(([prod]) => prod)
      );
      pro.subscribe((data) => {
        this.sendServiceList(data);
      });
    }
  }
  getCustomerBill() {
    /* this.adminService.getBill().subscribe((data: { docs: Invoice[] }) => {
      console.log('bill here', data);
      this.billTab = data.docs.filter(
        (inv) => inv.scConfirm == true && inv.swConfirm == false
      );
    });
     */
    this.adminService
      .getInvoiceNotPaieAdmin2(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (data: any[]) => {
          console.log('voici les invoices===>', data);
          this.getMyCustomer();
          this.billTab = data.filter((inv) => inv.swConfirm == false);
        },
        (err) => {
          //  this.notifi.presentAlert(`some error ${err}`);
        }
      );
  }
  async displayBill(com, i) {
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: com,
        order2: com,
        // Pos: true,
        Bill: true,
      },
      cssClass: 'custom-modal',
    });
    modal.onDidDismiss().then((res) => {
      if (res.data && res.data['cancel']) {
        let doc = res.data['result'];
      }
    });
    return await modal.present();
  }

  valider(com: Invoice, i) {
    console.log('bill here', com);

    this.notifi
      .presentAlertConfirm('Vous confirmez la livraison ?', 'OUI', 'NON')
      .then(() => {
        this.notifi.presentLoading();
        com.swConfirm = true;
        this.adminService.swUpdateBill(com).subscribe((res) => {
          this.billTab.splice(i, 1);
          this.notifi.dismissLoading();
        });
      })
      .catch((err) => {});
  }

  getMyCustomer() {
    this.adminService.getUserCustumer().subscribe((res) => {
      this.customerList = res['custumers'];
      this.billTab.forEach((f) => {
        let found = this.customerList.find(
          (client) => client._id == f.customerId
        );
        if (found) {
          f.customer = found;
        }
      });
    });
  }

  async updateProduct(prod, index) {
    const modal = await this.modalController.create({
      component: BillardUpdatePage,
      componentProps: {
        product: prod,
        page: 'billard',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data'] === 'no_update') {
        console.log(data['data']);
      } else {
        // console.log(data["data"]);
        if (data['data']['product']) {
          let obj = data['data']['product'];
          this.productServiceTab.splice(index, 1, obj);
        }
      }
    });
    return await modal.present();
  }

  getSetting() {
    this.adminService
      .getCompanySetting()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          if (data['company'].length) {
            let obj = data['company'][0];

            this.saveRandom.setSetting(obj);
            localStorage.setItem('setting', JSON.stringify(data['company']));
            localStorage.setItem(
              'useResource',
              JSON.stringify(obj['use_resource'])
            );
            localStorage.setItem(
              'manageStockWithService',
              JSON.stringify(obj['manageStockWithService'])
            );
            localStorage.setItem(
              'poslive',
              JSON.stringify(obj['use_pos_live'])
            );
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
