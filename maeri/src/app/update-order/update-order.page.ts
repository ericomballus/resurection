import { Component, OnInit } from "@angular/core";
import { ManageCartService } from "../services/manage-cart.service";
import { AdminService } from "../services/admin.service";
import { Router } from "@angular/router";
import { Platform, LoadingController } from "@ionic/angular";
import { environment, uri } from "../../environments/environment";
import { UrlService } from "../services/url.service";
import { HTTP } from "@ionic-native/http/ngx";
import { log } from "util";
@Component({
  selector: "app-update-order",
  templateUrl: "./update-order.page.html",
  styleUrls: ["./update-order.page.scss"],
})
export class UpdateOrderPage implements OnInit {
  order: any;
  order2: any;
  oldCommande: any;
  url: string = "http://192.168.100.10:3000/";
  isLoading = false;
  constructor(
    public manageCartService: ManageCartService,
    public adminService: AdminService,
    public router: Router,
    private platform: Platform,
    private httpN: HTTP,
    private urlService: UrlService,
    public loadingController: LoadingController
  ) {
    //this.order = JSON.parse(localStorage.getItem("order_update"));

    this.display(JSON.parse(localStorage.getItem("order_update")));

    this.takeUrl();
    // console.log(this.order);
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
      });
    } else {
      this.url = uri;
    }
  }

  ngOnInit() {}

  ionViewWillEnter() {}

  async removeOne(row, products, commandes, i, j, mode) {
    //this.order2= this.order
    console.log(commandes[j]);
    let mt = commandes[j]["montantRecu"];
    let id = row.item._id;

    let obj = commandes[j]["cartdetails"];

    console.log(obj["items"][id]);
    if (mode === "modeG") {
      console.log(mode);

      if (obj["items"][id]["item"]["modeG"] == 0) {
        return;
      }
    } else if (mode === "modeNG") {
      if (obj["items"][id]["item"]["modeNG"] == 0) {
        return;
      }
    } else if (obj["items"][id]["item"]["qty"] == 0) {
      return;
    } else {
    }

    let res = await this.manageCartService.removeOneToCart2(id, obj);
    console.log(res);
    let result = {
      products: res["products"],
      cartdetails: {
        items: res["items"],
        totalPrice: res["totalPrice"],
        totalQty: res["totalQty"],
        montantRecu: mt,
      },
      montantRecu: mt,
    };
    if (mode === "modeG") {
      result["products"][i]["item"]["modeG"] =
        result["products"][i]["item"]["modeG"] - 1;
    } else if (mode === "modeNG") {
      result["products"][i]["item"]["modeNG"] =
        result["products"][i]["item"]["modeNG"] - 1;
    } else {
      result["products"][i]["item"]["qty"] =
        result["products"][i]["item"]["qty"] - 1;
    }
    this.order2 = this.order;
    this.order2["commandes"][j] = result;
    this.order2["commandes"].splice(j, 1, result);

    setTimeout(() => {
      this.order = this.order2;
    }, 100);
  }

  display(res) {
    this.order = res;
    this.oldCommande = res["commandes"];
  }
  confirmUpdate() {
    let old = JSON.parse(localStorage.getItem("old"));
    let id = old["localId"];

    this.oldCommande = old["commandes"];
    this.presentLoading3();
    let adminId = localStorage.getItem("adminId");

    if (this.platform.is("desktop")) {
      this.adminService
        .cancelAndUpdate(id, this.oldCommande, this.order["commandes"])
        .subscribe(
          (result) => {
            this.dismissLoading();
            localStorage.removeItem("order_update");
            localStorage.removeItem("old");
            this.router.navigateByUrl("activitie");
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      let url2 =
        this.url +
        `invoice/confirmOders/invoice/cancel/and/update/changes/values?db=${adminId}`;
      let data = {
        localId: id,
        oldCommande: this.oldCommande,
        newCommande: this.order["commandes"],
        adminId: adminId,
        cancelupdate: 1,
        url: url2,
      };
      let obj = JSON.stringify(data);
      //  console.log(obj);

      let uri =
        this.url +
        `invoice/confirmOders/invoice/cancel/and/update/changes/values?localId=${id}`;

      this.httpN.setDataSerializer("utf8");
      this.httpN
        .post(uri, obj, {})
        .then((response) => {
          this.dismissLoading();
          localStorage.removeItem("order_update");
          localStorage.removeItem("old");
          this.router.navigateByUrl("activitie");
          // this.modalController.dismiss("update");
        })
        .catch((error) => {
          this.dismissLoading();
          alert(JSON.stringify(error));
        });
    }
  }
  async presentLoading3() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
        cssClass: "my-custom-class",
        message: "Traitement en cours...",
      })
      .then((a) => {
        a.present().then(() => {
          // console.log("presented");
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
}
