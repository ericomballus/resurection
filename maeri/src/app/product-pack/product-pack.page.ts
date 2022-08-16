import { Component, OnInit } from "@angular/core";
import { RestApiService } from "../services/rest-api.service";
import { AlertController, ModalController } from "@ionic/angular";
import { ProductPackItemModalPage } from "../product-pack-item-modal/product-pack-item-modal";
import { Socket } from "ngx-socket-io";

@Component({
  selector: "app-item",
  templateUrl: "./product-pack.page.html",
  styleUrls: ["./product-pack.page.scss"],
})
export class ProductPackPage implements OnInit {
  products: any;
  productId: any;
  packs: any;
  product: any;
  flag_pack_add: Boolean = false;
  adminId: any;
  admin: boolean = false;
  tabRoles = [];
  unitName: any;
  productName: any;
  //public id = 1
  //allo: object[]
  //type toto= () => string
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    private socket: Socket
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    if (this.tabRoles.includes(1) || this.tabRoles.includes(2)) {
      //this.takeProduct();
      setTimeout(() => {
        this.takeProductItems();
      }, 2000);
      this.takePack();
    }

    if (this.tabRoles.includes(1)) {
      this.admin = true;
    }
  }

  ngOnInit() {
    this.adminId = localStorage.getItem("adminId");
    this.webServerSocket(this.adminId);
  }

  webServerSocket(id) {
    this.socket.connect();

    this.socket.emit("set-name", name);

    this.socket.fromEvent(`${id}newProduct`).subscribe(async (data) => {
      this.products.unshift(data);
    });
    this.socket.fromEvent(`${id}newPack`).subscribe(async (data) => {
      //console.log("pack item change ", data);
      this.packs.unshift(data);
    });

    this.socket.fromEvent(`${id}packItem`).subscribe(async (data) => {
      //console.log("pack item change ", data);
      // this.packs.unshift(data);
      this.takePack();
    });
  }

  takeProductItems() {
    this.restApiService.getProductItem().subscribe((data) => {
      // console.log(data);
      this.products = data;
    });
  }

  takePack() {
    this.restApiService.getPack().subscribe((data) => {
      console.log(data);
      // this.packs = data["docs"];
      this.packs = data;
    });
  }
  register(form) {
    if (this.unitName) {
      form.value["unitNamePack"] = this.unitName;
    }
    console.log("here", this.product);
    form.value["productItemId"] = this.product["_id"];
    form.value["productId"] = this.product["productId"];
    form.value["url"] = this.product["url"];
    form.value["sizeUnitProduct"] = this.product["sizeUnitProduct"];
    form.value["unitNameProduct"] = this.product["unitNameProduct"];
    let unitNameProduct = this.product["unitNameProduct"];
    let sizeUnitProduct = this.product["sizeUnitProduct"];
    console.log(form.value);
    this.restApiService.postPack(form.value).subscribe((data) => {
      console.log(data["data"]);
      let item_pack = data["data"];
      this.flag_pack_add = false;
      // this.packs.unshift(item_pack); itemsInPack

      item_pack["productPackId"] = item_pack["_id"];
      item_pack["itemsInPack"] = form.value["sizePack"];
      item_pack["sizeUnitProduct"] = sizeUnitProduct;
      item_pack["unitNameProduct"] = unitNameProduct;
      this.restApiService.postPackItem(item_pack).subscribe((data) => {
        // console.log(data);
      });
    });
  }
  test(ev: Event) {
    // console.log(ev);
    // console.log(ev.target["value"]);
    this.productId = ev.target["value"];

    this.product = this.products.filter(
      (item) => item["_id"] === this.productId
    )[0];
    //console.log(this.product);

    this.productName = this.product["name"];
  }

  unitMeasure(ev: Event) {
    //console.log(ev.target["value"]);
    this.unitName = ev.target["value"];
  }

  createPack() {
    /*  if (!this.flag_pack_add) {
      this.flag_pack_add = true;
    } else {
      this.flag_pack_add = false;
    } */
    this.flag_pack_add = !this.flag_pack_add;
  }

  deletePack(pack) {
    // console.log(pack);
    let id = pack._id;
    this.restApiService.deletePack(id).subscribe((data) => {
      // console.log(data);
      this.packs = this.packs.filter((elt) => {
        return elt._id !== id;
      });
    });
  }

  async createPackitems(pack) {
    const modal = await this.modalController.create({
      component: ProductPackItemModalPage,
      componentProps: {
        product: pack,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      // console.log(data["data"]);
      if (data["data"] === "erico") {
        // console.log("hello");
      } else {
        //this.presentAlert(data);
      }
    });
    return await modal.present();
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: "ELPIS",
      subHeader: "sauvegarde ok",
      //message: data.data.message,
      buttons: ["OK"],
    });

    await alert.present();
  }
}
