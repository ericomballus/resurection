import { Component, OnInit } from "@angular/core";
import { SelectvendorService } from "src/app/services/selectvendor.service";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import io from "socket.io-client";
import { UrlService } from "src/app/services/url.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
  selector: "app-vendor-orders",
  templateUrl: "./vendor-orders.page.html",
  styleUrls: ["./vendor-orders.page.scss"],
})
export class VendorOrdersPage implements OnInit {
  commandeList = [];
  public sockets;
  public url;
  constructor(
    public vendorService: SelectvendorService,
    public modalController: ModalController,
    private router: Router,
    public urlService: UrlService,
    public notif: NotificationService
  ) {
    this.getOrder();
  }

  ngOnInit() {
    this.takeUrl();
    let vendor = JSON.parse(localStorage.getItem("user"))[0];
    this.webServerSocket(vendor["_id"]);
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
    });
  }
  getOrder() {
    let vendor = JSON.parse(localStorage.getItem("user"))[0];

    this.vendorService
      .getNotConfirmOrders(vendor["_id"])
      .subscribe((data: Array<any>) => {
        console.log(data);

        this.commandeList = data;
      });
  }

  openOrder(inv, i) {
    if (this.commandeList[i]["open"]) {
      this.commandeList[i]["open"] = false;
    } else {
      this.commandeList[i]["open"] = true;
    }
  }

  async presentModal(order) {
    this.vendorService.setOrder(order);
    this.router.navigateByUrl("vendor-modal");
  }

  webServerSocket(id) {
    this.sockets = io(this.url);
    this.sockets.on(`${id}RetailerConfirmOrder`, async (data) => {
      console.log(data);
      let index = this.commandeList.findIndex((elt) => {
        return elt._id == data._id;
      });
      //let msg = `  Confirmation de la commande `;
      //this.notif.presentToast(msg, "success");
      if (index >= 0) {
        // this.commandeList[index]["delivered"] = true;
        let retailerId = this.commandeList[index]["retailerId"];
        data["retailerId"] = retailerId;
        this.commandeList.splice(index, 1, data);
      }
      /* this.commandeList = this.commandeList.filter((com) => {
        return com._id !== data._id;
      });*/
    });

    this.sockets.on(`${id}newRetailerOrder`, async (data) => {
      console.log(data);
      this.commandeList.unshift(data[0]);
    });
  }
}
