const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
router.get("/", (req, res, next) => {
  req.tenant
    .find({ adminId: req.query.db, storeId: req.query.storeId, open: true })
    .lean()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:adminId/all", (req, res, next) => {
  // Invoice
  // req
  req.tenant
    .find({ adminId: req.params.adminId })
    // .select("product quantity _id")
    // .populate("product")
    .lean()
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
router.get("/:adminId/last/:close", (req, res, next) => {
  req.tenant
    .find({ adminId: req.params.adminId, storeId: req.query.storeId })
    .sort({ $natural: -1 })
    .limit(1)
    .lean()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:adminId/last/close/oropen", (req, res, next) => {
  req.tenant
    .find({
      $or: [
        { cashOpening: req.query.cashOpeningId },
        { cashOpening: new ObjectId(req.query.cashOpeningId) },
      ],
    })
    .lean()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  (req.body._id = new mongoose.Types.ObjectId()),
    req.tenant
      .create(req.body)
      .then((resu) => {
        res.send(JSON.stringify({ success: resu }));
      })
      .catch((err) => {
        console.log(err);
      });
});

router.patch("/", (req, res, next) => {
  console.log(req.body._id);

  req.tenant
    .updateOne(
      { _id: req.body._id },
      { $set: req.body },
      { new: true },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          res.status(201).json(success);
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
