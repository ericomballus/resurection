const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/:adminId", (req, res, next) => {
  if (req.query.byCustomer) {
    req.tenant
      .find({
        adminId: req.params.adminId,
        customerId: req.query.customerId,
        Fund: false,
      })
      .sort({ $natural: -1 })
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
  } else if (req.query.allCustomer) {
    req.tenant
      .find({
        adminId: req.params.adminId,
        Fund: false,
        // customerId: req.params.customerId,
      })
      .sort({ $natural: -1 })
      .limit(100)
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
    req.tenant
      .find({ adminId: req.params.adminId, Fund: true })
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

router.post("/:adminId", async (req, res, next) => {
  try {
    let resu = await req.tenant.create(req.body);
    res.status(200).json({ message: resu });
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.patch("/:adminId/consigne", (req, res, next) => {
  console.log(req.body);
  req.tenant.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: req.body,
    },
    { new: true },
    (error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log(success);
        req.io.sockets.emit(`${req.body.adminId}makeInventory`, success);
        res.status(201).json({
          message: "update ",
          resultat: success,
        });
      }
    }
  );
});

router.delete("/:adminId", (req, res, next) => {
  // console.log(req.query);
  req.tenant.findByIdAndRemove(req.query.Id, (error, success) => {
    if (error) {
      console.log(error);
    } else {
      res.status(201).json({
        message: "update ",
        resultat: success,
      });
    }
  });
});
module.exports = router;
