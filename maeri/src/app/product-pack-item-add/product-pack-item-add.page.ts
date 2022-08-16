import { Component, OnInit } from "@angular/core";
import { RestApiService } from "../services/rest-api.service";
import {
  AlertController,
  ModalController,
  ActionSheetController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { ProductPackItemModalPage } from "../product-pack-item-modal/product-pack-item-modal";
import { ProductPackItemDetailsPage } from "../product/product-pack-item-details/product-pack-item-details.page";
import { Socket } from "ngx-socket-io";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "../translate-config.service";

@Component({
  selector: "app-product-pack-item-add",
  templateUrl: "./product-pack-item-add.page.html",
  styleUrls: ["./product-pack-item-add.page.scss"],
})
export class ProductPackItemAddsPage implements OnInit {
  packs: Array<any>;
  adminId: any;
  tabRoles = [];
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    // public loadingController: LoadingController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private socket: Socket
  ) {
    this.takePackItems();
    this.languageChanged();
  }

  ngOnInit() {
    console.log("ProductPackItemAddsPage");
    this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
      this.adminId = localStorage.getItem("adminId");
      // console.log(this.adminId);
      this.webServerSocket(this.adminId);
    }
  }

  languageChanged() {
    //console.log("lang shop page");
    let lang = localStorage.getItem("language");
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  takePackItems() {
    this.restApiService.getPackItem().subscribe((data) => {
      // console.log(data);
      data["items"].forEach((element) => {
        element["totalItems"] = element["quantity"] * element["itemsInPack"];
      });
      this.packs = data["items"];
    });
  }

  webServerSocket(id) {
    this.socket.connect();

    this.socket.emit("set-name", name);

    this.socket.fromEvent(`${id}newPackItem`).subscribe(async (data) => {
      this.packs.unshift(data);
    });
    this.socket.fromEvent(`${id}packItem`).subscribe(async (data) => {
      //  console.log("pack item change ", data);
      this.takePackItems();
      /* if (data && data["_id"]) {
        let index = await this.packs.findIndex(elt => {
          return elt._id === data["_id"];
        });
        this.packs.splice(index, 1, data);
      } */
    });
  }

  async updatePackItems(pack) {
    pack.flag = "update";
    const modal = await this.modalController.create({
      component: ProductPackItemModalPage,
      componentProps: {
        product: pack,
      },
    });
    modal.onDidDismiss().then((data) => {
      // console.log(data);
      //console.log(data["data"]);
      if (data["data"] === "error") {
        console.log("hello");
        // this.presentAlert("error");
      } else {
        this.presentToast();
      }
    });
    return await modal.present();
  }

  async displayDetails(pack) {
    // pack.flag = "update";
    const modal = await this.modalController.create({
      component: ProductPackItemDetailsPage,
      componentProps: {
        product: pack,
      },
    });
    modal.onDidDismiss().then((data) => {
      // console.log(data);
      // console.log(data["data"]);
      if (data["data"] === "erico") {
        console.log("hello");
      } else {
        // this.presentAlert(data);
      }
    });
    return await modal.present();
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: "ELPIS",
      subHeader: ` ${data}`,
      //message: data.data.message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  deletePackItems(packitems) {
    // console.log(packitems);
    let id = packitems._id;
    this.restApiService.deletePackItem(id).subscribe((data) => {
      //  console.log(data);
      this.packs = this.packs.filter((elt) => {
        return elt._id !== id;
      });
    });
  }

  async presentActionSheet(packitems) {
    const actionSheet = await this.actionSheetController.create({
      header: "Albums",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.deletePackItems(packitems);
          },
        },
        /* {
          text: "Add quantity",
          icon: "add",
          handler: () => {
            this.updatePackItems(packitems);
          }
        }, */
        {
          text: "View Details",
          icon: "heart",
          handler: () => {
            // console.log("Favorite clicked");
            this.displayDetails(packitems);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: `product have been save.`,
      duration: 2000,
      position: "top",
      animated: true,
      cssClass: "my-custom-class",
    });
    toast.present();
  }
}
