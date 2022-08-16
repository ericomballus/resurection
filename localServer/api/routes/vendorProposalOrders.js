const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const proposalOrder = require("../models/VendorProposalOrder");
const productItemsSchema = require("../models/ProductItem");
//const countItems = require("../../middleware/productItemsCount");
const tenant = require("../../getTenant");
const Maeri = require("../models/Maeri_Product");
const db = "maeri";

router.get("/:vendorId", async (req, res, next) => {
  let id = req.requestId;

  try {
    let order = await proposalOrder
      .find({ vendorId: req.params.vendorId, vendorConfirm: false })
      .populate("retailerId")
      .sort({ _id: -1 })
      .limit(5)
      .exec();
    res.status(200).json(order);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/:vendorId/notconfirm", async (req, res, next) => {
  if (req.query.retailerId) {
    try {
      let order = await proposalOrder
        .find({ retailerId: req.query.retailerId, display: true })
        .populate("vendorId")
        .sort({ _id: -1 })
        .limit(20)
        .exec();
      res.status(200).json(order);
    } catch (e) {
      console.error(e);
    } finally {
      console.log("We do cleanup here");
    }
  } else {
    try {
      let order = await proposalOrder
        .find({ vendorId: req.params.vendorId, retailerConfirm: false })
        .populate("retailerId")
        .sort({ _id: -1 })
        .limit(20)
        .exec();
      res.status(200).json(order);
    } catch (e) {
      console.error(e);
    } finally {
      console.log("We do cleanup here");
    }
  }
});
router.post("/", async (req, res, next) => {
  let obj = req.body;
  obj["_id"] = new mongoose.Types.ObjectId();
  const order = new proposalOrder(obj);
  try {
    let result = await order.save();

    /* let orders = await proposalOrder
      .find({ vendorId: req.body.vendorId, vendorConfirm: false })
      .populate("retailerId")
      .sort({ _id: -1 })
      .limit(5)
      .exec();*/
    req.io.sockets.emit(`${req.body.vendorId}newproposalOrder`, result);
    req.io.sockets.emit(`${req.body.retailerId}newproposalOrder`, result);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});
router.put("/", async (req, res, next) => {
  //let id = req.body._id;
  let company;
  if (typeof req.body.retailerId === "string") {
    company = req.body.vendorId.company;
  } else {
    company = req.body.retailerId.company;
  }

  const filter = { _id: req.body._id };
  const update = req.body;
  try {
    let result = await proposalOrder.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );
    if (typeof req.body.retailerId == "string") {
      console.log("====hello===");
      let vendorId = req.body.vendorId._id;
      req.io.sockets.emit(
        `${req.body.retailerId}RetailerConfirmOrderProposal`,
        result
      );
      req.io.sockets.emit(`${vendorId}RetailerConfirmOrderProposal`, result);
    } else {
      let retailerId = req.body.retailerId._id;
      req.io.sockets.emit(
        `${req.body.vendorId}RetailerConfirmOrderProposal`,
        result
      );
      req.io.sockets.emit(`${retailerId}RetailerConfirmOrderProposal`, result);
    }

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
  /* .then((doc) => {
      req.io.sockets.emit(`${req.body.vendorId}RetailerConfirmOrder`, docs);
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    }); */
});

router.put("/adminId", async (req, res, next) => {
  //let id = req.body._id;
  let vendorId;
  let retailerId;
  let company;
  if (typeof req.body.retailerId === "string") {
    company = req.body.vendorId.company;
    retailerId = req.body.retailerId;
    vendorId = req.body.vendorId._id;
  } else {
    company = req.body.retailerId.company;
    retailerId = req.body.retailerId._id;
    vendorId = req.body.vendorId;
    let tab = [];
    tab = req.body.commandes;
    tab.forEach((elt) => {
      elt.qty = parseInt(elt.item.sizePack) * elt.qty;
      countProductItemes2(req, elt);
    });
  }

  const filter = { _id: req.body._id };
  const update = req.body;

  try {
    let result = await proposalOrder.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );

    req.io.sockets.emit(`${vendorId}RetailerConfirmOrder`, result);
    req.io.sockets.emit(`${retailerId}RetailerConfirmOrder`, result);

    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  }
});

countProductItemes2 = async (req, elt) => {
  let a = await req.tenancy.getModelByTenant(
    req.dbUse,
    "productitems",
    productItemsSchema
  );
  const tenant = a;
  tenant
    .find({ maeriId: elt["item"]["maeriId"], adminId: req.body.vendorId })
    .exec()
    .then(async (result) => {
      let doc = result[0];

      Maeri.findById(doc.maeriId, (err, product) => {
        if (!err) {
          let ris_par_produit =
            parseInt(product["ristourne"]) / parseInt(product["packSize"]);
          let benefice = doc["sellingPrice"] - doc["purchasingPrice"];
          let beneficeTotal = benefice * elt["qty"] + doc.beneficeTotal;
          if (doc.quantityStore <= 0) {
            doc.productAlert = false;
          }
          let newQuantity = doc.quantityStore - parseInt(elt["qty"]);

          tenant.findOneAndUpdate(
            { _id: doc._id },
            {
              // $push: { tabitem: newpackitems },
              $set: {
                quantityStore: newQuantity,
                beneficeTotal: beneficeTotal,
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
        }
      });
      // }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = router;
