const express = require("express");
const mongoose = require("mongoose");
const ResourceItem = require("../models/Resource_item");
const test = require("../../middleware/multytenant");
const router = express.Router();
const warehouseTransaction = require("../../middleware/transactionItems");
const productItemsSchema = require("../models/ProductItem");
const { ObjectId } = require("mongodb");
//const mongoose = require("mongoose");
router.post("/:adminId", (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let sec = d.getSeconds();
  let mili = d.getMilliseconds();

  let theDate = `${year}-${month}-${day}`;
  req.tenant
    .create({
      created: theDate,
      name: req.body.name,
      adminId: req.params.adminId,
      resourceId: req.body.resourceId,
      unitName: req.body.unitName,
      quantity: req.body.quantity,
    })
    .then((resource) => {
      console.log(resource);
      req.io.sockets.emit(`${req.params.adminId}newResourceItem`, resource);
      res.status(201).json({ message: "ok ok product", data: resource });
    });
});

router.post("/:adminId/isAvaible", async (req, res, next) => {
  console.log(req.body);
  let arrayToFin = [];
  let tab = [];
  let arrayToProductFin = [];
  let tab22 = [];
  tab = req.body.resourceListId;
  if (req.body.productList && req.body.productList.length) {
    tab2 = req.body.productList;
    tab2.forEach((id) => {
      arrayToProductFin.push(mongoose.Types.ObjectId(id));
    });
  }
  tab.forEach((id) => {
    arrayToFin.push(mongoose.Types.ObjectId(id));
  });
  // let arrayToFind = req.body.resourceListId;
  /*
   let ProductItem = req.tenancy.getModelByTenant(
          req.dbUse,
          "productitems",
          productItemsSchema
        );

        ProductItem.find({ productId: result._id })
          .exec()
          .then((data) => {
  */
  try {
    const result = await req.tenant
      .find({
        resourceId: { $in: arrayToFin },
      })
      .exec();
    if (arrayToProductFin.length) {
      const result2 = await req.tenancy
        .getModelByTenant(req.dbUse, "productitems", productItemsSchema)
        .find({
          productId: { $in: arrayToProductFin },
        })
        .exec();
      let resultat = [...result, ...result2];
      res.status(200).json(resultat);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

//take all products
router.get(
  "/resourceId/:adminId",

  (req, res, next) => {
    req.tenant
      .find(
        {
          adminId: req.params.adminId,
          desabled: false,
          // resourceId: req.params.resourceId,
          //  quantity: { $gt: 0 },
        },
        "-__v"
      )
      .lean()
      .exec((err, dataR) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        }
        res.json({
          resources: dataR,
        });
      });
  }
);

router.get("/", (req, res, next) => {
  if (req.query.storeId) {
    req.tenant
      .find({
        desabled: false,
        adminId: req.query.db,
        storeId: req.query.storeId,
      })
      .sort({ name: 1 })
      .exec()
      .then((docs) => {
        // docs.filter((elt) => elt.)
        res.status(200).json({
          count: docs.length,
          items: docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } else {
    req.tenant
      .find({ desabled: false, adminId: req.query.db })
      .exec()
      .then((docs) => {
        // docs.filter((elt) => elt.)
        res.status(200).json({
          count: docs.length,
          items: docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
});
router.patch("/quantity", (req, res, next) => {
  const id = req.body.id;
  console.log(req.body);

  req.tenant
    .findById({ _id: id })
    .exec()
    .then((doc) => {
      // console.log(doc["tabitem"]);

      if (doc["tabitem"][doc["tabitem"].length - 1]) {
        let oldpack = doc["tabitem"][doc["tabitem"].length - 1];

        let oldQuantity = parseInt(oldpack.newstock);
        let newpackitems = {
          oldstock: oldpack.newstock,
          //newstock est la somme des ajouts
          newstock: parseInt(req.body.newquantity) + oldQuantity,
          //quantity est le stock ajouté
          quantity: parseInt(req.body.newquantity),
          itemId: doc._id,
        };

        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $push: { tabitem: newpackitems },
            $set: {
              quantityItems: oldQuantity + parseInt(req.body.newquantity),
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.params.adminId}resourceItem`, success);
              res.status(201).json({
                message: "update ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      } else {
        //first add productitems
        let newpackitems = {
          newstock: req.body.newquantity,
          oldstock: 0,
          quantity: req.body.newquantity,
          itemId: doc._id,
        };

        req.tenant.findOneAndUpdate(
          { _id: id },
          {
            $push: { tabitem: newpackitems },
            $set: {
              quantityItems: parseInt(req.body.newquantity),
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.params.adminId}resourceItem`, success);

              res.status(201).json({
                message: "update ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});

router.patch(
  "/:adminId/resource/store",

  (req, res, next) => {
    // console.log("je suis la", req.body);
    req.tenant
      .findById({ _id: req.body.id })
      .exec()
      .then((doc) => {
        //console.log(doc);
        let obj = {
          name: doc.name,
          quantityItems: req.body.quantity,
          sender: req.body.sender,
          productType: req.body.productType,
          productId: req.body.id,
        };
        const quantity = req.body.quantity;
        let newquantity = doc.quantityItems - quantity;
        let quantityInStore = doc.quantityStore + quantity;
        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
          {
            $set: {
              quantityItems: newquantity,
              quantityStore: quantityInStore,
              confirm: false,
              sender: req.body.sender,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              warehouseTransaction(req, obj);
              req.io.sockets.emit(`${req.params.adminId}resourceItem`, success);
              res.status(201).json({
                message: "update ",
                resultat: success,
                // professeur: prof
              });
            }
          }
        );
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      });
  }
);

router.delete(
  "/:id/:adminId",

  (req, res, next) => {
    let catId = req.params.id;
    let adminId = req.params.adminId;
    //Category
    req.tenant
      .remove({ _id: catId })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "category Deleted",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

module.exports = router;
