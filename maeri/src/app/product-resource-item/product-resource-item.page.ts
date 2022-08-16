import { Component, OnInit } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { ResourcesService } from "../services/resources.service";
import {
  AlertController,
  ModalController,
  ActionSheetController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { Router } from "@angular/router";
import { TranslateConfigService } from "../translate-config.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-product-resource-item",
  templateUrl: "./product-resource-item.page.html",
  styleUrls: ["./product-resource-item.page.scss"],
})
export class ProductResourceItemPage implements OnInit {
  productsItem: any;
  productResto: any;
  resources: any;
  adminId: any;
  tabRoles = [];
  num: Number = 2;
  btnProducts = true;
  btnResto = false;
  userName: any;
  constructor(
    // public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    // public loadingController: LoadingController,
    private socket: Socket,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    private resourceService: ResourcesService,
    public translate: TranslateService
  ) {
    if (JSON.parse(localStorage.getItem("user"))["name"]) {
      this.userName = JSON.parse(localStorage.getItem("user"))["name"];
    }
    this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(3) ||
      this.tabRoles.includes(2)
    ) {
      this.adminId = localStorage.getItem("adminId");
      this.webServerSocket(this.adminId);
      //this.takeProductItems();
    }
    this.languageChanged();
  }

  ngOnInit() {
    this.languageChanged();
    this.getResources();
  }

  languageChanged() {
    console.log("lang shop page");
    let lang = localStorage.getItem("language");
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  getResources() {
    this.resourceService.getResources().subscribe((data) => {
      console.log(data);
      this.resources = data["resources"];
      this.resources.forEach((elt) => {
        elt["quantityItems"] = 0;
        this.resourceService.getResourcesItem().subscribe((data) => {
          console.log(data);
          data["resources"].forEach((res) => {
            elt["quantityItems"] = elt["quantityItems"] + res["quantity"];
          });
        });
      });
    });
  }
  webServerSocket(id) {
    this.socket.connect();

    this.socket.emit("set-name", name);

    this.socket.fromEvent(`${id}newProductItem`).subscribe(async (data) => {
      this.productsItem.unshift(data);
    });
    this.socket.fromEvent(`${id}productItem`).subscribe(async (data) => {
      console.log("pack item change ", data);
      if (data && data["_id"]) {
        let index = await this.productsItem.findIndex((elt) => {
          return elt._id === data["_id"];
        });
        this.productsItem.splice(index, 1, data);
      }
    });
    this.socket.fromEvent(`${id}productItemDelete`).subscribe(async (data) => {
      console.log("items delete", data);
    });

    this.socket.fromEvent(`${id}manufacturedItem`).subscribe(async (data) => {
      console.log("manufactured item", data);
      if (data && data["_id"]) {
        let index = await this.productResto.findIndex((elt) => {
          return elt._id === data["_id"];
        });
        this.productResto.splice(index, 1, data);
      }
    });
  }

  async updateStore(prod) {
    let a: any = {};

    this.translate.get("add").subscribe((t) => {
      a.title = t;
    });
    this.translate.get("cancel").subscribe((t) => {
      a.cancel = t;
    });
    this.translate.get("placeholder").subscribe((t) => {
      a.placeholder = t;
    });

    const alert = await this.alertController.create({
      header: `Available ${prod.quantityItems}`,
      inputs: [
        {
          name: "quantity",
          type: "number",
          placeholder: "quantity",
        },
      ],
      buttons: [
        {
          text: a.cancel,
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: a.title,
          handler: (data) => {
            console.log("Confirm Ok");
            console.log(data);
            this.resourceService
              .addUserResourcesItem({
                resourceId: prod._id,
                quantity: parseInt(data["quantity"]),
                name: prod.name,
                unitName: prod.unitName,
              })
              .subscribe(
                (data) => {
                  console.log(data);
                  this.getResources();
                  /* if (prod["quantityItems"]) {
                      prod["quantityItems"] =
                        prod["quantityItems"] + parseInt(data["quantity"]);
                    } else {
                      this.getResources();
                    } */
                },
                (err) => {
                  console.log(err);
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
  callShowMessage() {
    this.updateStore(this.translate.instant("toast.message.available"));
  }
  //update product resto stock store here
  async updateStoreResto(prod) {
    const alert = await this.alertController.create({
      header: `Avaible ${prod.quantityItems}`,
      inputs: [
        {
          name: "quantity",
          type: "number",
          placeholder: "Enter quantity",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Ok",
          handler: (data) => {
            console.log("Confirm Ok");
            console.log(data);
            if (prod.quantityItems - parseInt(data["quantity"]) < 0) {
              this.presentAlert();
            } else {
              /* this.warehouseService
                .updateManufacturedItemStore({
                  id: prod._id,
                  quantity: parseInt(data["quantity"])
                })
                .subscribe(
                  data => {
                    console.log(data);
                  },
                  err => {
                    console.log(err);
                  }
                ); */
            }
          },
        },
      ],
    });

    await alert.present();
  }

  //
  async presentAlert() {
    const alert = await this.alertController.create({
      header: "ALERT",
      // subHeader: ` ${data}`,
      //message: data.data.message,
      message: "NOT ENOUGTH IN STOCK.",
      cssClass: "AlertStock",
      buttons: ["OK"],
    });

    await alert.present();
  }

  segmentChanged(ev: any) {
    console.log("Segment changed", ev.target.value);
    let check = ev.target.value;
    if (check === "product") {
      this.btnProducts = true;
      this.btnResto = false;
    } else if (check === "productResto") {
      this.btnResto = true;
      this.btnProducts = false;
    }
  }
}
