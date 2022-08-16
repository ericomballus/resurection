import { Component, OnInit } from "@angular/core";
import { CatService } from "src/app/services/cat.service";
import { CreatepackService } from "src/app/services/createpack.service";
import { NotificationService } from "src/app/services/notification.service";
import { RestApiService } from "src/app/services/rest-api.service";

@Component({
  selector: "app-add-product-list",
  templateUrl: "./add-product-list.page.html",
  styleUrls: ["./add-product-list.page.scss"],
})
export class AddProductListPage implements OnInit {
  // prod: any;
  categorys: Array<any>;
  constructor(
    public restApi: RestApiService,
    public notif: NotificationService,
    private categorieSerice: CatService,
    private createPack: CreatepackService
  ) {
    this.getCategories();
    console.log(JSON.parse(localStorage.getItem("setting")));
  }

  ngOnInit() {}
  getCategories() {
    this.categorieSerice.getMarieCategories().subscribe((data) => {
      console.log(data);
      this.categorys = data["category"];
    });
  }
  savProduct(form) {
    console.log(form.value);
    let obj = form.value;
    this.sendToServer(obj);
  }

  sendToServer(obj) {
    let user = JSON.parse(localStorage.getItem("user"))[0];

    let storeId = user["storeId"][0]["id"]; // je recupére le id du premier store le store mére
    obj["storeId"] = storeId;
    this.restApi.addProductFromMaeri(obj).subscribe((data) => {
      data["data"]["productId"] = data["data"]["_id"];
      delete data["data"]["_id"];
      delete data["data"]["productitems"];
      delete data["data"]["filename"];
      delete data["data"]["originalName"];
      delete data["data"]["lemballus"];
      delete data["data"]["originalName"];
      delete data["data"]["storeId"];
      //
      if (data["data"]["sizeUnit"]) {
        data["data"]["sizeUnitProduct"] = data["data"]["sizeUnit"];
      }
      if (data["data"]["unitName"]) {
        data["data"]["unitNameProduct"] = data["data"]["unitName"];
      }
      let setting = JSON.parse(localStorage.getItem("setting"))[0];
      let user = JSON.parse(localStorage.getItem("user"))[0];
      let tabStore = [];
      tabStore = user["storeId"];
      let id = tabStore[0].id;
      data["data"]["storeId"] = id;
      this.restApi.addProductItem(data["data"]).subscribe((elt) => {
        console.log(elt);
        elt["data"]["packSize"] = obj["packSize"];
        elt["data"]["packPrice"] = obj["packPrice"];
        let productId = elt["data"]["productId"];
        this.createPack.registerPack(
          elt["data"],
          productId,
          elt["data"]["_id"]
        );
      });
      if (setting["multi_store"]) {
        let otherStore = tabStore.slice(1);
        otherStore.forEach((store) => {
          console.log(store.id);
          let id = store.id;
          data["data"]["storeId"] = id;
          this.restApi.addProductItem(data["data"]).subscribe((elt) => {
            console.log(elt);
            elt["data"]["packSize"] = obj["packSize"];
            elt["data"]["packPrice"] = obj["packPrice"];
            let productId = elt["data"]["productId"];
            this.createPack.registerPack(
              elt["data"],
              productId,
              elt["data"]["_id"]
            );
          });
        });
      }
      /* if (setting["multi_store"]) {
        tabStore.forEach((store) => {
          console.log(store.id);
          let id = store.id;
          data["data"]["storeId"] = id;
          this.restApi.addProductItem(data["data"]).subscribe((elt) => {
            console.log(elt);
            elt["data"]["packSize"] = obj["packSize"];
            elt["data"]["packPrice"] = obj["packPrice"];
            let productId = elt["data"]["productId"];
            this.createPack.registerPack(
              elt["data"],
              productId,
              elt["data"]["_id"]
            );
          });
        });
      } else {
        this.restApi.addProductItem(data["data"]).subscribe((elt) => {
          console.log(elt);
          elt["data"]["packSize"] = obj["packSize"];
          elt["data"]["packPrice"] = obj["packPrice"];
          let productId = elt["data"]["productId"];
          this.createPack.registerPack(
            elt["data"],
            productId,
            elt["data"]["_id"]
          );
        });
      } */
    });
  }
}
