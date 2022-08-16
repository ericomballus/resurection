const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");

const Taxi = require("../models/Taxi_Driver");

const router = express.Router();
let io = require("socket.io");
//console.log(Product.model("Product"));

let UPLOAD_PATH = "uploads";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload1 = multer({ storage: storage });

router.post("/", upload1.single("userqrcode"), async (req, res, next) => {
  //console.log("ici tenant1", tenant1);
  try {
    let mapUser = await Taxi.findOne({ phone: req.body.phone });
    if (mapUser) {
      console.log(mapUser);
      res.status(400).json({
        error: "user exist with this phone number",
      });
    } else {
      const taxi = new Taxi({
        filename: req.file.filename,
        originalName: req.file.originalname,
        name: req.body.name,
        first_name: req.body.first_name,
        password: req.body.password,
        phone: req.body.phone,
        matricule: req.body.matricule,
      });
      let newtaxi = await taxi.save();
      // let url = req.protocol + "://" + req.get("host") + "/taxi/" + newtaxi._id;
      let url = req.protocol + "://" + req.get("host") + "/taxi/" + newtaxi._id;
      let urlQrcode =
        req.protocol + "://" + req.get("host") + "/customerTaxi/" + newtaxi._id;
      res.status(201).json({ data: newtaxi, url: url, urlQrcode: urlQrcode });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/auth", async (req, res, next) => {
  //console.log("ici tenant1", tenant1);
  try {
    let mapUser = await Taxi.findOne({ phone: req.body.phone });
    if (mapUser) {
      // console.log(mapUser);
      var result = { ...mapUser };
      var result2 = { ...result._doc };
      // console.log(result2);
      let qrcode = mapUser["urlQrcode"];
      let tab = qrcode.split("customerTaxi");
      result2["qrCodeDynamique"] =
        req.protocol + "://" + req.get("host") + "/customerTaxi" + tab[1];

      res.status(201).json(result2);
    } else {
      res.status(400).json({
        error: "user not found!",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
  Taxi.findById(imgId, (err, images) => {
    //console.log(images);
    if (!err && images) {
      fs.access(path.join(UPLOAD_PATH, images.filename), fs.F_OK, (err) => {
        if (err) {
          console.error(err);
          res.status(400).json({
            error: "qrcode not found",
          });
          return;
        }

        res.setHeader("Content-Type", "image/jpeg");
        fs.createReadStream(path.join(UPLOAD_PATH, images.filename)).pipe(res);
      });
    } else {
      //ici j'ecris sur le fichier log
      console.log(err);

      res.status(400).json({
        error: "document inexistant",
      });
    }
  });
});

router.get("/all/taxiDriver", async (req, res, next) => {
  try {
    const taxiDrivers = await Taxi.find({})
      // .populate("vendorId")
      .lean()
      .sort({ _id: -1 })
      .limit(100);
    taxiDrivers.forEach((taxi) => {
      let qrcode = taxi["urlQrcode"];
      let tab = qrcode.split("customerTaxi");
      taxi["qrCodeDynamique"] =
        req.protocol + "://" + req.get("host") + "/customerTaxi" + tab[1];
    });
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
