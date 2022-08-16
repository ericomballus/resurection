const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const test = require("../../middleware/multytenant");
const Vendor = require("../models/vendor");
const findEmploye = require("../../middleware/findemploye");

router.post("/", async (req, res, next) => {
  console.log(req.body.telephone);
  console.log(req.body);

  // User.find({ telephone: req.body.telephone })

  const vendor = new Vendor({
    _id: new mongoose.Types.ObjectId(),
    retailerId: req.body.adminId,
    vendorId: req.body.vendorId,
  });
  vendor
    .save()
    .then((result) => {
      req.io.sockets.emit(`${req.body.adminId}vendor`, result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:adminId", async (req, res, next) => {
  /* Vendor.find({ retailerId: req.params.adminId, unsubscribed: false })
    .populate("vendorId")
    .lean()
    .exec((err, venders) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      res.json(venders);
    }); */

  try {
    const venders = await Vendor.find({
      retailerId: req.params.adminId,
      unsubscribed: false,
    })
      .populate("vendorId")
      .lean();
    res.status(200).json(venders);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});
router.get("/retailer/:vendorId", async (req, res, next) => {
  /* Vendor.find({ retailerId: req.params.adminId, unsubscribed: false })
    .populate("vendorId")
    .lean()
    .exec((err, venders) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      res.json(venders);
    }); */

  try {
    const retailer = await Vendor.find({
      vendorId: req.params.vendorId,
    })
      .populate("retailerId")
      .lean();
    res.status(200).json(retailer);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.put("/", async (req, res, next) => {
  //let id = req.body._id;
  console.log(req.body);

  const filter = { _id: req.body._id };
  const update = { unsubscribed: true };
  Vendor.findOneAndUpdate(filter, update, {
    new: true,
  })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put("/confirmRetailer", async (req, res, next) => {
  //let id = req.body._id;
  console.log(req.body);

  const filter = { _id: req.body._id };
  const update = { vendorConfirm: true };
  Vendor.findOneAndUpdate(filter, update, {
    new: true,
  })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
