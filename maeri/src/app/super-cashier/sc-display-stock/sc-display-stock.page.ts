import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GetStoreNameService } from 'src/app/services/get-store-name.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RangeByStoreService } from 'src/app/services/range-by-store.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ServiceListService } from 'src/app/services/service-list.service';
import { UrlService } from 'src/app/services/url.service';
import { MyeventsService } from 'src/app/services/myevents.service';
import { MenuController, ModalController } from '@ionic/angular';
import { SuperwarehouseService } from 'src/app/services/superwarehouse.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Product } from 'src/app/models/product.model';
@Component({
  selector: 'app-sc-display-stock',
  templateUrl: './sc-display-stock.page.html',
  styleUrls: ['./sc-display-stock.page.scss'],
})
export class ScDisplayStockPage implements OnInit {
  productServiceTab: Product[] = [];
  constructor(
    public location: Location,
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
    public router: Router,
    private adminService: AdminService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}
  ionViewDidEnter() {
    let tabRoles: any[] = this.saveRandom.getTabRole();
    if (tabRoles.includes(10)) {
      this.takeProductServiceList();
    } else {
      this.location.back();
    }
  }
  goBack() {
    this.location.back();
  }
  takeProductServiceList() {
    this.notifi.presentLoading();
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
      this.notifi.dismissLoading();
      console.log('=====>', a);
      this.productServiceTab = a.filter((prod) => prod.desabled == false);
    });
  }
}
