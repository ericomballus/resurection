const billSchema = require("../api/models/Bill");
const InventorySchema = require("../api/models/Inventory");
const AdminInventorySchema = require("../api/models/admin_Iventory");
const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
let randomObj = {};
let success;
let response;
let tabNoSelectItem = [];
let allProd = 0;
let nbrBill = 0;
let cmp = 0;
const inventoryBuilder = async (req, response, success) => {
  success = success;
  response = response;
  const tenant2 = req.tenancy.getModelByTenant(req.dbUse, "bill", billSchema);

  tenant2
    .aggregate([
      // { $unwind: "$products" },
      {
        /* $match: {
          openCashDateId: req.body._id,
          adminId: req.query.db,
        },*/
        $match: {
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
          openCashDateId: req.body._id,
        },
      },

      /* {
          $unwind: "$products",
        }, */
      {
        $unwind: "$commandes",
      },
      {
        $unwind: "$commandes.products",
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
          quantity: {
            $sum: "$commandes.products.qty",
          },
          more: {
            $sum: "$commandes.products.more",
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
              //qty: "$commandes.products.qty",  6082da837622671bcc10b330     6082767c3576af0b506e20e9
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
      const Inventory = req.tenancy.getModelByTenant(
        req.dbUse,
        "inventory",
        InventorySchema
      );
      Inventory.find({ cashOpening: req.body._id })
        .exec()
        .then(async (result) => {
          let data = {
            docs: docs,
            Inventory: result,
          };
          // console.log("les inventaires ici===", data);
          build(data, req);
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

build = (data, req) => {
  let invoices = data["docs"];
  let inventory = [];
  inventory = data["Inventory"];
  allProd = inventory[0]["listsStart"].length;
  let totalSale = 0;
  nbrBill = invoices.length;

  invoices.forEach(async (elt) => {
    let resultat = await moreInfo(inventory, elt);
    //.then((resultat) => {
    resultat["commandes"].forEach((pro) => {
      totalSale = totalSale + pro["commande"]["products"]["price"];
    });

    let id = resultat["entry"][0]["item"]["_id"];
    resultat["ristourneGenerate"] =
      parseInt(resultat["_id"]["ristourneByProduct"]) * resultat["quantity"];

    let index = resultat["entry"].length - 1;

    let benefice =
      resultat["entry"][index]["item"]["sellingPrice"] -
      resultat["entry"][index]["item"]["purchasingPrice"];
    //  console.log("benefice", benefice);
    resultat["beneficeUnitaire"] = benefice;
    resultat["beneficeTotal"] = benefice * resultat["quantity"];
    resultat["pachat"] = resultat["entry"][index]["item"]["purchasingPrice"];
    resultat["pvente"] = resultat["entry"][index]["item"]["sellingPrice"];

    if (elt["ristourneGenerate"]) {
    } else {
      resultat["ristourneGenerate"] = 0;
    }

    await confirm(resultat, data, req);
    //.then((res) => {
    cmp = cmp + 1;

    if (cmp == nbrBill) {
      //les produit qui n'ont pas été vendus ils contenu dans result
      req.io.sockets.emit(
        `${req.query.db}${req.query.storeId}endBuilInventory`,
        cmp
      );

      filterInventorylist(inventory, randomObj).then((result) =>
        addNosaleProduct(result, req)
      );
    }
    // });
    // });
  });
};

moreInfo = (inventory, elt) => {
  return new Promise((resolve, reject) => {
    inventory[0]["listsStart"].forEach((item) => {
      // randomObj[item["_id"]] = item;
      if (item["_id"] == elt["_id"]["id"] && item["productType"] == "Gamme") {
        elt["out"] = elt["quantity"];
        elt["start"] = 0;
        elt["reste"] = 0;
        elt["remaining2"] = 0;
        elt["more"] = 0;
        item["select"] = true;
        randomObj[item["_id"]] = item;
      } else if (item["_id"] == elt["_id"]["id"]) {
        elt["out"] = elt["quantity"];
        elt["start"] =
          elt["entry"][0]["item"]["quantityStore"] +
          elt["entry"][0]["item"]["quantityItems"];
        elt["reste"] = elt["start"] - elt["out"];
        elt["remaining2"] = 0;
        elt["more"] = elt["entry"][0]["item"]["more"];
        item["select"] = true;
        randomObj[item["_id"]] = item;
      } else {
        elt["out"] = elt["quantity"];
        elt["start"] =
          elt["entry"][0]["item"]["quantityStore"] +
          elt["entry"][0]["item"]["quantityItems"];
        elt["reste"] = elt["start"] - elt["out"];
        elt["remaining2"] = 0;
        elt["more"] = elt["entry"][0]["item"]["more"];
        randomObj[elt["_id"]["id"]] = elt;
      }
    });

    resolve(elt);
  });
};

confirm = (row, d, req) => {
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
    if (row && row["_id"]["type"] == "Gamme") {
      row["more"] = 0;
      row["reste"] = 0;
      row[" pachat"] = 1;
      row["beneficeUnitaire"] = 0;
      row["beneficeTotal"] = 0;
      row["start"] = 0;
      row["pachat"] = 0;
    }
    saveInventory(row, req).then((res) => {
      resolve("hello");
    });
  });
};

saveInventory = (row, req) => {
  return new Promise((resolve, reject) => {
    const tenant = req.tenancy.getModelByTenant(
      req.dbUse,
      "admininventory",
      AdminInventorySchema
    );

    tenant
      .find({
        productItemsId: row.productItemsId,
        cashOpening: row.cashOpening,
      })
      .lean()
      .exec()
      .then((docs) => {
        console.log("ligne 243 ===>", docs);
        if (docs.length) {
          tenant
            .findOneAndUpdate(
              { _id: docs[0]["_id"] },
              { $set: req.body },
              { new: true },
              function (error, resul) {
                if (error) {
                  console.log(error);
                } else {
                  resolve(resu);
                }
              }
            )
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("ligne 262 ===>", row);
          (row._id = new mongoose.Types.ObjectId()),
            tenant
              .create(row)
              .then((resu) => {
                resolve(resu);
              })
              .catch((err) => {
                console.log(err);
              });
        }
      });
  });
};

filterInventorylist = (inventory, randomObj) => {
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
};

addNosaleProduct = (arr, req) => {
  arr.forEach((prod) => {
    prod["out"] = 0;
    prod["start"] = prod["quantityStore"];
    prod["reste"] = prod["start"] - prod["out"];
    prod["remaining2"] = 0;
    prod["cashOpening"] = req.body._id;
    prod["adminId"] = req.body.adminId;
    prod["storeId"] = req.body.storeId;
    saveInventory(prod, req).then((res) => {
      // resolve("hello");
      cmp = cmp + 1;
      if (cmp == allProd) {
        //les produit qui n'ont pas été vendus ils contenu dans result
        req.io.sockets.emit(
          `${req.query.db}${req.query.storeId}endBuilInventory`,
          cmp
        );
      }
    });
  });
};

module.exports = inventoryBuilder;
