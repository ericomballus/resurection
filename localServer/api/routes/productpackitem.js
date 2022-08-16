const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Packitems = require("../models/ProductPackItem");

router.get(
  "/admin/:adminId",

  (req, res, next) => {
    // Packitems;
    req.tenant
      .find({ adminId: req.params.adminId, desabled: false })
      // .select("product quantity _id")
      .populate("packId")
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
);

//pour appli admin
router.get("/", (req, res, next) => {
  // req.tenant;
  req.tenant
    .find({ desabled: false })
    // .select("product quantity _id")
    // .populate("product")
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
});

router.get("/pack/:name/:IdAdmin", (req, res, next) => {
  req.tenant
    .find({ name: { $regex: req.params.name }, desabled: false })
    .exec()
    .then((docs) => {
      // docs.filter((elt) => elt.)
      res.status(200).json({
        pack: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/:adminId/pack/packitems", (req, res, next) => {
  let _id = req.body._id;
  console.log("=====+++++++====++++-------");

  req.tenant
    .create({
      // productItemId: req.body._id,
      productPackId: req.body.productPackId,
      adminId: req.body.adminId,
      purchasingPrice: req.body.purchasingPrice,
      sellingPrice: req.body.sellingPrice,
      name: req.body.name,
      url: req.body.url,
      itemsInPack: req.body.itemsInPack,
      unitNameProduct: req.body.unitNameProduct,
      sizeUnitProduct: req.body.sizeUnitProduct,
      maeriId: req.body.maeriId,
      superCategory: req.body.superCategory,
      productId: req.body.productId,
      storeId: req.body.storeId,
    })
    .then((data) => {
      console.log(data);
      req.io.sockets.emit(`${req.body.adminId}newPackItem`, data);
      res.status(201).json({ message: "ok ok product", data: data });
    });
});

router.get("/:packId", (req, res, next) => {
  req.tenant
    .findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((pack) => {
      if (!pack) {
        return res.status(404).json({
          message: "order not found",
        });
      }
      res.status(200).json({
        Pack: pack,
        request: {
          type: "GET",
          url: "http://localhost:3000/pack",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/admin/:Id", (req, res, next) => {
  req.tenant
    .findOneAndUpdate(
      { productId: req.params.Id },
      {
        $set: {
          desabled: true,
        },
      },
      { new: true }
    )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
});

router.patch("/", (req, res, next) => {
  const id = req.body._id;

  //OnePack
  req.tenant
    .find({ productPackId: req.body.id })
    .exec()
    .then((result) => {
      //result is an object
      console.log(result);
      let obj = result[0];
      let quantity = obj["quantity"];
      if (obj["pack_update"][obj["pack_update"].length - 1]) {
        let oldpack = obj["pack_update"][obj["pack_update"].length - 1];
        console.log(oldpack);
        console.log(req.body.newquantity);
        let oldQuantity = oldpack.quantity;
        let newpackitems = {
          oldstock: oldpack.newstock,
          //newstock est la somme des ajouts
          newstock: req.body.newquantity + oldQuantity,
          //quantity est le stock ajouté
          quantity: req.body.newquantity,
        };

        // req
        req.tenant.findOneAndUpdate(
          { _id: obj._id },
          {
            $push: { pack_update: newpackitems },
            $set: {
              quantity: quantity + req.body.newquantity,
              quantityItems: quantity + req.body.newquantity,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              req.io.sockets.emit(`${req.body.adminId}packItem`, success);
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
        };

        // req
        req.tenant.findOneAndUpdate(
          { _id: obj._id },
          { $push: { pack_update: newpackitems } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              // req
              req.tenant
                .findOneAndUpdate(
                  { _id: id },
                  {
                    $set: {
                      quantity: quantity + req.body.newquantity,
                      quantityItems: quantity + req.body.newquantity,
                    },
                  }
                )
                .then((data) => {
                  req.io.sockets.emit(`${req.body.adminId}packItem`, data);
                  // req
                  req.tenant.findById(id).then(() => {
                    res.status(201).json({
                      message: "ajouté ",
                      resultat: data,
                      // professeur: prof
                    });
                  });
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

router.patch("/more", (req, res, next) => {
  if (!req.body.fromVendor) {
    req.body.tab.forEach((element) => {
      req.tenant
        .find({ productPackId: element.packId, adminId: req.body.adminId })
        .exec()
        .then((result) => {
          //result is an object
          console.log(result);
          let obj = result[0];
          let quantity;
          if (obj["quantity"]) {
            quantity = obj["quantity"];
            if (obj["pack_update"][obj["pack_update"].length - 1]) {
              let oldpack = obj["pack_update"][obj["pack_update"].length - 1];
              console.log(oldpack);
              console.log(element.newquantity);
              let oldQuantity = oldpack.quantity;
              let newpackitems = {
                oldstock: oldpack.newstock,
                //newstock est la somme des ajouts
                newstock: element.packQuantity + oldQuantity,
                //quantity est le stock ajouté
                quantity: element.packQuantity,
              };

              // req
              req.tenant.findOneAndUpdate(
                { _id: obj._id },
                {
                  $push: { pack_update: newpackitems },
                  $set: {
                    quantity: quantity + element.packQuantity,
                    quantityItems: quantity + element.packQuantity,
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                    req.io.sockets.emit(`${req.body.adminId}packItem`, success);
                  }
                }
              );
            } else {
              //first add productitems
              let newpackitems = {
                newstock: element.packQuantity,
                oldstock: 0,
                quantity: element.packQuantity,
              };

              // req
              req.tenant.findOneAndUpdate(
                { _id: obj._id },
                { $push: { pack_update: newpackitems } },
                function (error, success) {
                  if (error) {
                    console.log(error);
                  } else {
                    // req
                    req.tenant
                      .findOneAndUpdate(
                        { _id: obj._id },
                        {
                          $set: {
                            quantity: quantity + element.packQuantity,
                            quantityItems: quantity + element.packQuantity,
                          },
                        }
                      )
                      .then((data) => {
                        req.io.sockets.emit(
                          `${req.body.adminId}packItem`,
                          data
                        );
                        // req
                      });
                  }
                }
              );
            }
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: err,
          });
        });
    });
  } else {
    req.body.tab.forEach((element) => {
      req.tenant
        .find({ maeriId: element.maeriId, adminId: req.body.adminId })
        .exec()
        .then((result) => {
          //result is an object
          console.log(result);
          let obj = result[0];
          let quantity;
          if (obj["quantity"]) {
            quantity = obj["quantity"];
            if (obj["pack_update"][obj["pack_update"].length - 1]) {
              let oldpack = obj["pack_update"][obj["pack_update"].length - 1];
              console.log(oldpack);
              console.log(element.newquantity);
              let oldQuantity = oldpack.quantity;
              let newpackitems = {
                oldstock: oldpack.newstock,
                //newstock est la somme des ajouts
                newstock: element.packQuantity + oldQuantity,
                //quantity est le stock ajouté
                quantity: element.packQuantity,
              };

              // req
              req.tenant.findOneAndUpdate(
                { _id: obj._id },
                {
                  $push: { pack_update: newpackitems },
                  $set: {
                    quantity: quantity + element.packQuantity,
                    quantityItems: quantity + element.packQuantity,
                  },
                },
                { new: true },
                (error, success) => {
                  if (error) {
                    console.log(error);
                  } else {
                    req.io.sockets.emit(`${req.body.adminId}packItem`, success);
                  }
                }
              );
            } else {
              //first add productitems
              let newpackitems = {
                newstock: element.packQuantity,
                oldstock: 0,
                quantity: element.packQuantity,
              };

              // req
              req.tenant.findOneAndUpdate(
                { _id: obj._id },
                { $push: { pack_update: newpackitems } },
                function (error, success) {
                  if (error) {
                    console.log(error);
                  } else {
                    // req
                    req.tenant
                      .findOneAndUpdate(
                        { _id: obj._id },
                        {
                          $set: {
                            quantity: quantity + element.packQuantity,
                            quantityItems: quantity + element.packQuantity,
                          },
                        }
                      )
                      .then((data) => {
                        req.io.sockets.emit(
                          `${req.body.adminId}packItem`,
                          data
                        );
                        // req
                      });
                  }
                }
              );
            }
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: err,
          });
        });
    });
  }

  res.status(200).json({
    message: "produit mise a jour",
  });
});

module.exports = router;
