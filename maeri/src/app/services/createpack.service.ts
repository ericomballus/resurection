import { Injectable } from "@angular/core";
import { RestApiService } from "./rest-api.service";
import { HttpClient } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { environment, uri } from "../../environments/environment";
import { UrlService } from "./url.service";

@Injectable({
  providedIn: "root",
})
export class CreatepackService {
  constructor(public restApiService: RestApiService) {}

  registerPack(form, productId, productItemId) {
    setTimeout(() => {
      if (form.unitName) {
        form["unitNamePack"] = form.unitNameProduct;
      }

      form["productItemId"] = form["_id"];
      delete form["_id"];
      form["productId"] = productId;
      form["url"] = form["url"];
      form["sizeUnitProduct"] = form["sizeUnitProduct"];
      form["unitNameProduct"] = form["unitNameProduct"];
      let unitNameProduct = form["unitNameProduct"];
      let sizeUnitProduct = form["sizeUnitProduct"];
      form["sizePack"] = form["packSize"];
      // console.log(form.value);
      this.restApiService.postPack(form).subscribe((data) => {
        let item_pack = data["data"];
        //  this.flag_pack_add = false;
        // this.packs.unshift(item_pack); itemsInPack

        item_pack["productPackId"] = item_pack["_id"];
        item_pack["productItemId"] = item_pack[productItemId];
        item_pack["itemsInPack"] = form["packSize"];
        item_pack["sizeUnitProduct"] = sizeUnitProduct;
        item_pack["unitNameProduct"] = unitNameProduct;
        this.restApiService.postPackItem(item_pack).subscribe((data) => {
          console.log(data);
        });
      });
    }, 5000);
  }
}
