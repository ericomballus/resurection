const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const tenant = require("../../getTenant");
const cashOpeningSchema = require("../models/Cash-opening");
const randomIventory = require("../../utils/randomIventory");
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

router.get("/admin/:adminId", (req, res, next) => {
  if (req.query.open) {
    console.log("req.query.adminId");

    randomIventory(req, res);
    // return;
  } else {
    req.tenant
      .find(
        { cashOpening: req.query.cashOpening, adminId: req.query.adminId },
        "-v"
      )
      .lean()
      .exec((err, result) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        console.log("hello inventaire ici here ===>", result);
        let Cash = mongoose.model("cashopens", cashOpeningSchema);
        // tenant.getModelByTenant(db, "cashopens", cashOpeningSchema);
        Cash.findById(req.query.cashOpening, function (err, cash) {
          if (err) {
            console.log(err);
          } else {
            res.json({
              docs: result,
              cash: cash,
            });
          }
        });
      });
  }
});

router.get("/admin/:adminId/aggregate", (req, res, next) => {
  req.tenant
    .aggregate([
      {
        $match: {
          adminId: req.query.adminId,
        },
      },
      { $sort: { created: -1 } },
      // { $limit: 3 },
      {
        $lookup: {
          from: "cashopens",
          localField: "cashOpening",
          foreignField: "_id",
          as: "cashDay_docs",
          // let: { cashOpening: "$_id" },
          // pipeline: [{ $limit: 3 }],
        },
      },
      {
        $group: {
          _id: "$cashOpening",
          ristourneGenerate: {
            $sum: "$ristourneGenerate",
          },

          totalSalesAmount: {
            $sum: "$totalSalesAmount",
          },
          entry: {
            $push: "$cashDay_docs",
            // qty: "$commandes.products.qty",
          },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 3 },
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
});
router.post("/", (req, res, next) => {
  delete req.body["_id"];
  req.tenant
    .find({
      productItemsId: req.body.productItemsId,
      cashOpening: req.body.cashOpening,
    })
    .lean()
    .exec()
    .then((docs) => {
      if (docs.length) {
        req.tenant
          .findOneAndUpdate(
            { _id: docs[0]["_id"] },
            { $set: req.body },
            { new: true },
            function (error, resul) {
              if (error) {
                console.log(error);
              } else {
                res.status(201).json({
                  doc: resul,
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
        (req.body._id = new mongoose.Types.ObjectId()),
          req.tenant
            .create(req.body)
            .then((resu) => {
              res.send(JSON.stringify({ success: resu }));
            })
            .catch((err) => {
              console.log(err);
            });
      }
    });
});

router.post("/:storeId", (req, res, next) => {
  req.tenant
    .find({
      productItemsId: req.body.productItemsId,
      cashOpening: req.body.cashOpening,
    })
    .lean()
    .exec()
    .then((docs) => {
      if (docs && docs.length) {
        req.tenant
          .findOneAndUpdate(
            { _id: docs[0]["_id"] },
            { $set: req.body },
            { new: true },
            function (error, resul) {
              if (error) {
                console.log(error);
              } else {
                res.status(201).json(resul);
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
          .create(req.body)
          .then((resu) => {
            res.status(201).json(resu);
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
function lastInventory(arrCash, docs) {}
module.exports = router;
