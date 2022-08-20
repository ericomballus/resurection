const billSchema = require("../api/models/Bill");
const InventorySchema = require("../api/models/Inventory");
const AdminInventorySchema = require("../api/models/admin_Iventory");
const invoiceSchema = require("../api/models/invoice");
const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
let randomObj = {};
let randomRes = [];
let tabNoSelectItem = [];
let cmpR = 0;
resp = "";
let cmp = 0;
nbrBill = 0;
allDocs = 0;
let nbr = 0;
function randomInventory(req, res) {
  resp = res;
  randomRes = [];
  randomObj = {};
  cmpR = 0;
  cmp = 0;
  nbrBill = 0;
  allDocs = 0;
  //resp = res;
  tabNoSelectItem = [];
  const tenant2 = mongoose.model("invoice", invoiceSchema);
  /* req.tenancy.getModelByTenant(
    req.dbUse,
    "invoice",
    invoiceSchema
  );*/

  tenant2
    .aggregate([
      // { $unwind: "$products" },
      {
        $match: {
          openCashDateId: req.query.cashOpening,
          $or: [
            { adminId: req.query.adminId },
            { adminId: new ObjectId(req.query.adminId) },
          ],
          invoiceCancel: false,
          sale: true,
        },
      },

      /* {
        $unwind: "$products",
      }, */
      {
        $unwind: "$trancheList",
      },
      {
        $unwind: "$commandes",
      },
      {
        $unwind: "$commandes.products",
      },
      {
        $unwind: "$_id",
      },
      {
        $group: {
          _id: {
            name: "$commandes.products.item.name",
            type: "$commandes.products.item.productType",
            id: "$commandes.products.item._id",
            ristourneByProduct: "$commandes.products.item.ristourneParProduit",
            ristourneByPAck: "$commandes.products.item.ristourne",
          },
          averageQuantity: { $avg: "$commandes.products.qty" },
          count: { $sum: 1 },
          totalSalesAmount: {
            $sum: "$commandes.products.price",
          },
          invoiceSum: {
            $sum: "$trancheList.montant",
          },
          quantity: {
            $sum: "$commandes.products.qty",
          },

          glace: {
            $sum: "$commandes.products.item.modeG",
          },
          nonglace: {
            $sum: "$commandes.products.item.modeNG",
          },
          ristourne: {
            $sum: "$commandes.products.item.ristourneParProduit",
          },
          entry: {
            $push: {
              item: "$commandes.products.item",
              qty: "$commandes.products.qty",
            },
          },
          commandes: {
            $push: {
              commande: "$commandes",
              //qty: "$commandes.products.qty",
            },
          },
          trancheList: {
            $push: {
              trancheList: "$trancheList",
              //qty: "$commandes.products.qty",
            },
          },

          invoiceId: {
            $push: {
              id: "$_id",
              //qty: "$commandes.products.qty",
            },
          },

          /*  recette: {
        $sum: "$montant"
      }*/
        },
      },
    ])
    //.lean()
    //.exec()
    .then((docs) => {
      if (docs.length == 0) {
        res.json({
          docs: [],
          //cash: cash,
        });
      } else {
        const Inventory = mongoose.model("inventory", InventorySchema);
        /* req.tenancy.getModelByTenant(
          req.dbUse,
          "inventory",
          InventorySchema
        );*/
        Inventory.find({ cashOpening: req.query.cashOpening })
          .exec()
          .then(async (result) => {
            allDocs = result[0]["listsStart"].length;
            let data = {
              docs: docs,
              Inventory: result,
            };
            // console.log(data);
            mballus(data, req);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function mballus(data, req) {
  // console.log("in dans build");
  // console.log(data);
  let invoices = data["docs"];

  let inventory = [];
  inventory = data["Inventory"];
  cmpR = inventory[0]["listsStart"].length;

  let totalSale = 0;
  nbrBill = invoices.length;
  let cmp = 0;
  invoices.forEach(async (elt) => {
    moreInfo(inventory, elt).then(async (res) => {
      res["commandes"].forEach((pro) => {
        if (pro["commande"].montantReduction) {
          // montant = montant + elt.montantReduction;
          totalSale = totalSale + pro["commande"]["montantReduction"];
        } else {
          totalSale = totalSale + pro["commande"]["cartdetails"]["totalPrice"];
        }
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
      // console.log(res);
      let res1 = await confirm(res, data, req);
      // console.log(res1);
      cmp = cmp + 1;
      // console.log(cmp);
      // console.log(randomRes)

      if (cmp == nbrBill) {
        //les produit qui n'ont pas été vendus ils contenu dans result
        if (cmpR == cmp) {
          resp.json({
            docs: randomRes,
            //cash: cash,
          });
        } else {
          resp.json({
            docs: randomRes,
            //cash: cash,
          });
        }
      }

      // let res2 = await filterInventorylist(inventory, randomObj);
      // if (res2) {
      // console.log("111+++++22222", res2);
      // addNosaleProduct(res2, req);
      // }
    });
  });
}

function moreInfo(inventory, elt) {
  return new Promise((resolve, reject) => {
    inventory[0]["listsStart"].forEach((item) => {
      // randomObj[item["_id"]] = item;
      // console.log(item);
      if (item["_id"] == elt["_id"]["id"]) {
        elt["out"] = elt["quantity"];
        elt["start"] = elt["entry"][0]["item"]["quantityStore"];
        elt["reste"] = elt["start"] - elt["out"];
        elt["remaining2"] = 0;
        item["select"] = true;
        randomObj[item["_id"]] = item;
        // tabNoSelectItem.push(item["_id"]);
        //delete randomObj[item["_id"]];
      } else {
        elt["out"] = elt["quantity"];
        elt["start"] = elt["entry"][0]["item"]["quantityStore"];
        elt["reste"] = elt["start"] - elt["out"];
        elt["remaining2"] = 0;
        randomObj[elt["_id"]["id"]] = elt["entry"][0]["item"];
      }
    });

    resolve(elt);
  });
}

function confirm(row, d, req) {
  return new Promise((resolve) => {
    let name = row["_id"]["name"];
    let productItemId = row["_id"]["id"];
    row["isChecked"] = true;
    row["name"] = name;
    row["productItemsId"] = productItemId;

    row["reste"] = row["entry"][0]["item"]["quantityStore"];
    let adminId = req.query.db;
    let openCashDateId = d["_id"];
    let storeId = d["storeId"];
    row["cashOpening"] = req.body._id;
    row["adminId"] = req.body.adminId;
    row["storeId"] = req.body.storeId;
    saveInventory(row, req).then((res) => {
      resolve("hello");
    });
  });
}

function saveInventory(row, req) {
  return new Promise((resolve, reject) => {
    randomRes.push(row);
    resolve(row);
  });
}

function filterInventorylist(inventory, randomObj) {
  let tab = [];
  return new Promise((resolve, reject) => {
    inventory[0]["listsStart"].forEach((item) => {
      if (item["_id"] in randomObj) {
      } else {
        tab.push(item);
      }
    });
    resolve(tab);
  });
}

function addNosaleProduct(arr, req) {
  arr.forEach((prod) => {
    prod["out"] = 0;
    prod["start"] = prod["quantityStore"];
    prod["reste"] = prod["start"] - prod["out"];
    prod["remaining2"] = 0;
    prod["cashOpening"] = req.body._id;
    prod["adminId"] = req.body.adminId;
    prod["storeId"] = req.body.storeId;
    randomRes.push(prod);
  });

  if (cmpR == allDocs) {
    resp.json({
      docs: randomRes,
      //cash: cash,
    });
  }
}

module.exports = randomInventory;
