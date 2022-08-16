const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pack = require("../models/ProductPack");
const productSchema = require("../models/Product");
const test = require("../../middleware/multytenant");
const Packitems = require("../models/ProductPackItem");
//router.get("/admin/:adminId", (req, res, next) => {
router.get("/admin/:adminId", (req, res, next) => {
  // OnePack
  req.tenant
    .find({ adminId: req.params.adminId, desabled: false })
    // .select("product quantity _id")
    // .populate("product")
    .exec()
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

router.get("/", (req, res, next) => {
  // OnePack
  req.tenant
    .find({ desabled: false })
    // .select("product quantity _id")
    .populate("Product")
    .exec()
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

router.get("/pack_item_list", (req, res, next) => {
  // OnePack
  req.tenant
    .find({ desabled: false })
    .exec()
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

router.post("/:adminId", async (req, res, next) => {
  req.body.adminId = req.params.adminId;

  req.tenant
    .create(req.body)
    .then((data) => {
      req.io.sockets.emit(`${req.body.adminId}newPack`, data);
      res.status(201).json({ message: "ok ok product", data: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post(
  "/:adminId/pack/packitems",

  (req, res, next) => {
    console.log(req.body);

    let _id = req.body._id;

    req.tenant.findById(_id, (err, docs) => {
      let tab_items = pack.pack_items;
      if (err) {
        res.sendStatus(400);
      }
      if (tab_items[tab_items.length - 1]) {
        //console.log("je suis la merci");
        let oldpack = tab_items[tab_items.length - 1];
        console.log(oldpack);
        let newpackitems = {
          oldstock: oldpack.quantity,
          newstock: req.body.quantity + oldpack.quantity,
          quantity: req.body.quantity,
        };

        req.tenant.findOneAndUpdate(
          { _id: _id },
          { $push: { pack_items: newpackitems } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              req.tenant.findById(_id).then((data) => {
                res.status(201).json({
                  message: "ajouté ",
                  resultat: data,
                  // professeur: prof
                });
              });
            }
          }
        );
      } else {
        //first add productitems
        let newpackitems = {
          newstock: req.body.quantity,
          quantity: req.body.quantity,
        };

        req.tenant.findOneAndUpdate(
          { _id: _id },
          { $push: { pack_items: newpackitems } },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              Pack.findById(_id).then((data) => {
                res.status(201).json({
                  message: "ajouté ",
                  resultat: data,
                  // professeur: prof
                });
              });
            }
          }
        );
      }
    });
  }
);

router.get("/:packId", (req, res, next) => {
  req.tenant
    .findById(req.params.packId)
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

router.delete("/:productId", (req, res, next) => {
  //OnePack;
  console.log(req.params.productId);

  // .remove({ _id: req.params.orderId })
  req.tenant
    .findOneAndUpdate(
      { productId: req.params.productId },
      {
        $set: {
          desabled: true,
        },
      },
      { new: true }
    )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/", (req, res, next) => {
  const id = req.body._id;
  req.tenant
    .findOneAndUpdate(
      { _id: id },
      { $set: req.body },
      { new: true },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({
            message: "ajouté ",
            resultat: success,
            // professeur: prof
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
router.patch("/updateField", (req, res, next) => {
  const id = req.body._id;
  req.tenant
    .find({ _id: req.body._id })
    .exec()
    .then((result) => {
      //result is an object
      console.log(result);
      let obj = result[0];

      if (obj["pack_items"][obj["pack_items"].length - 1]) {
        req.tenant.findOneAndUpdate(
          { _id: obj._id },
          {
            $set: {
              quantity: req.body.quantity + req.body.newquantity,
              quantityItems: req.body.quantity + req.body.newquantity,
            },
          },
          { new: true },
          (error, success) => {
            if (error) {
              console.log(error);
            } else {
              // req.io.sockets.emit(`${req.body.adminId}packItem`, success);
              // res.redirect('/?valid=' + string);
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

router.patch("/update/multy", (req, res, next) => {
  const id = req.body._id;
  req.tenant
    .findOneAndUpdate(
      { productId: id },
      { $set: req.body },
      { new: true },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json({
            message: "ajouté ",
            resultat: success,
            // professeur: prof
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

module.exports = router;
