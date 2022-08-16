import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { NotificationService } from "src/app/services/notification.service";
import { SelectvendorService } from "src/app/services/selectvendor.service";
import io from "socket.io-client";
import { UrlService } from "src/app/services/url.service";

@Component({
  selector: "app-retailer-display-order-proposal",
  templateUrl: "./retailer-display-order-proposal.page.html",
  styleUrls: ["./retailer-display-order-proposal.page.scss"],
})
export class RetailerDisplayOrderProposalPage implements OnInit {
  commandeList: any;
  retailer: Boolean = false;
  vendor: Boolean = false;
  isLoading = false;
  public sockets;
  public url;
  constructor(
    public vendorService: SelectvendorService,
    public loadingController: LoadingController,
    public notif: NotificationService,
    private router: Router,
    private urlService: UrlService
  ) {}
  ionViewWillEnter() {
    this.commandeList = this.vendorService.getProposalOrder();
    if (
      this.commandeList[0]["retailerId"] &&
      typeof this.commandeList[0]["retailerId"] === "string"
    ) {
      console.log("hello1");

      this.retailer = true;
      this.vendor = false;
    } else {
      console.log("hello2");
      this.retailer = false;
      this.vendor = true;
    }
    this.takeUrl();
  }
  takeUrl() {
    console.log("url");

    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      let adminId = localStorage.getItem("adminId");
      this.webServerSocket(adminId);
    });
  }
  ngOnInit() {}
  openOrder(inv, i) {
    this.vendorService.setProposalOrder2(inv);
    this.router.navigateByUrl("retailer-modal");
  }
  displayOrders() {}
  confirmOrders(order) {
    order.display = false;
    order.retailerConfirm = true;
    order[" vendorId"] = order.vendorId._id;
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

  webServerSocket(id) {
    this.sockets = io(this.url);
    this.sockets.on(`${id}RetailerConfirmOrderProposal`, async (data) => {
      console.log(data);
      setTimeout(() => {
        this.commandeList = this.vendorService.getProposalOrder();
        if (
          this.commandeList[0]["retailerId"] &&
          typeof this.commandeList[0]["retailerId"] === "string"
        ) {
          console.log("hello1");

          this.retailer = true;
          this.vendor = false;
        } else {
          console.log("hello2");
          this.retailer = false;
          this.vendor = true;
        }
      }, 3000);

      this.notif.presentToast("commande envoyé!", "success");
    });
  }
}
