import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SelectvendorService } from "src/app/services/selectvendor.service";
import { Router } from "@angular/router";
import io from "socket.io-client";
import { UrlService } from "src/app/services/url.service";
import { NotificationService } from "src/app/services/notification.service";
import { AdminService } from "src/app/services/admin.service";
import { RestApiService } from "src/app/services/rest-api.service";
import { CountItemsService } from "src/app/services/count-items.service";
import { zip, from, interval } from "rxjs";
import { map } from "rxjs/operators";
@Component({
  selector: "app-retailer-order",
  templateUrl: "./retailer-order.page.html",
  styleUrls: ["./retailer-order.page.scss"],
})
export class RetailerOrderPage implements OnInit {
  commandeList = [];
  public sockets;
  public url;
  adminId: any;
  constructor(
    public vendorService: SelectvendorService,
    public modalController: ModalController,
    private router: Router,
    public urlService: UrlService,
    public notif: NotificationService,
    public restApiService: RestApiService,
    private adminService: AdminService,
    public countItemsService: CountItemsService
  ) {
    console.log("hello");
    this.takeUrl();

    //  let retailerId = localStorage.getItem("adminId");
  }

  ngOnInit() {}
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      console.log(data);
      this.getOrder();
    });
  }
  getOrder() {
    let retailerId = localStorage.getItem("adminId");
    console.log(retailerId);
    this.adminId = retailerId;
    this.webServerSocket(retailerId);
    this.vendorService
      .retailerGetOrders(retailerId)
      .subscribe((data: Array<any>) => {
        console.log(data);

        this.commandeList = data;
      });
  }

  /* openOrder(inv, i) {
    if (this.commandeList[i]["open"]) {
      this.commandeList[i]["open"] = false;
    } else {
      this.commandeList[i]["open"] = true;
    }
  }*/

  async presentModal(order) {
    order["adminId"] = this.adminId;
    this.vendorService.setOrder(order);
    this.router.navigateByUrl("vendor-modal");
  }

  webServerSocket(id) {
    console.log(id);
    console.log(this.url);

    this.sockets = io(this.url);
    this.sockets.on(`${id}RetailerConfirmOrder`, async (data) => {
      console.log(data);

      /* if (data["status"] == 4 && data["isBuy"] == 1) {
        // this.addToStock(data["commandes"]);
        let msg = `la Commande livré !!!`;
        this.notif.presentToast(msg, "success");
      }

      if (data["status"] == 3) {
        let msg = `la Commande est disponible.`;
        this.notif.presentToast(msg, "warning");
      }

      if (data["status"] == 2) {
        let msg = `Commande en cours de traitement `;
        this.notif.presentToast(msg, "primary");
      } */

      let index = this.commandeList.findIndex((elt) => {
        return elt._id == data._id;
      });
      if (index >= 0) {
        // this.commandeList[index]["delivered"] = true;
        let vendorId = this.commandeList[index]["vendorId"];
        data["vendorId"] = vendorId;
        this.commandeList.splice(index, 1, data);
      }
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
      if (elt["qty"]) {
        quantity = quantity + elt.qty;
      }
      if (elt["coast"]) {
        totalPrice = totalPrice + parseInt(elt["coast"]);
      }
    });
    console.log(totalPrice);

    let tabProd = [];
    let tabPack = [];
    let tabResto = [];
    for (let i = 0; i < tab.length; i++) {
      let obj = {};
      console.log(tab[i]);

      if (tab[i]["item"]["nbrBtl"]) {
        obj = {
          newquantity: tab[i]["qty"] + tab[i]["item"]["nbrBtl"],
          id: tab[i]["item"]["_id"],
        };
      } else {
        obj = {
          newquantity: tab[i]["qty"],
          id: tab[i]["item"]["_id"],
        };
      }

      // console.log(obj);
      if (
        tab[i]["item"]["productType"] &&
        tab[i]["item"]["productType"] == "manufacturedItems"
      ) {
        tabResto.push(obj);
      }
      if (tab[i]["item"]["productType"]) {
        tabProd.push(obj);
      } else {
        console.log("pack here");
        tab[i]["item"]["newquantity"] = tab[i]["qty"];
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
      console.log("end of all");
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
                    resolve("ok");

                    // tabProd.forEach((elt) => {
                  });
              });
          }
        });
    });
  }
  sendProductRestoToServer(tabResto) {
    return new Promise((resolve, reject) => {
      console.log("send resto init---++++ ok");
      let cmp = 0;
      let i = tabResto.length;
      if (tabResto.length) {
        let pro = zip(from(tabResto), interval(500)).pipe(
          map(([prod]) => prod)
        );
        pro.subscribe((data) => {
          console.log("send resto 2 ok");
          this.EnvoiManufactured(data);
          cmp = cmp + 1;
          if (cmp >= i) {
            setTimeout(() => {
              console.log("cest bon=======++++++++112222----");

              resolve("ok");
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
