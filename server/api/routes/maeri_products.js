const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");

const Maeri = require("../models/Maeri_Product");

const router = express.Router();
let io = require("socket.io");
//console.log(Product.model("Product"));

let UPLOAD_PATH = "uploads";
/*
if (process.platform === "win32") {
  UPLOAD_PATH = "uploads";
} else if (process.platform === "linux") {
  UPLOAD_PATH = "/root/home/ubuntu/elpis/server/uploads/";
}
*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload1 = multer({ storage: storage });

router.post("/", upload1.single("image"), (req, res, next) => {
  //console.log("ici tenant1", tenant1);
  console.log(req.body);
  const product = new Maeri({
    filename: req.file.filename,
    originalName: req.file.originalname,
    adminId: req.params.adminId,
    name: req.body.name,
    categoryName: req.body.categoryName,
    purchasingPrice: req.body.purchasingPrice,
    sellingPrice: req.body.sellingPrice,
    capacity: req.body.capacity,
    description: req.body.description,
    unitName: req.body.unitName,
    sizeUnit: req.body.sizeUnit,
    categoryId: req.body.categoryId,
    produceBy: req.body.produceBy,
    packPrice: req.body.packPrice,
    packSize: req.body.packSize,
    ristourne: req.body.ristourne,
  });
  product.save().then(async (prod) => {
    prod["test"] = "maeri";
    let url =
      req.protocol + "://" + req.get("host") + "/maeriproducts/" + prod._id;

    req.io.sockets.emit(`maerinewproduct`, { prod: prod, url: url });
    res.status(201).json({ message: "ok ok product", data: prod });
  });
});

router.get("/", (req, res, next) => {
  // Maeri.find({}, "-__v")
  // .lean()
  //  Maeri.find({}, "-__v")
  Maeri.aggregate([
    // { $group: { _id: "$produceBy", doc: { $first: "$$ROOT" } } },
    // { $replaceRoot: { newRoot: "$doc" } },
    { $sort: { name: 1 } },
    {
      $group: {
        _id: "$produceBy",
        count: { $sum: 1 },
        entry: {
          $push: {
            purchasingPrice: "$purchasingPrice",
            display: "$display",
            sellingPrice: "$sellingPrice",
            sizeUnit: "$sizeUnit",
            name: "$name",
            filename: "$filename",
            originalName: "$originalName",
            categoryName: "$categoryName",
            capacity: "$capacity",
            description: "$description",
            categoryId: "$categoryId",
            updatedAt: "$updatedAt",
            created: "$created",
            unitName: "$unitName",
            _id: "$_id",
            produceBy: "$produceBy",
            packPrice: "$packPrice",
            packSize: "$packSize",
            ristourne: "$ristourne",
          },
        },
      },
    },
  ]).exec((err, products) => {
    // console.log(products);

    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    if (products) {
      // console.log(products);
      products.forEach((prod) => {
        for (let i = 0; i < prod.entry.length; i++) {
          // var img = images[i];
          var img = prod.entry[i];
          img.url =
            req.protocol +
            "://" +
            req.get("host") +
            "/maeriproducts/" +
            img._id;
        }
      });

      res.status(200).json(products);
    } else {
      console.log("error");
    }
  });
});

router.get("/:id", (req, res, next) => {
  let imgId = req.params.id;
  Maeri.findById(imgId, (err, images) => {
    console.log(images);
    if (!err && images) {
      // fs.access(path.join(UPLOAD_PATH, images.filename), fs.F_OK, (err) => {
      let found = path.join(UPLOAD_PATH, images.filename);

      fs.access(found, fs.F_OK, (err) => {
        if (err) {
          console.error(err);
          res.status(400).json({
            error: "image inexistante",
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

router.get("/:maeriadmin/products", (req, res, next) => {
  Maeri.find({}, "-__v")
    .lean()
    .exec((err, products) => {
      console.log(products);

      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      if (products) {
        console.log(products);
        for (let i = 0; i < products.length; i++) {
          // var img = images[i];
          var img = products[i];
          img.url =
            req.protocol +
            "://" +
            req.get("host") +
            "/maeriproducts/" +
            img._id;
        }
        res.status(200).json({ message: products });
      } else {
        console.log("error");
      }
    });
});

router.get("/:maeriadmin/products/ristourne/:id", (req, res, next) => {
  let imgId = req.params.id;
  Maeri.findById(imgId, (err, product) => {
    if (!err) {
      res.status(200).json({ prod: product });
    } else {
      console.log(" document inexistant");

      res.status(200).json({
        prod: { ristourne: 0, packSize: 1 },
      });
    }
  });
});

router.patch("/", (req, res, next) => {
  const id = req.body._id;

  Maeri.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        res.status(201).json({
          message: "mise a jour ",
          resultat: success,
          // professeur: prof
        });
      }
    }
  ).catch((err) => {
    res.status(400).json({
      error: err,
    });
  });
});

router.patch("/changeimage", upload1.single("image"), (req, res, next) => {
  const id = req.body._id;
  req.body["filename"] = req.file.filename;
  req.body["originalName"] = req.file.originalname;
  req.body["packSize"] = JSON.parse(req.body["packSize"]);
  req.body["packPrice"] = JSON.parse(req.body["packPrice"]);
  req.body["ristourne"] = JSON.parse(req.body["ristourne"]);
  req.body["sizeUnit"] = JSON.parse(req.body["sizeUnit"]);
  req.body["purchasingPrice"] = JSON.parse(req.body["purchasingPrice"]);
  req.body["sellingPrice"] = JSON.parse(req.body["sellingPrice"]);
  console.log(req.body);
  console.log(req.body._id);
  Maeri.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { new: true },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        let url =
          req.protocol +
          "://" +
          req.get("host") +
          "/maeriproducts/" +
          success._id;
        // req.io.sockets.emit(`maerinewproduct`, { prod: success, url: url });
        res.status(201).json({
          message: "mise a jour ",
          resultat: success,
          url: url,
          // professeur: prof
        });
      }
    }
  ).catch((err) => {
    res.status(400).json({
      error: err,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  let imgId = req.params.id;

  Maeri.findOneAndRemove({ _id: imgId }, (err, image) => {
    del([path.join(UPLOAD_PATH, image.filename)]).then((deleted) => {
      res.status(200).json({ message: "image supprimé avec succé" });
    });
  });
});
module.exports = router;
