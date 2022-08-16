const express = require("express");
const router = express.Router();
const InventorySchema = require("../models/Inventory");
const mongoose = require("mongoose");
const test = require("../../middleware/multytenant");
//const OnePack = require("../models/ProductPack");
//const Product = require("../models/Product");
const manufactureditem = require("../models/Product-manufactured-item");
const warehouseTransaction = require("../../middleware/transactionItems");

router.get(
  "/admin/:prodId",

  (req, res, next) => {
    // Packitems;
    req.tenant
      .find({ productId: req.params.prodId, disablemanufactured: true })
      //.populate("productId")
      .exec()
      .then((docs) => {
        // docs.filter((elt) => elt.)
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
);

//pour appli admin
router.get("/", (req, res, next) => {
  if (req.query.storeId) {
    console.log("hello product store id -----+++++---+++++");

    req.tenant
      .find({
        desabled: false,
        adminId: req.query.db,
        storeId: req.query.storeId,
      })
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
      .find({ disablemanufactured: true, adminId: req.query.db })
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

router.get(
  "/manufactureditem/:name/:IdAdmin",

  (req, res, next) => {
    req.tenant
      .find({
        name: { $regex: req.params.name },
        disablemanufactured: true,
      })
      // .select("product quantity _id")
      // .populate("product")
      .exec()
      .then((docs) => {
        // docs.filter((elt) => elt.)
        res.status(200).json({
          Items: docs,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.post("/:adminId/manufactured/items", (req, res, next) => {
  console.log(req.body);

  req.tenant
    .create(req.body)
    // .save(req.body)
    .then((data) => {
      //console.log(data);

      res.status(201).json({ message: "ok ok product", data: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/:Id", (req, res, next) => {
  //OnePack;
  // console.log(req.params.Id);
  req.tenant.findOneAndUpdate(
    { _id: req.params.Id },
    {
      $set: {
        disablemanufactured: false,
      },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        res.status(201).json({
          message: "Delete ",
          resultat: success,
          // professeur: prof
        });
      }
    }
  );
  // .remove({ _id: req.params.Id })
  //.exec()
});

router.patch("/:adminId", (req, res, next) => {
  const id = req.body.id;
  console.log(req.body);
  req.tenant
    .findById({ _id: req.body.id })
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
              req.io.sockets.emit(
                `${req.params.adminId}manufacturedItem`,
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
        //first add productitems
        let newpackitems = {
          newstock: req.body.newquantity,
          oldstock: 0,
          quantity: req.body.newquantity,
          itemId: doc._id,
        };

        req.tenant.findOneAndUpdate(
          { _id: req.body.id },
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
              req.io.sockets.emit(
                `${req.params.adminId}manufacturedItem`,
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
  "/:adminId/manufacturedItems/store",

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
              req.io.sockets.emit(
                `${req.params.adminId}manufacturedItem`,
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
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      });
  }
);

router.patch("/:adminId/manufacturedItems/store/confirm", (req, res, next) => {
  console.log(req.body);
  req.tenant
    .findById({ _id: req.body.id })
    .exec()
    .then((doc) => {
      console.log("=============");
      console.log(doc);
      console.log("=============");
      req.tenant.findOneAndUpdate(
        { _id: req.body.id },
        {
          confirmStore: 1,
        },
        { new: true },
        (error, success) => {
          if (error) {
            console.log(error);
          } else {
            console.log(success);

            // warehouseTransaction(req, success);
            let tab = [];
            tab.push(success);
            const tenant = req.tenancy.getModelByTenant(
              req.dbUse,
              "inventory",
              InventorySchema
            );
            tenant
              .find({
                open: true,
                cashOpening: req.query.openCashDate,
              })
              .lean()
              .exec()
              .then((docs) => {
                if (docs && docs.length) {
                  let arr = docs[0]["listsStart"];
                  let index = arr.findIndex((elt) => {
                    return elt._id == success._id;
                  });
                  if (index >= 0) {
                    arr.splice(index, 1, success);
                    tenant.updateOne(
                      { _id: docs[0]["_id"] },
                      { $set: { listsStart: arr } },
                      { new: true },
                      function (error, success1) {
                        if (error) {
                          console.log(error);
                        } else {
                        }
                      }
                    );
                  } else {
                    arr.push(success);
                    console.log(arr.length);

                    tenant.updateOne(
                      { _id: docs[0]["_id"] },
                      { $set: { listsStart: arr } },
                      { new: true },
                      function (error, success1) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("succes======++++++-----2", success1);
                        }
                      }
                    );
                  }
                } else {
                  console.log("succes======++++++-----33");
                  tenant.create({
                    _id: new mongoose.Types.ObjectId(),
                    cashOpening: req.query.openCashDate,
                    listsStart: tab,
                    adminId: req.params.adminId,
                  });
                }
              });
            req.io.sockets.emit(
              `${req.params.adminId}manufacturedItemConfirm`,
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
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});
router.patch(
  "/:adminId/products/store/confirm/reset/quantity",

  (req, res, next) => {
    req.tenant.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          quantityItems: 0,
          quantityStore: 0,
          // quantityToConfirm: 0,
          // quantityToConfirm: 0,
        },
      },
      { new: true },
      (error, success) => {
        if (error) {
          console.log(error);
        } else {
          // warehouseTransaction(req, obj);
          // req.io.sockets.emit(`${req.params.adminId}productItem`, success);
          res.status(201).json({
            message: "update ",
            resultat: success,
            // professeur: prof
          });
        }
      }
    );
    //  })
    /*  .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      }); */
  }
);

module.exports = router;
