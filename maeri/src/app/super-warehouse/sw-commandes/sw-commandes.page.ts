import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
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

@Component({
  selector: 'app-sw-commandes',
  templateUrl: './sw-commandes.page.html',
  styleUrls: ['./sw-commandes.page.scss'],
})
export class SwCommandesPage implements OnInit {
  public sockets;
  public url;
  public adminId;
  allPurchase: Array<any>;
  articles = [];
  stores: Store[];
  agencesCommandes: any[] = [];
  productServiceTab: Product[] = [];
  destroy$ = new Subject();
  transaction = [];
  constructor(
    private menu: MenuController,
    private adminService: AdminService,
    private notifi: NotificationService,
    private random: SaverandomService,
    private swService: SuperwarehouseService,
    public restApiService: RestApiService,
    public router: Router,
    private urlService: UrlService
  ) {}

  ngOnInit() {
    this.takeProductServiceList();
    this.takeUrl();
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'first');
    this.getPurchase();
  }
  takeUrl() {
    this.urlService
      .getUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('url ici===', data);

        this.url = data;
        this.adminId = localStorage.getItem('adminId');
        this.webServerSocket(this.adminId, data);
        // alert(this.url);
      });
  }
  getPurchase() {
    this.notifi.presentLoading();
    let storeId = this.random.getStoreId();
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let sc = true;
    this.adminService.getPurchase().subscribe((data) => {
      if (tabRoles.includes(7)) {
        this.allPurchase = data['docs'].filter(
          (p) => p.scConfirm == true && p.swConfirm == false
        );
      } else {
        this.allPurchase = data['docs'];
      }

      this.stores = this.random.getStoreList();
      this.allPurchase.forEach((p) => {
        let s = this.stores.find((store) => store.id == p.storeId);
        p['store'] = s;
      });
      console.log(this.allPurchase);
      this.agencesCommandes = this.allPurchase;
      this.notifi.dismissLoading();
    });
  }

  display(com, i) {
    this.notifi.presentLoading();
    let arrRandom: AgenceCommande[] = [];
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
      this.router.navigateByUrl('sw-display-commande');
    }, 1000);
  }

  takeProductServiceList() {
    this.restApiService.getBillardList().subscribe(async (data) => {
      let a = data['product'].sort((b, c) => {
        if (b.name.toLocaleLowerCase() > c.name.toLocaleLowerCase()) {
          return 1;
        }
        if (b.name.toLocaleLowerCase() < c.name.toLocaleLowerCase()) {
          return -1;
        }
        return 0;
      });
      a = data['product'];
      console.log('=====>', a);
      this.productServiceTab = a;
    });
  }

  webServerSocket(id, url) {
    this.sockets = io(url);
    this.sockets.on('connect', function () {
      console.log('je suis connecté socket', url);
    });

    let storeId = this.random.getStoreId();
    console.log('storeId', storeId);
    this.sockets.on(`${this.adminId}warehouseChange`, (data) => {
      console.log(data);

      let index = this.agencesCommandes.findIndex((elt) => elt._id == data._id);
      if (index >= 0) {
        this.agencesCommandes.splice(index, 1, data);
        this.transaction.push(data);
        this.notifi.presentToast('you have new notification', 'danger');
      }
    });

    this.sockets.on(`${this.adminId}${storeId}billardItem`, (data) => {
      console.log(data);

      let index = this.productServiceTab.findIndex(
        (elt) => elt._id == data._id
      );
      if (index >= 0) {
        this.productServiceTab.splice(index, 1, data);
        //  this.transaction.push(data);
        //  this.notifi.presentToast('you have new notification', 'danger');
      }
    });
  }
}
