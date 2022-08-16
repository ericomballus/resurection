import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";

import { TranslateService } from "@ngx-translate/core";
import { RestApiService } from "src/app/services/rest-api.service";
import { SelectvendorService } from "src/app/services/selectvendor.service";
import { TranslateConfigService } from "src/app/translate-config.service";

@Component({
  selector: "app-vendor-retailer-products",
  templateUrl: "./vendor-retailer-products.page.html",
  styleUrls: ["./vendor-retailer-products.page.scss"],
})
export class VendorRetailerProductsPage implements OnInit {
  vendorProduct = [];
  retailer: any;
  productsItem = [];
  randomObj = {};
  totalItems = 0;
  totalPrice = 0;
  vendor: any;
  products = [];
  packs = [];
  cart: any;
  constructor(
    public vendorService: SelectvendorService,
    public restApi: RestApiService,
    public translate: TranslateService,
    private translateConfigService: TranslateConfigService,

    public restApiService: RestApiService,
    private router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {}
  languageChanged() {
    console.log("lang shop page");
    let lang = localStorage.getItem("language");
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  ngOnInit() {
    this.languageChanged();
    let tab = [];
    let tab2 = [];
    this.vendorProduct = this.vendorService.getProducts();
    console.log(this.vendorProduct);
    this.retailer = this.vendorService.getData();
    console.log(this.retailer);

    this.restApi
      .vendorGetRetailerProductsItems(this.retailer.retailerId._id)
      .subscribe((data: Array<any>) => {
        console.log(data);
        tab = data["docs"];
        this.vendorProduct.forEach((prod) => {
          tab.forEach((elt) => {
            if (elt["maeriId"] === prod["maeriId"]) {
              // if (elt["quantityToConfirm"] > 0) {
              /*  let divi = elt.quantityItems / elt.packSize;
                let store = elt.quantityStore + elt.quantityToConfirm;
                let divi2 = store / elt.packSize;
                elt["cassier"] = parseInt(divi.toString()); //cassier en stcok
                elt["btls"] = elt.quantityItems % elt.packSize; //btl en stock
                elt["cassierStore"] = parseInt(divi2.toString()); //cassier en vente
                elt["btlsStore"] = store % elt.packSize; */ //btl en vente
              //  } else {
              let divi = parseInt(elt.quantityItems) / parseInt(elt.packSize);
              let divi2 = parseInt(elt.quantityStore) / parseInt(elt.packSize);
              let sum = divi + divi2;
              let total = sum;
              elt["cassier"] = parseInt(total.toString());
              elt["btls"] = total % parseInt(elt.packSize);
              //  }
              tab2.push(elt);
            }
          });
        });
        this.productsItem = tab2;
      });
  }

  orderProposal(prod) {}

  async getValue(ev, prod) {
    let value = parseInt(ev.target["value"]);
    let id = prod["_id"];
    let nbr = value;
    console.log(nbr);
    if (nbr >= 0) {
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
      //this.presentAlert();
      ev.target["value"] = "";
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
    this.vendorService.setCart(this.cart);
    this.router.navigateByUrl("/vendor-order-proposal");
  }
  displayOrders() {}
}
