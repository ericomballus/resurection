import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { Purchase } from 'src/app/models/purchase.model';
import { Store } from 'src/app/models/store.model';
import { AdminService } from 'src/app/services/admin.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { SuperwarehouseService } from 'src/app/services/superwarehouse.service';
import { UrlService } from 'src/app/services/url.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Invoice } from 'src/app/models/invoice';
import { Product } from 'src/app/models/product.model';
import { AgenceCommande } from 'src/app/models/agenceCommande';
import { productCart } from 'src/app/models/productCart';
@Component({
  selector: 'app-sw-transaction',
  templateUrl: './sw-transaction.page.html',
  styleUrls: ['./sw-transaction.page.scss'],
})
export class SwTransactionPage implements OnInit {
  public sockets;
  public url;
  public adminId;
  allPurchase: Array<any>;
  articles = [];
  stores: Store[];
  agencesCommandes: Purchase[] = [];
  productServiceTab: Product[] = [];
  billTab: Invoice[] = [];
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
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.menu.enable(true, 'first');
    this.getPurchase();
  }
  getPurchase() {
    this.notifi.presentLoading();
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
          this.allPurchase = data['docs'].filter(
            (p: any) => 'scConfirm' in p && 'swConfirm' in p
          );
        }

        this.stores = this.random.getStoreList();
        this.allPurchase.forEach((p) => {
          let s = this.stores.find((store) => store.id == p.storeId);
          p['store'] = s;
        });

        this.agencesCommandes = this.allPurchase;
        this.notifi.dismissLoading();
        // this.takeProductServiceList();
      });
  }
  display(com, i) {
    this.random.setData(com);
    this.router.navigateByUrl('purchase-confirm');
  }
}
