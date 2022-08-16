import { Component, OnInit } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/services/admin.service";
import { AuthServiceService } from "src/app/services/auth-service.service";
import { CountItemsService } from "src/app/services/count-items.service";
import { ManageCartService } from "src/app/services/manage-cart.service";
import { RestApiService } from "src/app/services/rest-api.service";
import { UrlService } from "src/app/services/url.service";
import { WarehouseService } from "src/app/services/warehouse.service";
import io from "socket.io-client";
@Component({
  selector: "app-refueling",
  templateUrl: "./refueling.page.html",
  styleUrls: ["./refueling.page.scss"],
})
export class RefuelingPage implements OnInit {
  activitie: any;
  productItem: any;
  public sockets;
  public url;
  user: any;
  storeList = [];
  store: any;
  totalItems = 0;
  totalPrice = 0;
  packs = [];
  cartValue: any;
  randomObj = {};
  allCart: any;
  quantity = 0;
  constructor(
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
    public warehouseService: WarehouseService,
    public auth: AuthServiceService,
    public restApiService: RestApiService,
    public manageCartService: ManageCartService,
    public countItemsService: CountItemsService,
    public adminService: AdminService,
    public urlService: UrlService
  ) {
    this.productItem = this.warehouseService.getProductItem();
    console.log(this.productItem);
    this.getUserAllStore();
    this.takeUrl();
  }

  ngOnInit() {}

  dismiss(data?) {
    if (data) {
      this.activitie = data;
    }
    this.modalCtrl.dismiss({
      dismissed: true,
      // activitie: this.productItem,
    });
  }

  getUserAllStore() {
    this.auth.getUser().subscribe((result) => {
      this.user = result;
      console.log(result);
      this.storeList = this.user[0]["storeId"];
    });
  }
  async assignSore(ev: Event) {
    let id = ev.target["value"];
    this.store = id;
    console.log(id);
  }
  addQuantity($event) {
    this.quantity = $event.target.value;
    console.log(this.quantity);
  }
  updateProductItems() {
    this.getValue(this.quantity, this.productItem);
    /* let update = {
      productId: this.productItem.productId,
      storeId: this.store,
      quantity: 12,
      prod: this.productItem,
      sender: "erico",
      multi_store: true,
    };
    this.warehouseService.updateProductItemStore1(update).subscribe(
      (data) => {
        console.log(data);

        
      },
      (err) => {
        console.log(err);
      }
    ); */
  }

  displayPriceQuantity(obj) {
    let a = Object.keys(obj);
    this.restApiService.saveCart({});
    this.totalItems = 0;
    this.totalPrice = 0;
    for (const prop of a) {
      obj[prop]["prod"]["removeQuantity"] = obj[prop]["sale"];

      if (obj[prop]["remove"] === 1) {
        //removeQuantity
        this.totalItems = this.totalItems + obj[prop]["sale"];
        this.totalPrice = this.totalPrice + obj[prop]["coast"];
      } else {
        if (obj[prop]["prod"]["nbrBtl"]) {
          let price =
            obj[prop]["prod"]["nbrBtl"] * obj[prop]["prod"]["purchasingPrice"];
          this.totalPrice = this.totalPrice + price;
        }
        this.totalItems = this.totalItems + obj[prop]["sale"];
        this.totalPrice = this.totalPrice + obj[prop]["coast"];
      }

      this.buyPackProduct(obj[prop]["prod"]);
    }
  }

  buyPackProduct(prod) {
    // console.log(prod);
    let id = prod._id;

    this.cartValue = this.restApiService.getCart2();
    console.log("hello 2", this.cartValue);

    if (this.cartValue && this.cartValue["cart"]) {
      let data = {};
      data["product"] = prod;
      data["cart"] = this.cartValue["cart"];
      let cart = this.manageCartService.addToCart(data);

      // this.totalItems = cart["totalQty"];
      //  this.totalPrice = cart["totalPrice"];
      console.log(cart);
      let items = cart["items"];
      let oldTotalPrice = this.totalPrice;
      // this.totalPrice = 0;
      for (const key in items) {
        let obj = items[key]["item"];
        if (obj["packPrice"]) {
          /*  this.totalPrice =
            this.totalPrice + items[key]["qty"] * obj["packPrice"]; */
        } else {
          // this.totalPrice = oldTotalPrice;
        }
      }

      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.packs.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod["qty"] = b[0]["qty"];
      // console.log("hello2", prod);
      this.packs.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    } else {
      let cart = this.manageCartService.addToCart(prod);

      let items = cart["items"];
      for (const key in items) {
        let obj = items[key]["item"];
        if (obj["sizePack"]) {
        } else {
        }
      }

      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.packs.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod["qty"] = b[0]["qty"];
      //  console.log("hello2", prod);
      this.packs.splice(index, 1, prod);

      this.packs.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    }
    this.updateProd();
  }

  async getValue(ev, prod) {
    // let value = parseInt(ev.target["value"]);
    let id = prod["_id"];
    let nbr = ev;

    if (Number.isNaN(ev)) {
      prod["myValue"] = 0;
    } else {
      prod["myValue"] = nbr;
    }

    if (prod["noHandle"]) {
      return;
    } else {
      let storedItem = this.randomObj[id];
      if (!storedItem) {
        if (prod["packPrice"]) {
          this.randomObj[id] = {
            sale: nbr,
            coast: nbr * parseInt(prod["packPrice"]),
            prod: prod,
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
        if (nbr) {
          let obj = this.randomObj[id];
          if (obj["sale"]) {
            nbr = obj["sale"] + nbr;
          }

          if (prod["packPrice"]) {
            this.randomObj[id] = {
              sale: nbr,
              coast: nbr * parseInt(prod["packPrice"]),
              prod: prod,
            };
          } else {
            this.randomObj[id] = {
              sale: nbr,
              coast: 0,
              prod: prod,
            };
          }
        } else {
          prod["nbrBtl"] = 0;
          delete this.randomObj[id];
        }
      }
      if (prod["nbrCassier"]) {
        prod["nbrCassier"] = prod["nbrCassier"] + nbr;
      } else {
        prod["nbrCassier"] = nbr;
      }
      this.displayPriceQuantity(this.randomObj);
    }
  }

  async updateProd() {
    this.restApiService.getCart().subscribe((data) => {
      this.allCart = data;

      let totalPrice = 0;
      let tab = [];
      let totalPirce = 0;
      tab = this.allCart["products"];
      console.log(tab);
      tab.forEach((elt) => {
        if (elt["qty"]) {
          // quantity = this.quantity + elt.qty;
        }
        elt["qty"] = this.quantity;
        if (elt["item"]["packPrice"]) {
          totalPrice =
            totalPrice + parseInt(elt["item"]["packPrice"]) * elt["qty"];
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
          obj = { newquantity: tab[i]["qty"], id: tab[i]["item"]["_id"] };
        }

        // console.log(obj);
        if (
          tab[i]["item"]["productType"] &&
          tab[i]["item"]["productType"] == "manufacturedItems"
        ) {
          tabResto.push(obj);
        }
        if (tab[i]["item"]["productType"]) {
          // console.log("prod===");

          tabProd.push(obj);

          // this.UpdateupdateProductItem(obj, i + 1);
        } else {
          // console.log("pack=======111");

          tab[i]["item"]["newquantity"] = tab[i]["qty"];
          tabPack.push(tab[i]);
        }
      }

      if (tabPack.length) {
        this.sendPackToServer(tabPack, tabProd);
      }
      if (tabResto.length) {
        this.sendProductRestoToServer(tabResto);
      }
      let obj = {
        articles: this.allCart,
        quantity: this.quantity,
        totalPrice: totalPrice,
      };
      this.adminService.sendPurchase(obj).subscribe((res) => {
        console.log("end of all");
        console.log(res);
      });
      console.log(tabPack.length);

      if (!tabPack.length) {
        (tabProd[0]["productId"] = this.productItem.productId),
          (tabProd[0]["storeId"] = this.store),
          (tabProd[0]["multi_store"] = true),
          this.restApiService
            .updateMoreProductItem({
              tab: tabProd,
              multi_store: true,
              storeId: this.store,
            })
            .subscribe((data) => {
              console.log("send pack ok");
              console.log(data);
              let update = {
                id: this.productItem._id,
                quantity: this.quantity,
                prod: this.productItem,
                sender: "this.userName",
                storeId: this.store,
                multi_store: true,
                productId: this.productItem.productId,
              };
              this.warehouseService
                .updateProductItemStore1(update)
                .subscribe((resultat) => {
                  console.log(resultat);
                  this.quantity = 0;
                  // this.dismiss();
                });
              // tabProd.forEach((elt) => {
            });
      }
    });
  }

  sendPackToServer(tabPack, tabProd) {
    return new Promise((resolve, reject) => {
      this.countItemsService
        .countProductsItems(tabPack)
        .then((resultat: Array<any>) => {
          if (resultat.length) {
            this.restApiService
              .updateMorePackItem({ tab: resultat })
              .subscribe((data) => {
                resultat.forEach((elt) => {
                  console.log(elt);

                  let obj = {
                    newquantity: elt.newquantity,
                    id: elt.productItemId,
                    noRistourne: elt.noRistourne,
                  };
                  tabProd.push(obj);
                });

                this.restApiService
                  .updateMoreProductItem({ tab: tabProd })
                  .subscribe((data) => {
                    console.log("send pack ok");
                    console.log(data);

                    resolve("ok");
                  });
              });
          }
        });
    });
  }
  sendProductRestoToServer(tabResto) {
    /* return new Promise((resolve, reject) => {
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
    }); */
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      let adminId = localStorage.getItem("adminId");
      this.webServerSocket(adminId);
      // alert(this.url);
    });
  }

  webServerSocket(id) {
    //this.socket.connect();

    //  this.socket.emit("set-name", name);
    console.log(this.url);

    this.sockets = io(this.url);
    this.sockets.on("connect", function () {
      //console.log("depuis client socket");
    });

    this.sockets.on(`${id}productItemStore`, (data) => {
      console.log(data);
    });
  }
}
