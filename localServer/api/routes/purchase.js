const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Purchase = require("../models/Purchase");
const test = require("../../middleware/multytenant");
const wareHouseManager = require("../../middleware/Scmanager");
const checkIfRefueling = require("../../utils/wareHouseRefueling");
router.get("/:adminId", (req, res, next) => {
  // Invoice
  req.tenant
    .find({
      adminId: req.params.adminId,
      $or: [{ desable: { $exists: false } }, { desable: { $ne: true } }],
    })
    .sort({ _id: -1 })
    .limit(30)
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
    .find({
      adminId: req.params.adminId,
      // $or: [{ desable: { $exists: false } }, { desable: { $ne: true } }],
    })
    // .select("product quantity _id")
    // .populate("product")
    .lean()
    .exec()
    .then((resul) => {
      let docs = resul.reverse();

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

router.get("/:adminId/all/for_inventory", (req, res, next) => {
  // Invoice
  // req
  req.tenant
    .find({
      adminId: req.params.adminId,
      storeId: req.query.storeId,
      $or: [{ desable: { $exists: false } }, { desable: { $ne: true } }],
      created: {
        $gt: req.query.olDate,
        $lte: req.query.newDate,
      },
    })
    // .select("product quantity _id")
    // .populate("product")
    .lean()
    .exec()
    .then((resul) => {
      let docs = resul.reverse();
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/:adminId", test.db, async (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let heure = d.getHours();
  let minute = d.getMinutes();
  let sec = d.getSeconds();
  let mili = d.getMilliseconds();

  let openDate = `${year}-${month}-${day}`;
  let hours = `${heure}:${minute}:${sec}`;
  let wareHouseRefueling = false;
  let adminId = req.params.adminId;
  try {
    wareHouseRefueling = await checkIfRefueling(adminId, req);
    req.tenant
      .create({
        adminId: req.params.adminId,
        purchaseDate: openDate,
        totalPrice: req.body.totalPrice,
        hours: hours,
        quantity: req.body.quantity,
        articles: req.body.articles,
        storeId: req.body.storeId,
        senderId: req.body.senderId,
        wareHouseRefueling: wareHouseRefueling,
      })
      .then((resu) => {
        req.io.sockets.emit(`${req.body.adminId}Purchase`, resu);
        res.status(200).json({ message: resu });
      })

      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

router.patch("/", (req, res, next) => {
  console.log("make patch here ====>>>>", req.body._id);
  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: req.body,
    },
    { new: true },
    async (error, success) => {
      console.log("finish update here====>>>>");
      if (error) {
        console.log(error);
      } else {
        console.log("finish update here====>>>>");
        if (req.body.scConfirm && req.body.swConfirm) {
          req.io.sockets.emit(`${req.body.adminId}PurchaseUpdate`, success);
        }
        if (req.body.scConfirm && req.body.swConfirm == false) {
          try {
            await warehouseManager(req, res, req.body.AgenceCommande);
            req.io.sockets.emit(`${req.body.adminId}warehouseChange`, success); // notifi le warehouse et la dg
            res.status(200).json({
              resultat: success,
            });
          } catch (error) {
            res.status(500).json(error);
          }
        } else if (
          !req.body.scConfirm &&
          !req.body.swConfirm &&
          !req.query.nomatch
        ) {
          try {
            await warehouseManager(req, res, req.body.AgenceCommande);
            req.io.sockets.emit(`${req.body.adminId}warehouseChange`, success);
            res.status(200).json({
              resultat: success,
            });
          } catch (error) {
            res.status(500).json(error);
          }
        } else {
          console.log("response for lupdate here");
          res.status(201).json({
            message: "update ",
            resultat: success,
          });
        }
      }
    }
  );
});

router.patch("/:adminId", (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let sec = d.getSeconds();
  let mili = d.getMilliseconds();
  let heure = d.getHours();
  let minute = d.getMinutes();
  let heures = `${heure}:${minute}:${sec}`;

  let closDate = `${year}-${month}-${day}`;
  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: { quantity: quantity, hours: hours },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(`${req.body.adminId}Purchase`, success);
        res.status(201).json({
          message: "update ",
          resultat: success,
        });
      }
    }
  );
});

router.patch("/:adminId/delete", (req, res, next) => {
  console.log(req.body);

  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: { desable: true },
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        req.io.sockets.emit(`${req.body.adminId}Purchase`, success);
        res.status(201).json({
          message: "update ",
          resultat: success,
        });
      }
    }
  );
});
module.exports = router;
