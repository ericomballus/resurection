const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Maeri = require("../models/Maeri_Product");
const productItemsSchema = require("../models/ProductItem");
const InventorySchema = require("../models/Inventory");
const resourceSchema = require("../models/Resource");
const resourceManager = require("../../middleware/manageResource");
const tenant = require("../../getTenant");
let db = "maeri";
let ObjectId = require("mongoose").Types.ObjectId;
const { fork } = require("child_process");
const { log } = require("console");
router.get("/", (req, res, next) => {
  req.tenant
    .find({ adminId: new ObjectId(req.query.adminId) }, "-v")
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      res.json({
        docs: result,
      });
    });
});

router.get("/for_inventory", (req, res, next) => {
  req.tenant
    .find({
      adminId: new ObjectId(req.query.db),
      created: {
        $gte: req.query.olDate,
        $lte: req.query.newDate,
      },
    })
    .lean()
    .exec()
    .then((resul) => {
      let docs = resul.reverse();
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/admin/:adminId", async (req, res, next) => {
  if (req.query.isPatient) {
    try {
      let list = await req.tenant
        .find({
          customerId: req.query.customerId,
        })
        .sort({ _id: 1 })
        .exec();
      res.json(list);
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  } else if (req.query.cancel == true || req.query.cancel == "true") {
    console.log("=====get all invoice=====");
    let today = new Date();
    let d = new Date().toISOString().substring(0, 10);
    let status = false;
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.toISOString;
    let t = tomorrow.toISOString().substring(0, 10);
    req.tenant
      .aggregate([
        {
          $match: {
            $or: [
              { adminId: req.query.db },
              { adminId: new ObjectId(req.query.db) },
              // { cancel: { $exists: false } },
            ],
            storeId: req.query.storeId,
            created: { $gte: new Date(d), $lt: new Date(t) },
          },
        },
        { $sort: { created: -1 } },
        { $limit: 100 },
      ])

      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.query.deleteAuth) {
    req.tenant
      .aggregate([
        {
          $match: {
            $or: [
              { adminId: req.query.db },
              { adminId: new ObjectId(req.query.db) },
              { cancel: { $exists: false } },
            ],
            openCashDateId: req.query.openCashDateId,
            cancel: false,
            deleteAuth: true,
            storeId: req.query.storeId,
          },
        },
      ])
      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.query.openCashDateId == 1 || req.query.whoIs == true) {
    let today = new Date();
    let d = new Date().toISOString().substring(0, 10);
    let status = false;
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.toISOString;
    let t = tomorrow.toISOString().substring(0, 10);

    req.tenant
      .aggregate([
        {
          $match: {
            $or: [
              { adminId: req.query.db },
              { adminId: new ObjectId(req.query.db) },
              // { cancel: { $exists: false } },
            ],
            storeId: req.query.storeId,
            created: { $gte: new Date(d), $lt: new Date(t) },
            cancel: false,
          },
        },
        { $sort: { created: -1 } },
        { $limit: 100 },
      ])

      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else {
    req.tenant
      .find({
        openCashDateId: req.query.openCashDateId,
        cancel: false,
        storeId: req.query.storeId,
      })
      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
});

router.get("/admin/:adminId/aggregate", (req, res, next) => {
  // req.tenant
  if (req.query.onlyByDate) {
    onlyBydateSelect(req, res);
  } else if (req.query.localServer) {
    console.log("come from localserver customer");
    req.tenant
      .find({
        // deleteAuth: true,
        // adminId: req.query.adminId,
        $or: [
          { adminId: req.query.db },
          { adminId: new ObjectId(req.query.db) },
        ],
        openCashDateId: req.query.openCashDateId,
      })
      .then((docs) => {
        res.json(docs);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else {
    req.tenant
      .aggregate([
        // { $unwind: "$products" },
        {
          $match: {
            openCashDateId: req.query.openCashDateId,
            cancel: false,
            openCashDateId: req.query.openCashDateId,
            /* $or: [
              { openCashDateId: req.query.openCashDateId },
              { adminId: new ObjectId(req.query.db) },
            ],*/
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
              ristourneByProduct:
                "$commandes.products.item.ristourneParProduit",
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
        Inventory.find({ cashOpening: req.query.openCashDateId })
          .exec()
          .then(async (result) => {
            res.status(200).json({
              docs: docs,
              Inventory: result,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
});
router.post("/", (req, res, next) => {
  let montant = 0;
  let billId = null;
  if (req.body.billId) {
    billId = req.body.billId;
  }

  if (req.body.resourceList) {
    console.log(req.body.resourceList);

    let ResourceItem = req.tenancy.getModelByTenant(
      req.dbUse,
      "resource",
      resourceSchema
    );
    resourceManager(req, req.body.resourceList, ResourceItem);
  }
  const child = fork(__dirname + "/worker");

  child.on("message", (result) => {
    console.log("second log ");
    manageProd(req, result.tab);
    req.tenant
      .find({
        localId: req.body.localId,
        openCashDateId: req.body.openCashDateId,
      })
      .lean()
      .exec()
      .then((bills) => {
        if (bills.length) {
          res.send(JSON.stringify({ success: "existe deja" }));
        } else {
          req.tenant
            .create({
              adminId: req.body.adminId,
              userName: req.body.userName,
              invoicesId: req.body._id,
              commandes: req.body.commandes,
              openCashDate: req.body.openCashDate,
              openCashDateId: req.body.openCashDateId,
              numFacture: req.body.numFacture,
              montant: result.montant,
              localId: req.body.localId,
              reimbursed: req.body.reimbursed,
              rembourse: req.body.rembourse,
              customerId: req.body.customerId,
              customer: req.body.commande.customer,
              trancheList: req.body.trancheList,
              billId: billId,
            })
            .then((resu) => {
              req.io.sockets.emit(`${req.body.adminId}newBill`, resu);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  });

  child.send(req.body.commandes);
  res.send(JSON.stringify({ success: "resu" }));
});

router.post("/createBill", (req, res, next) => {
  let montant = 0;

  let tabP = [];
  let billId = null;
  let employe = null;
  let employeId = null;
  let deliveryDate = Date.now();
  if (req.body.billId) {
    billId = req.body.billId;
  }
  if (req.body.commande.employe) {
    employe = req.body.commande.employe;
    employeId = employe._id;
  }
  let phoneNumber = 0;
  if (req.body.phoneNumber) {
    phoneNumber = phoneNumber;
  }
  if (req.body.deliveryDate) {
    deliveryDate = req.body.deliveryDate;
  }
  let removeProductList = [];
  let addProductList = [];
  if (req.body.removeProductList) {
    removeProductList = req.body.removeProductList;
  }
  if (req.body.addProductList) {
    addProductList = req.body.addProductList;
  }

  const child = fork(__dirname + "/worker");

  child.on("message", (result) => {
    //  manageProd(req, result.tab);
    req.tenant
      .find({
        localId: req.body.localId,
        // openCashDateId: req.body.openCashDateId,
      })
      .lean()
      .exec()
      .then(async (bills) => {
        if (bills.length) {
          console.log("existe deja ici=====>", bills);
          await req.tenant.findOneAndUpdate(
            { localId: req.body.localId },
            {
              $set: {
                trancheList: req.body.trancheList,
              },
            },
            {
              new: true,
            }
          );
          res.send(
            JSON.stringify({
              message: "cette facture existe deja",
              delete: true,
              success: bills,
            })
          );
        } else {
          if (!req.body.commande.customer) {
            req.body.commande.customer = { _id: "" };
          }
          req.tenant
            .create({
              adminId: req.body.adminId,
              userName: req.body.userName,
              invoicesId: req.body._id,
              commandes: req.body.commandes,
              openCashDate: req.body.openCashDate,
              openCashDateId: req.body.openCashDateId,
              numFacture: req.query.numFacture,
              montant: result.montant,
              localId: req.body.localId,
              reimbursed: req.body.reimbursed,
              rembourse: req.body.rembourse,
              customerId: req.body.commande.customer._id,
              customer: req.body.commande.customer,
              trancheList: req.body.trancheList,
              storeId: req.body.storeId,
              confirmPaie: req.body.confirmPaie,
              delivery: req.body.delivery,
              billId: billId,
              montantReduction: req.body.commande.montantReduction,
              employeId: employeId,
              commande: req.body.commande,
              paiment_type: req.body.paiment_type,
              scConfirm: req.body.scConfirm,
              swConfirm: req.body.swConfirm,
              phoneNumber: phoneNumber,
              useCustomerSolde: req.body.useCustomerSolde,
              deliveryDate: deliveryDate,
              removeProductList: removeProductList,
              addProductList: addProductList,
            })
            .then(async (resu) => {
              if (resu.billId) {
              } else {
              }
              require("../../utils/manageRecipe")(resu, req);
              req.io.sockets.emit(`${req.body.adminId}newBill`, resu);
              req.io.sockets.emit(
                `${req.body.adminId}${req.body.storeId}newBill`,
                resu
              );
              res.send(JSON.stringify({ success: resu }));
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  });

  child.send(req.body.commandes);
});

router.patch("/", (req, res, next) => {
  if (req.body.scConfirm && req.body.swConfirm) {
    req.tenant
      .findOneAndUpdate(
        { _id: req.body._id },
        { $set: req.body },
        { new: true },
        function (error, success) {
          if (error) {
            console.log(error);
          } else {
            console.log(success);
            req.io.sockets.emit(`${success.adminId}billUpdate`, success);
            res.status(201).json({
              bill: success,
            });
          }
        }
      )
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    req.tenant
      .updateOne(
        { _id: req.body._id },
        { $set: { reimbursed: 2 } },
        { new: true },
        function (error, success) {
          if (error) {
            console.log(error);
          } else {
            res.status(201).json({
              bill: success,
            });
          }
        }
      )
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  }
});

// create bill with redirect route
router.patch("/createBill", (req, res, next) => {
  let montant = 0;
  let swConfirm = false;
  let tabP = [];
  let billId = null;
  let employe = null;
  let employeId = null;
  if (req.body.swConfirm) {
    swConfirm = true;
  }
  if (req.body.billId) {
    billId = req.body.billId;
  }
  if (req.body.commande.employe) {
    employe = req.body.commande.employe;
    employeId = employe._id;
  }
  let phoneNumber = 0;
  if (req.body.phoneNumber) {
    phoneNumber = req.body.phoneNumber;
  }
  let caisseConfirm = false;
  let emballage = 0;
  let transport = 0;
  let taxeRetrait = 0;
  let phytosanitaire = 0;
  let poids_estimatif = 0;
  let transport_colis = 0;
  if (req.body.caisseConfirm) {
    caisseConfirm = true;
  }

  if (req.body.scConfirm) {
    emballage = req.body.emballage;
    phytosanitaire = req.body.phytosanitaire;
    transport = req.body.transport;
    taxeRetrait = req.body.taxeRetrait;
    poids_estimatif = req.body.poids_estimatif;
    transport_colis = req.body.transport_colis;
  }

  let saConfirm = false;
  if (req.body.caisseConfirm) {
    saConfirm = true;
  }

  let deliveryDate = Date.now();
  if (req.body.deliveryDate) {
    deliveryDate = req.body.deliveryDate;
  }

  const child = fork(__dirname + "/worker");

  child.on("message", (result) => {
    //  manageProd(req, result.tab);
    req.tenant
      .find({
        localId: req.body.localId,
        // openCashDateId: req.body.openCashDateId,
      })
      .lean()
      .exec()
      .then(async (bills) => {
        if (bills.length) {
          await req.tenant.findOneAndUpdate(
            { localId: req.body.localId },
            {
              $set: {
                trancheList: req.body.trancheList,
                saConfirm: saConfirm,
                caisseConfirm: caisseConfirm,
              },
            },
            {
              new: true,
            }
          );
          res.send(
            JSON.stringify({
              message: "cette facture existe deja",
              delete: true,
              success: bills,
            })
          );
        } else {
          req.tenant
            .create({
              adminId: req.body.adminId,
              userName: req.body.userName,
              invoicesId: req.body._id,
              commandes: req.body.commandes,
              openCashDate: req.body.openCashDate,
              openCashDateId: req.body.openCashDateId,
              numFacture: req.query.numFacture,
              montant: result.montant,
              localId: req.body.localId,
              reimbursed: req.body.reimbursed,
              rembourse: req.body.rembourse,
              customerId: req.body.customerId,
              customer: req.body.commande.customer,
              trancheList: req.body.trancheList,
              storeId: req.body.storeId,
              confirmPaie: req.body.confirmPaie,
              delivery: req.body.delivery,
              billId: billId,
              montantReduction: req.body.commande.montantReduction,
              employeId: employeId,
              commande: req.body.commande,
              paiment_type: req.body.paiment_type,
              swConfirm: swConfirm,
              caisseConfirm: caisseConfirm,
              saConfirm: saConfirm,
              phoneNumber: phoneNumber,
              deliveryDate: deliveryDate,
              emballage: emballage,
              phytosanitaire: phytosanitaire,
              transport: transport,
              taxeRetrait: taxeRetrait,
              poids_estimatif: poids_estimatif,
              transport_colis: transport_colis,
            })
            .then(async (resu) => {
              if (resu.billId) {
              } else {
              }

              req.io.sockets.emit(`${req.body.adminId}newBill`, resu);
              req.io.sockets.emit(
                `${req.body.adminId}${req.body.storeId}newBill`,
                resu
              );
              res.send(JSON.stringify({ success: resu }));
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  });

  child.send(req.body.commandes);
});

router.patch("/cancel/bill", async (req, res, next) => {
  console.log("body ===>", req.body);
  let query = {};
  let update = {};
  let update2 = {};
  let id = "";

  id = req.body.order._id;
  query["cancel"] = true;
  try {
    let success = await req.tenant.findOneAndUpdate(
      { localId: req.body.localId },
      // update,
      { $set: { cancel: true } },
      {
        new: true,
      }
    );
    require("../../utils/manageRecipe")(success, req);
    if (!req.body.createdPurchase) {
      req.io.sockets.emit(`${req.query.db}billCancel`, success);
      req.io.sockets.emit(
        `${req.query.db}${success.storeId}billCancel`,
        success
      );
      //storeId
      res.status(201).json(success);
    } else {
      const nextUrl = `/purchaseorder/created/?db=${req.query.db}`;
      res.redirect(nextUrl);
      req.io.sockets.emit(`${req.query.db}billCancel`, success);
      req.io.sockets.emit(
        `${req.query.db}${success.storeId}billCancel`,
        success
      );
    }

    //
  } catch (error) {
    console.log(error);
  }
});

router.delete("/", (req, res, next) => {
  req.tenant
    .updateOne(
      { localId: req.body.localId },
      { $set: { reimbursed: 2 } },
      { new: true },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({
            bill: success,
          });
        }
      }
    )
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

manageProd = (req, tab) => {
  tab.forEach((elt, index) => {
    if (elt["item"]["productType"] === "packItems") {
      // console.log("le pack", elt);
      // countPackItems(req, elt);
    } else if (elt["item"]["productType"] === "manufacturedItems") {
      setTimeout(() => {
        countManufacturedItems(req, elt);
      }, index * 100);
    } else if (elt["item"]["productType"] === "productItems") {
      setTimeout(() => {
        countProd(req, elt);
      }, index * 100);
    } else if (elt["item"]["productType"] === "billard") {
    }
  });
  req.io.sockets.emit(`${req.body.adminId}end`, tab);
};

countProd = async (req, elt) => {
  let a = await req.tenancy.getModelByTenant(
    req.dbUse,
    "productitems",
    productItemsSchema
  );
  const tenant = a;
  let prodId = elt["item"]["_id"];
  let Qty = elt["qty"];
  const outQty = elt["qty"];
  tenant
    .findById({ _id: elt["item"]["_id"] })
    .exec()
    .then(async (doc) => {
      let ristourneGen = doc.ristourneGenerate;

      let noRistouneQuantity = doc.stockNoRistourne;
      let comptRistourne; /* quantité sur laquel je dois compter les ristourne */
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
      let newpackitems = {};
      if (doc["tabitem"][doc["tabitem"].length - 1]) {
        let oldpack = doc["tabitem"][doc["tabitem"].length - 1];

        let oldQuantity = parseInt(oldpack.newstock);
        let newQuantity = doc.quantityStore - parseInt(elt["qty"]);
        let quantityItems = doc.quantityItems;
        let check = doc.quantityStore + quantityItems - parseInt(elt["qty"]);
        let newStock = oldQuantity - parseInt(elt["qty"]);
        let more = 0;
        if (check < 0) {
          newQuantity = 0;
          glace = 0;
          nonglace = 0;
          quantityItems = 0;
          newStock = 0;
          more = -(-check);
        }

        newpackitems = {
          oldstock: oldQuantity,
          //newstock est la somme des ajouts
          newstock: newStock,
          quantityOut: parseInt(elt["qty"]),
          motif: "vente",
          itemId: doc._id,
          more: more,
        };
      }

      Maeri.findById(doc.maeriId, (err, product) => {
        if (!err) {
          let ris_par_produit =
            parseInt(product["ristourne"]) / parseInt(product["packSize"]);
          ristourneGen = ristourneGen + ris_par_produit * comptRistourne;

          tenant.findOneAndUpdate(
            { _id: elt["item"]["_id"] },
            {
              $push: { tabitem: newpackitems },
              $set: {
                stockNoRistourne: noRistouneQuantity,
                ristourneGenerate: ristourneGen,
                ristourne: parseInt(product["ristourne"]),
                ristourneParProduit: ris_par_produit,
              },
            },
            { new: true },
            (error, success) => {
              if (error) {
                console.log("product items", error.message);
              } else {
                const Inventory = req.tenancy.getModelByTenant(
                  req.dbUse,
                  "inventory",
                  InventorySchema
                );

                Inventory.find({ cashOpening: req.body.openCashDateId })
                  .exec()
                  .then(async (result) => {
                    let arr = result[0]["listsStart"];

                    let index = arr.findIndex((elt) => {
                      return elt["_id"] == prodId;
                    });
                    if (index >= 0) {
                      let prod = arr[index];
                      if (prod["out"]) {
                        prod["out"] = prod["out"] + Qty;
                      } else {
                        prod["out"] = Qty;
                      }

                      arr.splice(index, 1, prod);

                      saveProd(arr, Inventory, index);
                      //return;
                    }
                    //return;
                  });
                /*  req.io.sockets.emit(
                  `${req.params.adminId}productItem`,
                  success
                ); */
              }
            }
          );
        } else {
        }
      });
      // }
    })
    .catch((err) => {
      console.log(err);
    });
};

countManufacturedItems = async (req, elt) => {
  let prodId = elt["item"]["_id"];
  let Qty = parseInt(elt["qty"]);
  const Inventory2 = req.tenancy.getModelByTenant(
    req.dbUse,
    "inventory",
    InventorySchema
  );
  Inventory2.find({ cashOpening: req.body.openCashDateId })
    .exec()
    .then(async (result) => {
      let arr = result[0]["listsStart"];

      let index = arr.findIndex((elt) => {
        return elt["_id"] == prodId;
      });
      if (index >= 0) {
        let prod = arr[index];
        //  console.log(prod);

        if (prod["out"]) {
          prod["out"] = prod["out"] + Qty;
        } else {
          prod["out"] = Qty;
        }

        arr.splice(index, 1, prod);

        saveProd(arr, Inventory2, index);
        //return;
      }
      //return;
    });
};

saveProd = (arr, Inventory, index) => {
  Inventory.findOneAndUpdate(
    { open: true },
    {
      $set: {
        listsStart: arr,
      },
    },
    { new: true },
    (error, res) => {
      if (error) {
        console.log("erreur ", error);
      } else {
      }
    }
  );
};

function onlyBydateSelect(req, res) {
  req.tenant
    .find({
      $or: [{ adminId: req.query.db }, { adminId: new ObjectId(req.query.db) }],
      created: {
        $gte: req.query.start,
        $lte: req.query.end,
      },
      // deleteAuth: true,
      storeId: req.query.storeId,
      cancel: false,
    })
    .then(function (docs) {
      console.log(docs);
      res.json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}

module.exports = router;
