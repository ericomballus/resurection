const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const tenant = require("../../getTenant");
const productItemsSchema = require("../models/ProductItem");
const manufacturedSchema = require("../models/Product-manufactured-item");
const billardSchema = require("../models/Billard");
const productListSchema = require("../models/Product-List");
const gammeSchema = require("../models/Gamme");
let db = "maeri";
router.get("/", (req, res, next) => {
  req.tenant
    .find({}, "-v")
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

router.get("/admin", async (req, res, next) => {
  try {
    const result = await req.tenant
      .find({ adminId: req.query.adminId }, "-v")
      // .skip(1)
      .sort({ created: -1 })
      .lean();
    if (result.length > 1) {
      result.pop();
    }
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/admin/last_inventaire", async (req, res, next) => {
  try {
    const result = await req.tenant
      .find({ adminId: req.query.adminId }, "-v")
      .sort({ _id: -1 })
      .limit(1)
      .lean();
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  return;
  let tab = [];
  tab = req.body.Inventory;
  req.tenant
    .create(req.body)
    .then((resu) => {
      res.send(JSON.stringify({ success: resu }));
      tab.forEach((elt) => {
        if (elt["prod"]["productType"] === "billard") {
        } else if (elt["prod"]["productType"] === "shoplist") {
        } else if (elt["prod"]["productType"] === "productItems") {
          countProductItemes(elt, req);
        }
      });
    })
    .catch((err) => {
      console.log(err);
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

countProductItemes = async (elt, req) => {
  let a = await req.tenancy.getModelByTenant(
    req.dbUse,
    "productitems",
    productItemsSchema
  );
  const tenant = a;

  tenant
    .findById({ _id: elt["prod"]["_id"] })
    .exec()
    .then(async (doc) => {
      let store = 0;
      if (elt["reste"] >= 0) {
        store = elt["reste"];
      } else {
        store = 0;
      }
      tenant.findOneAndUpdate(
        { _id: doc._id },
        {
          $set: {
            quantityStore: 0,
            quantityItems: store,
          },
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log("product items", error.message);
          } else {
            console.log("item after inventory", success);
          }
        }
      );
    });
};

module.exports = router;
