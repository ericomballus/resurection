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
import { UrlService } from 'src/app/services/url.service';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, zip, interval, from } from 'rxjs';
import { ServiceListService } from '../services/service-list.service';
import { SupercashierService } from '../services/supercashier.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-purchase-confirm',
  templateUrl: './purchase-confirm.page.html',
  styleUrls: ['./purchase-confirm.page.scss'],
})
export class PurchaseConfirmPage implements OnInit {
  destroy$ = new Subject();
  doc: any;
  tabRoles = [];
  constructor(
    private menu: MenuController,
    private adminService: AdminService,
    private notifi: NotificationService,
    private random: SaverandomService,
    private swService: SuperwarehouseService,
    public restApiService: RestApiService,
    public router: Router,
    private urlService: UrlService,
    private servicelistService: ServiceListService,
    private scService: SupercashierService,
    private location: Location
  ) {}

  ngOnInit() {
    this.takeUrl();
    console.log(this.random.getData());
  }

  ionViewDidEnter() {
    this.tabRoles = this.random.getTabRole();
    if (this.tabRoles.includes(7)) {
    }
    this.menu.enable(true, 'first');
    this.getPurchase();
  }
  takeUrl() {
    this.urlService
      .getUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('url ici===', data);

        // alert(this.url);
      });
  }
  getPurchase() {
    console.log(this.random.getData());
    let data: any = this.random.getData();
    // let arr: any[] = data.AgenceCommande;
    // data.AgenceCommande = arr.filter((elt) => !elt.confirm);
    this.doc = data;
  }

  valider(com, i) {
    console.log(com);
    console.log(this.doc.AgenceCommande);

    let senderId = '';
    let user = this.random.getUserCredentail();
    if (user) {
      senderId = user._id;
    }
    this.doc.AgenceCommande[i]['confirm'] = true;
    if (this.doc.AgenceCommande.every((elt) => elt['confirm'])) {
      this.doc['managerConfirm'] = true;
    }
    let data = {
      adminId: this.doc.adminId,
      id: com.request.item._id,
      name: com.request.item.name,
      newquantity: com.accept,
      senderId: senderId,
      storeId: com.request.item.storeId,
      purchase: this.doc,
    };
    this.sendServiceList(data, i);
  }

  sendServiceList(data, i) {
    this.notifi.presentLoading();
    this.servicelistService.updateServiceItemQuantity(data).subscribe(
      (res) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('successfuly!!!', 'primary');
        this.doc.AgenceCommande[i]['managerConfim'] = true;
        //this.doc.AgenceCommande.splice(i, 1);

        /* this.doc.AgenceCommande = this.doc.AgenceCommande.filter(
          (elt) => !elt.managerConfim
        );
        console.log(res);
        if (this.doc.AgenceCommande.length == 0) {
          this.location.back();
        }*/
      },
      (err) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast(
          'impossible de confirmer cette opération !!!',
          'danger'
        );
        console.log(err);
      }
    );
  }
}
