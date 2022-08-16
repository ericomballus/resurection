const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");

const Taxi = require("../models/Taxi_Driver");
const Transaction = require("../models/Passenger_Trasanction");
const PUB = require("../models/Taxi_Image_Pub");
const router = express.Router();
let io = require("socket.io");

//console.log(Product.model("Product"));

router.post("/", async (req, res, next) => {
  //console.log("ici tenant1", tenant1);

  let customer = req.body;

  const trans = new Transaction({
    customer_phone: req.body.phone,
    driver_phone: req.body.driver_phone,
    provider: req.body.provider,
    driverId: req.body.driverId,
    //cashId: req.body.cashId,
  });
  let url = req.protocol + "://" + req.get("host") + "/";
  let tab = [];
  let pubUrl = "https://picsum.photos/seed/picsum/200/300";
  if (pub) {
    pub.forEach((prod) => {
      var result = { ...prod };
      var result2 = { ...result._doc };
      result2["url"] =
        req.protocol + "://" + req.get("host") + "/taxipub/" + prod._id;
      tab.push(result2);
      pubUrl = tab[0]["url"];
    });
  }

  try {
    let result = await trans.save();
    req.io.sockets.emit(`${req.body.driverId}paimentRequest`, result);
    res.render("pages/notification", {
      customer: customer,
      url: url,
      pubUrl: pubUrl,
    });
    let mapUser = await Taxi.findOne({ phone: req.body.phone });
    if (mapUser) {
      console.log(mapUser);
    } else {
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res, next) => {
  let Id = req.params.id;
  let taxi = await Taxi.find({ _id: Id });
  pub = await PUB.find({});
  let tab = [];
  let pubUrl = "";
  if (pub) {
    pub.forEach((prod) => {
      var result = { ...prod };
      var result2 = { ...result._doc };
      result2["url"] =
        req.protocol + "://" + req.get("host") + "/taxipub/" + prod._id;
      tab.push(result2);
      pubUrl = tab[0]["url"];
    });
  }

  if (taxi) {
    console.log(taxi);
    let postUrl = req.protocol + "://" + req.get("host") + "/customerTaxi";
    res.render("pages/index", {
      driver: taxi[0],
      postUrl: postUrl,
      pubUrl: pubUrl,
    });
  }
});

router.get("/all/taxiDriver", async (req, res, next) => {
  try {
    const taxiDrivers = await Taxi.find({})
      // .populate("vendorId")
      .lean()
      .sort({ _id: -1 })
      .limit(100);
    res.status(200).json(taxiDrivers);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.put("/qrcode", async (req, res, next) => {
  //let id = req.body._id;
  console.log(req.body);

  const filter = { _id: req.body._id };
  const update = { qrCode: req.body.qrCode, urlQrcode: req.body.urlQrcode };
  Taxi.findOneAndUpdate(filter, update, {
    new: true,
  })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res, next) => {
  Taxi.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "role Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
