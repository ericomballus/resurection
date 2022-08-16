import { Injectable } from "@angular/core";
//import { resolve } from "dns";

@Injectable({
  providedIn: "root",
})
export class CountItemsService {
  constructor() {}

  countProductsItems(Pack) {
    return new Promise((resolve, reject) => {
      let tabItems = [];
      Pack.forEach((elt) => {
        console.log(elt);
        elt["item"]["unitNamePack"] = elt["item"]["unitNameProduct"];
        if (elt["item"]["unitNamePack"]) {
          if (
            elt["item"]["unitNamePack"] === "cl" &&
            elt["item"]["unitNameProduct"] === "cl"
          ) {
            console.log(elt);

            console.log("cl & cl");
            let nbr = parseInt(elt["item"]["sizePack"]) * parseInt(elt["qty"]);
            if (elt["item"]["nbrBtl"]) {
              nbr = nbr + elt["item"]["nbrBtl"];
            }
            let packQuantity = parseInt(elt["qty"]),
              productItemId = elt["item"]["productItemId"];
            let obj = {
              newquantity: nbr,
              packId: elt["item"]["_id"],
              packQuantity: packQuantity,
              productItemId: productItemId,
            };
            tabItems.push(obj);
          } else if (
            elt["item"]["unitNamePack"] === "g" &&
            elt["item"]["unitNameProduct"] === "g"
          ) {
            // console.log("g & g");
            let nbr = elt["item"]["sizePack"] * elt["qty"];
            let packQuantity = elt["qty"],
              productItemId = elt["item"]["productItemId"];
            let obj = {
              newquantity: nbr,
              packId: elt["item"]["_id"],
              packQuantity: packQuantity,
              productItemId: productItemId,
            };
            tabItems.push(obj);
          } else if (
            elt["item"]["unitNamePack"] === "kg" &&
            elt["item"]["unitNameProduct"] === "g"
          ) {
            console.log("kg & g");

            let nbr =
              (elt["item"]["sizePack"] * elt["qty"] * 1000) /
              elt["item"]["sizeUnitProduct"];
            let packQuantity = elt["qty"],
              productItemId = elt["item"]["productItemId"];
            let obj = {
              newquantity: nbr,
              packId: elt["item"]["_id"],
              packQuantity: packQuantity,
              productItemId: productItemId,
            };
            tabItems.push(obj);
          } else if (
            Pack["unitNamePack"] === "l" &&
            Pack["unitNameProduct"] === "cl"
          ) {
            console.log("l & cl");
            let nbr =
              (elt["item"]["sizePack"] * elt["qty"] * 100) /
              elt["item"]["sizeUnitProduct"];
            let packQuantity = elt["qty"],
              productItemId = elt["item"]["productItemId"];
            let obj = {
              newquantity: nbr,
              packId: elt["item"]["_id"],
              packQuantity: packQuantity,
              productItemId: productItemId,
            };
            tabItems.push(obj);
          }
        } else {
          console.log("aucune unité");
          console.log(elt);

          // let nbr = elt["item"]["sizePack"] * elt["qty"];
          // let obj = { newquantity: nbr, id: elt["item"]["productItemId"] };
          let noRistourne = false;
          if (elt["item"]["noRistourne"]) {
            noRistourne = elt["item"]["noRistourne"];
          }
          let nbr = 0;
          if (elt["item"]["sizePack"]) {
            nbr = elt["item"]["sizePack"] * elt["qty"];
          } else {
          }
          // let nbr = parseInt(elt["item"]["sizePack"]) * parseInt(elt["qty"]);
          if (elt["item"]["nbrBtl"]) {
            nbr = nbr + elt["item"]["nbrBtl"];
          }
          let packQuantity = elt["qty"],
            productItemId = elt["item"]["productItemId"];
          let obj = {
            newquantity: nbr,
            packId: elt["item"]["_id"],
            packQuantity: packQuantity,
            productItemId: productItemId,
            noRistourne: noRistourne,
            maeriId: elt["item"]["maeriId"],
          };
          tabItems.push(obj);
        }
      });
      resolve(tabItems);
    });
  }

  getQtyItems(allProducts, cartProducts, prod) {
    let b = [];
    b = cartProducts.filter((elt) => {
      return elt.item._id === prod._id;
    });
    let index = allProducts.findIndex((elt) => {
      return elt._id === prod._id;
    });
    prod["qty"] = b[0]["qty"];
    console.log("hello2", prod);
    allProducts.splice(index, 1, prod);
    return allProducts;
    //  this.products.splice(index, 1, prod);
  }
}
