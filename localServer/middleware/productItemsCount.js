const productItemsSchema = require("../api/models/ProductItem");
const packItem = require("../api/models/ProductPackItem");
const Manufactureitem = require("../api/models/Product-manufactured-item");
const billardSchema = require("../api/models/Billard");
const productListSchema = require("../api/models/Product-List");
const CompanySetting = require("../api/models/Company_Setting");
const Maeri = require("../api/models/Maeri_Product");
const tenant = require("../getTenant");
let db = "maeri";
const mongoose = require("mongoose");

countItems = (req, tab) => {
  tab.forEach((elt) => {
    console.log(elt);

    if (elt["item"]["productType"] === "packItems") {
      // console.log("le pack", elt);
      // countPackItems(req, elt);
    } else if (elt["item"]["productType"] === "manufacturedItems") {
      db = req.dbUse;
      let a = mongoose.model("manufactureditemSchema", Manufactureitem);

      const tenant = a;
      tenant
        .findById({ _id: elt["item"]["_id"] })
        .exec()
        .then((doc) => {
          let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
          if (newQuantity < 0) {
            newQuantity = 0;
          }

          tenant.findOneAndUpdate(
            { _id: elt["item"]["_id"] },
            {
              // $push: { tabitem: newpackitems },
              $set: {
                quantityStore: newQuantity,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log("manufactured items", error.message);
              } else {
                req.io.sockets.emit(
                  `${req.params.adminId}manufacturedItem`,
                  success
                );
              }
            }
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (elt["item"]["productType"] === "productItems") {
      // console.log("element i i i ii  ===>", elt["item"]);
      countProductItemes22(req, elt);
      setTimeout(() => {}, 1500);
    } else if (elt["item"]["productType"] === "billard") {
      let Company = mongoose.model("company", CompanySetting);

      Company.find(
        {
          adminId: req.query.db,
        },
        "-__v"
      )
        .lean()
        .exec((err, docs) => {
          let count_bottle = false;

          if (docs[0].sale_Gaz) {
            count_bottle = true;

            countBillardItemsNew(req, elt, count_bottle);
          } else {
            countBillardItemsNew(req, elt, count_bottle);
          }
        });
    } else if (elt["item"]["productType"] === "shoplist") {
      let Company = mongoose.model("company", CompanySetting);
      Company.find(
        {
          adminId: req.query.db,
        },
        "-__v"
      )
        .lean()
        .exec((err, docs) => {
          let count_bottle = false;
          if (docs[0].sale_Gaz) {
            count_bottle = true;

            countProductListItemsNew(req, elt, count_bottle);
          } else {
            countProductListItemsNew(req, elt, count_bottle);
          }
        });
    } else if (elt["item"]["productType"] === "Gamme") {
      let qty = parseInt(elt["qty"]);
      elt["item"]["productList"].forEach(async (prod) => {
        setTimeout(async () => {
          let result = await countBillardItemsGamme(
            req,
            prod,
            parseInt(elt["qty"])
          );
        }, 2000);
      });
    }
  });
};

countPackItem = async (req, elt) => {
  packItem
    .findById({ _id: elt["item"]["_id"] })
    .exec()
    .then((doc) => {
      let newQuantity = doc.quantityItems - parseInt(elt["qty"]);
      if (newQuantity < 0) {
        newQuantity = 0;
      }

      packItem.findOneAndUpdate(
        { _id: elt["item"]["_id"] },
        {
          // $push: { tabitem: newpackitems },
          $set: {
            quantityItems: newQuantity,
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log(error.message);
          } else {
            req.io.sockets.emit(`${req.params.adminId}packItem`, success);
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
  // });
};

countProductItemes22 = async (req, elt) => {
  let a = mongoose.model("productitems", productItemsSchema);

  const tenant = a;

  tenant
    .findById({ _id: elt["item"]["_id"] })
    .exec()
    .then(async (doc) => {
      console.log("===>items", elt["item"]);
      let ristourneGen = doc.ristourneGenerate;
      let glace;
      let nonglace;
      let noRistouneQuantity = doc.stockNoRistourne;
      let comptRistourne; /* quantité sur laquel je dois compter les ristourne */
      let tabRistourne;
      //if (noRistouneQuantity > 0) {
      if (parseInt(elt["qty"]) > parseInt(noRistouneQuantity)) {
        // noRistouneQuantity=  parseInt(elt["qty"]) -  noRistouneQuantity
        noRistouneQuantity = 0;
        comptRistourne = parseInt(elt["qty"]) - parseInt(noRistouneQuantity);
      } else {
        noRistouneQuantity =
          parseInt(noRistouneQuantity) - parseInt(elt["qty"]);
        comptRistourne = 0;
      }
      if (doc.maeriId !== "nothing") {
        Maeri.findById(doc.maeriId, (err, product) => {
          if (!err) {
            let ris_par_produit =
              parseInt(product["ristourne"]) / parseInt(product["packSize"]);
            ristourneGen = ristourneGen + ris_par_produit * comptRistourne;
            let objRistourne = {
              openCashDate: req.body.openCashDate,
              openCashDateId: req.body.openCashDateId,
              ristourne: ris_par_produit * comptRistourne,
            };

            let benefice = doc["sellingPrice"] - doc["purchasingPrice"];
            let beneficeTotal = benefice * elt["qty"] + doc.beneficeTotal;
            if (doc.glace && doc.glace > 0 && elt["item"]["modeG"]) {
              glace = parseInt(doc.glace) - parseInt(elt["item"]["modeG"]);
            } else if (doc.glace) {
              glace = parseInt(doc.glace);
            } else {
            }
            if (doc.nonglace && doc.nonglace > 0 && elt["item"]["modeNG"]) {
              nonglace =
                parseInt(doc.nonglace) - parseInt(elt["item"]["modeNG"]);
            } else if (doc.nonglace) {
              nonglace = parseInt(doc.nonglace);
            } else {
            }

            if (doc.quantityStore <= 0) {
              doc.productAlert = false;
            }
            let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
            if (elt["item"]["more"] > 0 && doc.quantityStore > 0) {
              newQuantity = doc.quantityStore - parseInt(elt["qty"]);
            }

            let quantityItems = doc.quantityItems;
            let check =
              doc.quantityStore + doc.quantityItems - parseInt(elt["qty"]);

            if (check <= 0 && elt["item"]["more"] > 0) {
              newQuantity = 0;
              glace = 0;
              nonglace = 0;
              quantityItems = 0;
            } else {
            }
            //  let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
            if (newQuantity < 0) {
              newQuantity = 0;
            }
            if (comptRistourne) {
              tenant.findOneAndUpdate(
                { _id: elt["item"]["_id"] },
                {
                  $push: { ristourneTab: objRistourne },
                  $set: {
                    quantityStore: newQuantity,
                    quantityItems: quantityItems,
                    glace: glace,
                    nonglace: nonglace,
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log("product items", error.message);
                  } else {
                    req.io.sockets.emit(
                      `${req.params.adminId}productItem`,
                      success
                    );
                  }
                }
              );
            } else {
              tenant.findOneAndUpdate(
                { _id: elt["item"]["_id"] },
                {
                  // $push: { ristourneTab: objRistourne },
                  $set: {
                    quantityStore: newQuantity,
                    quantityItems: quantityItems,
                    glace: glace,
                    nonglace: nonglace,
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log("product items", error.message);
                  } else {
                    req.io.sockets.emit(
                      `${req.params.adminId}productItem`,
                      success
                    );
                  }
                }
              );
            }
          } else {
          }
        });
      } else {
        let objRistourne = {
          openCashDate: req.body.openCashDate,
          openCashDateId: req.body.openCashDateId,
          ristourne: 0,
        };
        let benefice = doc["sellingPrice"] - doc["purchasingPrice"];
        let beneficeTotal = benefice * elt["qty"] + doc.beneficeTotal;
        if (doc.glace && doc.glace > 0 && elt["item"]["modeG"]) {
          glace = parseInt(doc.glace) - parseInt(elt["item"]["modeG"]);
        } else if (doc.glace) {
          glace = parseInt(doc.glace);
        } else {
        }
        if (doc.nonglace && doc.nonglace > 0 && elt["item"]["modeNG"]) {
          nonglace = parseInt(doc.nonglace) - parseInt(elt["item"]["modeNG"]);
        } else if (doc.nonglace) {
          nonglace = parseInt(doc.nonglace);
        } else {
        }

        if (doc.quantityStore <= 0) {
          doc.productAlert = false;
        }
        let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
        if (elt["item"]["more"] > 0 && doc.quantityStore > 0) {
          newQuantity = doc.quantityStore - parseInt(elt["qty"]);
        }

        let quantityItems = doc.quantityItems;
        let check =
          doc.quantityStore + doc.quantityItems - parseInt(elt["qty"]);

        if (check <= 0 && elt["item"]["more"] > 0) {
          newQuantity = 0;
          glace = 0;
          nonglace = 0;
          quantityItems = 0;
        } else {
        }
        //  let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
        if (newQuantity < 0) {
          newQuantity = 0;
        }
        if (comptRistourne) {
          tenant.findOneAndUpdate(
            { _id: elt["item"]["_id"] },
            {
              $push: { ristourneTab: objRistourne },
              $set: {
                quantityStore: newQuantity,
                quantityItems: quantityItems,
                glace: glace,
                nonglace: nonglace,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log("product items", error.message);
              } else {
                req.io.sockets.emit(
                  `${req.params.adminId}productItem`,
                  success
                );
              }
            }
          );
        } else {
          tenant.findOneAndUpdate(
            { _id: elt["item"]["_id"] },
            {
              // $push: { ristourneTab: objRistourne },
              $set: {
                quantityStore: newQuantity,
                quantityItems: quantityItems,
                glace: glace,
                nonglace: nonglace,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log("product items", error.message);
              } else {
                req.io.sockets.emit(
                  `${req.params.adminId}productItem`,
                  success
                );
              }
            }
          );
        }
      }

      // }
    })
    .catch((err) => {
      console.log(err);
    });
};

countManufacturedItems = (req, elt) => {};

countBillardItemsNew = async (req, elt, count_bottle) => {
  db = req.dbUse;
  let a = mongoose.model("billard", billardSchema);
  // await req.tenancy.getModelByTenant(db, "billard", billardSchema);
  const tenant = a;
  tenant
    .findById({ _id: elt["item"]["_id"] })
    .exec()
    .then((doc) => {
      let newQuantity = doc.quantityStore;
      let newQuantityItems = doc.quantityItems;
      if (req.body.scConfirm) {
        newQuantityItems = doc.quantityItems - parseInt(elt["qty"]);
      } else {
        newQuantity = doc.quantityStore - parseInt(elt["qty"]);
      }
      if (newQuantity < 0) {
        newQuantity = 0;
      }
      if (newQuantityItems < 0) {
        newQuantityItems = 0;
      }
      let bottle_full = 0;
      let bottle_empty = 0;
      let bottle_total = 0;
      if (doc.bottle_full) {
        bottle_full = doc.bottle_full;
      }
      if (doc.bottle_empty) {
        bottle_empty = doc.bottle_empty;
      }

      if (count_bottle) {
        // bottle_full = bottle_full - parseInt(elt["qty"]);
        bottle_full = newQuantity + newQuantityItems;
        bottle_empty = bottle_empty + parseInt(elt["qty"]);
        bottle_total = bottle_full + bottle_empty;
      }

      tenant.findOneAndUpdate(
        { _id: elt["item"]["_id"] },
        {
          // $push: { tabitem: newpackitems },
          $set: {
            quantityStore: newQuantity,
            quantityItems: newQuantityItems,
            bottle_full: bottle_full,
            bottle_empty: bottle_empty,
            bottle_total: bottle_total,
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log("billard items", error.message);
          } else {
            req.io.sockets.emit(`${req.params.adminId}billardItem`, success);
            req.io.sockets.emit(
              `${req.params.adminId}${success.storeId}billardItem`,
              success
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
  // });
};

countBillardItemsGamme = async (req, elt, qty) => {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("billard", billardSchema);
    // await req.tenancy.getModelByTenant(db, "billard", billardSchema);
    const tenant = a;
    tenant
      .findById({ _id: elt["_id"] })
      .exec()
      .then((doc) => {
        let newQuantity = 0;
        if (doc && doc.quantityStore) {
          newQuantity = doc.quantityStore - qty * elt["toRemove"];
        }

        if (newQuantity < 0) {
          newQuantity = 0;
        }

        tenant.findOneAndUpdate(
          { _id: elt["_id"] },
          {
            // $push: { tabitem: newpackitems },
            $set: {
              quantityStore: newQuantity,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log("billard items", error.message);
              reject(error);
            } else {
              setTimeout(() => {
                resolve(success);
              }, 1000);
              req.io.sockets.emit(`${req.params.adminId}billardItem`, success);
              req.io.sockets.emit(
                `${req.params.adminId}${success.storeId}billardItem`,
                success
              );
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

  // });
};

countProductListItemsNew = async (req, elt, count_bottle) => {
  console.log(elt);
  if (elt["item"].originId) {
    elt.item._id = elt.item.originId;
  }
  db = req.dbUse;
  let a = mongoose.model("productlist", productListSchema);

  const tenant = a;
  tenant
    .findById({ _id: elt["item"]["_id"] })
    .exec()
    .then((doc) => {
      let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
      if (newQuantity < 0) {
        newQuantity = 0;
      }
      let bottle_full = 0;
      let bottle_empty = 0;
      let bottle_total = 0;
      if (doc.bottle_full) {
        bottle_full = doc.bottle_full;
      }
      if (doc.bottle_empty) {
        bottle_empty = doc.bottle_empty;
      }
      if (doc.bottle_total) {
        bottle_total = doc.bottle_total;
      }

      if (count_bottle) {
        if (elt.item.sale_type && elt.item.sale_type == "emballage") {
          newQuantity = doc.quantityStore;
          // bottle_full = bottle_full - parseInt(elt["qty"]);
          bottle_empty = bottle_empty - parseInt(elt["qty"]);
          bottle_total = bottle_total - parseInt(elt["qty"]);
        } else if (
          elt.item.sale_type &&
          elt.item.sale_type == "emballage&contenu"
        ) {
          bottle_full = bottle_full - parseInt(elt["qty"]);
          bottle_total = bottle_total - parseInt(elt["qty"]);
        } else {
          bottle_full = bottle_full - parseInt(elt["qty"]);
          //bottle_full = newQuantity + doc.quantityItems;
          bottle_empty = bottle_empty + parseInt(elt["qty"]);
          bottle_total = bottle_full + bottle_empty;
        }
      }

      tenant.findOneAndUpdate(
        { _id: elt["item"]["_id"] },
        {
          // $push: { tabitem: newpackitems },
          $set: {
            quantityStore: newQuantity,
            bottle_full: bottle_full,
            bottle_empty: bottle_empty,
            bottle_total: bottle_total,
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log("billard items", error.message);
          } else {
            req.io.sockets.emit(`${req.params.adminId}productlist`, success);
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
  // });
};

module.exports = countItems;
