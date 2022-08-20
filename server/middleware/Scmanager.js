const productItemsSchema = require("../api/models/ProductItem");
const packItem = require("../api/models/ProductPackItem");
const Manufactureitem = require("../api/models/Product-manufactured-item");
const billardSchema = require("../api/models/Billard");
const productListSchema = require("../api/models/Product-List");
const mongoose = require("mongoose");

const Maeri = require("../api/models/Maeri_Product");
const tenant = require("../getTenant");
let db = "maeri";
let cmp = 0;
warehouseManager = (req, res, AgenceCommande) => {
  return new Promise(async (resolve, reject) => {
    cmp = AgenceCommande.length;
    AgenceCommande.forEach(async (elt) => {
      // let eltId = elt.avaible._id;

      if (elt["avaible"]["productType"] === "packItems") {
        // console.log("le pack", elt);
        // countPackItems(req, elt);
      } else if (elt["avaible"]["productType"] === "manufacturedItems") {
      } else if (elt["avaible"]["productType"] === "productItems") {
        countProductItemesSc(req, elt);
        setTimeout(() => {}, 1500);
      } else if (elt["avaible"]["productType"] === "billard") {
        //countProductListItems
        try {
          await countBillardItemsFromSc(req, elt, res);
          if (cmp == 0) {
            resolve(true);
          }
        } catch (error) {
          reject(false);
        }
      } else if (elt["avaible"]["productType"] === "shoplist") {
        countProductListItemsSc(req, elt);
      } else if (elt["avaible"]["productType"] === "Gamme") {
      }
    });
  });
};

countPackItemSc = async (req, elt) => {
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

countProductItemesSc = async (req, elt) => {
  let a = mongoose.model("productitems", productItemsSchema);
  const tenant = a;

  tenant
    .findById({ _id: elt["item"]["_id"] })
    .exec()
    .then(async (doc) => {
      console.log("===>", doc);
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

countManufacturedItemsSc = (req, elt) => {};

countBillardItemsFromSc = async (req, elt, res) => {
  return new Promise(async (resolve, reject) => {
    db = req.dbUse;
    let a = mongoose.model("billard", billardSchema);
    //await req.tenancy.getModelByTenant(db, "billard", billardSchema);
    const tenant = a;
    tenant
      .findById({ _id: elt["avaible"]["_id"] })
      .exec()
      .then((doc) => {
        let newQuantity = 0;
        if (req.body.restore) {
          newQuantity = doc.quantityItems + parseInt(elt["accept"]);
        } else {
          newQuantity = doc.quantityItems - parseInt(elt["accept"]);
        }

        // let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
        if (newQuantity < 0) {
          newQuantity = 0;
        }

        tenant.findOneAndUpdate(
          { _id: elt["avaible"]["_id"] },
          {
            // $push: { tabitem: newpackitems },
            $set: {
              quantityItems: newQuantity,
            },
          },
          { new: true },
          (error, updateDoc) => {
            if (error) {
              console.log("billard items", error);
              cmp = cmp - 1;
              reject(error);
              // if (cmp == 0) {
              // res.status(500).json(error)
              // reject(error)
              // }
            } else {
              console.log("changes doc ======>>>>>>", updateDoc);
              req.io.sockets.emit(
                `${updateDoc.adminId}${updateDoc.storeId}billardItem`,
                updateDoc
              );
              req.io.sockets.emit(`${req.body.adminId}billardItem`, updateDoc);
              cmp = cmp - 1;
              resolve(updateDoc);
              // cmp = cmp - 1;
              //  if (cmp == 0) {
              /* req.io.sockets.emit(`${req.body.adminId}warehouseChange`, success);
                res.status(201).json({
                  message: "update ",
                });*/
              // resolve(sucess);
              // }
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
        cmp = cmp - 1;
        reject(err);
      });
  });

  // });
};

countBillardItemsGamme = async (req, elt, qty) => {
  console.log("element ===>", elt);
  console.log("quantity  ===>", qty);
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
          if (elt["toRemove"]) {
            newQuantity = doc.quantityStore - qty * elt["toRemove"];
          } else {
            newQuantity = doc.quantityStore - qty;
          }
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

countProductListItems = async (req, elt) => {
  db = req.dbUse;
  let a = mongoose.model("productlist", productListSchema);
  /* await req.tenancy.getModelByTenant(
    db,
    "productlist",
    productListSchema
  );*/
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

module.exports = warehouseManager;
