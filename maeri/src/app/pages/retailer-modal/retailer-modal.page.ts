import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { SelectvendorService } from "src/app/services/selectvendor.service";
import { zip, from, interval } from "rxjs";
import { map } from "rxjs/operators";
import { CountItemsService } from "src/app/services/count-items.service";
import { AdminService } from "src/app/services/admin.service";
import { RestApiService } from "src/app/services/rest-api.service";
import { LoadingController } from "@ionic/angular";
@Component({
  selector: "app-retailer-modal",
  templateUrl: "./retailer-modal.page.html",
  styleUrls: ["./retailer-modal.page.scss"],
})
export class RetailerModalPage implements OnInit {
  order: any;
  date: any;
  disable: Boolean = true;
  retailer: Boolean = false;
  vendor: Boolean = false;
  isLoading = false;
  randomObj = {};
  constructor(
    public vendorService: SelectvendorService,
    public router: Router,
    public notif: NotificationService,
    private adminService: AdminService,
    public countItemsService: CountItemsService,
    public restApiService: RestApiService,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.order = this.vendorService.getProposalOrder2();
    console.log(this.order);
    // this.order["dateLivraison"] = this.date;
    if (typeof this.order.vendorId == "string") {
      this.order["catchVendor"] = false;
    } else {
      this.order["catchRetailer"] = true;
    }
  }

  getLivraisonTime(ev) {
    this.date = new Date(ev.target.value);
    this.disable = !this.disable;
  }
  confirmOrder() {
    console.log(this.order);
    this.order.vendorConfirm = true;
    this.order["status"] = 2;
    if (this.date) {
      this.order["dateLivraison"] = this.date;
      this.order["maxChanges"] = this.order["maxChanges"] + 1;
    }

    this.vendorService.confirmOrderReceive(this.order).subscribe((res) => {
      this.router.navigateByUrl("vendor-orders");
      this.notif.presentToast("confirmation reception commande ok", "success");
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
      this.router.navigateByUrl("vendor-orders");
      this.notif.presentToast("confirmation reception commande ok", "success");
    });
  }
  cancelOrder() {
    //  va remettre le stock enlevé  chez le vendor lors de la commande par le retailer
    this.order.vendorConfirm = false;
    this.order["status"] = 0;
    this.order["paid"] = false;
    console.log(this.order);

    this.order["restorProduct"] = 2;
    this.vendorService.cancelOrderReceive(this.order).subscribe((res) => {
      this.router.navigateByUrl("vendor-orders");
      this.notif.presentToast("la commande a été annulé", "danger");
    });
  }
  cancelProposal() {
    // if (this.date) {
    this.order["dateLivraison"] = this.date;
    this.order["display"] = false;
    this.order["retailerConfirm"] = false;
    this.vendorService.updateOrdersProposal(this.order).subscribe((res) => {
      // this.router.navigateByUrl("vendor-orders");
      this.notif.presentToast("commande annuler modifier", "success");
    });
  }
  confirmHours() {
    this.vendorService.updateOrderHourLivraison(this.order).subscribe((res) => {
      //this.router.navigateByUrl("vendor-orders");
      this.notif.presentToast("heure de livraison confirmé", "success");
    });
  }
  confirmOrders() {
    this.order.display = false;
    this.order["retailerConfirm"] = true;
    this.order["vendorId"] = this.order.vendorId._id;
    this.order["retailerId"] = this.order.retailerId;
    this.order["livraisonDateConfirm"] = 1;
    this.order["dateLivraison"];
    // retailerId: this.vendor.retailerId,
    // vendorId: this.vendor.vendorId._id,
    // commandes: this.cart,
    // retailer: retailer,
    // order["dateLivraison"] = this.date;
    /* let order = {
      retailerId: this.vendor.retailerId,
      vendorId: this.vendor.vendorId._id,
      commandes: this.cart,
      retailer: retailer,
    };*/
    this.posOrder(this.order);
  }
  posOrder(order) {
    this.vendorService.postOrder(order).subscribe((data) => {
      this.vendorService.updateOrdersProposal(order).subscribe((res) => {
        console.log(res);
      });
      this.dismissLoading();
      setTimeout(() => {
        this.router.navigateByUrl("retailer-display-order-proposal");
      }, 4000);
      this.notif.presentToast("votre a été commande envoyé", "success");
    });
  }

  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 8000,
        message: "please wait ...",
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }
  addIncrement(ev, prod, i) {
    let value = parseInt(ev.target["value"]);
    console.log(prod);

    console.log(this.order.commandes);
    let check;
    if (Number.isNaN(value)) {
    } else {
      prod["qty"] = value;
      prod["sale"] = value;
      prod["price"] = value * value * prod.item.packPrice;
      prod["coast"] = value * prod.item.packPrice;
    }
  }
}
