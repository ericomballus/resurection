const express = require("express");
const router = express.Router();
const countItems = require("../../middleware/productItemsCount");
const resourceManager = require("../../middleware/manageResource");
const createadCustomer = require("../../utils/createdCustomer");
const PurchaseOrderSchema = require("../models/Purchase_Order");
const tenant = require("../../getTenant");
let db = "maeri";
let ObjectId = require("mongoose").Types.ObjectId;
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

router.get("/:id", async (req, res, next) => {
  try {
    const invoice = await req.tenant
      .find({
        billId: req.params.id,
      })
      .lean()
      .exec();
    res.status(200).json(invoice[0]);
  } catch (e) {
    console.error(e);
  } finally {
    // console.log("We do cleanup here");
  }
});
router.post("/:userName/:adminId", createadCustomer, (req, res, next) => {
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

  let billId = null;
  if (req.body.cart.billId) {
    billId = req.body.cart.billId;
  }

  req.body.cart.products.forEach((elt) => {
    if (elt.item && elt.item.stockNoRistourne > 0) {
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
  if (req.body.delivery) {
    delivery = req.body.delivery;
  }
  if (req.body.confirmPaie) {
    confirmPaie = req.body.confirmPaie;
  }
  req.tenant
    .find({
      $or: [
        { openCashDateId: req.body.openCashDateId },
        { adminId: new ObjectId(req.params.adminId) },
      ],
      openCashDateId: req.body.openCashDateId,
      localId: req.body.localId,
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
              { openCashDateId: req.body.openCashDateId },
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
                userName: req.params.userName,
                confirm: confirm,
                Posconfirm: Posconfirm,
                validUntil: validUntil,
                created: created,
                openCashDateId: req.body.openCashDateId,
                numFacture: numFacture,
                localId: localId,
                senderId: req.body.senderId,
                resourceList: req.body.resourceList,
                storeId: req.body.cart.storeId,
                customerId: req.body.customerId,
                trancheList: trancheList,
                confirmPaie: confirmPaie,
                delivery: delivery,
                billId: billId,
              })
              .then(async (resu) => {
                if (req.body && req.body.resourceList) {
                  //resourceManager(req, req.body.resourceList);
                }

                if (tab.length) {
                  countItems(req, tab);
                }
                let a = await tenant.getModelByTenant(
                  db,
                  "purchaseOrders",
                  PurchaseOrderSchema
                );
                const purchaseOrder = a;

                purchaseOrder.findOneAndUpdate(
                  { billId: req.body.cart.billId },
                  {
                    // $push: { tabitem: newpackitems },
                    $set: {
                      managerSend: false,
                      posConfirm: true,
                      repaymentWithOtherProducts:
                        req.body.repaymentWithOtherProducts,
                    },
                  },
                  { new: true },
                  (error, success) => {
                    if (error) {
                      console.log("update purchase order", error.message);
                    } else {
                      let storeId = req.body.cart.storeId;
                      req.io.sockets.emit(
                        `${req.body.adminId}purchaseOrderChange`,
                        success
                      );
                      req.io.sockets.emit(
                        `${req.body.adminId}${storeId}purchaseOrder`,
                        success
                      );
                      req.io.sockets.emit(
                        `${req.body.adminId}newChildBill`,
                        resu
                      );
                      req.io.sockets.emit(
                        `${req.params.adminId}${req.body.cart.storeId}newChildBill`,
                        resu
                      );
                      res.status(200).json(resu);
                    }
                  }
                );
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
router.patch("/", (req, res, next) => {
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
});
// create bill with redirect route

function onlyBydateSelect(req, res) {
  console.log("hello hello");
  req.tenant
    .find({
      $or: [{ adminId: req.query.db }, { adminId: new ObjectId(req.query.db) }],
      created: {
        $gte: req.query.start,
        $lte: req.query.end,
      },
      // deleteAuth: true,
      storeId: req.query.storeId,
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
