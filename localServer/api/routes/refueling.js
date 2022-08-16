const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const test = require("../../middleware/multytenant");

router.get("/", (req, res, next) => {
  // Invoice
  // req

  req.tenant
    .find({
      adminId: req.query.adminId,
    })
    .sort({ _id: -1 })
    .limit(50)
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

router.get("/:adminId", (req, res, next) => {
  req.tenant
    .find({
      adminId: req.params.adminId,
      storeId: req.query.storeId,
      confirm: req.query.confirm,
    })
    .sort({ _id: -1 })
    .limit(30)
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

router.get("/:adminId/:notConfirm", (req, res, next) => {
  let query = {};
  query["adminId"] = req.params.adminId;
  // query["confirm"] = req.query.confirm;
  if (req.query.storeId) {
    query["storeId"] = req.query.storeId;
  }
  req.tenant
    .find(query)
    .sort({ _id: -1 })
    .limit(100)
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
router.post("/", test.db, (req, res, next) => {
  req.tenant
    .create(req.body)
    .then((resu) => {
      req.io.sockets.emit(`${req.body.adminId}Refueling`, resu);
      res.status(200).json(resu);
    })

    .catch((err) => {
      console.log(err);
    });
});

router.patch("/", (req, res, next) => {
  // delete req.body._id;
  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: { confirm: req.body.confirm },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(`${req.body.adminId}Refueling`, success);
        res.status(201).json(success);
      }
    }
  );
});

module.exports = router;
