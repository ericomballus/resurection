import { Component, OnInit } from "@angular/core";
import { SelectvendorService } from "src/app/services/selectvendor.service";
import { RestApiService } from "src/app/services/rest-api.service";
import { LoadingController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";

@Component({
  selector: "app-vendor-order-proposal",
  templateUrl: "./vendor-order-proposal.page.html",
  styleUrls: ["./vendor-order-proposal.page.scss"],
})
export class VendorOrderProposalPage implements OnInit {
  cart: any;
  retailer: any;
  isLoading = false;
  vendor: any;
  date: any;
  constructor(
    private selectVendor: SelectvendorService,
    public restApiService: RestApiService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router,
    private notif: NotificationService
  ) {
    this.cart = this.selectVendor.getCart();
    this.retailer = this.selectVendor.getData();
    console.log(this.retailer);
  }

  ngOnInit() {}
  changePrice($event, prod) {}
  getLivraisonTime(ev) {
    this.date = new Date(ev.target.value);
  }
  sendCommande() {
    this.presentLoading2();
    let vendor = JSON.parse(localStorage.getItem("user"))[0];
    let order = {
      retailerId: this.retailer.retailerId._id,
      vendorId: this.retailer.vendorId,
      commandes: this.cart,
    };
    console.log(order);
    if (this.date) {
      order["dateLivraison"] = this.date;
      this.presentLoading2();
      this.selectVendor.postProposalOrder(order).subscribe((data) => {
        console.log(data);
        this.dismissLoading();
        this.presentToast();
        this.cart = null;
        setTimeout(() => {
          this.router.navigateByUrl("/vendor-retailer-list");
        }, 4000);
      });
    } else {
      this.notif.presentToast(
        "veillez choisir une heure pour livraison",
        "danger"
      );
      return;
    }
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
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Votre commande a été transmise",
      duration: 5000,
      position: "middle",
      color: "success",
    });
    toast.present();
  }
}
