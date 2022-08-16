const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//const Invoice = require("../models/invoice");
const test = require("../../middleware/multytenant");
const countItems = require("../../middleware/productItemsCount");
const resourceManager = require("../../middleware/manageResource");
const BalanceHandle = require("../../utils/manageBalance");
const cancelerManager = require("../../middleware/cancerlerManager");
const cancelerManager2 = require("../../middleware/cancerlerManager2");
const updateCancelerManager = require("../../middleware/updateAndCancel");
const createadCustomer = require("../../utils/createdCustomer");
const consigneSchema = require("../models/Consignes");
const checkIfCount = require("../../utils/checkIfCount");
//const Invoice = require("../models/invoice");
let ObjectId = require("mongoose").Types.ObjectId;
router.get("/", (req, res, next) => {
  req.tenant
    .aggregate([
      {
        $match: {
          $or: [
            { adminId: req.query.db },
            { adminId: new ObjectId(req.query.db) },
          ],
          sale: true,
          invoiceCancel: false,
        },
      },
      { $sort: { created: -1 } },
      { $limit: 20 },
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
      {
        $sort: { quantity: -1 },
      },
      {
        $limit: 30,
      },
    ])
    //.lean()
    //.exec()
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
});

router.get("/admin/:adminId", (req, res, next) => {
  // req.tenant
  if (req.query.onlyByDate) {
    onlyBydateSelect(req, res);
  } else if (req.query.all) {
    selectAll(req, res);
  } else {
    req.tenant
      .aggregate([
        {
          $match: {
            openCashDateId: req.query.openCashDateId,
            sale: true,
            invoiceCancel: false,
          },
        },

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

router.get("/admin/paieinvoice/:adminId/sale/false", (req, res, next) => {
  // Invoice
  // req

  // tenant1.model("Invoice");
  if (req.query.check && req.query.openCashDateId && !req.query.fc) {
    req.tenant
      // .paginate({ adminId: req.params.adminId, sale: false }, { limit: 10 })
      .find({
        sale: req.query.sale,
        openCashDateId: req.query.openCashDateId,
      })
      .then(function (docs) {
        res.json({
          docs,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
    return;
  } else if (req.query.cancel && req.query.openCashDateId) {
    req.tenant
      // .paginate({ adminId: req.params.adminId, sale: false }, { limit: 10 })
      .find({
        /* $or: [
        { adminId: req.params.adminId },
        { adminId: new ObjectId(req.params.adminId) },
      ],*/
        invoiceCancel: true,
        openCashDateId: req.query.openCashDateId,
      })
      .then(function (docs) {
        res.json({
          docs,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
    return;
  } else if (req.query.localServer && req.query.openCashDateId) {
    req.tenant
      .find({
        openCashDateId: req.query.openCashDateId,
      })
      .then((docs) => {
        res.json(docs);
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
  } else if (req.query.openCashDateId && !req.query.fc) {
    if (req.query.numPage) {
      let num = parseInt(req.query.numPage);
      req.tenant
        .paginate(
          {
            $or: [
              { adminId: req.params.adminId },
              { adminId: new ObjectId(req.params.adminId) },
            ],
            openCashDateId: req.query.openCashDateId,
          },
          { limit: 20, page: num }
        )
        .then(function (docs) {
          res.json({
            docs,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
      return;
    }

    req.tenant
      .aggregate([
        // { $unwind: "$products" },

        {
          $match: {
            openCashDateId: req.query.openCashDateId,
            sale: false,
            invoiceCancel: false,
          },
        },
        {
          $addFields: {
            totalHomework: { $sum: "$numFacture" },
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
              numFacture: "$numFacture",
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
            entry: {
              $push: {
                item: "$numFacture",
                //qty: "$commandes.products.qty",
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
      .then((docs) => {
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
  } else {
    if (req.query.sa == true || req.query.sa == "true") {
      req.tenant
        .find({
          caisseConfirm: true,
          sale: true,
          storeId: req.query.storeId,
          invoiceCancel: false,
          // swConfirm: false,
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
        })
        // .populate("adminId")
        .exec()
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
      return;
    }
    if (req.query.sw == true || req.query.sw == "true") {
      req.tenant
        .find({
          swConfirm: false,
          sale: true,
          storeId: req.query.storeId,
          invoiceCancel: false,
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
        })
        // .populate("adminId")
        .exec()
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
      return;
    }
    if (req.query.fc == true || req.query.fc == "true") {
      //facturation service
      req.tenant
        .find({
          sale: false,
          storeId: req.query.storeId,
          invoiceCancel: false,
          valide: false,
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
        })
        // .populate("adminId")
        .exec()
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
      return;
    }
    if (req.query.ch == true || req.query.ch == "true") {
      req.tenant
        .find({
          sale: false,
          caisseConfirm: false,
          storeId: req.query.storeId,
          invoiceCancel: false,
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
        })
        // .populate("adminId")
        .exec()
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
      return;
    }
    if (!req.query.ch && !req.query.fc && !req.query.sw) {
      req.tenant
        .find({
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
          sale: false,
        })
        // .populate("adminId")
        .exec()
        .then(function (docs) {
          res.json({
            docs,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
      return;
    }
  }
});

router.get(
  "/admin/paieinvoice/:adminId/sale/true/nonpaye",
  (req, res, next) => {
    // Invoice
    // req
    req.tenant
      .find({ reste: { $lt: 0 } })
      .then(function (docs) {
        res.json({
          docs: docs,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
  }
);

router.get(
  "/admin/findByUser/:senderId/:adminId/:numpPage/invoice/get/all",

  (req, res, next) => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();

    if (req.query.customerId) {
      req.tenant
        .find({
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
          customerId: req.query.customerId,
        })
        .sort({ created: -1 })
        .then(function (docs) {
          res.json({
            docs,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } else if (parseInt(req.params.numpPage)) {
      req.tenant
        .paginate(
          {
            $or: [
              { adminId: req.params.adminId },
              { adminId: new ObjectId(req.params.adminId) },
            ],
            senderId: req.params.senderId,
            openCashDateId: req.query.openCashDateId,
            invoiceCancel: false,
          },
          { limit: 20, page: req.params.numpPage }
        )
        .then(function (docs) {
          res.json({
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
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
          senderId: req.params.senderId,
          openCashDateId: req.query.openCashDateId,
          invoiceCancel: false,
        })
        .then((docs) => {
          res.json(docs);
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  }
);

router.get("/admin/paieinvoice/:adminId", (req, res, next) => {
  // Invoice
  // req
  if (req.query.customerId) {
    req.tenant
      .find({
        $or: [
          { adminId: req.params.adminId },
          { adminId: new ObjectId(req.params.adminId) },
        ],
        customerId: req.query.customerId,
      })
      .then(function (docs) {
        res.json({
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
      .paginate(
        {
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
          sale: true,
        },
        { limit: 10 }
      )
      .then(function (docs) {
        res.json({
          docs,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
  }
});

router.get(
  "/admin/paieinvoice/:adminId/:numpPage",

  (req, res, next) => {
    // Invoice
    // req
    req.tenant
      .model("Invoice")
      .paginate(
        {
          $or: [
            { adminId: req.params.adminId },
            { adminId: new ObjectId(req.params.adminId) },
          ],
          sale: true,
        },
        { limit: 10, page: req.params.numpPage }
      )
      .then(function (docs) {
        res.json({
          docs,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
        });
      });
  }
);

router.post(
  "/commande/items/:userName/:adminId",
  createadCustomer,
  (req, res, next) => {
    let ristourneProd = [];
    let trancheList = [];
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let confirm = false;
    let Posconfirm = false;
    let tab = req.body.cart.products;
    let obj = req.body.cart;
    let created = Date.now();
    let validUntil = `${year}-${month}-${day}`;
    let table = [];
    let resourceList = [];
    let localId = "";
    let delivery = false;
    let confirmPaie = false;
    let employeId = null; //id de l'employé a qui on applique une reduction
    let billId = null;
    let valide = false;
    let phoneNumber = 0;
    if (req.body.phoneNumber) {
      phoneNumber = req.body.phoneNumber;
    }

    if (req.body.valide) {
      valide = true;
    }

    let montantReduction = 0;
    if (req.body.cart.billId) {
      billId = req.body.cart.billId;
    }
    if (req.body.cart.employe) {
      employeId = req.body.cart.employe._id;
    }
    if (req.body.commande.montantReduction) {
      montantReduction = req.body.commande.montantReduction;
    }

    req.body.cart.products.forEach((elt) => {
      if (elt.item.stockNoRistourne > 0) {
        ristourneProd.push(elt);
      }
    });
    table.push(obj);
    if (req.body.cart.trancheList) {
      trancheList = req.body.cart.trancheList;
    }
    if (req.body.confirm) {
      confirm = true;
    }
    if (req.body.localId) {
      localId = req.body.localId;
    }

    if (req.body.Posconfirm) {
      Posconfirm = true;
    }
    if (req.body.created) {
      created = req.body.created;
    }
    if (req.body.validUntil) {
      validUntil = req.body.validUntil;
    }
    if (req.body.resourceList) {
      resourceList = req.body.resourceList;
    }
    let caisseConfirm = false;
    let emballage = 0;
    let transport = 0;
    let taxeRetrait = 0;
    let phytosanitaire = 0;
    let poids_estimatif = 0;
    let transport_colis = 0;
    if (req.body.delivery) {
      delivery = req.body.delivery;
    }
    if (req.body.confirmPaie) {
      confirmPaie = req.body.confirmPaie;
    }
    let deliveryDate = Date.now();
    if (req.body.deliveryDate) {
      deliveryDate = req.body.deliveryDate;
    }

    let scConfirm = false;
    if (req.body.caisseConfirm) {
      caisseConfirm = req.body.caisseConfirm;
    }
    if (req.body.scConfirm) {
      scConfirm = req.body.scConfirm;
      caisseConfirm = false;
      emballage = req.body.emballage;
      phytosanitaire = req.body.phytosanitaire;
      transport = req.body.transport;
      taxeRetrait = req.body.taxeRetrait;
      poids_estimatif = req.body.poids_estimatif;
      transport_colis = req.body.transport_colis;
    }
    let removeProductList = [];
    let addProductList = [];
    if (req.body.removeProductList) {
      removeProductList = req.body.removeProductList;
    }
    if (req.body.addProductList) {
      addProductList = req.body.addProductList;
    }
    req.tenant
      .find({
        /* $or: [
          { openCashDateId: req.body.openCashDateId },
          { adminId: new ObjectId(req.params.adminId) },
        ],*/
        // openCashDateId: req.body.openCashDateId,
        localId: req.body.localId,
      })
      .lean()
      .exec()
      .then(async (result) => {
        if (result.length) {
          // res.send(JSON.stringify({ localId: "existe" }));
          res.send(
            JSON.stringify({
              message: "cette facture proforma existe deja",
              save: false,
              success: result[0],
              doublons: true,
            })
          );
        } else {
          req.tenant
            .find({
              /*  $or: [
                { openCashDateId: req.body.openCashDateId },
                { adminId: new ObjectId(req.params.adminId) },
              ],*/
              storeId: req.body.cart.storeId,
              openCashDateId: req.body.openCashDateId,
            })
            .lean()
            .exec()
            .then((docs) => {
              if (req.body.numFacture) {
                numFacture = req.body.numFacture;
              } else {
                numFacture = docs.length + 1;
              }
              if (req.body.role) {
                numFacture = docs.length + 1;
                req.body.numFacture = docs.length + 1;
              }
              req.tenant
                .create({
                  adminId: req.body.adminId,
                  commande: obj,
                  ristourneProd: ristourneProd,
                  commandes: table,
                  products: req.body.cart.products,
                  tableNumber: req.body.tableNumber,
                  openCashDate: req.body.openCashDate,
                  userName: req.params.userName,
                  confirm: confirm,
                  Posconfirm: Posconfirm,
                  validUntil: validUntil,
                  created: created,
                  openCashDateId: req.body.openCashDateId,
                  numFacture: numFacture,
                  localId: req.body.localId,
                  senderId: req.body.senderId,
                  resourceList: req.body.resourceList,
                  storeId: req.body.cart.storeId,
                  customerId: req.customerId,
                  trancheList: trancheList,
                  confirmPaie: confirmPaie,
                  delivery: delivery,
                  billId: billId,
                  montantReduction: montantReduction,
                  employeId: employeId,
                  scConfirm: scConfirm,
                  caisseConfirm: caisseConfirm,
                  useCustomerSolde: req.body.useCustomerSolde,
                  phoneNumber: phoneNumber,
                  deliveryDate: deliveryDate,
                  emballage: emballage,
                  phytosanitaire: phytosanitaire,
                  transport: transport,
                  taxeRetrait: taxeRetrait,
                  poids_estimatif: poids_estimatif,
                  transport_colis: transport_colis,
                  removeProductList: removeProductList,
                  addProductList: addProductList,
                  valide: valide,
                })
                .then(async (resu) => {
                  if (req.body.cart.consigne) {
                    const Consigne = req.tenancy.getModelByTenant(
                      req.dbUse,
                      "consigne",
                      consigneSchema
                    );
                    let con = await Consigne.create({
                      adminId: req.params.adminId,
                      storeId: req.body.storeId,
                      invoiceId: resu._id,
                      commandes: obj,
                      articles: req.body.cart.consigne,
                      customerId: req.customerId,
                    });
                  }
                  if (req.body.useCustomerSolde) {
                    let custo = await BalanceHandle(req, res);
                  }
                  if (req.body && req.body.resourceList) {
                    resourceManager(req, req.body.resourceList);
                  }

                  if (tab.length) {
                    let flag = await checkIfCount(req.params.adminId, req);
                    if (!flag && !req.body.scConfirm) {
                      // if (!flag) {
                      console.log("ligne 63 ici");
                      countItems(req, tab);
                    }
                  }
                  if (req.body.check) {
                    createInvoiceAndBill(req, res);
                  } else {
                    req.io.sockets.emit(`${req.body.adminId}newOrder`, resu);
                    req.io.sockets.emit(
                      `${resu.adminId}${resu.storeId}newOrder`,
                      resu
                    );

                    res.status(200).json({ save: true, facture: resu });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);

        res.status(500).json({
          error: err,
        });
      });
  }
);

router.post("/commande/items/:userName/:adminId/custumer", (req, res, next) => {
  let ristourneProd = [];
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let confirm = false;
  let Posconfirm = false;
  let tab = req.body.cart.products;
  let obj = req.body.cart;
  let created = Date.now();
  let validUntil = `${year}-${month}-${day}`;
  let table = [];
  let resourceList = [];
  let localId = "";

  // console.log(JSON.stringify(req.body));
  // console.log(JSON.stringify(req.body.cart));
  //return;
  req.body.cart.products.forEach((elt) => {
    console.log(elt);
    if (elt.item.stockNoRistourne > 0) {
      ristourneProd.push(elt);
    }
  });
  table.push(obj);
  if (req.body.confirm) {
    confirm = true;
  }
  if (req.body.localId) {
    localId = req.body.localId;
  }

  if (req.body.Posconfirm) {
    Posconfirm = true;
  }
  if (req.body.created) {
    created = req.body.created;
  }
  if (req.body.validUntil) {
    validUntil = req.body.validUntil;
  }
  if (req.body.resourceList) {
    resourceList = req.body.resourceList;
  }
  req.tenant
    .find({
      /* $or: [
        { openCashDateId: req.query.openCashDateId },
        { adminId: new ObjectId(req.query.db) },
      ],*/
      localId: req.body.localId,
      openCashDateId: req.body.openCashDateId,
    })
    .lean()
    .exec()
    .then((result) => {
      if (result.length) {
        res.send(JSON.stringify({ localId: "existe" }));
      } else {
        req.tenant
          .find({
            $or: [
              { adminId: req.params.adminId },
              { adminId: new ObjectId(req.params.adminId) },
            ],
            openCashDateId: req.body.openCashDateId,
          })
          .lean()
          .exec()
          .then((docs) => {
            if (req.body.numFacture) {
              numFacture = req.body.numFacture;
            } else {
              numFacture = docs.length + 1;
            }
            req.tenant
              .create({
                adminId: req.body.adminId,
                commande: obj,
                ristourneProd: ristourneProd,
                commandes: table,
                products: req.body.cart.products,
                tableNumber: req.body.tableNumber,
                openCashDate: req.body.openCashDate,
                openCashDateId: req.body.openCashDateId,
                storeId: req.body.storeId,
                userName: "client",
                confirm: confirm,
                Posconfirm: Posconfirm,
                validUntil: validUntil,
                created: created,
                numFacture: 111111,
                localId: localId,
                senderId: "222222",
                resourceList: req.body.resourceList,
                storeId: req.commande.storeId,
              })
              .then((resu) => {
                if (req.body && req.body.resourceList) {
                  // resourceManager(req, req.body.resourceList);
                }

                if (tab.length) {
                  countItems(req, tab);
                }
                req.io.sockets.emit(`${req.params.adminId}newOrder`, resu);
                req.io.sockets.emit(
                  `${req.params.adminId}${req.body.commande.storeId}newOrder`,
                  resu
                );
                res.send(JSON.stringify({ localId: localId }));
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/", async (req, res, next) => {
  let custumerName = "";
  let custumerPhone = "";
  let swConfirm = false;

  if (req.query.notComplete) {
    req.tenant.findOneAndUpdate(
      { localId: req.body.localId },
      {
        $set: {
          sale: false,
          partially: req.body.partially,
          trancheList: req.body.trancheList,
          swConfirm: swConfirm,
        },
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log(success);
          req.io.sockets.emit(`${req.body.adminId}newInvoiceChange`, success);
          req.io.sockets.emit(
            `${req.body.adminId}${req.body.storeId}newInvoiceChange`,
            success
          );
          res.status(201).json({
            message: "update ",
            resultat: success,
          });
        }
      }
    );
  } else if (req.query.deleteAuth) {
    req.tenant.findOneAndUpdate(
      { _id: req.body.invoicesId },
      {
        $set: {
          deleteAuth: true,
        },
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          const nextUrl = `/bill/cancel/bill?db=${
            req.body.adminId
          }&deleteAuth=${true}`;
          res.redirect(nextUrl);
        }
      }
    );
  } else {
    if (req.body.custumerName) {
      custumerName = req.body.custumerName;
    }
    if (req.body.custumerPhone) {
      custumerPhone = req.body.custumerPhone;
    }
    let caisseConfirm = false;
    let emballage = 0;
    let transport = 0;
    let taxeRetrait = 0;
    let phytosanitaire = 0;

    if (req.body.caisseConfirm) {
      caisseConfirm = true;
      emballage = req.body.emballage;
      phytosanitaire = req.body.phytosanitaire;
      transport = req.body.transport;
      taxeRetrait = req.body.taxeRetrait;
    }
    let saConfirm = false;
    if (req.body.saConfirm) {
      saConfirm = true;
    }
    if (req.body.swConfirm) {
      swConfirm = true;
    }

    if (req.body.saConfirm && req.body.caisseConfirm && !req.body.swConfirm) {
      swConfirm = true;
      req.tenant.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            saConfirm: req.body.saConfirm,
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log(error);
            res.status(500).json(error);
          } else {
            req.io.sockets.emit(`${req.body.adminId}saConfirm`, success);
            res.status(200).json(success);
          }
        }
      );
      return;
    }

    if (req.body.swConfirm && req.body.saConfirm && req.body.caisseConfirm) {
      swConfirm = true;
      req.tenant.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            swConfirm: swConfirm,
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log(error);
            res.status(500).json(error);
          } else {
            console.log(success);
            countItems(req, success.products);
            req.io.sockets.emit(`${req.body.adminId}swConfirm`, success);
            res.status(200).json(success);
          }
        }
      );
      return;
    }

    let phoneNumber = 0;
    if (req.body.phoneNumber) {
      phoneNumber = req.body.phoneNumber;
    }
    req.tenant.findOneAndUpdate(
      { localId: req.body.localId },
      {
        $set: {
          sale: true,
          confirm: true,
          avance: req.body.avance,
          reste: req.body.reste,
          onAccount: req.body.onAccount,
          partially: req.body.partially,
          cash: req.body.cash,
          custumerName: custumerName,
          custumerPhone: custumerPhone,
          trancheList: req.body.trancheList,
          paiment_type: req.body.paiment_type,
          swConfirm: swConfirm,
          saConfirm: saConfirm,
          caisseConfirm: caisseConfirm,
          phoneNumber: phoneNumber,
        },
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          console.log(success);

          const nextUrl = `/bill/createBill?db=${req.body.adminId}`;
          res.redirect(nextUrl);
          // req.io.sockets.emit(`${req.body.adminId}buyOrder`, success);
          if (req.body.caisseConfirm) {
            req.io.sockets.emit(`${req.body.adminId}caisseConfirm`, success);
          }
          req.io.sockets.emit(
            `${req.body.adminId}${req.body.storeId}buyOrder`,
            success
          );
        }
      }
    );
  }
});

router.patch("/confirmOders", (req, res, next) => {
  let confirm = false;
  if (req.body.order.sender) {
    confirm = true;
  }

  if (req.body.localId) {
    req.tenant.findOneAndUpdate(
      { localId: req.body.localId },
      {
        $set: { Posconfirm: true },
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          req.io.sockets.emit(`${req.body.adminId}confirmOrder`, success);
          req.io.sockets.emit(
            `${req.body.adminId}${success.storeId}confirmOrder`,
            success
          );
          res.status(201).json({
            message: "update ",
            resultat: success,
            // professeur: prof
          });
        }
      }
    );
  } else {
    req.tenant.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: { Posconfirm: true },
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
          console.log(" here error");
        } else {
          req.io.sockets.emit(`${req.body.adminId}confirmOrder`, success);
          res.status(201).json({
            message: "update ",
            resultat: success,
            // professeur: prof
          });
        }
      }
    );
  }
});

router.patch("/confirmOders/service", (req, res, next) => {
  req.tenant.findOneAndUpdate(
    { localId: req.body.localId },
    {
      $set: { confirm: true },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(`${req.body.adminId}serviceConfirmOrder`, success);
        res.status(201).json({
          message: "update ",
          resultat: success,
          // professeur: prof
        });
      }
    }
  );
});

router.patch("/confirmOders/invoice/cancel", async (req, res, next) => {
  let sale = false;
  let returnProduct = false;
  if (req.body.bill) {
    sale = true;
  }

  let query = {};
  if (req.body.toRemove && req.body.toRemove.length) {
    query = { localId: req.body.localId };
  } else {
    query = { localId: req.body.localId };
  }
  if (req.body.toRemove && req.body.toRemove.length) {
    returnProduct = true;
  }
  try {
    let success = await req.tenant.findOneAndUpdate(
      query,
      {
        $set: {
          invoiceCancel: true,
          returnProduct: returnProduct,
          //  custumerPhone: req.body.custumerPhone,
          // motif: req.body.motif,
        },
      },
      { new: true }
    );
    if (req.body.sc) {
    } else {
      cancelerManager(req.tenant, req, res, success);
    }

    if (sale) {
      const billUrl = `/bill/cancel/bill/?db=${req.query.db}`;
      res.redirect(billUrl);
    }
    req.io.sockets.emit(`${req.body.adminId}invoiceCancel`, success);
    req.io.sockets.emit(
      `${success.adminId}${success.storeId}invoiceCancel`,
      success
    );
    if (sale) {
    } else {
      /* res.status(201).json({
        message: "update ",
        resultat: success,
      });*/
    }
  } catch (error) {
    console.log(error);
  }
});

router.patch("/add/newinvoice/to/old", (req, res, next) => {
  let tab = req.body.cart.products;

  req.tenant.find({ localId: req.body.localId }).then(function (docs) {
    let id = docs[0]["_id"];

    cancelerManager2(req, docs[0]["products"], res).then((data) => {
      req.tenant.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            commandes: req.body.commandes,
            // products: req.body.commande.products,
          },
        },
        { new: true },
        (error, success) => {
          console.log(success);

          if (error) {
            console.log(error);
          } else {
            if (req.body && req.body.resourceList) {
              resourceManager(req, req.body.resourceList);
            }

            if (tab.length) {
              countItems(req, tab);
            }

            req.io.sockets.emit(`${req.body.adminId}invoiceadd`, success);
            res.status(201).json({
              message: "update ",
              resultat: success,
            });
          }
        }
      );
    });
  });
});

router.patch(
  "/confirmOders/invoice/cancel/and/update/changes/values",
  (req, res, next) => {
    // console.log(req.body);

    req.tenant
      .find({ localId: req.body.localId, adminId: req.body.adminId })
      .then(function (docs) {
        let id = docs[0]["_id"];
        req.tenant.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              commandes: req.body.newCommande,
              // products: req.body.commande.products,
            },
          },
          { new: true },
          (error, success) => {
            console.log(success);

            if (error) {
              console.log(error);
            } else {
              updateCancelerManager(req.tenant, req, res, req.body.oldCommande);
              // req.io.sockets.emit(`${req.body.adminId}invoiceadd`, success);
              res.status(201).json({
                message: "update ",
                resultat: success,
              });
            }
          }
        );
      });
  }
);
router.delete("/", (req, res, next) => {
  console.log("suppression ivoice sstart=====");
  req.tenant
    .findOneAndDelete({ _id: req.body._id }, function (error, success) {
      if (error) {
        console.log(error);
      } else {
        res.status(201).json({
          message: "le document a été supprimé",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  req.tenant
    .remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      console.log("result");

      res.status(200).json({
        message: "order Deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

function onlyBydateSelect(req, res) {
  if (req.query.openCashDateId) {
    console.log(new Date(req.query.onlyByDate));

    req.tenant
      .aggregate([
        // { $unwind: "$products" },
        {
          $match: {
            openCashDateId: req.query.openCashDateId,
            sale: true,
            invoiceCancel: false,
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
        { $sort: { name: 1 } },
        {
          $group: {
            _id: {
              name: "$commandes.products.item.name",
              type: "$commandes.products.item.productType",
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
        res.status(200).json({
          docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else if (req.query.bonus) {
    req.tenant
      .find({
        $or: [
          { adminId: req.query.db },
          { adminId: new ObjectId(req.query.db) },
        ],
        created: {
          $gte: req.query.start,
          $lte: req.query.end,
        },
        sale: true,
      })
      .then(function (docs) {
        res.json({
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
      .aggregate([
        // { $unwind: "$products" },
        {
          $match: {
            openCashDate: new Date(req.query.onlyByDate),
          },
        },

        {
          $unwind: "$products",
        },
        { $sort: { name: 1 } },
        {
          $group: {
            _id: "$products.item.name",
            averageQuantity: { $avg: "$products.qty" },
            count: { $sum: 1 },
            totalSalesAmount: {
              $sum: "$products.price",
            },
            quantity: {
              $sum: "$products.qty",
            },

            glace: {
              $sum: "$products.item.modeG",
            },
            nonglace: {
              $sum: "$products.item.modeNG",
            },
            ristourneGenerate: {
              $sum: "$products.item.ristourneGenerate",
            },
            beneficeTotal: {
              $sum: "$products.item.beneficeTotal",
            },
            entry: {
              $push: {
                item: "$products.item",
                qty: "$products.qty",
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
}

function selectAll(req, res) {
  console.log("heheheheheheh");
  console.log(req.query);
  req.tenant
    .find({
      // $or: [{ adminId: req.query.db }, { adminId: new ObjectId(req.query.db) }],
      customerId: req.query.customerId,
      sale: true,
    })
    // .lean()
    .exec()
    .then(function (docs) {
      res.json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}
function createInvoiceAndBill(req, res) {
  console.log("je cree la facture");
  let custumerName = null;
  let custumerPhone = null;
  let SM = false;
  if (req.body.custumer && req.body.custumer.name) {
    custumerName = req.body.custumer.name;
  }
  if (req.body.custumer && req.body.custumer.phone) {
    custumerPhone = req.body.custumer.phone;
  }
  if (req.body.custumer && req.body.custumer.customerType == "SM") {
    SM = true;
  }
  let deliveryDate = Date.now();
  if (req.body.deliveryDate) {
    deliveryDate = req.body.deliveryDate;
  }
  req.tenant.findOneAndUpdate(
    { localId: req.body.localId },
    {
      $set: {
        sale: req.body.sale,
        confirm: true,
        avance: req.body.avance,
        reste: req.body.reste,
        onAccount: req.body.onAccount,
        partially: req.body.partially,
        cash: req.body.cash,
        custumerName: custumerName,
        custumerPhone: custumerPhone,
        trancheList: req.body.trancheList,
        paiment_type: req.body.paiment_type,
        deliveryDate: deliveryDate,
        SM: SM,
      },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        const nextUrl = `/bill/createBill/?db=${req.body.adminId}&numFacture=${success.numFacture}`;
        res.redirect(307, nextUrl);
        // req.io.sockets.emit(`${req.body.adminId}newOrder`, success);
        req.io.sockets.emit(
          `${success.adminId}${success.storeId}newOrder`,
          success
        );
        if (success.caisseConfirm) {
          req.io.sockets.emit(
            `${req.body.adminId}${success.storeId}buyOrder`,
            success
          );
        }
        if (success.SM) {
          req.io.sockets.emit(
            `${req.body.adminId}${success.storeId}SM`,
            success
          );
        }
        /* req.io.sockets.emit(`${req.body.adminId}buyOrder`, success);
        req.io.sockets.emit(
          `${req.body.adminId}${req.body.storeId}buyOrder`,
          success
        );*/
      }
    }
  );
}

module.exports = router;
