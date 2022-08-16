const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
router.get("/:adminId", (req, res, next) => {
  req.tenant
    .find({ adminId: req.params.adminId, open: true })
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
    .find({ adminId: req.params.adminId })
    .sort({ $natural: -1 })
    .limit(1)
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
router.post("/", async (req, res, next) => {
  try {
    let docs = await req.tenant.create(req.body);
    res.status(201).json(docs);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.patch("/", (req, res, next) => {
  console.log(req.body._id);

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

router.patch("/:storeId", (req, res, next) => {
  console.log(req.body._id);

  req.tenant
    .findOneAndUpdate(
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
      res.status(400).json(err);
    });
});
module.exports = router;
