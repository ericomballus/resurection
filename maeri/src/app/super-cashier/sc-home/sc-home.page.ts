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
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Invoice } from 'src/app/models/invoice';
import { DetailsPage } from 'src/app/point-of-sale/details/details.page';
import { Purchase } from 'src/app/models/purchase.model';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-sc-home',
  templateUrl: './sc-home.page.html',
  styleUrls: ['./sc-home.page.scss'],
})
export class ScHomePage implements OnInit {
  public sockets;
  public url;
  public adminId;
  allPurchase: Array<any>;
  articles = [];
  stores: Store[];
  agencesCommandes: Purchase[] = [];
  productServiceTab: Product[] = [];
  billTab: any[] = [];
  destroy$ = new Subject();
  EmployesList: any[] = [];
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
    private networkService: NetworkService
  ) {}

  ngOnInit() {
    this.getSetting();
    this.takeEmployees();
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'first');
    // this.networkService.initializeNetworkEvents();
    this.getPurchase();
    this.getCustomerBill();
    this.takeUrl();
  }
  refreshAll() {
    this.notifi.presentLoading();
    setTimeout(() => {
      this.notifi.dismissLoading();
    }, 3000);
    this.getCustomerBill();
    this.getPurchase();
  }
  ionViewWillLeave() {
    this.sockets.connected = false;
    this.sockets.disconnected = true;
    this.adminId = null;
    this.url = null;
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
  getPurchase() {
    // this.notifi.presentLoading();
    let storeId = this.random.getStoreId();
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let sc = true;
    this.adminService
      .getPurchase()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (tabRoles.includes(2)) {
          this.allPurchase = data['docs'].filter((p) => p.storeId == storeId);
        } else {
          console.log(data['docs']);

          this.allPurchase = data['docs'].filter(
            (p: Purchase) => p.wareHouseRefueling == true
          );
          //this.allPurchase = data['docs'];
        }

        this.stores = this.random.getStoreList();
        /* this.allPurchase.forEach((p) => {
          let s = this.stores.find((store) => store.id == p.storeId);
          p['store'] = s;
        });*/
        for (let p of this.allPurchase) {
          let s = this.stores.find((store) => store.id == p.storeId);
          p['store'] = s;
        }

        this.agencesCommandes = this.allPurchase;
        // this.notifi.dismissLoading();
        this.takeProductServiceList();
      });
  }

  display(com, i) {
    //if (com.scConfirm) {
    //this.notifi.presentToast('cette commande a déja été traité', 'danger');
    //  return;
    // }
    this.notifi.presentLoading();
    let arrRandom: AgenceCommande[] = [];
    console.log(this.productServiceTab);
    let productList: productCart[] = com['articles'][0]['products'];
    productList.forEach((p) => {
      let found = this.productServiceTab.find((prod) =>
        prod.idList.includes(p.item._id)
      );
      if (found) {
        let obj = { avaible: found, request: p, accept: 0, reject: 0 };
        arrRandom.push(obj);
      }
    });
    setTimeout(() => {
      this.notifi.dismissLoading();
      console.log('match ==>', arrRandom);
      this.random.setAgenceCommande(arrRandom);
      this.random.setData(com);
      this.router.navigateByUrl('sc-commande');
    }, 1000);
  }

  takeProductServiceList() {
    this.restApiService
      .getBillardList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (data) => {
        let a: Product[] = data['product'].sort((b, c) => {
          if (b.name.toLocaleLowerCase() > c.name.toLocaleLowerCase()) {
            return 1;
          }
          if (b.name.toLocaleLowerCase() < c.name.toLocaleLowerCase()) {
            return -1;
          }
          return 0;
        });

        this.productServiceTab = a;
        // this.productServiceTab.forEach((p) => {
        this.agencesCommandes.forEach((c) => {
          if (!c.swConfirm && !c.scConfirm) {
            let productList: productCart[] = c.articles[0]['products'];
            productList.forEach((pro) => {
              let found = this.productServiceTab.find((prod, i) =>
                prod.idList.includes(pro.item._id)
              );
              if (found) {
                if (found.reserve) {
                  found.reserve = found.reserve + pro.qty;
                  found.dispo = found.quantityItems - found.reserve;
                } else {
                  found['reserve'] = pro.qty;
                  found['dispo'] = found.quantityItems - found.reserve;
                }
                let index = this.productServiceTab.findIndex(
                  (pr) => pr._id == found._id
                );
                if (index >= 0) {
                  this.productServiceTab.splice(index, 1, found);
                }
              }
            });
          }
        });
        // });
        setTimeout(() => {
          console.log(this.productServiceTab);
        }, 5000);
      });
  }

  webServerSocket() {
    let storeId = this.random.getStoreId();
    this.sockets = io(this.url);
    this.sockets.on('connect', function () {
      console.log('je suis connecté socket', this.url);
    });
    this.sockets.on(`${this.adminId}warehouseChange`, (data) => {
      console.log(data);

      let index = this.agencesCommandes.findIndex((elt) => elt._id == data._id);
      if (index >= 0) {
        this.stores = this.random.getStoreList();
        let s = this.stores.find((store) => store.id == data.storeId);
        data['store'] = s;
        this.agencesCommandes.splice(index, 1, data);

        this.rebuild();
      }
    });
    this.sockets.on(`${this.adminId}managerConfirm`, (data) => {
      let index = this.agencesCommandes.findIndex((elt) => elt._id == data._id);
      if (index >= 0) {
        this.stores = this.random.getStoreList();
        let s = this.stores.find((store) => store.id == data.storeId);
        data['store'] = s;
        this.agencesCommandes.splice(index, 1, data);
        this.notifi.presentToast(
          `${s.name}: livraison de produit confirmé`,
          'primary'
        );
        this.rebuild();
      }
    });
    this.sockets.on(`${this.adminId}${storeId}billardItem`, (data: Product) => {
      let index = this.productServiceTab.findIndex((p) => p._id == data._id);
      if (index >= 0) {
        console.log('index===>', index);
        this.productServiceTab.splice(index, 1, data);
        this.rebuild();
      }
    });
    this.sockets.on(`${this.adminId}${storeId}newOrder`, (data: any) => {
      let index = this.billTab.findIndex((inv) => inv._id == data._id);
      if (index >= 0) {
        // console.log('index===>', index);
      } else {
        let found = this.customerList.find(
          (client) => client._id == data.customerId
        );
        if (found) {
          data.customer = found;
        }
        this.billTab.push(data);
      }
    });
    this.sockets.on(`${this.adminId}swConfirm`, (data) => {
      console.log('new here ===>', data);

      let index = this.billTab.findIndex((p) => p._id == data._id);
      if (index >= 0) {
        this.billTab.splice(index, 1, data);
        this.rebuild();
      }
    });
    this.sockets.on(`${this.adminId}swConfirm`, (data) => {
      let index = this.billTab.findIndex((p) => p._id == data._id);
      if (index >= 0) {
        // this.billTab.splice(index, 1);
        // this.rebuild();
      }
    });
    //
    this.sockets.on(`${this.adminId}Purchase`, (data: Purchase) => {
      if (data.wareHouseRefueling) {
        this.stores = this.random.getStoreList();
        let s = this.stores.find((store) => store.id == data.storeId);
        if (s) {
          data['store'] = s;
          this.agencesCommandes.unshift(data);

          this.rebuild();
        }
      }
    });
    this.sockets.on(`${this.adminId}PurchaseUpdate`, (data) => {
      console.log('warehouse confirm=====>', data);

      let index = this.agencesCommandes.findIndex((p) => p._id == data._id);
      if (index >= 0) {
        this.stores = this.random.getStoreList();
        let s = this.stores.find((store) => store.id == data.storeId);
        data['store'] = s;

        this.agencesCommandes.splice(index, 1, data);
        this.rebuild();
      }
    });

    this.sockets.on(`${this.adminId}${storeId}billardItem`, (data) => {
      console.log('warehouse c=====>', data);
      let index = this.productServiceTab.findIndex((p) => p._id == data._id);
      if (index >= 0) {
        this.productServiceTab.splice(index, 1, data);
        this.rebuild();
      }
    });

    this.sockets.on(`${this.adminId}billUpdate`, (data) => {
      let index = this.billTab.findIndex((p) => p._id == data._id);
      if (index >= 0) {
        this.billTab.splice(index, 1, data);
        this.rebuild();
      }
    });
    this.sockets.on(`${this.adminId}${storeId}invoiceCancel`, (data) => {
      setTimeout(() => {
        this.billTab = this.billTab.filter((f) => f._id !== data._id);
      }, 1500);
    });
    this.sockets.on(`${this.adminId}${storeId}buyOrder`, (data) => {
      let index = this.billTab.findIndex((inv) => inv._id == data._id);
      if (index >= 0) {
        let found = this.customerList.find(
          (client) => client._id == data.customerId
        );
        if (found) {
          data.customer = found;
        }
        this.billTab.splice(index, 1, data);
      } else {
      }
    });
  }

  rebuild() {
    this.productServiceTab.forEach((p) => {
      p.reserve = 0;
      p.dispo = 0;
    });

    this.agencesCommandes.forEach((c) => {
      if (!c.swConfirm && !c.scConfirm) {
        let productList: productCart[] = c.articles[0]['products'];
        productList.forEach((pro) => {
          let found = this.productServiceTab.find((prod, i) =>
            prod.idList.includes(pro.item._id)
          );

          if (found) {
            if (found.reserve) {
              found.reserve = found.reserve + pro.qty;
              found.dispo = found.quantityItems - found.reserve;
            } else {
              found['reserve'] = pro.qty;
              found['dispo'] = found.quantityItems - found.reserve;
            }
            let index = this.productServiceTab.findIndex(
              (pr) => pr._id == found._id
            );
            if (index >= 0) {
              this.productServiceTab.splice(index, 1, found);
            }
          }
        });
      }
    });
  }
  goToShop() {
    this.router.navigateByUrl('sc-shop');
  }

  takeEmployees() {
    this.authService
      .getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('voici les emplo===>', data);

        this.EmployesList = data['employes'];
        this.EmployesList = this.EmployesList.sort((c, b) =>
          c.name > b.name ? 1 : -1
        );
        this.random.setEmployeList(this.EmployesList);
      });
  }

  getSetting() {
    this.adminService
      .getCompanySetting()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
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

  getCustomerBill() {
    this.adminService
      .getInvoiceNotPaieAdmin2(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (data: any[]) => {
          console.log('voici les invoices===>', data);
          this.getMyCustomer();
          this.billTab = data.filter((inv) => inv.caisseConfirm == false);
        },
        (err) => {
          //  this.notifi.presentAlert(`some error ${err}`);
        }
      );
  }
  async displayBill(com, i) {
    console.log('===>', com);

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
  deleteBill(invoice, i) {
    if (invoice['caisseConfirm'] == true) {
      this.notifi.presentToast(
        'impossible de supprimer cette facture',
        'danger'
      );
    } else {
      console.log(invoice);

      this.notifi
        .presentAlertConfirm('supprimer la  factuer ?', 'OUI', 'NON')
        .then(() => {
          invoice['sc'] = true;
          let customer = null;
          if (invoice.customer) {
            customer = invoice.customer;
          }
          this.notifi.presentLoading();
          invoice['commandes'].forEach((elt) => {
            // setTimeout(() => {
            this.adminService
              .cancelOrder2(invoice.localId, elt['products'], customer, true)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (data) => {
                  console.log('delte herere  ===>', data);
                  this.billTab.splice(i, 1);
                  this.notifi.dismissLoading();
                },
                (err) => {
                  console.log(err);
                }
              );
            // }, 200);
          });
        })
        .catch(() => {});
    }
  }

  getMyCustomer() {
    this.adminService
      .getUserCustumer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.customerList = res['custumers'];
        for (const f of this.billTab) {
          let found = this.customerList.find(
            (client) => client._id == f.customerId
          );
          if (found) {
            f.customer = found;
          }
          // let user= this.random.getUserCredentail()
        }
        /* this.billTab.forEach((f) => {
          let found = this.customerList.find(
            (client) => client._id == f.customerId
          );
          if (found) {
            f.customer = found;
          }
        }); */
      });
  }
}
