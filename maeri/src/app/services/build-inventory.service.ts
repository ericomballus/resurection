import { Injectable } from "@angular/core";
import { AdminService } from "./admin.service";

@Injectable({
  providedIn: "root",
})
export class BuildInventoryService {
  constructor(public adminService: AdminService) {}

  rebuild(d) {
    console.log(d);
    let openCashDateId = d._id;
    let storeId = JSON.parse(localStorage.getItem("user"))["storeId"];
    let totalSale = 0;
    setTimeout(() => {
      this.takeBillsCopy(d);
    }, 30000);
    this.adminService.getBillAggregate(d.openDate).subscribe((data) => {
      console.log("response bills ===****-------", data);
      let invoices = data["docs"];
      let inventory = [];
      inventory = data["Inventory"];

      invoices.forEach(async (elt) => {
        console.log("bills", elt);

        this.moreInfo(inventory, elt).then((res) => {
          console.log("responsemoreInfo", res);

          res["commandes"].forEach((pro) => {
            totalSale = totalSale + pro["commande"]["products"]["price"];
          });

          let id = res["entry"][0]["item"]["_id"];
          res["ristourneGenerate"] =
            parseInt(res["_id"]["ristourneByProduct"]) * res["quantity"];

          let index = res["entry"].length - 1;

          let benefice =
            res["entry"][index]["item"]["sellingPrice"] -
            res["entry"][index]["item"]["purchasingPrice"];
          //  console.log("benefice", benefice);
          res["beneficeUnitaire"] = benefice;
          res["beneficeTotal"] = benefice * res["quantity"];
          res["pachat"] = res["entry"][index]["item"]["purchasingPrice"];
          res["pvente"] = res["entry"][index]["item"]["sellingPrice"];

          if (elt["ristourneGenerate"]) {
          } else {
            res["ristourneGenerate"] = 0;
          }

          this.confirm(res, d);
        });
      });
    });
  }

  takeBillsCopy(d) {
    // this.presentLoading2();
    console.log("heloo====***////****");

    let first = true;
    let productItem = [];
    let totalSale = 0;
    let openCashDateId = d._id;
    this.adminService.getBillAggregate(d.openDate).subscribe((data) => {
      console.log(data);
      let invoices = data["docs"];
      console.log(invoices);

      let inventory = [];
      inventory = data["Inventory"];

      invoices.forEach(async (elt) => {
        this.moreInfo(inventory, elt).then((res) => {
          res["commandes"].forEach((pro) => {
            totalSale = totalSale + pro["commande"]["products"]["price"];
          });

          let id = res["entry"][0]["item"]["_id"];
          res["ristourneGenerate"] =
            parseInt(res["_id"]["ristourneByProduct"]) * res["quantity"];

          let index = res["entry"].length - 1;

          let benefice =
            res["entry"][index]["item"]["sellingPrice"] -
            res["entry"][index]["item"]["purchasingPrice"];
          //  console.log("benefice", benefice);
          res["beneficeUnitaire"] = benefice;
          res["beneficeTotal"] = benefice * res["quantity"];
          res["pachat"] = res["entry"][index]["item"]["purchasingPrice"];
          res["pvente"] = res["entry"][index]["item"]["sellingPrice"];

          if (res["ristourneGenerate"]) {
          } else {
            res["ristourneGenerate"] = 0;
          }
          console.log("je passe a confirm***///***/----33654///");

          this.confirm(res, d);
        });
      });
    });
  }

  moreInfo(inventory, elt) {
    return new Promise((resolve, reject) => {
      inventory[0]["listsStart"].forEach((item) => {
        if (item["_id"] == elt["_id"]["id"]) {
          elt["out"] = elt["quantity"];
          elt["start"] = elt["entry"][0]["item"]["quantityStore"];
          elt["reste"] = elt["start"] - elt["out"];
          elt["remaining2"] = 0;
          console.log(elt);
        }
      });

      resolve(elt);
    });
  }

  confirm(row, d) {
    console.log("load confirm", row);
    let name = row["_id"]["name"];
    let productItemId = row["_id"]["id"];
    row["isChecked"] = true;
    row["name"] = name;
    row["productItemsId"] = productItemId;

    row["reste"] = row["entry"][0]["item"]["quantityStore"];
    this.adminService.postInventory2(row, d).subscribe((data) => {
      console.log("hello6598=====");
      console.log("response du serveur", data);
      // this.confirmAgainst(row);
    });
  }
}
