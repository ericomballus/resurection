const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const transactionItem = require("../models/Transaction");
const test = require("../../middleware/multytenant");
//const sublease = require("mongoose-sublease");

router.get("/:adminId", (req, res, next) => {
  // Invoice.find({}, "-v")
  req.tenant
    .find({ confirm: true, adminId: req.params.adminId }, "-v")
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
  // Invoice
  // req
  console.log("this is query222222===>", req.query);
  let query = {};
  if (req.query.role !== "false") {
    query = {
      adminId: req.params.adminId,
      storeId: req.query.storeId,
    };
    req.tenant
      .find(query)
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
    let adminId = "";
    if (req.query.adminId) {
      adminId = req.query.adminId;
    } else if (req.params.adminId) {
      adminId = req.params.adminId;
    }
    if (req.query.storeId) {
      query = {
        confirm: false,
        adminId: adminId,
        storeId: req.query.storeId,
      };
    } else if (req.query.senderId) {
      query = { adminId: adminId, senderId: req.query.senderId };
    } else {
      query = {
        confirm: false,
        adminId: adminId,
        storeId: req.query.storeId,
      };
    }
    req.tenant
      .find(query)
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

router.get("/confirm/transaction/:adminId", (req, res, next) => {
  // Invoice
  // req
  req.tenant
    .find({ adminId: req.params.adminId, sale: true })
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

router.patch("/:adminId", (req, res, next) => {
  req.tenant.findOneAndUpdate(
    { _id: req.body.id },
    {
      $set: req.body,
    },
    { new: true },
    async (error, success) => {
      if (error) {
        console.log(error);
      } else {
        let T = await req.tenant.find({ _id: req.body.id });
        require("../../utils/sendToStore").sendToStore(req, T[0]);
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

router.delete("/:adminId", async (req, res, next) => {
  await req.tenant.remove({ _id: req.body.id }).exec();
});

module.exports = router;
