import { Component, OnInit } from "@angular/core";
import { SelectvendorService } from "src/app/services/selectvendor.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { RestApiService } from "src/app/services/rest-api.service";
import { Cart } from "../../manage-cart/manageCart";
@Component({
  selector: "app-vendor-shop",
  templateUrl: "./vendor-shop.page.html",
  styleUrls: ["./vendor-shop.page.scss"],
})
export class VendorShopPage implements OnInit {
  vendor: any;
  products = [];
  packs = [];
  randomObj = {};
  totalItems = 0;
  totalPrice = 0;
  cart: any;
  constructor(
    private selectVendor: SelectvendorService,
    public restApiService: RestApiService,
    private router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {
    this.vendor = this.selectVendor.getData();
    console.log(this.vendor);
    this.takePack();
    setTimeout(() => {
      this.takeProduct();
      this.takePackitems();
    }, 600);
  }

  ngOnInit() {}

  takeProduct() {
    this.restApiService
      .getVendorProductItem(this.vendor.vendorId)
      .subscribe((data) => {
        console.log(data);
        this.products = data;
        if (this.products.length > 0) {
          this.products.forEach((elt) => {
            this.packs.forEach((pack) => {
              if (pack.productId == elt.productId) {
                let divi2 = elt.quantityStore / elt.packSize;
                console.log(elt);
                console.log(pack);

                pack["cassier"] = parseInt(divi2.toString());
                pack["btls"] = elt.quantityStore % elt.packSize;
                pack["packPrice"] = elt["packSize"] * elt["sellingPrice"];
                pack["avaible"] = elt["packSize"] * elt["sellingPrice"];
              }
            });
            console.log(this.packs);
          });
        }
      });
  }

  takePackitems() {
    this.restApiService
      .getVendorProducts(this.vendor.vendorId)
      .subscribe((data) => {
        console.log(data);
        let tab = data["products"];
        tab.forEach((elt) => {
          this.packs.forEach((pack) => {
            if (pack.productId == elt._id) {
              // pack["packPrice"] = elt["packPrice"];
            }
          });
        });
      });
  }
  takePack() {
    this.restApiService
      .getVendorPack(this.vendor.vendorId)
      .subscribe((data) => {
        // this.packs = data["docs"];
        console.log(data);

        this.packs = data;

        // this.packs2 = this.packs;
        if (this.packs.length > 0) {
          // this.allProducts = [...this.allProducts, ...this.packs];
        }
      });
  }
  getValueBtl(ev, prod) {
    let value = parseInt(ev.target["value"]);
    let id = prod["_id"];
    let nbr = value;
    let storedItem = this.randomObj[id];
    if (nbr && nbr > 0) {
      console.log("hi");

      if (prod["sizePack"] && nbr >= prod["sizePack"]) {
        //si le nbr de bouteile correspond a un cassier
        prod["nbrBtl"] = "";
        //  return;
        //  this.getOnePack(nbr, prod);
      } else {
        //si le nbr de bouteile ne correspond pas a un cassier
        console.log("hello 12");

        if (!storedItem) {
          if (prod["packPrice"]) {
            this.randomObj[id] = {
              sale: 0,
              coast: 0,
              prod: prod,
              item: prod,
              qty: 0,
              price: 0,
            };
            prod["nbrBtl"] = nbr;
          } else {
          }
        } else {
          if (nbr) {
            if (prod["packPrice"]) {
              console.log(this.randomObj[id]);
              this.randomObj[id]["prod"]["nbrBtl"] = nbr;
            }
          } else {
            this.randomObj[id]["prod"]["nbrBtl"] = 0;
          }
        }
        //  this.displayItems.emit(this.randomObj);
      }
    } else {
      prod["nbrBtl"] = 0;
      // this.getOnePack(0, prod);
      if (!storedItem) {
        if (prod["packPrice"]) {
          this.randomObj[id] = {
            sale: 0,
            coast: 0,
            prod: prod,
            item: prod,
            qty: 0,
            price: 0,
          };
          prod["nbrBtl"] = 0;
        } else {
          if (prod["packPrice"]) {
            console.log(this.randomObj[id]);
            this.randomObj[id]["prod"]["nbrBtl"] = nbr;
          }
        }
      }
    }
  }
  async getValue(ev, prod) {
    let value = parseInt(ev.target["value"]);
    let id = prod["_id"];
    let nbr = value;
    console.log(nbr);
    if (!nbr) {
      prod["fisrtValueAdd"] = 0;
      delete this.randomObj[id];
    }
    if (prod.cassier >= nbr) {
      let storedItem = this.randomObj[id];
      if (!storedItem) {
        if (prod["packPrice"]) {
          this.randomObj[id] = {
            sale: nbr,
            coast: nbr * parseInt(prod["packPrice"]),
            prod: prod,
            item: prod,
            qty: nbr,
            price: nbr * parseInt(prod["packPrice"]),
          };
          prod["fisrtValueAdd"] = nbr;
        } else {
          this.randomObj[id] = {
            sale: nbr,
            coast: 0,
            prod: prod,
          };
        }
      } else {
        delete this.randomObj[id];
        if (nbr) {
          if (prod["packPrice"]) {
            this.randomObj[id] = {
              sale: nbr,
              coast: nbr * parseInt(prod["packPrice"]),
              prod: prod,
              item: prod,
              qty: nbr,
              price: nbr * parseInt(prod["packPrice"]),
            };
            prod["fisrtValueAdd"] = nbr;
          } else {
            this.randomObj[id] = {
              sale: nbr,
              coast: 0,
              prod: prod,
            };
          }
        } else {
          console.log("no nbr");
        }
      }

      let a = Object.keys(this.randomObj);
      for (const prop of a) {
        this.randomObj[prop]["prod"]["removeQuantity"] = this.randomObj[prop][
          "sale"
        ];
      }
      console.log(this.randomObj);
      console.log(this.generateArray(this.randomObj));
      let tab = this.generateArray(this.randomObj);
      this.totalItems = 0;
      this.totalPrice = 0;
      tab.forEach((elt) => {
        this.totalItems = this.totalItems + elt.qty;
        this.totalPrice = this.totalPrice + elt.coast;
      });
    } else {
      if (isNaN(nbr)) {
      } else {
        this.presentAlert();
      }

      ev.target["value"] = "";
      let tab = this.generateArray(this.randomObj);
      this.totalItems = 0;
      this.totalPrice = 0;
      tab.forEach((elt) => {
        this.totalItems = this.totalItems + elt.qty;
        this.totalPrice = this.totalPrice + elt.coast;
      });
    }
  }
  generateArray(randomObj) {
    const arr = [];
    for (var id in randomObj) {
      arr.push(randomObj[id]);
    }
    this.cart = arr;
    return arr;
  }
  openCart() {
    this.selectVendor.setCart(this.cart);
    this.router.navigateByUrl("/vendor-cart");
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Alert",
      subHeader: "Not avaible",
      message:
        "quantité choisi pas disponible. <h2>hello</h2><ion-icon name='close-outline'></ion-icon>",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
