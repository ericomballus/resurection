import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { SelectvendorService } from 'src/app/services/selectvendor.service';
import { zip, from, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountItemsService } from 'src/app/services/count-items.service';
import { AdminService } from 'src/app/services/admin.service';
import { RestApiService } from 'src/app/services/rest-api.service';
@Component({
  selector: 'app-vendor-modal',
  templateUrl: './vendor-modal.page.html',
  styleUrls: ['./vendor-modal.page.scss'],
})
export class VendorModalPage implements OnInit {
  order: any;
  date: any;
  disable: Boolean = true;
  constructor(
    public vendorService: SelectvendorService,
    public router: Router,
    public notif: NotificationService,
    private adminService: AdminService,
    public countItemsService: CountItemsService,
    public restApiService: RestApiService
  ) {
    this.order = this.vendorService.getOrder();
    console.log(this.order);
    if (typeof this.order.vendorId == 'string') {
      this.order['catchVendor'] = true;
    }
  }

  ngOnInit() {}
  getLivraisonTime(ev) {
    this.date = new Date(ev.target.value);
    this.disable = !this.disable;
  }
  confirmOrder() {
    console.log(this.order);
    this.order.vendorConfirm = true;
    this.order['status'] = 2;
    if (this.date) {
      this.order['dateLivraison'] = this.date;
      this.order['maxChanges'] = this.order['maxChanges'] + 1;
    }

    this.vendorService.confirmOrderReceive(this.order).subscribe((res) => {
      this.router.navigateByUrl('vendor-orders');
      this.notif.presentToast('confirmation reception commande ok', 'success');
    });
  }
  confirmOrderReception() {
    this.order.orderConfirm = true;
    //this.order["status"] = 2;
    /* if (this.date) {
      this.order["dateLivraison"] = this.date;
      this.order["maxChanges"] = this.order["maxChanges"] + 1;
    }*/

    this.vendorService.confirmOrderReceive(this.order).subscribe((res) => {
      this.sendTofirebase(this.order);
      this.router.navigateByUrl('vendor-orders');
      this.notif.presentToast('confirmation reception commande ok', 'success');
    });
  }
  sendTofirebase(data) {
    /* let vendor = JSON.parse(localStorage.getItem("user"))[0]["company"];
    data["companyVendor"] = vendor;
    const devicesRef = this.db.list(`/vendorConfirm/${data.retailerId._id}`);
    devicesRef.push(data); */
  }
  cancelOrder() {
    //  va remettre le stock enlevé  chez le vendor lors de la commande par le retailer
    this.order.vendorConfirm = false;
    this.order['status'] = 0;
    this.order['paid'] = false;
    console.log(this.order);

    this.order['restorProduct'] = 2;
    this.vendorService.cancelOrderReceive(this.order).subscribe((res) => {
      this.router.navigateByUrl('vendor-orders');
      this.notif.presentToast('la commande a été annulé', 'danger');
    });
  }
  updateLivraisonHours() {
    if (this.date && this.order['maxChanges'] < 3) {
      this.order['dateLivraison'] = this.date;
      //  this.order["maxChanges"] = this.order["maxChanges"] + 1;
      this.vendorService
        .updateOrderHourLivraison(this.order)
        .subscribe((res) => {
          this.router.navigateByUrl('vendor-orders');
          this.notif.presentToast('heure de livraison modifier', 'success');
        });
    } else {
      this.notif.presentToast(
        "vous ne pouvez plus changer l'heure de livraison",
        'danger'
      );
    }
  }

  confirmHours() {
    this.order['livraisonDateConfirm'] = 1;
    this.vendorService.updateOrderHourLivraison(this.order).subscribe((res) => {
      //this.router.navigateByUrl("vendor-orders");
      this.notif.presentToast('heure de livraison confirmé', 'success');
    });
  }
  vendorDelivreddOrder() {
    this.order.vendorConfirm = true;
    this.order['status'] = 3;

    this.vendorService.confirmOrderReceive(this.order).subscribe((res) => {
      this.router.navigateByUrl('vendor-orders');
      this.notif.presentToast('arrivée a destination', 'success');
    });
  }
  delivredOrder() {
    this.order.delivered = true;
    this.order['status'] = 4;
    this.order['isBuy'] = 1;
    console.log(this.order);

    this.vendorService.confirmOrderReceive(this.order).subscribe((res) => {
      console.log(res);
      this.addToStock(res['commandes']);
      this.router.navigateByUrl('retailer-order');
      this.notif.presentToast('reception de la commande confirmé', 'success');
    });
  }
  buyOrder() {
    this.order['status'] = 5;
    console.log(this.order);
    this.order['paid'] = true;
    this.vendorService.confirmOrderReceive(this.order).subscribe((res) => {
      this.router.navigateByUrl('vendor-orders');
      this.notif.presentToast('paiment de la commande confirmé', 'success');
    });
  }

  async addToStock(prod) {
    let quantity = 0;
    let totalPrice = 0;
    let tab = [];
    let totalPirce = 0;
    tab = prod;
    console.log(tab);
    //let items = tab["cart"]["items"];
    tab.forEach((elt) => {
      if (elt['qty']) {
        quantity = quantity + elt.qty;
      }
      if (elt['coast']) {
        totalPrice = totalPrice + parseInt(elt['coast']);
      }
    });
    console.log(totalPrice);

    let tabProd = [];
    let tabPack = [];
    let tabResto = [];
    for (let i = 0; i < tab.length; i++) {
      let obj = {};
      console.log(tab[i]);

      if (tab[i]['item']['nbrBtl']) {
        obj = {
          newquantity: tab[i]['qty'] + tab[i]['item']['nbrBtl'],
          id: tab[i]['item']['_id'],
        };
      } else {
        obj = {
          newquantity: tab[i]['qty'],
          id: tab[i]['item']['_id'],
        };
      }

      // console.log(obj);
      if (
        tab[i]['item']['productType'] &&
        tab[i]['item']['productType'] == 'manufacturedItems'
      ) {
        tabResto.push(obj);
      }
      if (tab[i]['item']['productType']) {
        tabProd.push(obj);
      } else {
        console.log('pack here');
        tab[i]['item']['newquantity'] = tab[i]['qty'];
        tabPack.push(tab[i]);
      }
    }

    // let resultat: Array<any>;
    console.log(tabPack);
    if (tabPack.length) {
      await this.sendPackToServer(tabPack, tabProd);
    }
    if (tabResto.length) {
      await this.sendProductRestoToServer(tabResto);
    }

    let data = await {
      articles: prod,
      quantity: quantity,
      totalPrice: totalPrice,
    };
    this.adminService.sendPurchase(data).subscribe((res) => {
      console.log('end of all');
    });
  }
  sendPackToServer(tabPack, tabProd) {
    return new Promise((resolve, reject) => {
      this.countItemsService
        .countProductsItems(tabPack)
        .then((resultat: Array<any>) => {
          if (resultat.length) {
            this.restApiService
              .updateMorePackItem({ tab: resultat, fromVendor: true })
              .subscribe((data) => {
                resultat.forEach((elt) => {
                  console.log(elt);

                  let obj = {
                    newquantity: parseInt(elt.newquantity),
                    id: elt.productItemId,
                    noRistourne: elt.noRistourne,
                    maeriId: elt.maeriId,
                  };
                  tabProd.push(obj);
                });
                console.log(tabPack);
                console.log(tabProd);

                this.restApiService
                  .updateMoreProductItem({ tab: tabProd, fromVendor: true })
                  .subscribe((data) => {
                    resolve('ok');

                    // tabProd.forEach((elt) => {
                  });
              });
          }
        });
    });
  }
  sendProductRestoToServer(tabResto) {
    return new Promise((resolve, reject) => {
      console.log('send resto init---++++ ok');
      let cmp = 0;
      let i = tabResto.length;
      if (tabResto.length) {
        let pro = zip(from(tabResto), interval(500)).pipe(
          map(([prod]) => prod)
        );
        pro.subscribe((data) => {
          console.log('send resto 2 ok');
          this.EnvoiManufactured(data);
          cmp = cmp + 1;
          if (cmp >= i) {
            setTimeout(() => {
              console.log('cest bon=======++++++++112222----');

              resolve('ok');
            }, 200);
          }
        });
      }
    });
  }
  EnvoiManufactured(data) {
    this.restApiService.updateManufacturedItem(data).subscribe((res) => {
      console.log(res);
    });
  }
}
