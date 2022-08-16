const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Transaction = require("../models/Production_Transaction");

router.get("/:adminId", (req, res, next) => {
  Transaction.find({ adminId: req.params.adminId }, "-v")
    .populate("employeId")
    .sort({ _id: -1 })
    .limit(20)
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
  let query = {};
  if (req.query.role !== "false") {
    query = {
      adminId: req.params.adminId,
      storeId: req.query.storeId,
    };
    Transaction.find(query)
      .sort({ _id: -1 })
      .limit(200)
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
  } else {
    if (req.query.storeId) {
      query = {
        confirm: false,
        adminId: req.params.adminId,
        storeId: req.query.storeId,
      };
    } else if (req.query.senderId) {
      query = { adminId: req.params.adminId, senderId: req.query.senderId };
    } else {
      query = {
        confirm: false,
        adminId: req.params.adminId,
        storeId: req.query.storeId,
      };
    }
    Transaction.find(query)
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
  }
});

router.patch("/:adminId", (req, res, next) => {
  Transaction.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: req.body,
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(
          `${req.params.adminId}transactionUpdateItem`,
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
});

module.exports = router;
